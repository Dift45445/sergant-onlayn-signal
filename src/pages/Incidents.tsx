
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { Incident, IncidentStatus, IncidentType, Priority } from '@/types/incident';
import { webSocketService, getInitialIncidents, CrewType, IncidentWithCrew } from '@/services/incidentService';
import IncidentCard from '@/components/incidents/IncidentCard';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, FileText, Plus } from 'lucide-react';
import IncidentDetails from '@/components/incidents/IncidentDetails';
import CreateIncidentDialog from '@/components/incidents/CreateIncidentDialog';
import UserInfo from '@/components/user/UserInfo';

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentWithCrew[]>([]);
  const [connected, setConnected] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentWithCrew | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
      setIncidents(prev => [newIncident as IncidentWithCrew, ...prev]);
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

  const handleStatusChange = (incidentId: string, newStatus: IncidentStatus, crew?: CrewType) => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === incidentId) {
        const updatedIncident = { 
          ...incident, 
          status: newStatus,
          assignedCrew: crew || incident.assignedCrew
        };
        
        // Show toast for status change
        let statusText = "Обновлен";
        if (newStatus === IncidentStatus.IN_PROGRESS) statusText = "В обработке";
        if (newStatus === IncidentStatus.RESOLVED) statusText = "Завершено";
        if (newStatus === IncidentStatus.ARCHIVED) statusText = "В архиве";
        
        toast.success(`Статус обновлен: ${updatedIncident.type}`, {
          description: `${incident.location} - ${statusText}`
        });
        
        return updatedIncident;
      }
      return incident;
    }));
    
    // Close details modal if incident status changed to RESOLVED
    if (newStatus === IncidentStatus.RESOLVED && selectedIncident?.id === incidentId) {
      setSelectedIncident(null);
    }
  };

  const handleCreateIncident = (newIncident: IncidentWithCrew) => {
    const createdIncident = webSocketService.addIncident(newIncident) as IncidentWithCrew;
    setIncidents(prev => [createdIncident, ...prev]);
    toast.success("Вызов создан", {
      description: `${createdIncident.type} - ${createdIncident.location}`
    });
    setIsCreateDialogOpen(false);
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
        <div className="flex items-center gap-2">
          <UserInfo />
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
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Создать вызов
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/analytics'}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Дневная аналитика
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeIncidents.length > 0 ? (
          activeIncidents.map(incident => (
            <IncidentCard 
              key={incident.id} 
              incident={incident}
              onStatusChange={handleStatusChange}
              onClick={() => setSelectedIncident(incident)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">Нет активных инцидентов</p>
          </div>
        )}
      </div>

      {selectedIncident && (
        <IncidentDetails 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)} 
          onStatusChange={handleStatusChange}
        />
      )}
      
      <CreateIncidentDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateIncident}
      />
    </div>
  );
};

export default Incidents;
