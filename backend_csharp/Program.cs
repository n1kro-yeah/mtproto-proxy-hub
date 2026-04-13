using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using ProxyChecker;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Load proxies on startup
await ProxyCheckerService.LoadProxiesFromGitHub();

app.UseCors();

app.MapGet("/", () => new { message = "MTProto Proxy Hub API (C#)" });

app.MapGet("/api/proxies", () =>
{
    var proxies = ProxyCheckerService.GetLoadedProxies();
    Console.WriteLine($"GET /api/proxies called - returning {proxies.Count} proxies");
    return Results.Ok(new { proxies, count = proxies.Count });
});

app.MapPost("/api/check-proxy", async (ProxyCheckRequest proxy) =>
{
    var result = await ProxyCheckerService.CheckProxy(proxy);
    return Results.Ok(result);
});

app.MapPost("/api/check-all-proxies", async (HttpContext context) =>
{
    var requestBody = await JsonSerializer.DeserializeAsync<Dictionary<string, List<ProxyCheckRequest>>>(context.Request.Body);
    var proxies = requestBody["proxies"];
    
    var results = await ProxyCheckerService.CheckAllProxies(proxies);
    return Results.Ok(results);
});

app.Run("http://127.0.0.1:8001");
