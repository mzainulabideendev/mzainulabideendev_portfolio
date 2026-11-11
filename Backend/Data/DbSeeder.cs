using Microsoft.EntityFrameworkCore;
using portfilo.Models;
using portfilo.Services;

namespace portfilo.Data;

public static class DbSeeder
{
    public static async Task SeedDefaultAdmin(ApplicationDbContext context, IPasswordHasher passwordHasher, IConfiguration configuration)
    {
        // Check if any admin exists
        var existingAdminCount = await context.Admins.CountAsync();
        Console.WriteLine($"[SEED] Existing admin count: {existingAdminCount}");
        
        if (existingAdminCount > 0)
        {
            Console.WriteLine("[SEED] Admin already exists, skipping seeding");
            var existingAdmin = await context.Admins.FirstAsync();
            Console.WriteLine($"[SEED] Existing admin: Username={existingAdmin.Username}, Email={existingAdmin.Email}");
            return; // Admin already exists, skip seeding
        }

        // Get credentials from configuration (appsettings or user secrets)
        var adminUsername = configuration["DefaultAdmin:Username"] ?? "admin";
        var adminEmail = configuration["DefaultAdmin:Email"];
        var adminPassword = configuration["DefaultAdmin:Password"];
        
        Console.WriteLine($"[SEED] Creating new admin: Username={adminUsername}, Email={adminEmail}");

        if (string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
        {
            throw new InvalidOperationException("Default admin credentials are not configured properly.");
        }

        var passwordHash = passwordHasher.HashPassword(adminPassword);
        Console.WriteLine($"[SEED] Password hash generated: {passwordHash.Substring(0, 20)}...");

        var admin = new Admin
        {
            Username = adminUsername,
            Email = adminEmail,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        context.Admins.Add(admin);
        await context.SaveChangesAsync();
        
        Console.WriteLine($"[SEED] ✓ Admin created successfully with ID: {admin.Id}");
    }
}
