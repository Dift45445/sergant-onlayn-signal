
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, FileText, Plus, History, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PersonRecord {
  id: string;
  name: string;
  dateOfBirth: string;
  address: string;
  status: string;
  passport?: string;
  phone?: string;
}

interface SearchHistoryItem {
  id: string;
  query: string;
  type: 'name' | 'passport' | 'phone';
  timestamp: Date;
}

const Database: React.FC = () => {
  const [searchType, setSearchType] = useState<'name' | 'passport' | 'phone'>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [personDetails, setPersonDetails] = useState<PersonRecord | null>(null);
  const isMobile = useIsMobile();
  
  const sampleData: PersonRecord[] = [
    { 
      id: 'rec1', 
      name: 'Иванов Иван Иванович', 
      dateOfBirth: '15.05.1985', 
      address: 'ул. Ленина, 45', 
      status: 'В розыске',
      passport: '4515 123456',
      phone: '+79128765432'
    },
    { 
      id: 'rec2', 
      name: 'Петров Петр Петрович', 
      dateOfBirth: '22.10.1990', 
      address: 'пр. Гагарина, 12', 
      status: 'Под наблюдением',
      passport: '4601 789012',
      phone: '+79223456789'
    },
    { 
      id: 'rec3', 
      name: 'Сидорова Анна Васильевна', 
      dateOfBirth: '03.02.1978', 
      address: 'ул. Пушкина, 78', 
      status: 'Закрыто',
      passport: '4511 345678',
      phone: '+79034567890'
    },
    { 
      id: 'rec4', 
      name: 'Козлов Александр Николаевич', 
      dateOfBirth: '11.12.1982', 
      address: 'ул. Мира, 34', 
      status: 'Активно',
      passport: '4602 234567',
      phone: '+79112345678'
    },
  ];

  const filteredData = sampleData.filter(record => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    switch (searchType) {
      case 'name':
        return record.name.toLowerCase().includes(query);
      case 'passport':
        return record.passport?.toLowerCase().includes(query);
      case 'phone':
        return record.phone?.toLowerCase().includes(query);
      default:
        return true;
    }
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Add to search history
    const historyItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: searchQuery,
      type: searchType,
      timestamp: new Date()
    };
    
    setSearchHistory(prev => [historyItem, ...prev]);
    toast.success("Поиск выполнен", {
      description: `${searchType === 'name' ? 'ФИО' : searchType === 'passport' ? 'Паспорт' : 'Телефон'}: ${searchQuery}`
    });
  };

  const handleHistoryItemClick = (item: SearchHistoryItem) => {
    setSearchType(item.type);
    setSearchQuery(item.query);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    toast.info("История поиска очищена");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showPersonDetails = (person: PersonRecord) => {
    setPersonDetails(person);
  };

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

      <Tabs defaultValue="search" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="search">Поиск</TabsTrigger>
          <TabsTrigger value="history">История поиска</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <div className="flex-1 flex items-center gap-2 min-w-[300px]">
              <Select 
                value={searchType} 
                onValueChange={(value) => setSearchType(value as 'name' | 'passport' | 'phone')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Тип поиска" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">ФИО</SelectItem>
                  <SelectItem value="passport">Номер паспорта</SelectItem>
                  <SelectItem value="phone">Номер телефона</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Поиск в базе данных" 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-1" /> Найти
              </Button>
            </div>
            <Button>
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
                  {filteredData.length > 0 ? (
                    filteredData.map((record) => (
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
                          <Button variant="ghost" size="sm" onClick={() => showPersonDetails(record)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        Записей не найдено
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">История поиска</h3>
            {searchHistory.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-1" /> Очистить историю
              </Button>
            )}
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Запрос</TableHead>
                    <TableHead>Тип поиска</TableHead>
                    <TableHead>Время</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchHistory.length > 0 ? (
                    searchHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.query}</TableCell>
                        <TableCell>
                          {item.type === 'name' ? 'ФИО' : 
                           item.type === 'passport' ? 'Паспорт' : 
                           'Телефон'}
                        </TableCell>
                        <TableCell>{formatTime(item.timestamp)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleHistoryItemClick(item)}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                        История поиска пуста
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {personDetails && (
        <Dialog open={!!personDetails} onOpenChange={() => setPersonDetails(null)}>
          <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw]" : ""}>
            <DialogHeader>
              <DialogTitle>Детали записи</DialogTitle>
              <DialogDescription>Полная информация о гражданине</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <div className="font-medium col-span-1">ФИО:</div>
                <div className="col-span-3">{personDetails.name}</div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <div className="font-medium col-span-1">Дата рождения:</div>
                <div className="col-span-3">{personDetails.dateOfBirth}</div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <div className="font-medium col-span-1">Адрес:</div>
                <div className="col-span-3">{personDetails.address}</div>
              </div>
              
              {personDetails.passport && (
                <div className="grid grid-cols-4 items-center gap-2">
                  <div className="font-medium col-span-1">Паспорт:</div>
                  <div className="col-span-3">{personDetails.passport}</div>
                </div>
              )}
              
              {personDetails.phone && (
                <div className="grid grid-cols-4 items-center gap-2">
                  <div className="font-medium col-span-1">Телефон:</div>
                  <div className="col-span-3">{personDetails.phone}</div>
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-2">
                <div className="font-medium col-span-1">Статус:</div>
                <div className="col-span-3">
                  <span className={
                    personDetails.status === 'В розыске' ? 'text-red-500 font-medium' :
                    personDetails.status === 'Под наблюдением' ? 'text-amber-500 font-medium' :
                    personDetails.status === 'Активно' ? 'text-blue-500 font-medium' : 
                    'text-green-500 font-medium'
                  }>
                    {personDetails.status}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Database;
