cmake_minimum_required(VERSION 3.15)
project(ProxyCheckerCpp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(CURL REQUIRED)
find_package(Threads REQUIRED)

# Crow is header-only, so we just need to include it
# Download Crow if not present
if(NOT EXISTS "${CMAKE_CURRENT_SOURCE_DIR}/crow_all.h")
    message(STATUS "Downloading Crow header...")
    file(DOWNLOAD
        "https://raw.githubusercontent.com/CrowCpp/Crow/master/include/crow_all.h"
        "${CMAKE_CURRENT_SOURCE_DIR}/crow_all.h"
        SHOW_PROGRESS
    )
endif()

# Add executable
add_executable(proxy_checker main.cpp)

# Include directories
target_include_directories(proxy_checker PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
target_include_directories(proxy_checker PRIVATE ${CURL_INCLUDE_DIRS})

# Link libraries
target_link_libraries(proxy_checker PRIVATE ${CURL_LIBRARIES})
target_link_libraries(proxy_checker PRIVATE Threads::Threads)

# Windows-specific libraries
if(WIN32)
    target_link_libraries(proxy_checker PRIVATE ws2_32 iphlpapi)
endif()

# Compiler flags
if(MSVC)
    target_compile_options(proxy_checker PRIVATE /W4)
else()
    target_compile_options(proxy_checker PRIVATE -Wall -Wextra -Wpedantic)
endif()
