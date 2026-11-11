using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfilo.Data;
using portfilo.DTOs;
using portfilo.Models;

namespace portfilo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        return await _context.Projects.OrderByDescending(p => p.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project == null)
        {
            return NotFound();
        }

        return project;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject(ProjectDTO projectDto)
    {
        var project = new Project
        {
            Title = projectDto.Title,
            Description = projectDto.Description,
            ImageUrl = projectDto.ImageUrl,
            TechnologiesUsed = projectDto.TechnologiesUsed,
            ProjectUrl = projectDto.ProjectUrl,
            GithubUrl = projectDto.GithubUrl
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, ProjectDTO projectDto)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project == null)
        {
            return NotFound();
        }

        project.Title = projectDto.Title;
        project.Description = projectDto.Description;
        project.ImageUrl = projectDto.ImageUrl;
        project.TechnologiesUsed = projectDto.TechnologiesUsed;
        project.ProjectUrl = projectDto.ProjectUrl;
        project.GithubUrl = projectDto.GithubUrl;
        project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project == null)
        {
            return NotFound();
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
