# C++ Backend Installation Guide

## Quick Start (Windows)

### Option 1: Using vcpkg (Recommended)

1. **Install vcpkg** (if not already installed):
```bash
git clone https://github.com/Microsoft/vcpkg.git C:\vcpkg
cd C:\vcpkg
.\bootstrap-vcpkg.bat
.\vcpkg integrate install
```

2. **Install dependencies**:
```bash
.\vcpkg install curl:x64-windows boost-asio:x64-windows
```

3. **Build the project**:
```bash
cd backend_cpp
.\build.bat
```

### Option 2: Manual Installation

1. **Install CMake**: Download from https://cmake.org/download/
2. **Install Visual Studio** with C++ support
3. **Install libcurl**: Download from https://curl.se/windows/
4. **Install Boost**: Download from https://www.boost.org/

5. **Build**:
```bash
cd backend_cpp
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release
```

## Linux

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install build-essential cmake libcurl4-openssl-dev libboost-all-dev

# Build
cd backend_cpp
mkdir build
cd build
cmake ..
make

# Run
./proxy_checker
```

## macOS

```bash
# Install dependencies
brew install cmake curl boost

# Build
cd backend_cpp
mkdir build
cd build
cmake ..
make

# Run
./proxy_checker
```

## Troubleshooting

### "crow_all.h not found"
The CMakeLists.txt will automatically download Crow header. If it fails, manually download:
```bash
curl -o crow_all.h https://raw.githubusercontent.com/CrowCpp/Crow/master/include/crow_all.h
```

### "CURL not found"
Make sure libcurl is installed and CMake can find it:
```bash
# Windows (vcpkg)
vcpkg install curl:x64-windows

# Linux
sudo apt-get install libcurl4-openssl-dev

# macOS
brew install curl
```

### "Boost not found"
```bash
# Windows (vcpkg)
vcpkg install boost-asio:x64-windows

# Linux
sudo apt-get install libboost-all-dev

# macOS
brew install boost
```

## Running

After successful build:

**Windows**:
```bash
cd build\Release
proxy_checker.exe
```

Or from backend_cpp directory:
```bash
build\Release\proxy_checker.exe
```

**Linux/macOS**:
```bash
cd build
./proxy_checker
```

The server will start on `http://127.0.0.1:8002`

## Integration with start-all.bat

The `start-all.bat` script will automatically start the C++ backend if it's built.
Make sure to build it first using `build.bat` before running `start-all.bat`.
