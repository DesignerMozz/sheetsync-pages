import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Table, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface SheetData {
  headers: string[];
  rows: string[][];
}

export const GoogleSheetsIntegration = () => {
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gid, setGid] = useState("");

  const fetchSheetData = async () => {
    if (!sheetUrl) {
      toast.error("Please enter a Google Sheet URL");
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract the sheet ID from the URL
      const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!sheetIdMatch) {
        throw new Error("Invalid Google Sheets URL");
      }
      
      const sheetId = sheetIdMatch[1];
      
      // Extract GID from URL if present, or use the manual input
      const gidMatch = sheetUrl.match(/[#&]gid=([0-9]+)/);
      const sheetGid = gid || (gidMatch ? gidMatch[1] : "0");
      
      // Use the public CSV export URL (sheet must be publicly accessible)
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${sheetGid}`;
      
      console.log("Fetching from:", csvUrl);
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch sheet data. Make sure the sheet is publicly accessible.");
      }
      
      const csvText = await response.text();
      console.log("CSV Response:", csvText.substring(0, 500)); // Log first 500 chars
      
      // Better CSV parsing that handles quotes and commas within cells
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };
      
      const rows = csvText
        .split('\n')
        .filter(line => line.trim())
        .map(line => parseCSVLine(line))
        .filter(row => row.some(cell => cell));
      
      console.log("Parsed rows:", rows.length, "First row:", rows[0]);
      
      if (rows.length > 0) {
        setSheetData({
          headers: rows[0],
          rows: rows.slice(1)
        });
        toast.success("Data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching sheet:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load data");
      setSheetData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-medium border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5 text-primary" />
            Google Sheets Integration
          </CardTitle>
          <CardDescription>
            Connect to your Google Sheet to display data. Sheet must be publicly accessible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste your Google Sheet URL here..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={fetchSheetData} 
              disabled={isLoading}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Load Data
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sheet Tab GID (optional)</label>
            <Input
              placeholder="e.g., 0 for first tab, or find in URL: #gid=123456789"
              value={gid}
              onChange={(e) => setGid(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              If your data is on a different tab, copy the number from the URL after #gid= or leave blank for first sheet
            </p>
          </div>
          
          <Alert className="bg-muted/50">
            <AlertDescription className="text-sm">
              <strong>Note:</strong> Your Google Sheet must be publicly accessible (Anyone with the link can view).
              To make it public: File → Share → Change to "Anyone with the link"
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {sheetData && (
        <Card className="shadow-medium border-border/50 animate-fade-in">
          <CardHeader>
            <CardTitle>Sheet Data</CardTitle>
            <CardDescription>
              Showing {sheetData.rows.length} rows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {sheetData.headers.map((header, index) => (
                      <th 
                        key={index}
                        className="text-left p-3 font-semibold text-foreground bg-muted/30"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheetData.rows.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      style={{ animationDelay: `${rowIndex * 0.05}s` }}
                    >
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-3 text-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
