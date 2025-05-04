
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { IncidentStatus, Priority } from "@/types/incident";
import { CrewType, IncidentWithCrew } from "@/services/incidentService";
import { ArrowRight, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface IncidentDetailsProps {
  incident: IncidentWithCrew;
  onClose: () => void;
  onStatusChange: (incidentId: string, newStatus: IncidentStatus, crew?: CrewType) => void;
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  incident,
  onClose,
  onStatusChange,
}) => {
  const [selectedCrew, setSelectedCrew] = useState<CrewType | undefined>(incident.assignedCrew);
  const [report, setReport] = useState<string>(incident.report || "");

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ru });
  };

  const priorityColor = {
    [Priority.HIGH]: "bg-red-500",
    [Priority.MEDIUM]: "bg-yellow-500",
    [Priority.LOW]: "bg-green-500"
  };

  const handleTakeToWork = () => {
    if (!selectedCrew) return;
    onStatusChange(incident.id, IncidentStatus.IN_PROGRESS, selectedCrew);
  };

  const handleComplete = () => {
    if (!selectedCrew) return;
    const resolvedIncident = { ...incident, report, assignedCrew: selectedCrew, status: IncidentStatus.RESOLVED };
    onStatusChange(incident.id, IncidentStatus.RESOLVED, selectedCrew);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {incident.type}
              <Badge className={`${priorityColor[incident.priority]} text-white`}>
                {incident.priority}
              </Badge>
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {formatTime(incident.timestamp)}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <h4 className="font-medium">Адрес происшествия</h4>
            <p>{incident.location}</p>
          </div>

          <div>
            <h4 className="font-medium">Описание</h4>
            <p className="text-sm">{incident.description}</p>
          </div>

          {incident.caller && (
            <div>
              <h4 className="font-medium">Заявитель</h4>
              <div className="text-sm">
                <p>ФИО: {incident.caller.name}</p>
                <p>Телефон: {incident.caller.phone}</p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Назначение экипажа</h4>
            <div className="flex gap-2 items-center">
              <Select value={selectedCrew} onValueChange={(value) => setSelectedCrew(value as CrewType)}>
                <SelectTrigger className="w-[180px]">
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

              <Button 
                variant="outline" 
                onClick={handleTakeToWork}
                disabled={!selectedCrew || incident.status === IncidentStatus.IN_PROGRESS}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Взять в работу
              </Button>

              <Button 
                onClick={handleComplete}
                disabled={!selectedCrew || incident.status === IncidentStatus.NEW}
              >
                <Check className="h-4 w-4 mr-2" />
                Завершить
              </Button>
            </div>
          </div>

          {incident.status === IncidentStatus.IN_PROGRESS && (
            <div className="mt-2">
              <h4 className="font-medium mb-2">Отчет о происшествии</h4>
              <Textarea
                placeholder="Введите отчет о происшествии..."
                className="min-h-[100px]"
                value={report}
                onChange={(e) => setReport(e.target.value)}
              />
            </div>
          )}

          {incident.status === IncidentStatus.RESOLVED && incident.report && (
            <div>
              <h4 className="font-medium">Отчет</h4>
              <p className="text-sm">{incident.report}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetails;
