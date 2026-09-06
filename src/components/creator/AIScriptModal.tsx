import React, { useState, useEffect } from 'react';
import { Campaign, CreatorProfile, CreatorArchetype, AIScriptResult } from '../../types';
import { generateAIScript } from '../../services/api';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Loader2, 
  Brain, 
  Flame, 
  ShieldCheck, 
  HeartHandshake, 
  MessageSquare, 
  FileText, 
  Tag, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIScriptModalProps {
  isOpen: boolean;
  campaign: Campaign;
  creator: CreatorProfile;
  onClose: () => void;
}

const ARCHETYPES: {
  id: CreatorArchetype;
  name: string;
  icon: any;
  tone: string;
  color: string;
}[] = [
  {
    id: 'Данышпан',
    name: 'Данышпан',
    icon: Brain,
    tone: 'Сарапшылық, фактілер & терең талдау',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'Жұмбақ',
    name: 'Жұмбақ',
    icon: Flame,
    tone: 'Интрига, құпия & тартымдылық',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 'Сенімді',
    name: 'Сенімді',
    icon: ShieldCheck,
    tone: 'Нақты нәтиже, батылдық & кепілдік',
    color: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'Дос',
    name: 'Дос',
    icon: HeartHandshake,
    tone: 'Жылылық, шынайы эмоция & достық кеңес',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
];

export const AIScriptModal: React.FC<AIScriptModalProps> = ({
  isOpen,
  campaign,
  creator,
  onClose,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState<CreatorArchetype>(
    creator.archetype || 'Дос'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [scriptResult, setScriptResult] = useState<AIScriptResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchScript = async (archetypeToUse: CreatorArchetype) => {
    setIsGenerating(true);
    try {
      const activeCreator = {
        ...creator,
        archetype: archetypeToUse,
      };
      const res = await generateAIScript(activeCreator, campaign);
      setScriptResult(res);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Script generation note:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedArchetype(creator.archetype || 'Дос');
      fetchScript(creator.archetype || 'Дос');
    }
  }, [isOpen, campaign.id]);

  if (!isOpen) return null;

  const handleArchetypeChange = (arch: CreatorArchetype) => {
    setSelectedArchetype(arch);
    fetchScript(arch);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleCopyAll = () => {
    if (!scriptResult) return;
    const combined = `[АВТОРДЫҢ АЙТАТЫН МӘТІНІ]:\n${scriptResult.authorScript}\n\n[ПОСТТЫҢ СИПАТТАМАСЫ / ОПИСАНИЕ]:\n${scriptResult.postCaption}`;
    handleCopy(combined, 'all');
  };

  const currentArchMeta = ARCHETYPES.find((a) => a.id === selectedArchetype) || ARCHETYPES[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white sm:rounded-3xl w-full max-w-4xl h-full sm:h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200">
        {/* Fullscreen Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
                  AI Сценарий жасаушы
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full font-mono">
                  {campaign.companyName}
                </span>
              </div>
              <p className="text-xs text-neutral-500 line-clamp-1">
                {campaign.product.name} • Комиссия: {campaign.commission.toLocaleString('kk-KZ')} ₸
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Жабу"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Archetype Quick Switcher Bar */}
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200/90 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider shrink-0">
                Креатор Образы:
              </span>
            </div>

            {/* 4 Archetype buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full sm:w-auto">
              {ARCHETYPES.map((arch) => {
                const isSelected = selectedArchetype === arch.id;
                const IconComp = arch.icon;

                return (
                  <button
                    key={arch.id}
                    onClick={() => handleArchetypeChange(arch.id)}
                    disabled={isGenerating}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    } disabled:opacity-50`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{arch.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => fetchScript(selectedArchetype)}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-emerald-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Қайта генерациялау</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-neutral-50/40">
          {isGenerating ? (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-neutral-900">
                  «{selectedArchetype}» образындағы сценарий жазылып жатыр...
                </h3>
                <p className="text-xs text-neutral-500 max-w-md">
                  Gemini жасанды интеллектісі сіздің стиліңіз бен {campaign.product.name} өнімінің артықшылығын үйлестіруде.
                </p>
              </div>
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            </div>
          ) : scriptResult ? (
            <div className="space-y-5 max-w-3xl mx-auto">
              {/* Active Archetype Banner */}
              <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <currentArchMeta.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Қолданылған образ:
                    </span>
                    <strong className="text-xs font-bold text-neutral-900">
                      {selectedArchetype} — {currentArchMeta.tone}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={handleCopyAll}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  {copiedKey === 'all' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Көшірілді!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Бәрін көшіру</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. БЛОК: АВТОРДЫҢ АЙТАТЫН МӘТІНІ (Сөйлеу мәтіні) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                        Автордың айтатын мәтіні
                      </h3>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        Камераға қарап дауыстап оқылатын сөздер
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(scriptResult.authorScript, 'script')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    {copiedKey === 'script' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Көшірілді!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Мәтінді көшіріп алу</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Spoken Text Display - Teleprompter / Read style */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/80">
                  <div className="text-neutral-800 text-sm sm:text-base leading-relaxed space-y-3 font-medium whitespace-pre-line">
                    {scriptResult.authorScript}
                  </div>
                </div>
              </div>

              {/* 2. БЛОК: ПОСТТЫҢ СИПАТТАМАСЫ (Описаниясы / Капшн - Копи-паста үшін) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                        Посттың сипаттамасы (Описание)
                      </h3>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        Instagram / TikTok астына қойылатын дайын мәтін
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(scriptResult.postCaption, 'caption')}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    {copiedKey === 'caption' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Көшірілді!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Сипаттаманы көшіріп алу</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Caption Display */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="text-neutral-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-mono">
                    {scriptResult.postCaption}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xs text-neutral-500">Сценарий генерацияланбады.</p>
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="px-5 py-3.5 border-t border-neutral-200 bg-white flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-bold text-xs transition-colors"
          >
            Жабу
          </button>

          <button
            onClick={handleCopyAll}
            disabled={!scriptResult}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {copiedKey === 'all' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Барлығы көшірілді!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Барлығын көшіріп алу (Сценарий + Описание)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
