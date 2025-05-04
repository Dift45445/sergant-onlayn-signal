
export interface Incident {
  id: string;
  type: IncidentType;
  location: string;
  description: string;
  priority: Priority;
  timestamp: string;
  status: IncidentStatus;
  caller?: {
    name: string;
    phone: string;
  };
}

export enum IncidentType {
  ASSAULT = 'Нападение',
  THEFT = 'Кража',
  FIRE = 'Пожар',
  ACCIDENT = 'ДТП',
  MEDICAL = 'Медицинская помощь',
  PUBLIC_DISORDER = 'Нарушение порядка',
  OTHER = 'Другое'
}

export enum Priority {
  HIGH = 'Высокий',
  MEDIUM = 'Средний',
  LOW = 'Низкий'
}

export enum IncidentStatus {
  NEW = 'Новый',
  IN_PROGRESS = 'В обработке',
  RESOLVED = 'Решено',
  ARCHIVED = 'В архиве'
}
