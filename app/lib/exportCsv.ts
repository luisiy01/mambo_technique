// lib/exportCsv.ts

interface CsvColumn<T> {
  header: string;
  accessor: (item: T) => string | number;
}

export function exportToCsv<T>(data: T[], columns: CsvColumn<T>[], filename: string) {
  if (!data || data.length === 0) return;

  // 1. Crear fila de encabezados
  const headers = columns.map((col) => `"${col.header}"`).join(',');

  // 2. Mapear cada registro a una fila CSV escapando comillas dobles
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const val = col.accessor(item);
        const stringVal = val !== undefined && val !== null ? String(val) : '';
        // Escapar comillas dobles internas
        return `"${stringVal.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  // 3. Unir encabezados y filas
  const csvContent = [headers, ...rows].join('\n');

  // 4. Agregar BOM (\uFEFF) para forzar a Excel a leerlo en UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

  // 5. Disparar la descarga en el navegador
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}