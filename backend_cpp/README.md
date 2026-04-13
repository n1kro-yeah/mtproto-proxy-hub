# MTProto Proxy Hub - C++ Backend

C++ implementation of the proxy checker backend using Crow web framework.

## Requirements

- C++17 compiler (GCC 7+, Clang 5+, MSVC 2017+)
- CMake 3.15+
- libcurl
- Boost (for Crow framework)

## Installation

### Windows

1. Install vcpkg:
```bash
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
.\bootstrap-vcpkg.bat
.\vcpkg integrate install
```

2. Install dependencies:
```bash
.\vcpkg install curl:x64-windows boost-asio:x64-windows
```

3. Build:
```bash
cd backend_cpp
mkdir build
cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=[vcpkg root]/scripts/buildsystems/vcpkg.cmake
cmake --build . --config Release
```

### Linux

1. Install dependencies:
```bash
sudo apt-get install build-essential cmake libcurl4-openssl-dev libboost-all-dev
```

2. Build:
```bash
cd backend_cpp
mkdir build
cd build
cmake ..
make
```

### macOS

1. Install dependencies:
```bash
brew install cmake curl boost
```

2. Build:
```bash
cd backend_cpp
mkdir build
cd build
cmake ..
make
```

## Running

```bash
# From build directory
./proxy_checker

# Or from backend_cpp directory
./build/proxy_checker
```

The server will start on `http://127.0.0.1:8002`

## API Endpoints

- `GET /` - API info
- `GET /api/proxies` - Get loaded proxies
- `POST /api/check-proxy` - Check single proxy
- `POST /api/check-all-proxies` - Check multiple proxies

## Features

- TCP connection checking
- ICMP ping support
- Geolocation lookup
- Parallel proxy checking
- CORS enabled
- Automatic proxy loading from GitHub

## Performance

C++ backend offers the best performance among all three implementations:
- Fastest TCP connection checks
- Efficient parallel processing with std::async
- Low memory footprint
- Native system integration
