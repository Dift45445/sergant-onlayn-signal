
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { IncidentStatus, Priority } from "@/types/incident";
import { CrewType, IncidentWithCrew } from "@/services/incidentService";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface IncidentDetailsProps {
  incident: IncidentWithCrew;
  onClose: () => void;
  onStatusChange: (incidentId: string, newStatus: IncidentStatus, crew?: CrewType) => void;
  isMobile?: boolean;
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  incident,
  onClose,
  onStatusChange,
  isMobile = false,
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

  const openInMaps = () => {
    // For mobile devices, open the location in maps app
    if (isMobile) {
      const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(incident.location)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const callNumber = () => {
    // For mobile devices, initiate a call
    if (isMobile && incident.caller?.phone) {
      window.open(`tel:${incident.caller.phone}`, '_self');
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${isMobile ? 'p-4 w-[95vw] max-w-[95vw]' : 'sm:max-w-[600px]'}`}>
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
            <div className="flex items-center justify-between">
              <p>{incident.location}</p>
              {isMobile && (
                <Button variant="outline" size="icon" onClick={openInMaps} className="ml-2">
                  <MapPin className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium">Описание</h4>
            <p className="text-sm">{incident.description}</p>
          </div>

          {incident.caller && (
            <div>
              <h4 className="font-medium">Заявитель</h4>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p>ФИО: {incident.caller.name}</p>
                  <p>Телефон: {incident.caller.phone}</p>
                </div>
                {isMobile && incident.caller.phone && (
                  <Button variant="outline" size="icon" onClick={callNumber} className="ml-2">
                    <Phone className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Экипаж</h4>
            <div className={`flex ${isMobile ? 'flex-col' : ''} gap-2`}>
              <Select value={selectedCrew} onValueChange={(value) => setSelectedCrew(value as CrewType)}>
                <SelectTrigger className={isMobile ? "w-full" : "w-[180px]"}>
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

              {isMobile ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleTakeToWork}
                    disabled={!selectedCrew || incident.status === IncidentStatus.IN_PROGRESS}
                    className="w-full"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    В работу
                  </Button>

                  <Button 
                    onClick={handleComplete}
                    disabled={!selectedCrew || incident.status === IncidentStatus.NEW}
                    className="w-full"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Завершить
                  </Button>
                </div>
              ) : (
                <>
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
                </>
              )}
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

        {isMobile && incident.status === IncidentStatus.IN_PROGRESS && (
          <DialogFooter className="mt-4">
            <Button 
              onClick={handleComplete}
              disabled={!selectedCrew || !report}
              className="w-full"
            >
              <Check className="h-4 w-4 mr-2" />
              Завершить вызов
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetails;
