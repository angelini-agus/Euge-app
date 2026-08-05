using ClosedXML.Excel;
using AutoLeads.Models;

namespace AutoLeads.Services;

/// <summary>
/// Generates Excel (.xlsx) files from a list of Consulta records.
/// Uses ClosedXML (MIT license, no registration required).
/// Formats dates accurately into Argentina Timezone (UTC-3).
/// </summary>
public class ExcelService
{
    private static readonly TimeZoneInfo ArgentinaTimeZone = GetArgentinaTimeZone();

    private static TimeZoneInfo GetArgentinaTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("America/Argentina/Buenos_Aires");
        }
        catch
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            }
            catch
            {
                return TimeZoneInfo.CreateCustomTimeZone("ART", TimeSpan.FromHours(-3), "Argentina Standard Time", "Argentina Standard Time");
            }
        }
    }

    public byte[] GenerarExcel(IEnumerable<Consulta> datos)
    {
        using var workbook  = new XLWorkbook();
        var ws              = workbook.Worksheets.Add("Consultas");

        // ── Header row ────────────────────────────────────────────────────────
        ws.Cell(1, 1).Value = "Fecha";
        ws.Cell(1, 2).Value = "Canal";
        ws.Cell(1, 3).Value = "Modelo";
        ws.Cell(1, 4).Value = "Cliente";
        ws.Cell(1, 5).Value = "Teléfono";
        ws.Cell(1, 6).Value = "Ciudad";
        ws.Cell(1, 7).Value = "Asesor";
        ws.Cell(1, 8).Value = "Observaciones";

        // Style header
        var headerRange = ws.Range(1, 1, 1, 8);
        headerRange.Style.Font.Bold            = true;
        headerRange.Style.Font.FontColor       = XLColor.White;
        headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#E53935");
        headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        // ── Data rows ─────────────────────────────────────────────────────────
        int row = 2;
        foreach (var c in datos)
        {
            var fechaLocal = TimeZoneInfo.ConvertTime(c.Fecha, ArgentinaTimeZone);
            ws.Cell(row, 1).Value = fechaLocal.ToString("dd/MM/yyyy HH:mm");
            ws.Cell(row, 2).Value = c.Canal;
            ws.Cell(row, 3).Value = c.Modelo;
            ws.Cell(row, 4).Value = c.NombreCliente;
            ws.Cell(row, 5).Value = c.Telefono;
            ws.Cell(row, 6).Value = c.Ciudad         ?? string.Empty;
            ws.Cell(row, 7).Value = c.AsesorAsignado;
            ws.Cell(row, 8).Value = c.Observaciones  ?? string.Empty;

            // Alternate row shading
            if (row % 2 == 0)
                ws.Range(row, 1, row, 8).Style.Fill.BackgroundColor = XLColor.FromHtml("#FFF5F5");

            row++;
        }

        // Auto-fit columns
        ws.Columns().AdjustToContents(minWidth: 10, maxWidth: 60);

        // Freeze header row
        ws.SheetView.FreezeRows(1);

        // ── Serialize ─────────────────────────────────────────────────────────
        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}
