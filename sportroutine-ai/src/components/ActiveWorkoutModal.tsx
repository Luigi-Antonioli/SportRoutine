import React, { useState, useEffect } from 'react';
import { SavedRoutine, RoutineTask } from '../types';
import { playChime } from '../utils/audio';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy
} from 'lucide-react';

interface ActiveWorkoutModalProps {
  routine: SavedRoutine | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  routine,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !routine || !routine.tasks || routine.tasks.length === 0) return null;

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(
    (routine.tasks[0]?.durationMinutes || 5) * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState(false);

  const currentTask: RoutineTask = routine.tasks[currentTaskIndex] || routine.tasks[0];

  // Sync timer when task index changes
  useEffect(() => {
    if (routine.tasks[currentTaskIndex]) {
      setTimeLeftSeconds(routine.tasks[currentTaskIndex].durationMinutes * 60);
    }
  }, [currentTaskIndex, routine]);

  // Interval timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeftSeconds === 0) {
      // Completed current task
      if (soundEnabled) playChime('beep');
      markTaskCompleted(currentTask.id);

      if (currentTaskIndex < routine.tasks.length - 1) {
        setCurrentTaskIndex((prev) => prev + 1);
      } else {
        setIsRunning(false);
        setIsFinished(true);
        if (soundEnabled) playChime('finish');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSeconds, currentTaskIndex, routine, soundEnabled]);

  const markTaskCompleted = (taskId: string) => {
    setCompletedTaskIds((prev) => new Set(prev).add(taskId));
  };

  const handleNext = () => {
    markTaskCompleted(currentTask.id);
    if (currentTaskIndex < routine.tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
      if (soundEnabled) playChime('beep');
    } else {
      setIsRunning(false);
      setIsFinished(true);
      if (soundEnabled) playChime('finish');
    }
  };

  const handlePrev = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setTimeLeftSeconds(currentTask.durationMinutes * 60);
    setIsRunning(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.round(
    ((routine.tasks.length - (routine.tasks.length - completedTaskIds.size)) /
      routine.tasks.length) *
      100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#14171B] border border-[#262B31] rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#262B31]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF3D] animate-pulse" />
            <h3 className="font-['Space_Grotesk'] font-bold text-sm sm:text-base text-[#F2F3F4] truncate max-w-[240px]">
              {routine.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-[#1B1F24] border border-[#262B31] text-[#8A9099] hover:text-[#C6FF3D] transition cursor-pointer"
              title={soundEnabled ? 'Silenciar avisos sonoros' : 'Ativar avisos sonoros'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1B1F24] border border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workout Body */}
        {isFinished ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C6FF3D]/15 border border-[#C6FF3D] text-[#C6FF3D] flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#F2F3F4]">
              Treino Concluído! 🎉
            </h2>
            <p className="text-sm text-[#8A9099] max-w-sm mx-auto">
              Excelente consistência! Você completou todas as {routine.tasks.length} tarefas da sua rotina de hoje.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setIsFinished(false);
                  setCurrentTaskIndex(0);
                  setCompletedTaskIds(new Set());
                  setTimeLeftSeconds((routine.tasks[0]?.durationMinutes || 5) * 60);
                }}
                className="px-4 py-2 rounded-xl bg-[#1B1F24] border border-[#262B31] text-xs font-medium text-[#F2F3F4] hover:border-[#7FA324] transition cursor-pointer"
              >
                Reiniciar Treino
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#C6FF3D] text-[#0B0D0F] font-['Space_Grotesk'] font-bold text-xs hover:opacity-90 transition cursor-pointer"
              >
                Fechar e Salvar
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            {/* Step Counter */}
            <div className="text-xs font-['Space_Grotesk'] uppercase tracking-wider text-[#8A9099] mb-1">
              Bloco {currentTaskIndex + 1} de {routine.tasks.length}
            </div>

            {/* Current Task Title */}
            <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#F2F3F4] max-w-md min-h-[3.5rem] flex items-center justify-center">
              {currentTask?.title}
            </h2>

            {/* Priority and Duration Badge */}
            <div className="flex items-center gap-2 mt-2 mb-6">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  currentTask.priority === 'Alta'
                    ? 'bg-[#FF5C35]/15 text-[#FF5C35] border border-[#FF5C35]/30'
                    : currentTask.priority === 'Média'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                Prioridade {currentTask.priority}
              </span>
              <span className="text-xs text-[#8A9099]">
                Planejado: {currentTask.durationMinutes} min
              </span>
            </div>

            {/* Massive Circular / Pill Countdown Display */}
            <div className="my-2 p-6 rounded-3xl bg-[#0B0D0F] border border-[#262B31] w-full max-w-xs flex flex-col items-center justify-center shadow-inner">
              <div className="font-['Space_Grotesk'] text-5xl sm:text-6xl font-bold tracking-tight text-[#C6FF3D]">
                {formatTime(timeLeftSeconds)}
              </div>
              <span className="text-[11px] text-[#8A9099] uppercase tracking-widest mt-1">
                {isRunning ? 'Em andamento' : 'Pausado'}
              </span>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentTaskIndex === 0}
                className="w-11 h-11 rounded-2xl bg-[#1B1F24] border border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                title="Bloco anterior"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  if (!isRunning && soundEnabled) playChime('start');
                  setIsRunning(!isRunning);
                }}
                className="w-16 h-16 rounded-3xl bg-[#C6FF3D] text-[#0B0D0F] flex items-center justify-center hover:opacity-90 active:scale-95 transition shadow-lg shadow-[#C6FF3D]/20 cursor-pointer"
                title={isRunning ? 'Pausar' : 'Iniciar'}
              >
                {isRunning ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-2xl bg-[#1B1F24] border border-[#262B31] text-[#8A9099] hover:text-[#C6FF3D] flex items-center justify-center transition cursor-pointer"
                title="Concluir e ir para próximo bloco"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={handleReset}
                className="w-9 h-9 rounded-xl bg-transparent border border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4] flex items-center justify-center transition cursor-pointer"
                title="Reiniciar tempo deste bloco"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Overall Workout Progress Bar */}
            <div className="w-full mt-8 pt-6 border-t border-[#262B31]">
              <div className="flex justify-between items-center text-xs text-[#8A9099] mb-2">
                <span>Progresso da rotina</span>
                <span className="font-semibold text-[#F2F3F4]">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1B1F24] overflow-hidden">
                <div
                  className="h-full bg-[#C6FF3D] transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
