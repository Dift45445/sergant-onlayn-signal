
import React from 'react';
import { getArchivedIncidents } from '@/services/incidentService';
import IncidentCard from '@/components/incidents/IncidentCard';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Archive: React.FC = () => {
  const archivedIncidents = getArchivedIncidents();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Архив</h1>
        <p className="text-muted-foreground">История завершенных происшествий</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Поиск по архиву" 
          className="pl-8"
        />
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {archivedIncidents.map(incident => (
          <IncidentCard 
            key={incident.id} 
            incident={incident}
            isArchive={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Archive;
