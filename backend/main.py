from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import time
from typing import Optional, Literal
import httpx
from urllib.parse import urlparse, parse_qs
import subprocess
import platform
import re

app = FastAPI(title="MTProto Proxy Hub")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global list to store loaded proxies
loaded_proxies = []


class ProxyCheck(BaseModel):
    host: str
    port: int
    type: Literal["mtproto", "socks5"]
    secret: Optional[str] = None
    user: Optional[str] = None
    pass_: Optional[str] = None
    ping_type: Optional[Literal["tcp", "icmp", "via-proxy"]] = "tcp"
    via_proxy_url: Optional[str] = "https://www.gstatic.com/generate_204"


class ProxyResult(BaseModel):
    host: str
    port: int
    type: Literal["mtproto", "socks5"]
    secret: Optional[str] = None
    user: Optional[str] = None
    pass_: Optional[str] = None
    status: Literal["online", "offline", "checking"]
    latency: Optional[float] = None
    country: Optional[str] = None
    city: Optional[str] = None
    last_checked: float


class ProxiesRequest(BaseModel):
    proxies: list[ProxyCheck]


async def check_connection(host: str, port: int, timeout: float = 5.0) -> tuple[bool, Optional[float]]:
    """Check if proxy is accessible using TCP connection"""
    start = time.time()
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port),
            timeout=timeout
        )
        latency = (time.time() - start) * 1000
        writer.close()
        await writer.wait_closed()
        return True, latency
    except Exception:
        return False, None


async def check_via_proxy(host: str, port: int, proxy_type: str, secret: Optional[str], test_url: str, timeout: float = 10.0) -> tuple[bool, Optional[float]]:
    """Check proxy by making HTTP request through it"""
    try:
        # Build proxy URL based on type
        if proxy_type == "mtproto":
            # MTProto proxies use SOCKS5 protocol
            proxy_url = f"socks5://{host}:{port}"
        else:
            # SOCKS5 proxy
            proxy_url = f"socks5://{host}:{port}"
        
        start = time.time()
        
        async with httpx.AsyncClient(
            proxies=proxy_url,
            timeout=timeout,
            follow_redirects=True
        ) as client:
            response = await client.get(test_url)
            latency = (time.time() - start) * 1000
            
            # Check if response is successful (200-299 status codes or 204 No Content)
            if response.status_code in range(200, 300):
                return True, latency
            else:
                return False, None
                
    except Exception as e:
        print(f"Via proxy check error: {e}")
        return False, None


async def check_icmp_ping(host: str, timeout: float = 5.0) -> tuple[bool, Optional[float]]:
    """Check host using ICMP ping"""
    try:
        # Determine ping command based on OS
        param = '-n' if platform.system().lower() == 'windows' else '-c'
        timeout_param = '-w' if platform.system().lower() == 'windows' else '-W'
        
        # Run ping command with shorter timeout
        command = ['ping', param, '1', timeout_param, '2000' if platform.system().lower() == 'windows' else '2', host]
        
        start = time.time()
        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=3,  # Hard timeout of 3 seconds
            creationflags=subprocess.CREATE_NO_WINDOW if platform.system().lower() == 'windows' else 0
        )
        
        if result.returncode == 0:
            # Parse latency from ping output
            # Use appropriate encoding for Windows (cp866 for Russian Windows console)
            try:
                if platform.system().lower() == 'windows':
                    # Try cp866 first (Russian Windows console), then cp1251, then utf-8
                    for encoding in ['cp866', 'cp1251', 'utf-8', 'latin-1']:
                        try:
                            output = result.stdout.decode(encoding)
                            break
                        except UnicodeDecodeError:
                            continue
                    else:
                        # If all fail, use latin-1 which never fails
                        output = result.stdout.decode('latin-1')
                else:
                    output = result.stdout.decode('utf-8')
            except Exception:
                output = result.stdout.decode('latin-1')  # Fallback
            
            # Windows: time=XXms or time<1ms
            # Linux: time=XX.X ms
            if platform.system().lower() == 'windows':
                match = re.search(r'time[=<](\d+)ms', output, re.IGNORECASE)
                if match:
                    latency = float(match.group(1))
                else:
                    # If time<1ms, use 0.5ms as estimate
                    if 'time<1ms' in output.lower():
                        latency = 0.5
                    else:
                        latency = (time.time() - start) * 1000
            else:
                match = re.search(r'time=([\d.]+)\s*ms', output, re.IGNORECASE)
                if match:
                    latency = float(match.group(1))
                else:
                    latency = (time.time() - start) * 1000
            
            return True, latency
        else:
            return False, None
    except subprocess.TimeoutExpired:
        print(f"ICMP ping timeout for {host}")
        return False, None
    except Exception as e:
        print(f"ICMP ping error: {e}")
        return False, None


async def get_geolocation(host: str) -> tuple[Optional[str], Optional[str]]:
    """Get country and city from IP"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"http://ip-api.com/json/{host}")
            if response.status_code == 200:
                data = response.json()
                return data.get("country"), data.get("city")
    except Exception:
        pass
    return None, None


def parse_mtproto_url(url: str) -> Optional[dict]:
    """Parse MTProto proxy URL from t.me/proxy format"""
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ['https', 'tg'] or 'proxy' not in parsed.path:
            return None
        
        params = parse_qs(parsed.query)
        server = params.get('server', [None])[0]
        port = params.get('port', [None])[0]
        secret = params.get('secret', [None])[0]
        
        if not server or not port or not secret:
            return None
        
        return {
            'host': server.rstrip('.'),  # Remove trailing dot if present
            'port': int(port),
            'type': 'mtproto',
            'secret': secret
        }
    except Exception:
        return None


async def load_proxies_from_github():
    """Load proxies from GitHub repository on startup"""
    global loaded_proxies
    url = "https://raw.githubusercontent.com/SoliSpirit/mtproto/master/all_proxies.txt"
    
    print("Loading proxies from GitHub...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                lines = response.text.strip().split('\n')
                proxies = []
                
                print(f"Found {len(lines)} lines in file")
                
                for line in lines:
                    line = line.strip()
                    if line and line.startswith('https://t.me/proxy'):
                        proxy_data = parse_mtproto_url(line)
                        if proxy_data:
                            proxies.append(proxy_data)
                
                loaded_proxies = proxies
                print(f"Successfully loaded {len(loaded_proxies)} proxies from GitHub")
                if len(loaded_proxies) > 0:
                    print(f"First proxy example: {loaded_proxies[0]}")
            else:
                print(f"Failed to load proxies: HTTP {response.status_code}")
    except Exception as e:
        print(f"Error loading proxies: {e}")
        import traceback
        traceback.print_exc()


@app.on_event("startup")
async def startup_event():
    """Load proxies when the application starts"""
    await load_proxies_from_github()


@app.get("/")
async def root():
    return {"message": "MTProto Proxy Hub API"}


@app.get("/proxies")
async def get_proxies():
    """Get list of loaded proxies"""
    print(f"GET /proxies called - returning {len(loaded_proxies)} proxies")
    return {"proxies": loaded_proxies, "count": len(loaded_proxies)}


@app.post("/check-proxy", response_model=ProxyResult)
async def check_proxy(proxy: ProxyCheck):
    """Check single proxy"""
    # Choose ping method based on ping_type
    if proxy.ping_type == "icmp":
        is_online, latency = await check_icmp_ping(proxy.host)
    elif proxy.ping_type == "via-proxy":
        is_online, latency = await check_via_proxy(
            proxy.host, 
            proxy.port, 
            proxy.type,
            proxy.secret,
            proxy.via_proxy_url or "https://www.gstatic.com/generate_204"
        )
    else:
        is_online, latency = await check_connection(proxy.host, proxy.port)
    
    country, city = await get_geolocation(proxy.host) if is_online else (None, None)

    return ProxyResult(
        host=proxy.host,
        port=proxy.port,
        type=proxy.type,
        secret=proxy.secret,
        user=proxy.user,
        pass_=proxy.pass_,
        status="online" if is_online else "offline",
        latency=latency,
        country=country,
        city=city,
        last_checked=time.time()
    )


@app.post("/check-all-proxies", response_model=list[ProxyResult])
async def check_all_proxies(request: ProxiesRequest):
    """Check all proxies in parallel"""

    async def check_one(proxy: ProxyCheck) -> ProxyResult:
        # Choose ping method based on ping_type
        if proxy.ping_type == "icmp":
            is_online, latency = await check_icmp_ping(proxy.host)
        elif proxy.ping_type == "via-proxy":
            is_online, latency = await check_via_proxy(
                proxy.host, 
                proxy.port, 
                proxy.type,
                proxy.secret,
                proxy.via_proxy_url or "https://www.gstatic.com/generate_204"
            )
        else:
            is_online, latency = await check_connection(proxy.host, proxy.port)
        
        country, city = await get_geolocation(proxy.host) if is_online else (None, None)

        return ProxyResult(
            host=proxy.host,
            port=proxy.port,
            type=proxy.type,
            secret=proxy.secret,
            user=proxy.user,
            pass_=proxy.pass_,
            status="online" if is_online else "offline",
            latency=latency,
            country=country,
            city=city,
            last_checked=time.time()
        )

    results = await asyncio.gather(*[check_one(p) for p in request.proxies])
    return list(results)
