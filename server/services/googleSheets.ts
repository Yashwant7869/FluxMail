import { google } from 'googleapis';

const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY || process.env.GOOGLE_API_KEY;

if (!GOOGLE_SHEETS_API_KEY) {
  console.warn("Google Sheets API key not found. Google Sheets integration will not work.");
}

export interface SheetData {
  id: string;
  name: string;
  values: string[][];
}

export async function getSheetData(spreadsheetId: string, range: string = 'A:Z'): Promise<SheetData | null> {
  if (!GOOGLE_SHEETS_API_KEY) {
    throw new Error("Google Sheets API key not configured");
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: GOOGLE_SHEETS_API_KEY });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values || [];
    
    return {
      id: spreadsheetId,
      name: 'Sheet Data',
      values
    };
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error('Failed to fetch Google Sheets data');
  }
}

export async function getSpreadsheetInfo(spreadsheetId: string) {
  if (!GOOGLE_SHEETS_API_KEY) {
    throw new Error("Google Sheets API key not configured");
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: GOOGLE_SHEETS_API_KEY });
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    return {
      id: spreadsheetId,
      title: response.data.properties?.title || 'Untitled Spreadsheet',
      sheets: response.data.sheets?.map((sheet: any) => ({
        id: sheet.properties?.sheetId,
        title: sheet.properties?.title || 'Untitled Sheet'
      })) || []
    };
  } catch (error) {
    console.error('Error fetching spreadsheet info:', error);
    throw new Error('Failed to fetch spreadsheet info');
  }
}

export function parseContactsFromSheet(values: string[][], emailColumn: number, nameColumn?: number): Array<{ email: string; name?: string; customFields: Record<string, any> }> {
  const contacts: Array<{ email: string; name?: string; customFields: Record<string, any> }> = [];
  
  if (values.length === 0) return contacts;
  
  const headers = values[0];
  const dataRows = values.slice(1);
  
  for (const row of dataRows) {
    if (row.length <= emailColumn) continue;
    
    const email = row[emailColumn]?.trim();
    if (!email || !isValidEmail(email)) continue;
    
    const name = nameColumn !== undefined && row.length > nameColumn ? row[nameColumn]?.trim() : undefined;
    
    const customFields: Record<string, any> = {};
    headers.forEach((header, index) => {
      if (index !== emailColumn && index !== nameColumn && row[index]) {
        customFields[header] = row[index];
      }
    });
    
    contacts.push({ email, name, customFields });
  }
  
  return contacts;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
