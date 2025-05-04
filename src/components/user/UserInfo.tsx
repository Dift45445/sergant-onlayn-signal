
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";
import { LogIn, User } from 'lucide-react';

const UserInfo = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [crewInfo, setCrewInfo] = useState({
    officerName: '',
    partnerName: '',
    crew: '',
    shiftType: ''
  });
  const isMobile = useIsMobile();

  const toggleStatus = () => {
    setIsOnline(!isOnline);
  };

  const handleStartShift = () => {
    if (!crewInfo.officerName || !crewInfo.partnerName || !crewInfo.crew || !crewInfo.shiftType) {
      toast.error("Заполните все поля");
      return;
    }

    setIsLoggedIn(true);
    setIsOnline(true);
    setIsDialogOpen(false);
    toast.success("Смена начата", {
      description: `${crewInfo.crew}: ${crewInfo.officerName}, ${crewInfo.partnerName}`
    });
  };

  const handleEndShift = () => {
    setIsLoggedIn(false);
    setIsOnline(false);
    toast.info("Смена завершена");
  };

  if (!isLoggedIn) {
    return (
      <>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          <span className={isMobile ? "hidden" : ""}>Начать смену</span>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Начать смену</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="crew" className="col-span-4">Выберите экипаж</Label>
                <Select 
                  value={crewInfo.crew} 
                  onValueChange={(value) => setCrewInfo({...crewInfo, crew: value})}
                >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Выберите экипаж" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="АП-1">АП-1</SelectItem>
                    <SelectItem value="АП-2">АП-2</SelectItem>
                    <SelectItem value="АП-3">АП-3</SelectItem>
                    <SelectItem value="ППС-101">ППС-101</SelectItem>
                    <SelectItem value="ППС-102">ППС-102</SelectItem>
                    <SelectItem value="ППС-103">ППС-103</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="officerName" className="col-span-4">ФИО сотрудника</Label>
                <Input
                  id="officerName"
                  className="col-span-4"
                  placeholder="Введите ФИО"
                  value={crewInfo.officerName}
                  onChange={(e) => setCrewInfo({...crewInfo, officerName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="partnerName" className="col-span-4">ФИО напарника</Label>
                <Input
                  id="partnerName"
                  className="col-span-4"
                  placeholder="Введите ФИО напарника"
                  value={crewInfo.partnerName}
                  onChange={(e) => setCrewInfo({...crewInfo, partnerName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="shiftType" className="col-span-4">Тип смены</Label>
                <Select 
                  value={crewInfo.shiftType} 
                  onValueChange={(value) => setCrewInfo({...crewInfo, shiftType: value})}
                >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Выберите тип смены" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Дневная</SelectItem>
                    <SelectItem value="night">Ночная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleStartShift}>Начать смену</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{crewInfo.crew}</AvatarFallback>
          </Avatar>
          <span className={isMobile ? "hidden" : "inline"}>{crewInfo.officerName}</span>
          <span className={`absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Профиль экипажа</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{crewInfo.officerName}</p>
          <p className="text-xs text-muted-foreground">Напарник: {crewInfo.partnerName}</p>
          <p className="text-xs text-muted-foreground mt-1">Экипаж: {crewInfo.crew}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Смена: {crewInfo.shiftType === 'day' ? 'Дневная' : 'Ночная'}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleStatus}>
          <span className={`mr-2 h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          Статус: {isOnline ? 'На связи' : 'Отошел'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEndShift}>Завершить смену</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserInfo;
