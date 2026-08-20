import { RoutineTask, SavedRoutine } from '../types';

/**
 * Extracts routine tasks, durations, and priority from formatted markdown text
 */
export function extractRoutineFromText(text: string, titleHint?: string): SavedRoutine | null {
  if (!text) return null;

  // Check if text looks like a routine
  const hasRoutineMarkers = 
    /objetivo/i.test(text) || 
    /tarefas?|blocos?|exerc[ií]cios?|aquecimento|treino/i.test(text) ||
    /dura[çc][ãa]o/i.test(text);

  if (!hasRoutineMarkers && text.length < 80) return null;

  const lines = text.split('\n');
  const tasks: RoutineTask[] = [];
  let detectedSport = 'Treino Personalizado';
  let detectedObjective = 'Condicionamento Geral';
  let totalDurationMinutes = 0;

  // Try to find sport
  const sportMatch = text.match(/(?:esporte|modalidade|rotina de|treino de)[:\s]+([^\n\.,]+)/i);
  if (sportMatch && sportMatch[1]) {
    detectedSport = sportMatch[1].trim();
  }

  // Try to find objective
  const objMatch = text.match(/(?:objetivo|meta)[:\s]+([^\n\.]+)/i);
  if (objMatch && objMatch[1]) {
    detectedObjective = objMatch[1].replace(/[*_]/g, '').trim();
  }

  // Try to find total duration
  const totalDurMatch = text.match(/(?:dura[çc][ãa]o total|tempo total)[:\s]+(\d+)\s*(?:min|minutos|h|horas)/i);
  if (totalDurMatch && totalDurMatch[1]) {
    totalDurationMinutes = parseInt(totalDurMatch[1], 10);
    if (/h|horas/i.test(totalDurMatch[0]) && !/min/i.test(totalDurMatch[0])) {
      totalDurationMinutes = totalDurationMinutes * 60;
    }
  }

  // Parse task lines
  // Matches patterns like:
  // - Aquecimento articular (10 min) - Prioridade Alta
  // - 1. Corrida leve: 20 minutos [Média]
  // - * Alongamento - 5 min
  const taskRegex = /^(?:[-*•]|\d+\.|\d+\))\s*(.*?)(?:[:–—-]|\s{2,}|$)/;
  
  let currentId = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line contains duration or is a bullet item
    const isBullet = /^(?:[-*•]|\d+\.|\d+\))\s+/.test(trimmed);
    const durationMatch = trimmed.match(/(\d+)\s*(?:min|minutos|minuto)/i);
    const hourMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:h|hora|horas)/i);

    if (isBullet && (durationMatch || hourMatch || /prioridade|aquecimento|s[eé]rie|alongamento|corrida|exerc[ií]cio|treino|descanso/i.test(trimmed))) {
      let duration = 10;
      if (durationMatch) {
        duration = parseInt(durationMatch[1], 10);
      } else if (hourMatch) {
        duration = Math.round(parseFloat(hourMatch[1]) * 60);
      }

      // Detect priority
      let priority: 'Alta' | 'Média' | 'Baixa' = 'Média';
      if (/alta|essencial|principal|urgente/i.test(trimmed)) {
        priority = 'Alta';
      } else if (/baixa|opcional|desej[aá]vel/i.test(trimmed)) {
        priority = 'Baixa';
      } else if (/m[eé]dia|moderada/i.test(trimmed)) {
        priority = 'Média';
      }

      // Clean task title
      let cleanTitle = trimmed
        .replace(/^(?:[-*•]|\d+\.|\d+\))\s*/, '')
        .replace(/[*_#]/g, '')
        .replace(/\(?\d+\s*(?:min|minutos|h|horas)\)?/gi, '')
        .replace(/[-–—]?\s*prioridade\s*(?:alta|m[eé]dia|baixa)/gi, '')
        .replace(/\[(?:alta|m[eé]dia|baixa)\]/gi, '')
        .replace(/[:–—\-]\s*$/, '')
        .trim();

      if (cleanTitle.length > 2 && !/^objetivo|^dura[çc][ãa]o total|^dicas|^observa/i.test(cleanTitle)) {
        tasks.push({
          id: `task-${currentId++}`,
          title: cleanTitle.slice(0, 80),
          durationMinutes: duration,
          priority,
          completed: false,
        });
      }
    }
  }

  // If no structured tasks found, return null
  if (tasks.length === 0) {
    return null;
  }

  // Calculate total duration if not found
  if (totalDurationMinutes === 0) {
    totalDurationMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  }

  const routineTitle = titleHint || (detectedSport !== 'Treino Personalizado' ? `Rotina de ${detectedSport}` : 'Rotina Personalizada');

  return {
    id: `routine-${Date.now()}`,
    title: routineTitle,
    sport: detectedSport,
    objective: detectedObjective,
    days: ['Conforme planejado'],
    totalDurationMinutes,
    tasks,
    rawText: text,
    createdAt: Date.now(),
  };
}
