
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateIncidentStats } from '@/services/incidentService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { IncidentType, Priority } from '@/types/incident';

interface AnalyticsData {
  months: string[];
  incidentsByType: {
    name: string;
    data: number[];
  }[];
  priorityDistribution: {
    name: string;
    value: number;
  }[];
  totalIncidents: number;
  resolvedIncidents: number;
  averageResponseTime: number;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTab, setSelectedTab] = useState<'daily' | 'monthly'>('daily');
  
  useEffect(() => {
    // Generate mock data
    const data = generateIncidentStats();
    setAnalyticsData(data);
  }, []);

  if (!analyticsData) {
    return <div>Загрузка данных...</div>;
  }

  // Colors for priority pie chart
  const PRIORITY_COLORS = {
    [Priority.HIGH]: '#ef4444',
    [Priority.MEDIUM]: '#eab308',
    [Priority.LOW]: '#22c55e'
  };

  // Format data for the daily chart
  const dailyData = Object.values(IncidentType).map(type => {
    const typeData = analyticsData.incidentsByType.find(item => item.name === type);
    // Get the last value (most recent day)
    const value = typeData ? typeData.data[typeData.data.length - 1] : 0;
    return { name: type, value };
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="text-muted-foreground">Статистика и анализ инцидентов</p>
        </div>
      </div>

      <Tabs defaultValue="daily" value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Дневная статистика</TabsTrigger>
          <TabsTrigger value="monthly">Месячная статистика</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{analyticsData.totalIncidents}</CardTitle>
                <CardDescription>Всего инцидентов сегодня</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{analyticsData.resolvedIncidents}</CardTitle>
                <CardDescription>Разрешено инцидентов</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{analyticsData.averageResponseTime} мин.</CardTitle>
                <CardDescription>Среднее время реакции</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Распределение по типам</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Распределение по приоритету</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.priorityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.priorityDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PRIORITY_COLORS[entry.name as Priority] || '#9b87f5'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Тренды по типам инцидентов</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.months.map((month, i) => {
                  const data: any = { month };
                  analyticsData.incidentsByType.forEach(typeData => {
                    data[typeData.name] = typeData.data[i];
                  });
                  return data;
                })}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {analyticsData.incidentsByType.map((type, index) => (
                    <Bar 
                      key={type.name}
                      dataKey={type.name} 
                      stackId="a" 
                      fill={`hsl(${index * 40}, 70%, 60%)`} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
