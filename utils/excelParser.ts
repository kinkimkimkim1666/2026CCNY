import * as XLSX from 'xlsx';
import { Winner } from '../types';

export const parseExcelFile = (file: File): Promise<Winner[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Assume first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        // Basic validation and mapping
        // We assume simple columns. Row 0 might be header.
        // Let's look for rows with at least 2 columns.
        
        const winners: Winner[] = [];
        
        // Skip header row if it detects "name" or "phone" like keywords, otherwise assume data starts at row 0
        let startIndex = 0;
        if (jsonData.length > 0) {
            const firstRow = jsonData[0].map(c => String(c).toLowerCase());
            if (firstRow.some((c: string) => c.includes('name') || c.includes('名') || c.includes('phone') || c.includes('電話'))) {
                startIndex = 1;
            }
        }

        for (let i = startIndex; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.length >= 2) {
             // Heuristic: Col 0 is Name, Col 1 is Phone. 
             // Or if Phone looks like a number, swap logic could go here.
             // For simplicity, we assume: Column A = Name, Column B = Phone
             const name = String(row[0] || '').trim();
             const phone = String(row[1] || '').trim();

             if (name && phone) {
                 winners.push({
                     id: `imported-${Date.now()}-${i}`,
                     name,
                     phone
                 });
             }
          }
        }
        resolve(winners);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};