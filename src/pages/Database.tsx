
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, FileText, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Database: React.FC = () => {
  const sampleData = [
    { id: 'rec1', name: 'Иванов Иван Иванович', dateOfBirth: '15.05.1985', address: 'ул. Ленина, 45', status: 'В розыске' },
    { id: 'rec2', name: 'Петров Петр Петрович', dateOfBirth: '22.10.1990', address: 'пр. Гагарина, 12', status: 'Под наблюдением' },
    { id: 'rec3', name: 'Сидорова Анна Васильевна', dateOfBirth: '03.02.1978', address: 'ул. Пушкина, 78', status: 'Закрыто' },
    { id: 'rec4', name: 'Козлов Александр Николаевич', dateOfBirth: '11.12.1982', address: 'ул. Мира, 34', status: 'Активно' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">База данных</h1>
        <p className="text-muted-foreground">Информация о гражданах и происшествиях</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Записей</CardTitle>
            <CardDescription>Всего в базе</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,254</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Активных дел</CardTitle>
            <CardDescription>Требуют внимания</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">27</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>В розыске</CardTitle>
            <CardDescription>Текущий статус</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Поиск в базе данных" 
            className="pl-8"
          />
        </div>
        <Button className="ml-2">
          <Plus className="h-4 w-4 mr-1" /> Новая запись
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ФИО</TableHead>
                <TableHead>Дата рождения</TableHead>
                <TableHead>Адрес</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.dateOfBirth}</TableCell>
                  <TableCell>{record.address}</TableCell>
                  <TableCell>
                    <span className={
                      record.status === 'В розыске' ? 'text-red-500' :
                      record.status === 'Под наблюдением' ? 'text-amber-500' :
                      record.status === 'Активно' ? 'text-blue-500' : 'text-green-500'
                    }>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Database;
