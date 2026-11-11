# Test SQL Server Connection
# Run this script to verify if the database connection is working

$connectionString = "sfhoshoshsfiohsoihsdfoishfiosdfhiosfhs"

Write-Host "Testing SQL Server Connection..." -ForegroundColor Cyan
Write-Host "Server: tdgd" -ForegroundColor Yellow
Write-Host "Database: gtrfdg" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Attempting to connect..." -ForegroundColor White
    
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    
    Write-Host "✓ Connection successful!" -ForegroundColor Green
    Write-Host ""
    
    # Get SQL Server version
    $command = $connection.CreateCommand()
    $command.CommandText = "SELECT @@VERSION as Version"
    $reader = $command.ExecuteReader()
    
    if ($reader.Read()) {
        Write-Host "SQL Server Version:" -ForegroundColor Cyan
        Write-Host $reader["Version"] -ForegroundColor White
    }
    
    $reader.Close()
    $connection.Close()
    
    Write-Host ""
    Write-Host "Connection test completed successfully!" -ForegroundColor Green
    Write-Host "You can now run: dotnet ef database update" -ForegroundColor Yellow
    
} catch {
    Write-Host "✗ Connection failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Details:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible Solutions:" -ForegroundColor Cyan
    Write-Host "1. Verify the server address is correct: db41604.databaseasp.net" -ForegroundColor White
    Write-Host "2. Check if your IP address is whitelisted on the hosting provider" -ForegroundColor White
    Write-Host "3. Ensure SQL Server is configured to accept remote connections" -ForegroundColor White
    Write-Host "4. Verify firewall settings allow outbound connection on port 1433" -ForegroundColor White
    Write-Host "5. Contact your hosting provider (databaseasp.net) for support" -ForegroundColor White
    Write-Host ""
    Write-Host "See DATABASE_TROUBLESHOOTING.md for more details" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
