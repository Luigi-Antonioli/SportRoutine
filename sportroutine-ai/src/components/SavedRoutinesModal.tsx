import React, { useState } from 'react';
import { SavedRoutine } from '../types';
import { 
  X, 
  Trash2, 
  Play, 
  Copy, 
  Check, 
  MessageSquareQuote, 
  Clock, 
  Bookmark, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SavedRoutinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRoutines: SavedRoutine[];
  onDeleteRoutine: (id: string) => void;
  onStartWorkout: (routine: SavedRoutine) => void;
  onSendToChat: (prompt: string) => void;
}

export const SavedRoutinesModal: React.FC<SavedRoutinesModalProps> = ({
  isOpen,
  onClose,
  savedRoutines,
  onDeleteRoutine,
  onStartWorkout,
  onSendToChat,
}) => {
  const [selectedRoutine, setSelectedRoutine] = useState<SavedRoutine | null>(
    savedRoutines[0] || null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeRoutine = selectedRoutine || savedRoutines[0] || null;

  const handleCopy = (routine: SavedRoutine) => {
    navigator.clipboard.writeText(routine.rawText);
    setCopiedId(routine.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRequestAdaptation = (routine: SavedRoutine) => {
    const prompt = `Gostaria de adaptar minha rotina salva "${routine.title}":\n\n${routine.rawText}\n\nPor favor, adapte esta rotina considerando que...`;
    onSendToChat(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#14171B] border border-[#262B31] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#262B31]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C6FF3D]/10 text-[#C6FF3D]">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#F2F3F4]">
                Rotinas Salvas ({savedRoutines.length})
              </h3>
              <p className="text-xs text-[#8A9099]">
                Seu histórico de rotinas organizadas e planos de treino
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A9099] hover:text-[#F2F3F4] hover:bg-[#1B1F24] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {savedRoutines.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1B1F24] border border-[#262B31] text-[#8A9099] flex items-center justify-center mx-auto">
              <Bookmark className="w-5 h-5" />
            </div>
            <h4 className="font-['Space_Grotesk'] font-semibold text-base text-[#F2F3F4]">
              Nenhuma rotina salva ainda
            </h4>
            <p className="text-xs text-[#8A9099] max-w-xs mx-auto">
              Quando a IA sugerir uma rotina no chat, clique em "Salvar" no cartão da rotina para guardá-la aqui.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#262B31]">
            {/* Sidebar list */}
            <div className="md:col-span-5 overflow-y-auto max-h-[300px] md:max-h-none p-3 space-y-2">
              {savedRoutines.map((routine) => {
                const isSelected = activeRoutine?.id === routine.id;
                return (
                  <div
                    key={routine.id}
                    onClick={() => setSelectedRoutine(routine)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1B1F24] border-[#7FA324] text-[#F2F3F4]'
                        : 'bg-[#14171B] border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4] hover:border-[#262B31]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-['Space_Grotesk'] font-semibold text-xs sm:text-sm text-[#F2F3F4] truncate">
                        {routine.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8A9099] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C6FF3D]" />
                          {routine.totalDurationMinutes} min
                        </span>
                        <span>•</span>
                        <span>{routine.tasks?.length || 0} tarefas</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8A9099] shrink-0" />
                  </div>
                );
              })}
            </div>

            {/* Routine details pane */}
            {activeRoutine && (
              <div className="md:col-span-7 flex flex-col justify-between overflow-y-auto p-4 sm:p-6 bg-[#0B0D0F]">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-['Space_Grotesk'] font-bold text-lg text-[#F2F3F4]">
                        {activeRoutine.title}
                      </h4>
                      <p className="text-xs text-[#C6FF3D] mt-0.5">
                        Objetivo: {activeRoutine.objective}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteRoutine(activeRoutine.id)}
                      className="p-2 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/30 transition cursor-pointer"
                      title="Excluir rotina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Task list preview */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-[#8A9099] uppercase tracking-wider block">
                      Blocos da Sessão:
                    </span>
                    <div className="space-y-1.5">
                      {activeRoutine.tasks?.map((task, idx) => (
                        <div
                          key={task.id || idx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#14171B] border border-[#262B31] text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="w-5 h-5 rounded bg-[#1B1F24] border border-[#262B31] flex items-center justify-center font-bold text-[10px] text-[#8A9099] shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-medium text-[#F2F3F4] truncate">
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-[#8A9099]">
                              {task.durationMinutes} min
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                task.priority === 'Alta'
                                  ? 'bg-[#FF5C35]/15 text-[#FF5C35] border border-[#FF5C35]/30'
                                  : task.priority === 'Média'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions bottom bar */}
                <div className="pt-6 mt-4 border-t border-[#262B31] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(activeRoutine)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14171B] border border-[#262B31] text-xs font-medium text-[#8A9099] hover:text-[#F2F3F4] transition cursor-pointer"
                    >
                      {copiedId === activeRoutine.id ? (
                        <Check className="w-3.5 h-3.5 text-[#C6FF3D]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === activeRoutine.id ? 'Copiado!' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={() => handleRequestAdaptation(activeRoutine)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14171B] border border-[#262B31] text-xs font-medium text-[#8A9099] hover:text-[#C6FF3D] transition cursor-pointer"
                      title="Enviar para o chat para adaptar horários ou intensidade"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D]" />
                      <span>Pedir Adaptação</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onStartWorkout(activeRoutine);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C6FF3D] text-[#0B0D0F] font-['Space_Grotesk'] font-bold text-xs hover:opacity-90 active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Iniciar Treino</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
