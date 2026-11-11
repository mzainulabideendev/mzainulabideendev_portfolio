using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfilo.Data;

namespace portfilo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiagnosticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public DiagnosticsController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet("health")]
    public async Task<ActionResult> HealthCheck()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            var adminCount = await _context.Admins.CountAsync();
            
            var admins = await _context.Admins
                .Select(a => new { a.Id, a.Username, a.Email, a.CreatedAt })
                .ToListAsync();

            return Ok(new
            {
                status = "OK",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
                databaseConnected = canConnect,
                adminCount = adminCount,
                admins = admins,
                connectionString = _configuration.GetConnectionString("DefaultConnection")?.Replace(_configuration.GetConnectionString("DefaultConnection")?.Split("Password=")[1].Split(";")[0] ?? "", "***") ?? "Not configured",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "ERROR",
                message = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }
}
