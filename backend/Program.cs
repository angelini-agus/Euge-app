using AutoLeads.Data;
using AutoLeads.Models;
using AutoLeads.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Connection string from environment (Docker injects DATABASE_URL) ──────────
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=autoleads;Username=autoleads;Password=autoleads_pass";

// ── Dependency Injection ──────────────────────────────────────────────────────
builder.Services.AddSingleton<IConsultaRepository>(_ => new ConsultaRepository(connectionString));
builder.Services.AddSingleton<ExcelService>();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allows the Vite dev server (localhost:5173) and any Cloudflare Pages domain
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://autoleads-crm.pages.dev"
            )
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .WithHeaders("Content-Type", "Authorization", "Accept")
            .AllowCredentials();
    });
});

var app = builder.Build();

// Order matters: UseCors before MapGet/MapPost
app.UseCors();

// ── Health check ──────────────────────────────────────────────────────────────
app.MapGet("/health", () =>
    Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));

// ── GET /api/catalogos — Dropdown options ─────────────────────────────────────
// Returns static lists used to populate form dropdowns.
// In a production system these would come from DB lookup tables.
app.MapGet("/api/catalogos", () =>
{
    return Results.Ok(new
    {
        canales = new[]
        {
            "WhatsApp", "Instagram", "Facebook", "Mercado Libre",
            "Web", "Llamado", "Presencial", "Referido"
        },
        modelos = new[]
        {
            "JOLION H.SUPREME", "JOLION PRO", "H6", "H6 Pro Hev",
            "C31 BOX", "ORA 03", "ORA Funky Cat",
            "TANK 300", "TANK 500", "Dargo X"
        },
        asesores = new[]
        {
            "Diego", "Marcos", "Laura", "Carlos", "Ana", "Martín"
        },
        ciudades = new[]
        {
            "Rosario", "Córdoba", "Buenos Aires", "Santa Fe",
            "Venado Tuerto", "Rafaela", "San Lorenzo", "Paraná"
        }
    });
});

// ── GET /api/consultas — List with optional filters ───────────────────────────
app.MapGet("/api/consultas", async (
    IConsultaRepository repo,
    string?             canal,
    string?             asesorAsignado,
    string?             fechaDesde,
    string?             fechaHasta) =>
{
    var filtros = new ConsultaFiltros
    {
        Canal          = canal,
        AsesorAsignado = asesorAsignado,
        FechaDesde     = DateOnly.TryParse(fechaDesde, out var fd) ? fd : null,
        FechaHasta     = DateOnly.TryParse(fechaHasta, out var fh) ? fh : null
    };

    var data = await repo.ListarAsync(filtros);
    return Results.Ok(data);
});

// ── POST /api/consultas — Create a new lead ───────────────────────────────────
app.MapPost("/api/consultas", async (IConsultaRepository repo, CreateConsultaRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Canal)   ||
        string.IsNullOrWhiteSpace(req.Modelo)  ||
        string.IsNullOrWhiteSpace(req.Telefono)||
        string.IsNullOrWhiteSpace(req.AsesorAsignado))
    {
        return Results.BadRequest(new { error = "Canal, Modelo, Telefono y AsesorAsignado son requeridos." });
    }

    var consulta = new Consulta
    {
        Fecha          = DateTimeOffset.UtcNow,
        Canal          = req.Canal.Trim(),
        Modelo         = req.Modelo.Trim(),
        NombreCliente  = req.NombreCliente?.Trim() ?? string.Empty,
        Telefono       = req.Telefono.Trim(),
        Ciudad         = req.Ciudad?.Trim(),
        AsesorAsignado = req.AsesorAsignado.Trim(),
        Observaciones  = req.Observaciones?.Trim()
    };

    var id = await repo.CrearAsync(consulta);
    return Results.Created($"/api/consultas/{id}", new { id });
});

// ── GET /api/consultas/export — Download Excel with current filters ────────────
// IMPORTANT: this route must be declared BEFORE /api/consultas/{id} if you add
// one later, otherwise "export" would be matched as an id segment.
app.MapGet("/api/consultas/export", async (
    IConsultaRepository repo,
    ExcelService         excel,
    string?              canal,
    string?              asesorAsignado,
    string?              fechaDesde,
    string?              fechaHasta) =>
{
    var filtros = new ConsultaFiltros
    {
        Canal          = canal,
        AsesorAsignado = asesorAsignado,
        FechaDesde     = DateOnly.TryParse(fechaDesde, out var fd) ? fd : null,
        FechaHasta     = DateOnly.TryParse(fechaHasta, out var fh) ? fh : null
    };

    var data     = await repo.ListarAsync(filtros);
    var bytes    = excel.GenerarExcel(data);
    var filename = $"consultas_{DateTime.Now:yyyyMMdd_HHmm}.xlsx";

    return Results.File(
        bytes,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileDownloadName: filename
    );
});

app.Run();

// Make the implicit Program class accessible from integration tests
public partial class Program { }
