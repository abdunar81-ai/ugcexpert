import React, { useState } from 'react';
import { LessonModule } from '../../types';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Play, 
  Pause, 
  Award, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle, 
  Sparkles,
  ArrowLeft,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: LessonModule[];
  onCompleteModule: (moduleId: number) => void;
}

export const LessonsModal: React.FC<LessonsModalProps> = ({
  isOpen,
  onClose,
  lessons,
  onCompleteModule,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const activeModule = selectedModuleId !== null 
    ? lessons.find((l) => l.id === selectedModuleId) || null 
    : null;

  const handleOpenModule = (moduleId: number) => {
    const mod = lessons.find((l) => l.id === moduleId);
    if (mod && !mod.isLocked) {
      setSelectedModuleId(moduleId);
      setIsPlaying(false);
      setQuizSubmitted(false);
      setSelectedAnswers({});
    }
  };

  const handleBackToSyllabus = () => {
    setSelectedModuleId(null);
    setIsPlaying(false);
    setQuizSubmitted(false);
    setSelectedAnswers({});
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleFinishLesson = () => {
    if (!activeModule) return;
    setQuizSubmitted(true);
    onCompleteModule(activeModule.id);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleNextLesson = () => {
    if (!activeModule) return;
    const nextMod = lessons.find((l) => l.id === activeModule.id + 1);
    if (nextMod && !nextMod.isLocked) {
      setSelectedModuleId(nextMod.id);
      setIsPlaying(false);
      setQuizSubmitted(false);
      setSelectedAnswers({});
    } else {
      handleBackToSyllabus();
    }
  };

  const handlePrevLesson = () => {
    if (!activeModule) return;
    const prevMod = lessons.find((l) => l.id === activeModule.id - 1);
    if (prevMod) {
      setSelectedModuleId(prevMod.id);
      setIsPlaying(false);
      setQuizSubmitted(false);
      setSelectedAnswers({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[92vh] sm:h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {selectedModuleId !== null ? (
              <button
                onClick={handleBackToSyllabus}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 font-bold text-xs shadow-xs transition-all shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Оқу бағдарламасы</span>
                <span className="sm:hidden">Артқа</span>
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
            )}
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-neutral-900 text-sm sm:text-base truncate">
                  {selectedModuleId !== null && activeModule
                    ? `${activeModule.number}-Модуль: ${activeModule.title}`
                    : 'UGC EXPERT Академиясы'}
                </h2>
                {selectedModuleId === null && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    7 Модуль
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 truncate">
                {selectedModuleId !== null && activeModule
                  ? activeModule.subtitle
                  : 'Нөлден айына 1 000 000 ₸ табуға арналған практикалық бағдарлама'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/70 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar (shown in syllabus view) */}
        {selectedModuleId === null && (
          <div className="bg-emerald-900 text-white px-5 py-2.5 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Жалпы прогресс: <strong className="text-emerald-300">{completedCount} / {lessons.length} модуль</strong> ({progressPercent}%)
              </span>
            </div>
            <div className="w-28 sm:w-48 h-2 bg-emerald-950 rounded-full overflow-hidden shrink-0">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* VIEW 1: ОҚУ БАҒДАРЛАМАСЫ (Syllabus Overview) */}
        {selectedModuleId === null && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                  Оқу бағдарламасы
                </h3>
                <p className="text-xs text-neutral-500">
                  Сабақты таңдап, бейнедәріс пен практикалық тапсырмаларды бастаңыз
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {lessons.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenModule(item.id)}
                  className={`w-full p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                    item.isLocked
                      ? 'bg-neutral-50/70 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-75'
                      : 'bg-white border-neutral-200/90 hover:border-emerald-500/70 hover:shadow-md cursor-pointer'
                  }`}
                >
                  {/* Left: Module Number/Status + Thumbnail + Info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Status badge / icon */}
                    <div className="mt-1 sm:mt-0 shrink-0">
                      {item.isCompleted ? (
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                      ) : item.isLocked ? (
                        <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center border border-neutral-200">
                          <Lock className="w-5 h-5 text-neutral-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                          {item.number}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail preview */}
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 hidden xs:block border border-neutral-200">
                      <img
                        src={item.videoThumbnail}
                        alt={item.title}
                        className={`w-full h-full object-cover ${item.isLocked ? 'opacity-40 grayscale' : 'opacity-85'}`}
                      />
                    </div>

                    {/* Titles */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Модуль {item.number}
                        </span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {item.videoDuration}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-neutral-900 text-sm sm:text-base mt-1 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                    <span className="text-xs font-semibold sm:hidden">
                      {item.isCompleted ? (
                        <span className="text-emerald-600 font-bold">Аяқталды ✓</span>
                      ) : item.isLocked ? (
                        <span className="text-neutral-400">Құлыпталған</span>
                      ) : (
                        <span className="text-emerald-700 font-bold">Қолжетімді</span>
                      )}
                    </span>

                    <button
                      disabled={item.isLocked}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        item.isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : item.isLocked
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs group-hover:translate-x-0.5'
                      }`}
                    >
                      <span>{item.isCompleted ? 'Қайта көру' : item.isLocked ? 'Құлыпталған' : 'Сабақты ашу'}</span>
                      {!item.isLocked && <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: ТОЛЫҚ ЭКРАНДЫ САБАҚ ПЛЕЙЕРІ ЖӘНЕ ТАПСЫРМАЛАР (Full Lesson Player View) */}
        {selectedModuleId !== null && activeModule && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Video Player Box */}
            <div className="relative rounded-3xl overflow-hidden bg-neutral-950 aspect-video shadow-xl group">
              <img
                src={activeModule.videoThumbnail}
                alt={activeModule.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-30' : 'opacity-80'}`}
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 bg-linear-to-t from-black/85 via-transparent to-black/50">
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur font-mono text-xs font-semibold">
                    Модуль {activeModule.number} • {activeModule.videoDuration}
                  </span>
                  {activeModule.isCompleted && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/90 backdrop-blur font-bold text-xs">
                      <Check className="w-3.5 h-3.5" /> Аяқталды
                    </span>
                  )}
                </div>

                {/* Center Play Button */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1.5" />}
                  </button>
                </div>

                {/* Bottom Timeline bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-emerald-500 rounded-full transition-all duration-300 ${
                        isPlaying ? 'w-3/4 animate-pulse' : activeModule.isCompleted ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-300 font-mono">
                    <span>{isPlaying ? '08:45' : '00:00'}</span>
                    <span>{activeModule.videoDuration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {activeModule.number}-Сабақ
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs font-bold text-neutral-700">{activeModule.subtitle}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {activeModule.title}
              </h1>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {activeModule.description}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-100 space-y-3">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Негізгі тезистер мен үйренетін дағдылар:
              </h3>
              <ul className="space-y-2">
                {activeModule.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Homework */}
            <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-2.5">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Практикалық тапсырма:
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
                {activeModule.practicalTask}
              </p>
            </div>

            {/* Checkpoint Quiz */}
            {activeModule.quiz && activeModule.quiz.length > 0 && (
              <div className="p-5 sm:p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Тексеру сұрағы (Чекпоинт):
                  </h3>
                </div>

                {activeModule.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <p className="text-sm font-bold text-neutral-900">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = optIdx === q.correctIndex;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(qIdx, optIdx)}
                            className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                              quizSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500'
                                  : isSelected
                                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                                  : 'border-neutral-200 text-neutral-500 opacity-60'
                                : isSelected
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500 font-semibold'
                                : 'bg-neutral-50/60 border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-2xl border border-emerald-100 leading-relaxed">
                        💡 <strong>Түсіндірме:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions Toolbar */}
            <div className="pt-3 pb-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                {activeModule.id > 1 && (
                  <button
                    onClick={handlePrevLesson}
                    className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Алдыңғы сабақ</span>
                  </button>
                )}
                <button
                  onClick={handleBackToSyllabus}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition-all"
                >
                  Бағдарламаға оралу
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFinishLesson}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeModule.isCompleted ? 'Қайта бекіту' : 'Сабақты аяқтау (+10 LVL)'}</span>
                </button>

                {activeModule.id < lessons.length && (
                  <button
                    onClick={handleNextLesson}
                    className="px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Келесі</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
