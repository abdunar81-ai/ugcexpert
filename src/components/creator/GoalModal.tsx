import React, { useState, useEffect } from 'react';
import { Goal } from '../../types';
import { X, Target, Trophy, Sparkles, Check, Car, Plane, Home, Smartphone, Award, Calendar, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal?: Goal | null;
  onSaveGoal: (updatedGoal: Goal) => void;
  avgCommission?: number;
}

const PRESETS = [
  {
    title: 'Toyota Camry 75',
    targetAmount: 18000000,
    category: 'car' as const,
    targetDate: '2026-12-31',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80',
    description: 'Жаңа автокөлік арманы'
  },
  {
    title: 'Дубайға саяхат',
    targetAmount: 1500000,
    category: 'travel' as const,
    targetDate: '2026-10-31',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80',
    description: 'Отбасымен немесе жеке демалыс'
  },
  {
    title: 'Алматыдан жаңа пәтер',
    targetAmount: 50000000,
    category: 'house' as const,
    targetDate: '2027-12-31',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    description: 'Жеке баспана'
  },
  {
    title: 'iPhone 16 Pro Max 512GB',
    targetAmount: 850000,
    category: 'gadget' as const,
    targetDate: '2026-10-15',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    description: 'Контент сапасын арттыру'
  },
  {
    title: 'MacBook Pro M3 Max',
    targetAmount: 1400000,
    category: 'gadget' as const,
    targetDate: '2026-11-30',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    description: 'Жоғары жылдамдықтағы монтаж'
  }
];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onSaveGoal,
  avgCommission = 10000,
}) => {
  const safeGoal = currentGoal || {
    id: 'goal-default',
    title: 'Үлкен Мақсат',
    targetAmount: 5000000,
    collectedAmount: 0,
    targetDate: '2026-12-31',
    category: 'car' as const,
    image: PRESETS[0].image,
  };

  const [title, setTitle] = useState(safeGoal.title || '');
  const [targetAmount, setTargetAmount] = useState(safeGoal.targetAmount || 5000000);
  const [collectedAmount, setCollectedAmount] = useState(safeGoal.collectedAmount || 0);
  const [targetDate, setTargetDate] = useState(safeGoal.targetDate || '2026-12-31');
  const [selectedImage, setSelectedImage] = useState(safeGoal.image || PRESETS[0].image);
  const [category, setCategory] = useState(safeGoal.category || 'car');

  // Synchronize state when modal opens or currentGoal changes
  useEffect(() => {
    if (currentGoal) {
      setTitle(currentGoal.title || '');
      setTargetAmount(currentGoal.targetAmount || 5000000);
      setCollectedAmount(currentGoal.collectedAmount || 0);
      setTargetDate(currentGoal.targetDate || '2026-12-31');
      setSelectedImage(currentGoal.image || PRESETS[0].image);
      setCategory(currentGoal.category || 'car');
    }
  }, [currentGoal, isOpen]);

  if (!isOpen) return null;

  const percent = Math.min(100, Math.round(((collectedAmount || 0) / Math.max(1, targetAmount || 1)) * 100));
  const remaining = Math.max(0, (targetAmount || 0) - (collectedAmount || 0));
  const salesNeeded = Math.ceil(remaining / Math.max(1000, avgCommission));

  // Time remaining calculation
  const calculateDaysLeft = (dateStr: string) => {
    if (!dateStr) return 0;
    const target = new Date(dateStr).getTime();
    const now = new Date().getTime();
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(targetDate);
  const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
  const salesPerWeek = Math.ceil(salesNeeded / weeksLeft);

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setTargetAmount(preset.targetAmount);
    setSelectedImage(preset.image);
    setCategory(preset.category);
    if (preset.targetDate) {
      setTargetDate(preset.targetDate);
    }
  };

  const handleSetQuickDate = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    const formatted = d.toISOString().split('T')[0];
    setTargetDate(formatted);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoal({
      ...(currentGoal || safeGoal),
      title,
      targetAmount: Number(targetAmount),
      collectedAmount: Number(collectedAmount),
      targetDate,
      image: selectedImage,
      category,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-base">Үлкен Мақсат Орнату</h2>
              <p className="text-xs text-neutral-500">Табысыңыз бен мерзіміңізді арманыңызбен байланыстырыңыз</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Танымал мақсат шаблондары:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((p) => {
                const Icon = p.icon;
                const isSelected = title === p.title;
                return (
                  <button
                    type="button"
                    key={p.title}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-neutral-500'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-xs font-semibold line-clamp-1">{p.title}</span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {(p.targetAmount / 1000000).toFixed(p.targetAmount % 1000000 === 0 ? 0 : 1)} млн ₸
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Мақсаттың атауы
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Мысалы: Toyota Camry 75"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Мақсат сомасы (₸)
                </label>
                <input
                  type="number"
                  min="100000"
                  step="50000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Қазір жиналғаны (₸)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* УАҚЫТПЕН ШЕКТЕУ (TARGET DEADLINE DATE) */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Мақсатқа жету мерзімі (Дедлайн датасы)</span>
                </label>
                {daysLeft > 0 ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Қалғаны: {daysLeft} күн
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-mono">
                    Мерзімі жетті немесе бүгін
                  </span>
                )}
              </div>

              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />

              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-neutral-400 font-medium">Жылдам таңдау:</span>
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(3)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white border border-neutral-200 text-neutral-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  +3 ай
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(6)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white border border-neutral-200 text-neutral-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  +6 ай
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(12)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white border border-neutral-200 text-neutral-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  +1 жыл
                </button>
                <button
                  type="button"
                  onClick={() => setTargetDate('2026-12-31')}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  2026 жыл соңы
                </button>
              </div>
            </div>
          </div>

          {/* Live Calculation Preview Card */}
          <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Мотивациялық есептеу & Мерзім
              </span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{percent}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-800">
              <div>
                <p className="text-neutral-400 text-[11px]">Жиналды:</p>
                <p className="font-bold text-white font-mono">{collectedAmount.toLocaleString('kk-KZ')} ₸</p>
              </div>
              <div>
                <p className="text-neutral-400 text-[11px]">Қалғаны:</p>
                <p className="font-bold text-amber-400 font-mono">{remaining.toLocaleString('kk-KZ')} ₸</p>
              </div>
            </div>

            {/* Target Deadline Details */}
            <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 space-y-1.5 text-xs text-neutral-200">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Мерзім күні:
                </span>
                <span className="font-bold text-white font-mono">
                  {targetDate ? new Date(targetDate).toLocaleDateString('kk-KZ', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Белгіленбеген'}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-700/60">
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs text-neutral-200">
                  Мерзімге жету үшін тағы <span className="font-bold text-emerald-400">{salesNeeded} сатылым</span> (аптасына ~<strong className="text-emerald-300">{salesPerWeek} сатылым</strong>) қажет!
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors"
            >
              Бас тарту
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Мақсатты сақтау
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
