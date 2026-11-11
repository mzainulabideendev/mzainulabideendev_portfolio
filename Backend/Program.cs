using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using portfilo.Data;
using portfilo.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] 
                    ?? throw new InvalidOperationException("JWT Key is not configured")))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Apply pending migrations and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // Apply migrations
        logger.LogInformation("=== STARTING DATABASE MIGRATION ===");
        logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);
        
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Test database connection first
        var canConnect = context.Database.CanConnect();
        logger.LogInformation("Database connection test: {CanConnect}", canConnect);
        
        if (!canConnect)
        {
            throw new InvalidOperationException("Cannot connect to database. Check connection string.");
        }
        
        // Apply migrations
        logger.LogInformation("Applying pending migrations...");
        context.Database.Migrate();
        logger.LogInformation("✓ Database migrations applied successfully.");
        
        // Seed default admin
        logger.LogInformation("=== STARTING ADMIN SEEDING ===");
        var passwordHasher = services.GetRequiredService<IPasswordHasher>();
        var configuration = services.GetRequiredService<IConfiguration>();
        
        var adminUsername = configuration["DefaultAdmin:Username"];
        var adminEmail = configuration["DefaultAdmin:Email"];
        logger.LogInformation("Attempting to seed admin: Username={Username}, Email={Email}", adminUsername, adminEmail);
        
        DbSeeder.SeedDefaultAdmin(context, passwordHasher, configuration).Wait();
        logger.LogInformation("✓ Default admin seeding completed successfully.");
        logger.LogInformation("=== DATABASE INITIALIZATION COMPLETE ===");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ CRITICAL ERROR during database initialization: {Message}", ex.Message);
        logger.LogError("Stack Trace: {StackTrace}", ex.StackTrace);
        
        // Always throw to prevent app from running with broken database
        throw;
    }
}

// Enable Swagger in all environments for API testing
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio API v1");
    options.RoutePrefix = string.Empty; // Serve Swagger UI at the app's root
    options.DocumentTitle = "Portfolio API Documentation";
});

app.UseCors("AllowAll");

// Only use HTTPS redirection in development or when properly configured
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
