
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateIncidentStats } from '@/services/incidentService';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

const Analytics: React.FC = () => {
  const [stats, setStats] = useState(generateIncidentStats());
  
  // Re-generate stats when component mounts
  useEffect(() => {
    setStats(generateIncidentStats());
  }, []);

  // Colors for pie chart
  const COLORS = ['#ef4444', '#f59e0b', '#22c55e'];

  // Convert data for bar chart
  const barData = stats.months.map((month, index) => {
    const data: {[key: string]: any} = { month };
    stats.incidentsByType.forEach(type => {
      data[type.name] = type.data[index];
    });
    return data;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <p className="text-muted-foreground">Статистика происшествий</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Всего инцидентов</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalIncidents}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Решено</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.resolvedIncidents}</p>
            <p className="text-sm text-muted-foreground">
              {Math.round((stats.resolvedIncidents / stats.totalIncidents) * 100)}% от общего количества
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Среднее время реакции</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.averageResponseTime} мин</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Тенденции по типам происшествий</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {stats.incidentsByType.map((type, index) => (
                  <Bar 
                    key={type.name}
                    dataKey={type.name} 
                    fill={`hsl(${index * 40}, 70%, 50%)`} 
                    stackId="a" 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение по приоритетам</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.priorityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
