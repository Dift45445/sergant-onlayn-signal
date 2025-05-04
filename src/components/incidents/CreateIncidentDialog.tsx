
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IncidentStatus, IncidentType, Priority } from "@/types/incident";
import { IncidentWithCrew } from "@/services/incidentService";

interface CreateIncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (incident: IncidentWithCrew) => void;
}

const CreateIncidentDialog: React.FC<CreateIncidentDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const [incidentType, setIncidentType] = useState<IncidentType>(IncidentType.OTHER);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [callerName, setCallerName] = useState("");
  const [callerPhone, setCallerPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newIncident: IncidentWithCrew = {
      id: Math.random().toString(36).substring(2, 15),
      type: incidentType,
      location,
      description,
      priority,
      timestamp: new Date().toISOString(),
      status: IncidentStatus.NEW,
      caller: {
        name: callerName,
        phone: callerPhone
      }
    };
    
    onSubmit(newIncident);
    
    // Reset form
    setIncidentType(IncidentType.OTHER);
    setLocation("");
    setDescription("");
    setPriority(Priority.MEDIUM);
    setCallerName("");
    setCallerPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новый вызов</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="incident-type" className="text-right">
                Тип
              </Label>
              <Select 
                value={incidentType} 
                onValueChange={(value) => setIncidentType(value as IncidentType)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите тип происшествия" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IncidentType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Адрес
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Приоритет
              </Label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Priority).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Описание
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="caller-name" className="text-right">
                Заявитель
              </Label>
              <Input
                id="caller-name"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                placeholder="ФИО"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="caller-phone" className="text-right">
                Телефон
              </Label>
              <Input
                id="caller-phone"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                placeholder="+7XXXXXXXXXX"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Создать вызов</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIncidentDialog;
