
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Incident, Priority } from '@/types/incident';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface IncidentCardProps {
  incident: Incident;
  onStatusChange?: (incidentId: string, newStatus: string) => void;
  isArchive?: boolean;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ 
  incident, 
  onStatusChange,
  isArchive = false
}) => {
  const priorityColor = {
    [Priority.HIGH]: "bg-red-500",
    [Priority.MEDIUM]: "bg-yellow-500",
    [Priority.LOW]: "bg-green-500"
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ru });
  };

  return (
    <Card className="overflow-hidden border-l-4 animate-in fade-in slide-in-from-bottom-5 duration-500" 
      style={{ borderLeftColor: incident.priority === Priority.HIGH ? '#ef4444' : 
                              incident.priority === Priority.MEDIUM ? '#eab308' : '#22c55e' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              {incident.type}
              {incident.priority === Priority.HIGH && !isArchive && (
                <span className="ml-2 h-2 w-2 rounded-full bg-police-accent animate-pulse-slow"></span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{incident.location}</p>
          </div>
          <Badge className={`${priorityColor[incident.priority]} text-white`}>
            {incident.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{incident.description}</p>
        
        {incident.caller && (
          <div className="text-xs text-muted-foreground mt-2">
            <div>Заявитель: {incident.caller.name}</div>
            <div>Телефон: {incident.caller.phone}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="text-xs text-muted-foreground">
          {formatTime(incident.timestamp)}
        </div>
        
        {!isArchive && onStatusChange && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStatusChange(incident.id, "IN_PROGRESS")}
            >
              Взять в работу
            </Button>
            <Button 
              size="sm"
              onClick={() => onStatusChange(incident.id, "RESOLVED")}
            >
              Завершить
            </Button>
          </div>
        )}
        
        {isArchive && (
          <Badge variant="outline">Архив</Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default IncidentCard;
