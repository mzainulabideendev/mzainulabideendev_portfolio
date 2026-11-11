using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfilo.Data;
using portfilo.DTOs;
using portfilo.Services;

namespace portfilo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthController(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        Console.WriteLine($"[LOGIN] Attempting login for username: {request.Username}");
        
        var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == request.Username);

        if (admin == null)
        {
            Console.WriteLine($"[LOGIN] ❌ Admin not found with username: {request.Username}");
            var totalAdmins = await _context.Admins.CountAsync();
            Console.WriteLine($"[LOGIN] Total admins in database: {totalAdmins}");
            if (totalAdmins > 0)
            {
                var allUsernames = await _context.Admins.Select(a => a.Username).ToListAsync();
                Console.WriteLine($"[LOGIN] Available usernames: {string.Join(", ", allUsernames)}");
            }
            return Unauthorized("Invalid username or password");
        }
        
        Console.WriteLine($"[LOGIN] Admin found: Username={admin.Username}, Email={admin.Email}");
        Console.WriteLine($"[LOGIN] Stored hash: {admin.PasswordHash.Substring(0, 20)}...");
        
        var isPasswordValid = _passwordHasher.VerifyPassword(request.Password, admin.PasswordHash);
        Console.WriteLine($"[LOGIN] Password verification result: {isPasswordValid}");

        if (!isPasswordValid)
        {
            Console.WriteLine($"[LOGIN] ❌ Password verification failed");
            return Unauthorized("Invalid username or password");
        }

        var token = _tokenService.GenerateToken(admin);
        Console.WriteLine($"[LOGIN] ✓ Login successful, token generated");

        return Ok(new LoginResponse
        {
            Token = token,
            Username = admin.Username,
            Email = admin.Email
        });
    }
}
