
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
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserInfo = () => {
  const [isOnline, setIsOnline] = useState(true);

  const toggleStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>МИ</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">Максим Иванов</span>
          <span className={`absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Профиль пользователя</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Максим Иванов</p>
          <p className="text-xs text-muted-foreground">Старший оператор</p>
          <p className="text-xs text-muted-foreground mt-1">Отделение #12</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleStatus}>
          <span className={`mr-2 h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          Статус: {isOnline ? 'Онлайн' : 'Отошел'}
        </DropdownMenuItem>
        <DropdownMenuItem>Настройки профиля</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserInfo;
