using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfilo.Data;
using portfilo.DTOs;
using portfilo.Models;

namespace portfilo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PicturesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PicturesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Picture>>> GetPictures([FromQuery] string? category = null)
    {
        var query = _context.Pictures.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category == category);
        }

        return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Picture>> GetPicture(int id)
    {
        var picture = await _context.Pictures.FindAsync(id);

        if (picture == null)
        {
            return NotFound();
        }

        return picture;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Picture>> CreatePicture(PictureDTO pictureDto)
    {
        var picture = new Picture
        {
            Title = pictureDto.Title,
            ImageUrl = pictureDto.ImageUrl,
            Description = pictureDto.Description,
            Category = pictureDto.Category
        };

        _context.Pictures.Add(picture);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPicture), new { id = picture.Id }, picture);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePicture(int id, PictureDTO pictureDto)
    {
        var picture = await _context.Pictures.FindAsync(id);

        if (picture == null)
        {
            return NotFound();
        }

        picture.Title = pictureDto.Title;
        picture.ImageUrl = pictureDto.ImageUrl;
        picture.Description = pictureDto.Description;
        picture.Category = pictureDto.Category;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePicture(int id)
    {
        var picture = await _context.Pictures.FindAsync(id);

        if (picture == null)
        {
            return NotFound();
        }

        _context.Pictures.Remove(picture);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
