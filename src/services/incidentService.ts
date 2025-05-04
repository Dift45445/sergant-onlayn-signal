
import { toast } from "sonner";
import { Incident, IncidentStatus, IncidentType, Priority } from "@/types/incident";

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: ((incident: Incident) => void)[] = [];

  connect() {
    // Simulate WebSocket connection
    console.log("WebSocket connecting...");
    setTimeout(() => {
      console.log("WebSocket connected");
      toast.success("Соединение установлено");
      
      // Start sending mock incidents
      this.startMockIncidents();
    }, 1000);
  }

  disconnect() {
    console.log("WebSocket disconnected");
    toast.info("Соединение прервано");
  }

  addListener(callback: (incident: Incident) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(incident: Incident) {
    this.listeners.forEach(callback => callback(incident));
  }

  private startMockIncidents() {
    // Generate random incidents every 10-20 seconds
    const generateIncident = () => {
      const incident = this.createRandomIncident();
      console.log("New incident received", incident);
      toast.info("Новый инцидент", {
        description: `${incident.type} - ${incident.location}`,
      });
      this.notifyListeners(incident);

      // Schedule next incident
      const nextTime = 10000 + Math.random() * 10000;
      setTimeout(generateIncident, nextTime);
    };

    // Initial incident after 3 seconds
    setTimeout(generateIncident, 3000);
  }

  private createRandomIncident(): Incident {
    const incidentTypes = Object.values(IncidentType);
    const priorities = Object.values(Priority);
    const locations = [
      "ул. Ленина, 15",
      "пр. Мира, 42",
      "ул. Гагарина, 78",
      "ул. Пушкина, 23",
      "ул. Достоевского, 56",
      "пр. Вернадского, 88",
      "ул. Чехова, 11",
      "пл. Революции, 1"
    ];
    const descriptions = [
      "Срочно требуется помощь",
      "Подозрительная активность",
      "Нужна немедленная поддержка",
      "Гражданин сообщает о происшествии",
      "Требуется вмешательство правоохранителей",
      "Экстренная ситуация"
    ];
    const names = [
      "Иванов И.И.",
      "Петров П.П.",
      "Сидоров С.С.",
      "Смирнова А.В.",
      "Козлов К.К.",
      "Морозова М.М."
    ];

    return {
      id: Math.random().toString(36).substring(2, 15),
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      timestamp: new Date().toISOString(),
      status: IncidentStatus.NEW,
      caller: {
        name: names[Math.floor(Math.random() * names.length)],
        phone: `+7${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`
      }
    };
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// Sample incidents for initial display
export const getInitialIncidents = (): Incident[] => {
  return [
    {
      id: "inc-001",
      type: IncidentType.ACCIDENT,
      location: "ул. Ленина, 42",
      description: "Столкновение двух автомобилей, есть пострадавшие",
      priority: Priority.HIGH,
      timestamp: new Date(Date.now() - 1000*60*15).toISOString(),
      status: IncidentStatus.IN_PROGRESS,
      caller: {
        name: "Петров В.А.",
        phone: "+79123456789"
      }
    },
    {
      id: "inc-002",
      type: IncidentType.THEFT,
      location: "Торговый центр 'Заря', пр. Мира, 78",
      description: "Кража сумки у посетителя",
      priority: Priority.MEDIUM,
      timestamp: new Date(Date.now() - 1000*60*45).toISOString(),
      status: IncidentStatus.NEW,
      caller: {
        name: "Иванова Е.С.",
        phone: "+79234567890"
      }
    }
  ];
};

export const getArchivedIncidents = (): Incident[] => {
  return [
    {
      id: "arc-001",
      type: IncidentType.PUBLIC_DISORDER,
      location: "Парк Культуры",
      description: "Группа молодых людей нарушает общественный порядок",
      priority: Priority.LOW,
      timestamp: new Date(Date.now() - 1000*60*60*24*2).toISOString(),
      status: IncidentStatus.ARCHIVED
    },
    {
      id: "arc-002",
      type: IncidentType.MEDICAL,
      location: "ул. Советская, 12",
      description: "Пожилому человеку стало плохо на улице",
      priority: Priority.MEDIUM,
      timestamp: new Date(Date.now() - 1000*60*60*24*3).toISOString(),
      status: IncidentStatus.ARCHIVED
    },
    {
      id: "arc-003",
      type: IncidentType.ASSAULT,
      location: "Клуб 'Фортуна', ул. Гагарина, 56",
      description: "Драка между посетителями",
      priority: Priority.HIGH,
      timestamp: new Date(Date.now() - 1000*60*60*24*4).toISOString(),
      status: IncidentStatus.ARCHIVED
    }
  ];
};
