namespace portfilo.Models;

public class Bio
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
