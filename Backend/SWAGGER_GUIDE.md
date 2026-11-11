# Swagger Setup Guide

## Overview
Your Portfolio API now includes Swagger/OpenAPI support for interactive API documentation and testing.

## Accessing Swagger UI

Once you run the application with `dotnet run`, Swagger UI will be available at:

- **Main URL**: `https://localhost:{PORT}/` (root URL)
- **Swagger JSON**: `https://localhost:{PORT}/swagger/v1/swagger.json`

## Features

### 1. Interactive API Testing
- Test all API endpoints directly from the browser
- See request/response models
- Try out endpoints with sample data

### 2. JWT Authentication Support
Swagger is configured to work with JWT Bearer tokens:

**Steps to use protected endpoints:**
1. First, use the `/api/auth/register` or `/api/auth/login` endpoint to get a JWT token
2. Copy the token from the response (without "Bearer" prefix)
3. Click the **"Authorize"** button (🔓 lock icon) at the top of Swagger UI
4. In the dialog, enter: `Bearer {your_token}` (replace {your_token} with actual token)
5. Click "Authorize" then "Close"
6. Now all 🔒 protected endpoints will include the authorization header automatically

### 3. API Documentation
Swagger automatically documents:
- All endpoints and their HTTP methods
- Request/response models
- Required vs optional parameters
- Data types and validations
- Authentication requirements

## Configuration

The Swagger configuration is in `Program.cs`:

```csharp
// Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Swagger middleware (Development only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio API v1");
        options.RoutePrefix = string.Empty; // Serve at root
        options.DocumentTitle = "Portfolio API Documentation";
    });
}
```

## Example Workflow

### 1. Register a New Admin
```
POST /api/auth/register
{
  "username": "admin",
  "password": "Admin@123",
  "email": "admin@example.com"
}
```

### 2. Copy the Token from Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "email": "admin@example.com"
}
```

### 3. Authorize in Swagger
- Click "Authorize" button
- Enter: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Click "Authorize"

### 4. Use Protected Endpoints
Now you can test all admin endpoints like:
- `POST /api/projects` - Create projects
- `PUT /api/bio` - Update bio
- `POST /api/books` - Add books
- etc.

## Production Notes

- Swagger is only enabled in Development environment
- For production, consider:
  - Disabling Swagger or securing it behind authentication
  - Using Swagger only for internal APIs
  - Generating static API documentation instead

## Troubleshooting

### Swagger UI not loading
- Ensure you're accessing the correct URL with HTTPS
- Check that the application is running in Development mode
- Clear browser cache

### "401 Unauthorized" on protected endpoints
- Make sure you've authorized with a valid JWT token
- Check that the token hasn't expired (tokens are valid for 7 days)
- Ensure you're using the format: `Bearer {token}`

### Cannot see all endpoints
- Make sure all controllers are decorated with `[ApiController]` and `[Route]` attributes
- Rebuild the solution

## Package Information

- **Swashbuckle.AspNetCore**: v10.1.3
- Includes Swagger UI, Swagger Generator, and OpenAPI 3.0 support

## Additional Resources

- [Swashbuckle Documentation](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)
- [OpenAPI Specification](https://swagger.io/specification/)
