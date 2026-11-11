using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfilo.Data;
using portfilo.DTOs;
using portfilo.Models;

namespace portfilo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BioController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BioController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<Bio>> GetBio()
    {
        var bio = await _context.Bios.FirstOrDefaultAsync();

        if (bio == null)
        {
            return NotFound("Bio not found. Please create one first.");
        }

        return bio;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Bio>> CreateBio(BioDTO bioDto)
    {
        if (await _context.Bios.AnyAsync())
        {
            return BadRequest("Bio already exists. Use PUT to update.");
        }

        var bio = new Bio
        {
            Name = bioDto.Name,
            Title = bioDto.Title,
            Description = bioDto.Description,
            ProfileImageUrl = bioDto.ProfileImageUrl,
            Email = bioDto.Email,
            Phone = bioDto.Phone,
            LinkedInUrl = bioDto.LinkedInUrl,
            GithubUrl = bioDto.GithubUrl,
            TwitterUrl = bioDto.TwitterUrl
        };

        _context.Bios.Add(bio);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBio), bio);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> UpdateBio(BioDTO bioDto)
    {
        var bio = await _context.Bios.FirstOrDefaultAsync();

        if (bio == null)
        {
            return NotFound("Bio not found. Please create one first.");
        }

        bio.Name = bioDto.Name;
        bio.Title = bioDto.Title;
        bio.Description = bioDto.Description;
        bio.ProfileImageUrl = bioDto.ProfileImageUrl;
        bio.Email = bioDto.Email;
        bio.Phone = bioDto.Phone;
        bio.LinkedInUrl = bioDto.LinkedInUrl;
        bio.GithubUrl = bioDto.GithubUrl;
        bio.TwitterUrl = bioDto.TwitterUrl;
        bio.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
