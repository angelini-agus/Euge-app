using Dapper;
using Npgsql;
using AutoLeads.Models;

namespace AutoLeads.Data;

public interface IMasterDataRepository
{
    // Modelos
    Task<IEnumerable<ModeloEntity>> ListarModelosAsync(bool soloActivos = false);
    Task<int> CrearModeloAsync(string nombre);
    Task<bool> ActualizarModeloAsync(int id, string nombre, bool activo);
    Task<bool> AlternarEstadoModeloAsync(int id, bool activo);

    // Vendedores
    Task<IEnumerable<VendedorEntity>> ListarVendedoresAsync(bool soloActivos = false);
    Task<int> CrearVendedorAsync(string nombre);
    Task<bool> ActualizarVendedorAsync(int id, string nombre, bool activo);
    Task<bool> AlternarEstadoVendedorAsync(int id, bool activo);
}

public class MasterDataRepository(string connectionString) : IMasterDataRepository
{
    private NpgsqlConnection CreateConnection() => new(connectionString);

    // ── Modelos ────────────────────────────────────────────────────────────────
    public async Task<IEnumerable<ModeloEntity>> ListarModelosAsync(bool soloActivos = false)
    {
        var sql = soloActivos
            ? "SELECT id, nombre, activo FROM modelos WHERE activo = TRUE ORDER BY nombre ASC;"
            : "SELECT id, nombre, activo FROM modelos ORDER BY nombre ASC;";

        await using var conn = CreateConnection();
        return await conn.QueryAsync<ModeloEntity>(sql);
    }

    public async Task<int> CrearModeloAsync(string nombre)
    {
        const string sql = """
            INSERT INTO modelos (nombre, activo)
            VALUES (@Nombre, TRUE)
            RETURNING id;
            """;

        await using var conn = CreateConnection();
        return await conn.ExecuteScalarAsync<int>(sql, new { Nombre = nombre.Trim() });
    }

    public async Task<bool> ActualizarModeloAsync(int id, string nombre, bool activo)
    {
        const string sql = """
            UPDATE modelos
            SET nombre = @Nombre, activo = @Activo
            WHERE id = @Id;
            """;

        await using var conn = CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { Id = id, Nombre = nombre.Trim(), Activo = activo });
        return rows > 0;
    }

    public async Task<bool> AlternarEstadoModeloAsync(int id, bool activo)
    {
        const string sql = """
            UPDATE modelos
            SET activo = @Activo
            WHERE id = @Id;
            """;

        await using var conn = CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { Id = id, Activo = activo });
        return rows > 0;
    }

    // ── Vendedores ──────────────────────────────────────────────────────────────
    public async Task<IEnumerable<VendedorEntity>> ListarVendedoresAsync(bool soloActivos = false)
    {
        var sql = soloActivos
            ? "SELECT id, nombre, activo FROM vendedores WHERE activo = TRUE ORDER BY nombre ASC;"
            : "SELECT id, nombre, activo FROM vendedores ORDER BY nombre ASC;";

        await using var conn = CreateConnection();
        return await conn.QueryAsync<VendedorEntity>(sql);
    }

    public async Task<int> CrearVendedorAsync(string nombre)
    {
        const string sql = """
            INSERT INTO vendedores (nombre, activo)
            VALUES (@Nombre, TRUE)
            RETURNING id;
            """;

        await using var conn = CreateConnection();
        return await conn.ExecuteScalarAsync<int>(sql, new { Nombre = nombre.Trim() });
    }

    public async Task<bool> ActualizarVendedorAsync(int id, string nombre, bool activo)
    {
        const string sql = """
            UPDATE vendedores
            SET nombre = @Nombre, activo = @Activo
            WHERE id = @Id;
            """;

        await using var conn = CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { Id = id, Nombre = nombre.Trim(), Activo = activo });
        return rows > 0;
    }

    public async Task<bool> AlternarEstadoVendedorAsync(int id, bool activo)
    {
        const string sql = """
            UPDATE vendedores
            SET activo = @Activo
            WHERE id = @Id;
            """;

        await using var conn = CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { Id = id, Activo = activo });
        return rows > 0;
    }
}
