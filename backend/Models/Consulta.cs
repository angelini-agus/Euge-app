namespace AutoLeads.Models;

/// <summary>
/// Domain entity representing a single lead/consultation record.
/// Maps 1:1 to the `consultas` table in PostgreSQL.
/// </summary>
public class Consulta
{
    public int Id { get; set; }
    public DateTimeOffset Fecha { get; set; } = DateTimeOffset.UtcNow;
    public string Canal { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public string NombreCliente { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string? Ciudad { get; set; }
    public string AsesorAsignado { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
}

/// <summary>
/// Optional filter parameters for the listing endpoint.
/// All fields are optional — null/empty means "no filter".
/// </summary>
public class ConsultaFiltros
{
    public string? Canal { get; set; }
    public string? AsesorAsignado { get; set; }
    public DateOnly? FechaDesde { get; set; }
    public DateOnly? FechaHasta { get; set; }
}

/// <summary>
/// DTO for POST /api/consultas — the JSON body the frontend sends.
/// </summary>
public record CreateConsultaRequest(
    string Canal,
    string Modelo,
    string NombreCliente,
    string Telefono,
    string? Ciudad,
    string AsesorAsignado,
    string? Observaciones
);
