from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import time
from typing import Optional, Literal
import httpx
from urllib.parse import urlparse, parse_qs

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
    """Check if proxy is accessible"""
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
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                lines = response.text.strip().split('\n')
                proxies = []
                
                for line in lines:
                    line = line.strip()
                    if line and line.startswith('https://t.me/proxy'):
                        proxy_data = parse_mtproto_url(line)
                        if proxy_data:
                            proxies.append(proxy_data)
                
                loaded_proxies = proxies
                print(f"✓ Loaded {len(loaded_proxies)} proxies from GitHub")
            else:
                print(f"✗ Failed to load proxies: HTTP {response.status_code}")
    except Exception as e:
        print(f"✗ Error loading proxies: {e}")


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
    return {"proxies": loaded_proxies, "count": len(loaded_proxies)}


@app.post("/check-proxy", response_model=ProxyResult)
async def check_proxy(proxy: ProxyCheck):
    """Check single proxy"""
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
