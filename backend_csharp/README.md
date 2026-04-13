# MTProto Proxy Hub - C# Backend

High-performance C# backend for proxy checking using .NET 8.

## Features

- **TCP Connection Check**: Fast TCP socket connection testing
- **ICMP Ping**: Native ICMP ping support using System.Net.NetworkInformation
- **Via Proxy Check**: HTTP requests through SOCKS5 proxy
- **Parallel Processing**: Async/await with Task.WhenAll for maximum performance
- **Geolocation**: IP geolocation using ip-api.com

## Requirements

- .NET 8.0 SDK or later
- Windows/Linux/macOS

## Installation

```bash
# Install .NET 8 SDK from https://dotnet.microsoft.com/download

# Restore dependencies
dotnet restore

# Build project
dotnet build
```

## Running

```bash
# Development mode
dotnet run

# Or use the batch file (Windows)
..\start\start-backend-csharp.bat
```

The server will start on `http://127.0.0.1:8001`

## API Endpoints

### POST /api/check-proxy
Check single proxy

**Request:**
```json
{
  "host": "example.com",
  "port": 443,
  "type": "mtproto",
  "secret": "...",
  "ping_type": "tcp",
  "via_proxy_url": "https://www.gstatic.com/generate_204"
}
```

### POST /api/check-all-proxies
Check multiple proxies in parallel

**Request:**
```json
{
  "proxies": [
    {
      "host": "example.com",
      "port": 443,
      "type": "mtproto",
      "secret": "...",
      "ping_type": "tcp"
    }
  ]
}
```

## Performance

C# backend is optimized for:
- Low memory footprint
- High concurrency with async/await
- Fast TCP socket operations
- Efficient parallel processing

Expected performance: ~2-3 seconds for 100+ proxies with TCP ping.

## Switching Between Python and C#

Use the developer button (code icon) in the web interface to switch between Python and C# backends.

- **Python**: Port 8000 (default)
- **C#**: Port 8001
