import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

interface DataVisualizationProps {
  headers: string[];
  rows: string[][];
}

export const DataVisualization = ({ headers, rows }: DataVisualizationProps) => {
  // Analyze data to determine chart types
  const analyzeColumn = (columnIndex: number) => {
    const values = rows.map(row => row[columnIndex]).filter(v => v && v.trim());
    const numericValues = values.filter(v => !isNaN(Number(v)));
    const isNumeric = numericValues.length > values.length * 0.7; // 70% numeric threshold
    
    return {
      isNumeric,
      uniqueCount: new Set(values).size,
      values,
      numericValues: numericValues.map(Number)
    };
  };

  // Find first numeric column for bar chart
  const numericColumnIndex = headers.findIndex((_, index) => analyzeColumn(index).isNumeric);
  const categoricalColumnIndex = headers.findIndex((_, index) => !analyzeColumn(index).isNumeric);

  // Prepare bar chart data
  const barChartData = numericColumnIndex >= 0 ? rows.slice(0, 10).map((row, index) => ({
    name: row[0] || `Row ${index + 1}`,
    value: Number(row[numericColumnIndex]) || 0
  })) : [];

  // Prepare pie chart data (categorical distribution)
  const pieChartData = categoricalColumnIndex >= 0 ? (() => {
    const distribution = rows.reduce((acc, row) => {
      const key = row[categoricalColumnIndex] || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(distribution)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  })() : [];

  // Chart colors using design system
  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--secondary))",
    "hsl(var(--muted))",
    "hsl(198 93% 35%)",
    "hsl(176 70% 40%)"
  ];

  // Summary statistics
  const totalRows = rows.length;
  const totalColumns = headers.length;
  const numericColumns = headers.filter((_, index) => analyzeColumn(index).isNumeric).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalRows}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{totalColumns}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Numeric Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{numericColumns}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      {barChartData.length > 0 && (
        <Card className="shadow-medium border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {headers[numericColumnIndex]} Distribution
            </CardTitle>
            <CardDescription>
              Top {Math.min(10, rows.length)} entries by {headers[numericColumnIndex].toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Pie Chart */}
      {pieChartData.length > 0 && (
        <Card className="shadow-medium border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-accent" />
              {headers[categoricalColumnIndex]} Distribution
            </CardTitle>
            <CardDescription>
              Distribution of categories in {headers[categoricalColumnIndex].toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {pieChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Line Chart for numeric trend */}
      {numericColumnIndex >= 0 && rows.length > 3 && (
        <Card className="shadow-medium border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              {headers[numericColumnIndex]} Trend
            </CardTitle>
            <CardDescription>
              Trend analysis over all entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
