import React, { useState } from 'react';
import { Message, SavedRoutine } from '../types';
import { extractRoutineFromText } from '../utils/routineParser';
import { 
  Bookmark, 
  Check, 
  Copy, 
  Play, 
  Sparkles, 
  Clock, 
  Target, 
  ListChecks, 
  AlertCircle,
  Share2
} from 'lucide-react';

interface MessageItemProps {
  message: Message;
  onSaveRoutine?: (routine: SavedRoutine) => void;
  onStartWorkout?: (routine: SavedRoutine) => void;
  isSaved?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onSaveRoutine,
  onStartWorkout,
  isSaved = false,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [localSaved, setLocalSaved] = useState(isSaved);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  // Extract structured routine if message is from assistant
  const detectedRoutine = !isUser ? extractRoutineFromText(message.content) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (detectedRoutine && onSaveRoutine) {
      onSaveRoutine(detectedRoutine);
      setLocalSaved(true);
    }
  };

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  // Helper to format text with bold and highlight tags
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
      // Check if it's a heading
      if (line.startsWith('###') || line.startsWith('##') || line.startsWith('#')) {
        const cleanHeading = line.replace(/^#+\s*/, '');
        return (
          <h3 key={index} className="font-['Space_Grotesk'] font-bold text-base sm:text-lg text-[#F2F3F4] mt-3 mb-1.5 flex items-center gap-1.5">
            <span className="text-[#C6FF3D]">•</span>
            {cleanHeading}
          </h3>
        );
      }

      // Check if it's a bullet point
      const isBullet = /^(?:[-*•]|\d+\.)\s+/.test(line);
      const content = line.replace(/^(?:[-*•]|\d+\.)\s+/, '');

      // Parse bold **text**
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={pIdx} className="text-[#C6FF3D] font-semibold">
              {boldText}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={index} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-[#7FA324] mt-1 text-xs shrink-0">▸</span>
            <span className="flex-1 text-[#F2F3F4] text-sm leading-relaxed">{formattedParts}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={index} className="h-2" />;
      }

      return (
        <p key={index} className="text-sm leading-relaxed text-[#F2F3F4] my-1">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 items-start my-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-['Space_Grotesk'] font-bold text-xs select-none shadow-sm ${
          isUser
            ? 'bg-[#1B1F24] text-[#8A9099] border border-[#262B31]'
            : 'bg-[#C6FF3D] text-[#0B0D0F]'
        }`}
      >
        {isUser ? 'EU' : 'SR'}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[88%] sm:max-w-[80%] flex flex-col gap-2`}>
        <div
          className={`p-3.5 sm:p-4.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-[#20261A] border border-[#7FA324]/60 text-[#F2F3F4] rounded-tr-sm'
              : 'bg-[#14171B] border border-[#262B31] text-[#F2F3F4] rounded-tl-sm'
          }`}
        >
          {/* Formatted Text */}
          <div className="space-y-1">{renderFormattedText(message.content)}</div>

          {/* Quick Copy / Timestamp / Token telemetry Footer */}
          <div className="flex flex-wrap items-center justify-between gap-1 pt-2.5 mt-2 border-t border-[#262B31]/60 text-[11px] text-[#8A9099]">
            <div className="flex items-center gap-2">
              <span>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {!isUser && message.usage && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0B0D0F] border border-[#262B31] text-[10px] text-[#C6FF3D]/90">
                  <span>📊 {message.usage.promptTokens ?? 0} in / {message.usage.outputTokens ?? 0} out</span>
                  <span className="text-[#8A9099]">•</span>
                  <span className="text-[#F2F3F4]">${(message.usage.costEstimate ?? 0).toFixed(6)}</span>
                </span>
              )}
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 hover:text-[#C6FF3D] transition-colors cursor-pointer px-1 py-0.5"
              title="Copiar mensagem"
            >
              {copied ? <Check className="w-3 h-3 text-[#C6FF3D]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Embedded Interactive Routine Card (If detected in assistant message) */}
        {!isUser && detectedRoutine && detectedRoutine.tasks.length > 0 && (
          <div className="bg-[#1B1F24] border border-[#262B31] rounded-xl p-3.5 sm:p-4 mt-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#C6FF3D]/10 text-[#C6FF3D]">
                  <ListChecks className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#F2F3F4]">
                    {detectedRoutine.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#8A9099] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C6FF3D]" />
                      {detectedRoutine.totalDurationMinutes} min total
                    </span>
                    <span>•</span>
                    <span>{detectedRoutine.tasks.length} tarefas</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {onStartWorkout && (
                  <button
                    onClick={() => onStartWorkout(detectedRoutine)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#C6FF3D] text-[#0B0D0F] font-['Space_Grotesk'] font-bold text-xs hover:opacity-90 active:scale-95 transition cursor-pointer"
                    title="Iniciar treino com cronômetro interativo"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Treinar</span>
                  </button>
                )}

                {onSaveRoutine && (
                  <button
                    onClick={handleSave}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                      localSaved
                        ? 'bg-[#7FA324]/20 border-[#7FA324] text-[#C6FF3D]'
                        : 'bg-[#14171B] border-[#262B31] hover:border-[#7FA324] text-[#8A9099] hover:text-[#F2F3F4]'
                    }`}
                    title={localSaved ? 'Rotina salva!' : 'Salvar nos favoritos'}
                  >
                    <Bookmark className="w-3 h-3" />
                    <span>{localSaved ? 'Salva' : 'Salvar'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tasks Interactive Checklist */}
            <div className="space-y-1.5 pt-1">
              {detectedRoutine.tasks.map((task) => {
                const isChecked = completedTaskIds.has(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs transition cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#14171B]/50 border-[#262B31] text-[#8A9099] line-through'
                        : 'bg-[#14171B] border-[#262B31] hover:border-[#7FA324]/50 text-[#F2F3F4]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition shrink-0 ${
                          isChecked
                            ? 'bg-[#C6FF3D] border-[#C6FF3D] text-[#0B0D0F]'
                            : 'border-[#8A9099]/40 bg-transparent'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate font-medium">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-[#8A9099]">{task.durationMinutes} min</span>
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
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
