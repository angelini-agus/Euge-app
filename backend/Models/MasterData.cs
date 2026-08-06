namespace AutoLeads.Models;

/// <summary>
/// Domain entity representing a vehicle model.
/// Maps to `modelos` table in PostgreSQL.
/// </summary>
public class ModeloEntity
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

/// <summary>
/// Domain entity representing a seller/advisor.
/// Maps to `vendedores` table in PostgreSQL.
/// </summary>
public class VendedorEntity
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

/// <summary>
/// DTO for creating a master data item (model or seller).
/// </summary>
public record CreateMasterDataItemRequest(string Nombre);

/// <summary>
/// DTO for updating a master data item.
/// </summary>
public record UpdateMasterDataItemRequest(string Nombre, bool Activo);
