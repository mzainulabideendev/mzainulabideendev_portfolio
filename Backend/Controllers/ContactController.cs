using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfilo.Data;
using portfilo.DTOs;
using portfilo.Models;

namespace portfilo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ContactController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ContactMessage>> SubmitContactForm(ContactDTO contactDto)
    {
        var message = new ContactMessage
        {
            Name = contactDto.Name,
            Email = contactDto.Email,
            Subject = contactDto.Subject,
            Message = contactDto.Message
        };

        _context.ContactMessages.Add(message);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetContactMessage), new { id = message.Id }, message);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetContactMessages()
    {
        return await _context.ContactMessages.OrderByDescending(m => m.CreatedAt).ToListAsync();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<ContactMessage>> GetContactMessage(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);

        if (message == null)
        {
            return NotFound();
        }

        return message;
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);

        if (message == null)
        {
            return NotFound();
        }

        message.IsRead = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContactMessage(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);

        if (message == null)
        {
            return NotFound();
        }

        _context.ContactMessages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
