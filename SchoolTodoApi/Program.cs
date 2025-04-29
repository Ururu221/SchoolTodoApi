using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using SchoolTodoApi.Models;
using SchoolTodoApi.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.Configure<SchoolDatabaseSettings>(
    builder.Configuration.GetSection(nameof(SchoolDatabaseSettings)));

builder.Services.AddSingleton<ISchoolDatabaseSettings>(sp =>
    sp.GetRequiredService<IOptions<SchoolDatabaseSettings>>().Value);

builder.Services.AddSingleton<StudentService>(sp =>
{
    var logger = sp.GetRequiredService<ILogger<StudentService>>();
    var settings = sp.GetRequiredService<ISchoolDatabaseSettings>();
    try
    {
        logger.LogInformation($"Connecting to MongoDB at {settings.ConnectionString}");
        return new StudentService(settings);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to connect to MongoDB");
        throw;
    }
});

builder.Services.AddSingleton<SchoolService>();
builder.Services.AddSingleton<TodoItemService>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SchoolTodoApi",
        Version = "v1",
        Description = "A simple API for managing schools, students, and todo items"
    });
});


var app = builder.Build();


app.UseDeveloperExceptionPage();

app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection(); 

app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.Run();
