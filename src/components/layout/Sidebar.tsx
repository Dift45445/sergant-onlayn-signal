
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Archive, Database, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { 
    path: "/", 
    name: "Инциденты", 
    icon: <Bell className="h-5 w-5" /> 
  },
  { 
    path: "/archive", 
    name: "Архив", 
    icon: <Archive className="h-5 w-5" /> 
  },
  { 
    path: "/database", 
    name: "База данных", 
    icon: <Database className="h-5 w-5" /> 
  },
  { 
    path: "/chat", 
    name: "Чат", 
    icon: <MessageCircle className="h-5 w-5" /> 
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={cn(
        "bg-police-blue text-white h-screen flex flex-col transition-all duration-300 z-10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 h-16 border-b border-white/10">
        {!collapsed && (
          <h1 className="font-bold text-lg mr-auto">МВД Портал</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-police-lightblue ml-auto"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <nav className="flex-grow">
        <ul className="mt-4 space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center p-3 rounded-md hover:bg-police-lightblue transition-colors", 
                  location.pathname === item.path ? "bg-police-lightblue" : "",
                  collapsed ? "justify-center" : "pl-4"
                )}
              >
                <div className="min-w-5">{item.icon}</div>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10 flex">
        {!collapsed && (
          <div className="text-sm">
            <div>Диспетчер на связи</div>
            <div className="text-police-gray/80">Онлайн</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
