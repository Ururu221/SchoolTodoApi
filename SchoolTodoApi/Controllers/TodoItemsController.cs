using Microsoft.AspNetCore.Mvc;
using SchoolTodoApi.Models;
using SchoolTodoApi.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolTodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoItemService _todoItemService;

        public TodoItemsController(TodoItemService todoItemService)
        {
            _todoItemService = todoItemService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TodoItem>>> Get() =>
            await _todoItemService.GetAsync();

        [HttpGet("{id:length(24)}", Name = "GetTodoItem")]
        public async Task<ActionResult<TodoItem>> Get(string id)
        {
            var todoItem = await _todoItemService.GetAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
        }

        [HttpGet("entity/{entityId}/{entityType}")]
        public async Task<ActionResult<List<TodoItem>>> GetByEntity(string entityId, string entityType) =>
            await _todoItemService.GetByEntityAsync(entityId, entityType);

        [HttpPost]
        public async Task<ActionResult<TodoItem>> Create(TodoItem todoItem)
        {
            await _todoItemService.CreateAsync(todoItem);

            return CreatedAtRoute("GetTodoItem", new { id = todoItem.Id }, todoItem);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, TodoItem todoItemIn)
        {
            var todoItem = await _todoItemService.GetAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            await _todoItemService.UpdateAsync(id, todoItemIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var todoItem = await _todoItemService.GetAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            await _todoItemService.RemoveAsync(id);

            return NoContent();
        }
    }
}