export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  usage?: {
    promptTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    model?: string;
    costEstimate?: number;
  };
}

export interface RoutineTask {
  id: string;
  title: string;
  durationMinutes: number;
  priority: 'Alta' | 'Média' | 'Baixa';
  description?: string;
  completed?: boolean;
}

export interface SavedRoutine {
  id: string;
  title: string;
  sport: string;
  objective: string;
  days: string[];
  totalDurationMinutes: number;
  tasks: RoutineTask[];
  rawText: string;
  createdAt: number;
}

export interface SportFormData {
  sport: string;
  level: string;
  objective: string;
  days: string[];
  timePerDay: string;
  notes: string;
}
