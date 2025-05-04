
import React, { useState } from 'react';
import { getArchivedIncidents, IncidentWithCrew } from '@/services/incidentService';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Archive: React.FC = () => {
  const [archivedIncidents] = useState(getArchivedIncidents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<IncidentWithCrew | null>(null);
  const [showReport, setShowReport] = useState(false);

  const filteredIncidents = archivedIncidents.filter(incident => 
    incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (incident.caller?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewReport = (incident: IncidentWithCrew) => {
    setSelectedIncident(incident);
    setShowReport(true);
  };

  const handlePrint = (incident: IncidentWithCrew) => {
    setSelectedIncident(incident);
    setTimeout(() => {
      window.print();
    }, 100);
  };

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map(incident => (
            <div key={incident.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{incident.type}</h3>
                <span className="text-xs text-muted-foreground">{new Date(incident.timestamp).toLocaleDateString('ru-RU')}</span>
              </div>
              
              <p className="text-sm mb-2">{incident.location}</p>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{incident.description}</p>
              
              {incident.assignedCrew && (
                <div className="text-xs mb-3">
                  <span className="font-medium">Экипаж: </span>
                  {incident.assignedCrew}
                </div>
              )}
              
              <div className="flex justify-between mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleViewReport(incident)}
                >
                  <FileText className="h-4 w-4" />
                  Отчет
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1" 
                  onClick={() => handlePrint(incident)}
                >
                  <Printer className="h-4 w-4" />
                  Печать
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">Нет архивных записей</p>
          </div>
        )}
      </div>

      {/* Report Dialog */}
      {selectedIncident && (
        <Dialog open={showReport} onOpenChange={setShowReport}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Отчет по происшествию</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <div className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{selectedIncident.type}</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedIncident.timestamp).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-sm">{selectedIncident.location}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium">Описание происшествия:</h4>
                <p className="text-sm mt-1">{selectedIncident.description}</p>
              </div>
              
              {selectedIncident.caller && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium">Заявитель:</h4>
                  <p className="text-sm mt-1">{selectedIncident.caller.name}, {selectedIncident.caller.phone}</p>
                </div>
              )}
              
              {selectedIncident.assignedCrew && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium">Экипаж:</h4>
                  <p className="text-sm mt-1">{selectedIncident.assignedCrew}</p>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="text-sm font-medium">Отчет сотрудника:</h4>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedIncident.report || "Отчет не предоставлен"}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Archive;
