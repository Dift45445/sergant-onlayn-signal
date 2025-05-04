
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { Incident, IncidentStatus } from '@/types/incident';
import { webSocketService, getInitialIncidents } from '@/services/incidentService';
import IncidentCard from '@/components/incidents/IncidentCard';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Load initial incidents
    setIncidents(getInitialIncidents());
    
    // Connect to WebSocket
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  const connect = () => {
    // Add incident listener
    const unsubscribe = webSocketService.addListener((newIncident) => {
      setIncidents(prev => [newIncident, ...prev]);
    });
    
    // Connect to service
    webSocketService.connect();
    setConnected(true);
    
    return unsubscribe;
  };

  const disconnect = () => {
    webSocketService.disconnect();
    setConnected(false);
  };

  const toggleConnection = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleStatusChange = (incidentId: string, newStatus: string) => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === incidentId) {
        const updatedIncident = { 
          ...incident, 
          status: newStatus as IncidentStatus 
        };
        
        // Show toast for status change
        toast.success(`Статус обновлен: ${updatedIncident.type}`, {
          description: `${incident.location} - ${newStatus === "IN_PROGRESS" ? "В обработке" : "Завершено"}`
        });
        
        return updatedIncident;
      }
      return incident;
    }));
  };

  // Filter out archived incidents
  const activeIncidents = incidents.filter(incident => incident.status !== IncidentStatus.ARCHIVED);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Инциденты</h1>
          <p className="text-muted-foreground">Мониторинг происшествий в реальном времени</p>
        </div>
        <Button 
          onClick={toggleConnection}
          variant={connected ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {connected ? (
            <>
              <Bell className="h-4 w-4" />
              Онлайн
            </>
          ) : (
            <>
              <BellOff className="h-4 w-4" />
              Офлайн
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeIncidents.length > 0 ? (
          activeIncidents.map(incident => (
            <IncidentCard 
              key={incident.id} 
              incident={incident}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">Нет активных инцидентов</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;
