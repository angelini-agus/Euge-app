using Dapper;
using Npgsql;
using AutoLeads.Models;

namespace AutoLeads.Data;

public interface IConsultaRepository
{
    Task<int> CrearAsync(Consulta consulta);
    Task<IEnumerable<Consulta>> ListarAsync(ConsultaFiltros filtros);
}

/// <summary>
/// Dapper-based PostgreSQL repository for consultas.
/// All SQL is explicit — no ORM magic, easy to audit.
/// </summary>
public class ConsultaRepository(string connectionString) : IConsultaRepository
{
    private NpgsqlConnection CreateConnection() => new(connectionString);

    public async Task<int> CrearAsync(Consulta consulta)
    {
        const string sql = """
            INSERT INTO consultas (fecha, canal, modelo, nombre_cliente, telefono, ciudad, asesor_asignado, observaciones)
            VALUES (@Fecha, @Canal, @Modelo, @NombreCliente, @Telefono, @Ciudad, @AsesorAsignado, @Observaciones)
            RETURNING id;
            """;

        await using var conn = CreateConnection();
        return await conn.ExecuteScalarAsync<int>(sql, consulta);
    }

    public async Task<IEnumerable<Consulta>> ListarAsync(ConsultaFiltros filtros)
    {
        var conditions = new List<string>();
        var parameters = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(filtros.Canal))
        {
            conditions.Add("canal = @Canal");
            parameters.Add("Canal", filtros.Canal);
        }

        if (!string.IsNullOrWhiteSpace(filtros.AsesorAsignado))
        {
            conditions.Add("asesor_asignado = @AsesorAsignado");
            parameters.Add("AsesorAsignado", filtros.AsesorAsignado);
        }

        if (filtros.FechaDesde.HasValue)
        {
            conditions.Add("fecha >= @FechaDesde");
            parameters.Add("FechaDesde", filtros.FechaDesde.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc));
        }

        if (filtros.FechaHasta.HasValue)
        {
            conditions.Add("fecha <= @FechaHasta");
            parameters.Add("FechaHasta", filtros.FechaHasta.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc));
        }

        var where = conditions.Count > 0
            ? "WHERE " + string.Join(" AND ", conditions)
            : string.Empty;

        // Column aliases map snake_case DB columns to PascalCase C# properties
        var sql = $"""
            SELECT
                id,
                fecha,
                canal,
                modelo,
                nombre_cliente   AS NombreCliente,
                telefono,
                ciudad,
                asesor_asignado  AS AsesorAsignado,
                observaciones
            FROM consultas
            {where}
            ORDER BY fecha DESC;
            """;

        await using var conn = CreateConnection();
        return await conn.QueryAsync<Consulta>(sql, parameters);
    }
}
