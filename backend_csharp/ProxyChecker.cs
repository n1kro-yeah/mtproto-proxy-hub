using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace ProxyChecker
{
    public class ProxyData
    {
        [JsonPropertyName("host")]
        public string Host { get; set; }
        
        [JsonPropertyName("port")]
        public int Port { get; set; }
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("secret")]
        public string? Secret { get; set; }
    }

    public class ProxyCheckRequest
    {
        [JsonPropertyName("host")]
        public string Host { get; set; }
        
        [JsonPropertyName("port")]
        public int Port { get; set; }
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("secret")]
        public string? Secret { get; set; }
        
        [JsonPropertyName("user")]
        public string? User { get; set; }
        
        [JsonPropertyName("pass_")]
        public string? Pass { get; set; }
        
        [JsonPropertyName("ping_type")]
        public string PingType { get; set; } = "tcp";
        
        [JsonPropertyName("via_proxy_url")]
        public string? ViaProxyUrl { get; set; }
    }

    public class ProxyResult
    {
        [JsonPropertyName("host")]
        public string Host { get; set; }
        
        [JsonPropertyName("port")]
        public int Port { get; set; }
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("secret")]
        public string? Secret { get; set; }
        
        [JsonPropertyName("user")]
        public string? User { get; set; }
        
        [JsonPropertyName("pass_")]
        public string? Pass { get; set; }
        
        [JsonPropertyName("status")]
        public string Status { get; set; }
        
        [JsonPropertyName("latency")]
        public double? Latency { get; set; }
        
        [JsonPropertyName("country")]
        public string? Country { get; set; }
        
        [JsonPropertyName("city")]
        public string? City { get; set; }
        
        [JsonPropertyName("last_checked")]
        public double LastChecked { get; set; }
    }

    public class ProxyCheckerService
    {
        private static readonly HttpClient httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
        private static List<ProxyData> loadedProxies = new List<ProxyData>();

        public static List<ProxyData> GetLoadedProxies() => loadedProxies;

        public static async Task LoadProxiesFromGitHub()
        {
            var url = "https://raw.githubusercontent.com/SoliSpirit/mtproto/master/all_proxies.txt";
            
            Console.WriteLine("Loading proxies from GitHub...");
            try
            {
                var response = await httpClient.GetStringAsync(url);
                var lines = response.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                var proxies = new List<ProxyData>();
                
                Console.WriteLine($"Found {lines.Length} lines in file");
                
                foreach (var line in lines)
                {
                    var trimmedLine = line.Trim();
                    if (trimmedLine.StartsWith("https://t.me/proxy"))
                    {
                        var proxyData = ParseMTProtoUrl(trimmedLine);
                        if (proxyData != null)
                        {
                            proxies.Add(proxyData);
                        }
                    }
                }
                
                loadedProxies = proxies;
                Console.WriteLine($"Successfully loaded {loadedProxies.Count} proxies from GitHub");
                if (loadedProxies.Count > 0)
                {
                    Console.WriteLine($"First proxy example: {loadedProxies[0].Host}:{loadedProxies[0].Port}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading proxies: {ex.Message}");
            }
        }

        private static ProxyData? ParseMTProtoUrl(string url)
        {
            try
            {
                var uri = new Uri(url);
                var query = HttpUtility.ParseQueryString(uri.Query);
                
                var server = query["server"];
                var portStr = query["port"];
                var secret = query["secret"];
                
                if (string.IsNullOrEmpty(server) || string.IsNullOrEmpty(portStr) || string.IsNullOrEmpty(secret))
                {
                    return null;
                }
                
                if (!int.TryParse(portStr, out int port))
                {
                    return null;
                }
                
                return new ProxyData
                {
                    Host = server.TrimEnd('.'),
                    Port = port,
                    Type = "mtproto",
                    Secret = secret
                };
            }
            catch
            {
                return null;
            }
        }

        public static async Task<(bool isOnline, double? latency)> CheckTcpConnection(string host, int port, int timeoutMs = 2000)
        {
            var sw = Stopwatch.StartNew();
            try
            {
                using var client = new TcpClient();
                var connectTask = client.ConnectAsync(host, port);
                
                if (await Task.WhenAny(connectTask, Task.Delay(timeoutMs)) == connectTask)
                {
                    await connectTask;
                    sw.Stop();
                    return (true, sw.Elapsed.TotalMilliseconds);
                }
                
                return (false, null);
            }
            catch
            {
                return (false, null);
            }
        }

        public static async Task<(bool isOnline, double? latency)> CheckIcmpPing(string host, int timeoutMs = 2000)
        {
            try
            {
                using var ping = new Ping();
                var sw = Stopwatch.StartNew();
                var reply = await ping.SendPingAsync(host, timeoutMs);
                sw.Stop();
                
                if (reply.Status == IPStatus.Success)
                {
                    return (true, (double)reply.RoundtripTime);
                }
                
                return (false, null);
            }
            catch
            {
                return (false, null);
            }
        }

        public static async Task<(bool isOnline, double? latency)> CheckViaProxy(
            string host, int port, string proxyType, string? secret, string testUrl, int timeoutMs = 10000)
        {
            try
            {
                var proxy = new WebProxy($"socks5://{host}:{port}");
                var handler = new HttpClientHandler { Proxy = proxy, UseProxy = true };
                using var client = new HttpClient(handler) { Timeout = TimeSpan.FromMilliseconds(timeoutMs) };
                
                var sw = Stopwatch.StartNew();
                var response = await client.GetAsync(testUrl);
                sw.Stop();
                
                if (response.IsSuccessStatusCode)
                {
                    return (true, sw.Elapsed.TotalMilliseconds);
                }
                
                return (false, null);
            }
            catch
            {
                return (false, null);
            }
        }

        public static async Task<(string? country, string? city)> GetGeolocation(string host)
        {
            try
            {
                var response = await httpClient.GetStringAsync($"http://ip-api.com/json/{host}");
                var data = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(response);
                
                var country = data.ContainsKey("country") ? data["country"].GetString() : null;
                var city = data.ContainsKey("city") ? data["city"].GetString() : null;
                
                return (country, city);
            }
            catch
            {
                return (null, null);
            }
        }

        public static async Task<ProxyResult> CheckProxy(ProxyCheckRequest proxy)
        {
            bool isOnline;
            double? latency;

            if (proxy.PingType == "icmp")
            {
                (isOnline, latency) = await CheckIcmpPing(proxy.Host);
            }
            else if (proxy.PingType == "via-proxy")
            {
                (isOnline, latency) = await CheckViaProxy(
                    proxy.Host, proxy.Port, proxy.Type, proxy.Secret,
                    proxy.ViaProxyUrl ?? "https://www.gstatic.com/generate_204"
                );
            }
            else
            {
                (isOnline, latency) = await CheckTcpConnection(proxy.Host, proxy.Port);
            }

            var (country, city) = isOnline ? await GetGeolocation(proxy.Host) : (null, null);

            return new ProxyResult
            {
                Host = proxy.Host,
                Port = proxy.Port,
                Type = proxy.Type,
                Secret = proxy.Secret,
                User = proxy.User,
                Pass = proxy.Pass,
                Status = isOnline ? "online" : "offline",
                Latency = latency,
                Country = country,
                City = city,
                LastChecked = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };
        }

        public static async Task<List<ProxyResult>> CheckAllProxies(List<ProxyCheckRequest> proxies)
        {
            var tasks = proxies.Select(async proxy =>
            {
                bool isOnline;
                double? latency;

                if (proxy.PingType == "icmp")
                {
                    (isOnline, latency) = await CheckIcmpPing(proxy.Host);
                }
                else if (proxy.PingType == "via-proxy")
                {
                    (isOnline, latency) = await CheckViaProxy(
                        proxy.Host, proxy.Port, proxy.Type, proxy.Secret,
                        proxy.ViaProxyUrl ?? "https://www.gstatic.com/generate_204"
                    );
                }
                else
                {
                    (isOnline, latency) = await CheckTcpConnection(proxy.Host, proxy.Port);
                }

                // Skip geolocation for bulk checks (performance)
                return new ProxyResult
                {
                    Host = proxy.Host,
                    Port = proxy.Port,
                    Type = proxy.Type,
                    Secret = proxy.Secret,
                    User = proxy.User,
                    Pass = proxy.Pass,
                    Status = isOnline ? "online" : "offline",
                    Latency = latency,
                    Country = null,
                    City = null,
                    LastChecked = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
                };
            });

            var results = await Task.WhenAll(tasks);
            return results.ToList();
        }
    }
}
