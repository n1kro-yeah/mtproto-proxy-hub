#include "crow_all.h"
#include <iostream>
#include <string>
#include <vector>
#include <chrono>
#include <thread>
#include <future>
#include <regex>
#include <ctime>
#include <sstream>

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#include <iphlpapi.h>
#pragma comment(lib, "ws2_32.lib")
#pragma comment(lib, "iphlpapi.lib")
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <unistd.h>
#include <sys/select.h>
#include <fcntl.h>
#endif

// HTTP client for geolocation and proxy loading
#include <curl/curl.h>

struct ProxyData {
    std::string host;
    int port;
    std::string type;
    std::string secret;
};

struct ProxyResult {
    std::string host;
    int port;
    std::string type;
    std::string secret;
    std::string user;
    std::string pass_;
    std::string status;
    double latency;
    std::string country;
    std::string city;
    long long last_checked;
    
    bool has_latency = false;
    bool has_country = false;
    bool has_city = false;
};

std::vector<ProxyData> loaded_proxies;

// CURL write callback
size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
    userp->append((char*)contents, size * nmemb);
    return size * nmemb;
}

// Parse MTProto URL
ProxyData parse_mtproto_url(const std::string& url) {
    ProxyData proxy;
    
    std::regex server_regex(R"([?&]server=([^&]+))");
    std::regex port_regex(R"([?&]port=(\d+))");
    std::regex secret_regex(R"([?&]secret=([^&]+))");
    
    std::smatch match;
    
    if (std::regex_search(url, match, server_regex) && match.size() > 1) {
        proxy.host = match[1].str();
        // Remove trailing dot
        if (!proxy.host.empty() && proxy.host.back() == '.') {
            proxy.host.pop_back();
        }
    }
    
    if (std::regex_search(url, match, port_regex) && match.size() > 1) {
        proxy.port = std::stoi(match[1].str());
    }
    
    if (std::regex_search(url, match, secret_regex) && match.size() > 1) {
        proxy.secret = match[1].str();
    }
    
    proxy.type = "mtproto";
    
    return proxy;
}

// Load proxies from GitHub
void load_proxies_from_github() {
    std::cout << "Loading proxies from GitHub..." << std::endl;
    
    CURL* curl = curl_easy_init();
    if (!curl) {
        std::cerr << "Failed to initialize CURL" << std::endl;
        return;
    }
    
    std::string response;
    curl_easy_setopt(curl, CURLOPT_URL, "https://raw.githubusercontent.com/SoliSpirit/mtproto/master/all_proxies.txt");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 30L);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    
    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    
    if (res != CURLE_OK) {
        std::cerr << "Failed to load proxies: " << curl_easy_strerror(res) << std::endl;
        return;
    }
    
    std::vector<ProxyData> proxies;
    std::istringstream stream(response);
    std::string line;
    
    while (std::getline(stream, line)) {
        // Trim whitespace
        line.erase(0, line.find_first_not_of(" \t\r\n"));
        line.erase(line.find_last_not_of(" \t\r\n") + 1);
        
        if (line.find("https://t.me/proxy") == 0) {
            ProxyData proxy = parse_mtproto_url(line);
            if (!proxy.host.empty() && proxy.port > 0) {
                proxies.push_back(proxy);
            }
        }
    }
    
    loaded_proxies = proxies;
    std::cout << "Successfully loaded " << loaded_proxies.size() << " proxies from GitHub" << std::endl;
    
    if (!loaded_proxies.empty()) {
        std::cout << "First proxy example: " << loaded_proxies[0].host << ":" << loaded_proxies[0].port << std::endl;
    }
}

// Check TCP connection
std::pair<bool, double> check_tcp_connection(const std::string& host, int port, int timeout_ms = 2000) {
    auto start = std::chrono::high_resolution_clock::now();
    
#ifdef _WIN32
    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);
#endif
    
    struct addrinfo hints = {}, *result = nullptr;
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;
    
    if (getaddrinfo(host.c_str(), std::to_string(port).c_str(), &hints, &result) != 0) {
#ifdef _WIN32
        WSACleanup();
#endif
        return {false, 0.0};
    }
    
    int sock = socket(result->ai_family, result->ai_socktype, result->ai_protocol);
    if (sock < 0) {
        freeaddrinfo(result);
#ifdef _WIN32
        WSACleanup();
#endif
        return {false, 0.0};
    }
    
    // Set non-blocking
#ifdef _WIN32
    u_long mode = 1;
    ioctlsocket(sock, FIONBIO, &mode);
#else
    int flags = fcntl(sock, F_GETFL, 0);
    fcntl(sock, F_SETFL, flags | O_NONBLOCK);
#endif
    
    connect(sock, result->ai_addr, result->ai_addrlen);
    
    fd_set fdset;
    FD_ZERO(&fdset);
    FD_SET(sock, &fdset);
    
    struct timeval tv;
    tv.tv_sec = timeout_ms / 1000;
    tv.tv_usec = (timeout_ms % 1000) * 1000;
    
    bool success = false;
    if (select(sock + 1, nullptr, &fdset, nullptr, &tv) > 0) {
        int error = 0;
        socklen_t len = sizeof(error);
        getsockopt(sock, SOL_SOCKET, SO_ERROR, (char*)&error, &len);
        success = (error == 0);
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    double latency = std::chrono::duration<double, std::milli>(end - start).count();
    
#ifdef _WIN32
    closesocket(sock);
    WSACleanup();
#else
    close(sock);
#endif
    
    freeaddrinfo(result);
    
    return {success, success ? latency : 0.0};
}

// Check ICMP ping (simplified - uses system ping command)
std::pair<bool, double> check_icmp_ping(const std::string& host, int timeout_ms = 2000) {
    auto start = std::chrono::high_resolution_clock::now();
    
#ifdef _WIN32
    std::string command = "ping -n 1 -w 2000 " + host + " >nul 2>&1";
#else
    std::string command = "ping -c 1 -W 2 " + host + " >/dev/null 2>&1";
#endif
    
    int result = system(command.c_str());
    
    auto end = std::chrono::high_resolution_clock::now();
    double latency = std::chrono::duration<double, std::milli>(end - start).count();
    
    return {result == 0, result == 0 ? latency : 0.0};
}

// Get geolocation
std::pair<std::string, std::string> get_geolocation(const std::string& host) {
    CURL* curl = curl_easy_init();
    if (!curl) {
        return {"", ""};
    }
    
    std::string url = "http://ip-api.com/json/" + host;
    std::string response;
    
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 2L);
    
    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    
    if (res != CURLE_OK) {
        return {"", ""};
    }
    
    // Simple JSON parsing for country and city
    std::string country, city;
    
    std::regex country_regex(R"("country"\s*:\s*"([^"]+)")");
    std::regex city_regex(R"("city"\s*:\s*"([^"]+)")");
    
    std::smatch match;
    if (std::regex_search(response, match, country_regex) && match.size() > 1) {
        country = match[1].str();
    }
    if (std::regex_search(response, match, city_regex) && match.size() > 1) {
        city = match[1].str();
    }
    
    return {country, city};
}

// Check single proxy
ProxyResult check_proxy(const crow::json::rvalue& proxy_json) {
    ProxyResult result;
    result.host = proxy_json["host"].s();
    result.port = proxy_json["port"].i();
    result.type = proxy_json["type"].s();
    result.secret = proxy_json.has("secret") ? proxy_json["secret"].s() : "";
    result.user = proxy_json.has("user") ? proxy_json["user"].s() : "";
    result.pass_ = proxy_json.has("pass_") ? proxy_json["pass_"].s() : "";
    
    std::string ping_type = proxy_json.has("ping_type") ? proxy_json["ping_type"].s() : "tcp";
    
    bool is_online = false;
    double latency = 0.0;
    
    if (ping_type == "icmp") {
        auto [online, lat] = check_icmp_ping(result.host);
        is_online = online;
        latency = lat;
    } else {
        // Default to TCP
        auto [online, lat] = check_tcp_connection(result.host, result.port);
        is_online = online;
        latency = lat;
    }
    
    result.status = is_online ? "online" : "offline";
    result.latency = latency;
    result.has_latency = is_online;
    
    if (is_online) {
        auto [country, city] = get_geolocation(result.host);
        result.country = country;
        result.city = city;
        result.has_country = !country.empty();
        result.has_city = !city.empty();
    }
    
    result.last_checked = std::time(nullptr);
    
    return result;
}

// Convert ProxyResult to JSON
crow::json::wvalue proxy_result_to_json(const ProxyResult& result) {
    crow::json::wvalue json;
    json["host"] = result.host;
    json["port"] = result.port;
    json["type"] = result.type;
    json["secret"] = result.secret;
    json["user"] = result.user;
    json["pass_"] = result.pass_;
    json["status"] = result.status;
    
    if (result.has_latency) {
        json["latency"] = result.latency;
    } else {
        json["latency"] = nullptr;
    }
    
    if (result.has_country) {
        json["country"] = result.country;
    } else {
        json["country"] = nullptr;
    }
    
    if (result.has_city) {
        json["city"] = result.city;
    } else {
        json["city"] = nullptr;
    }
    
    json["last_checked"] = result.last_checked;
    
    return json;
}

int main() {
    // Initialize CURL globally
    curl_global_init(CURL_GLOBAL_DEFAULT);
    
    // Load proxies on startup
    load_proxies_from_github();
    
    crow::SimpleApp app;
    
    // CORS middleware
    CROW_ROUTE(app, "/<path>").methods(crow::HTTPMethod::Options)
    ([](const std::string&) {
        auto res = crow::response(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "*");
        return res;
    });
    
    // Root endpoint
    CROW_ROUTE(app, "/")
    ([]() {
        auto res = crow::response(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        res.write("{\"message\":\"MTProto Proxy Hub API (C++)\"}");
        res.set_header("Content-Type", "application/json");
        return res;
    });
    
    // Get proxies
    CROW_ROUTE(app, "/api/proxies")
    ([]() {
        crow::json::wvalue response;
        crow::json::wvalue::list proxies_json;
        
        for (const auto& proxy : loaded_proxies) {
            crow::json::wvalue p;
            p["host"] = proxy.host;
            p["port"] = proxy.port;
            p["type"] = proxy.type;
            p["secret"] = proxy.secret;
            proxies_json.push_back(std::move(p));
        }
        
        response["proxies"] = std::move(proxies_json);
        response["count"] = loaded_proxies.size();
        
        std::cout << "GET /api/proxies called - returning " << loaded_proxies.size() << " proxies" << std::endl;
        
        auto res = crow::response(response);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });
    
    // Check single proxy
    CROW_ROUTE(app, "/api/check-proxy").methods(crow::HTTPMethod::Post)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            auto res = crow::response(400);
            res.write("{\"error\":\"Invalid JSON\"}");
            res.add_header("Access-Control-Allow-Origin", "*");
            return res;
        }
        
        ProxyResult result = check_proxy(body);
        auto res = crow::response(proxy_result_to_json(result));
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });
    
    // Check all proxies
    CROW_ROUTE(app, "/api/check-all-proxies").methods(crow::HTTPMethod::Post)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body || !body.has("proxies")) {
            auto res = crow::response(400);
            res.write("{\"error\":\"Invalid JSON\"}");
            res.add_header("Access-Control-Allow-Origin", "*");
            return res;
        }
        
        auto proxies_json = body["proxies"];
        std::vector<std::future<ProxyResult>> futures;
        
        // Check all proxies in parallel
        for (size_t i = 0; i < proxies_json.size(); ++i) {
            futures.push_back(std::async(std::launch::async, [&proxies_json, i]() {
                ProxyResult result;
                result.host = proxies_json[i]["host"].s();
                result.port = proxies_json[i]["port"].i();
                result.type = proxies_json[i]["type"].s();
                result.secret = proxies_json[i].has("secret") ? proxies_json[i]["secret"].s() : "";
                result.user = proxies_json[i].has("user") ? proxies_json[i]["user"].s() : "";
                result.pass_ = proxies_json[i].has("pass_") ? proxies_json[i]["pass_"].s() : "";
                
                std::string ping_type = proxies_json[i].has("ping_type") ? proxies_json[i]["ping_type"].s() : "tcp";
                
                bool is_online = false;
                double latency = 0.0;
                
                if (ping_type == "icmp") {
                    auto [online, lat] = check_icmp_ping(result.host);
                    is_online = online;
                    latency = lat;
                } else {
                    auto [online, lat] = check_tcp_connection(result.host, result.port);
                    is_online = online;
                    latency = lat;
                }
                
                result.status = is_online ? "online" : "offline";
                result.latency = latency;
                result.has_latency = is_online;
                
                // Skip geolocation for bulk checks (performance)
                result.has_country = false;
                result.has_city = false;
                
                result.last_checked = std::time(nullptr);
                
                return result;
            }));
        }
        
        // Collect results
        crow::json::wvalue::list results_json;
        for (auto& future : futures) {
            ProxyResult result = future.get();
            results_json.push_back(proxy_result_to_json(result));
        }
        
        auto res = crow::response(crow::json::wvalue(results_json));
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });
    
    std::cout << "Starting C++ backend on http://127.0.0.1:8002" << std::endl;
    app.port(8002).multithreaded().run();
    
    curl_global_cleanup();
    
    return 0;
}
