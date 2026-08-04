using AutoLeads.Models;
using AutoLeads.Services;
using ClosedXML.Excel;
using Xunit;

namespace AutoLeads.Tests;

/// <summary>
/// Unit tests for ExcelService.
/// These run without any DB — purely in memory.
/// </summary>
public class ExcelServiceTests
{
    private readonly ExcelService _service = new();

    [Fact]
    public void GenerarExcel_ConListaVacia_RetornaArchivoConSoloEncabezados()
    {
        var bytes = _service.GenerarExcel(Array.Empty<Consulta>());

        Assert.NotEmpty(bytes);

        using var wb = new XLWorkbook(new MemoryStream(bytes));
        var ws = wb.Worksheets.First();

        // Verify exact column names
        Assert.Equal("Fecha",          ws.Cell(1, 1).Value.ToString());
        Assert.Equal("Canal",          ws.Cell(1, 2).Value.ToString());
        Assert.Equal("Modelo",         ws.Cell(1, 3).Value.ToString());
        Assert.Equal("Cliente",        ws.Cell(1, 4).Value.ToString());
        Assert.Equal("Teléfono",       ws.Cell(1, 5).Value.ToString());
        Assert.Equal("Ciudad",         ws.Cell(1, 6).Value.ToString());
        Assert.Equal("Asesor",         ws.Cell(1, 7).Value.ToString());
        Assert.Equal("Observaciones",  ws.Cell(1, 8).Value.ToString());

        // Only the header row should exist
        Assert.Equal(1, ws.LastRowUsed()!.RowNumber());
    }

    [Fact]
    public void GenerarExcel_ConUnRegistro_RetornaDosFilas()
    {
        var data = new[]
        {
            new Consulta
            {
                Fecha          = new DateTimeOffset(2026, 1, 15, 10, 30, 0, TimeSpan.Zero),
                Canal          = "WhatsApp",
                Modelo         = "H6 Pro Hev",
                NombreCliente  = "Juan Pérez",
                Telefono       = "341-1234567",
                Ciudad         = "Rosario",
                AsesorAsignado = "María",
                Observaciones  = "Interesado en financiación"
            }
        };

        var bytes = _service.GenerarExcel(data);

        using var wb = new XLWorkbook(new MemoryStream(bytes));
        var ws = wb.Worksheets.First();

        // Header + 1 data row
        Assert.Equal(2, ws.LastRowUsed()!.RowNumber());

        // Spot-check data row values
        Assert.Equal("WhatsApp",       ws.Cell(2, 2).Value.ToString());
        Assert.Equal("H6 Pro Hev",     ws.Cell(2, 3).Value.ToString());
        Assert.Equal("Juan Pérez",     ws.Cell(2, 4).Value.ToString());
        Assert.Equal("341-1234567",    ws.Cell(2, 5).Value.ToString());
        Assert.Equal("Rosario",        ws.Cell(2, 6).Value.ToString());
        Assert.Equal("María",          ws.Cell(2, 7).Value.ToString());
    }

    [Fact]
    public void GenerarExcel_ConMultiplesRegistros_RetornaFilaPorCadaUno()
    {
        var data = Enumerable.Range(1, 5).Select(i => new Consulta
        {
            Canal          = $"Canal{i}",
            Modelo         = $"Modelo{i}",
            NombreCliente  = $"Cliente{i}",
            Telefono       = $"000-{i:D4}",
            AsesorAsignado = $"Asesor{i}"
        }).ToArray();

        var bytes = _service.GenerarExcel(data);

        using var wb = new XLWorkbook(new MemoryStream(bytes));
        var ws = wb.Worksheets.First();

        // Header + 5 data rows
        Assert.Equal(6, ws.LastRowUsed()!.RowNumber());
    }
}
