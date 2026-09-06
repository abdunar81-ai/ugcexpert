import React, { useState } from 'react';
import { Campaign, CreatorProfile, OrderTracking } from '../../types';
import { AIScriptModal } from './AIScriptModal';
import { 
  ArrowLeft, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShoppingBag, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Brain,
  Flame,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

interface OrderDetailModalProps {
  campaign: Campaign;
  creator: CreatorProfile;
  activeOrder?: OrderTracking;
  onClose: () => void;
  onSubmitVideo?: (orderId: string, videoUrl: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  campaign,
  creator,
  activeOrder,
  onClose,
}) => {
  const [isAIScriptModalOpen, setIsAIScriptModalOpen] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Referral code logic
  const referralCode = activeOrder?.referralCode || `UGC-${creator.name.split(' ')[0].toUpperCase()}125`;
  const referralLink = activeOrder?.referralLink || `https://meyram.kz/cinema/${referralCode}`;

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getArchetypeIcon = () => {
    switch (creator.archetype) {
      case 'Данышпан': return Brain;
      case 'Жұмбақ': return Flame;
      case 'Сенімді': return ShieldCheck;
      case 'Дос':
      default: return HeartHandshake;
    }
  };

  const ArchetypeIcon = getArchetypeIcon();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
        <div className="bg-white sm:rounded-3xl w-full max-w-2xl h-full sm:h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200">
          {/* Header Bar */}
          <div className="px-4 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-bold text-neutral-800 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{campaign.companyName}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(referralLink, 'share')}
                className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 transition-colors"
                title="Бөлісу"
              >
                {copiedSection === 'share' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* 1. Product Brief Overview */}
            <div className="p-4 rounded-3xl bg-neutral-50/70 border border-neutral-200/80 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white border border-neutral-200 shrink-0 mx-auto sm:mx-0 shadow-xs">
                <img
                  src={campaign.product.photo}
                  alt={campaign.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                    {campaign.category}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-600 bg-neutral-200/80 px-2 py-0.5 rounded-full inline-block">
                    {campaign.platform}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-neutral-900 leading-snug">
                  {campaign.product.name}
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                  {campaign.product.description}
                </p>
                <p className="text-xs font-mono font-bold text-neutral-900 pt-0.5">
                  Өнім бағасы: {campaign.product.price.toLocaleString('kk-KZ')} ₸
                </p>
              </div>
            </div>

            {/* 2. Key Terms (3 Columns) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Комиссия
                </span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-950 font-mono mt-0.5 block">
                  {campaign.commission.toLocaleString('kk-KZ')} ₸
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 border border-neutral-200 text-center">
                <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Платформа
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-neutral-900 mt-0.5 block">
                  {campaign.platform}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 border border-neutral-200 text-center">
                <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Дедлайн
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-neutral-900 font-mono mt-0.5 block">
                  {campaign.deadline}
                </span>
              </div>
            </div>

            {/* 3. AI SCENARIO GENERATION PROMINENT BANNER (User requirement) */}
            <div className="rounded-3xl border-2 border-emerald-500 bg-linear-to-r from-emerald-600 to-teal-700 text-white p-5 space-y-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold backdrop-blur-xs">
                    <ArchetypeIcon className="w-3.5 h-3.5" />
                    <span>Сіздің образыңыз: {creator.archetype || 'Дос'}</span>
                  </div>
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    AI Сценарий жасау (Толық экран)
                  </h3>
                  <p className="text-xs text-emerald-100 leading-relaxed max-w-md">
                    Креатор анкетаңыздағы «{creator.archetype || 'Дос'}» образына сәйкес арнайы сөйлеу мәтіні және Instagram/TikTok-қа дайын описание құрастырылады.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <button
                onClick={() => setIsAIScriptModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-emerald-900 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>AI сценарийді толық экранда ашу</span>
                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 4. Requirements (Талаптар) */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-2.5 shadow-xs">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Тапсырыс талаптары:
              </h3>
              <ul className="space-y-1.5">
                {campaign.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Жеке сілтеме (Рефералдық) / Промокод & Tracking */}
            <div className="p-5 rounded-3xl border border-neutral-200 bg-white space-y-4 shadow-xs">
              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                  Жеке сілтеме (рефералдық)
                </span>
                <div className="mt-1.5 flex items-center justify-between gap-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-200 font-mono text-xs text-emerald-700">
                  <span className="truncate">{referralLink}</span>
                  <button
                    onClick={() => handleCopy(referralLink, 'link')}
                    className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-emerald-50 text-neutral-700 transition-colors shrink-0"
                  >
                    {copiedSection === 'link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tracking 4 Stats Cards */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 block">Clicks</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-neutral-900 font-mono block mt-0.5">
                    {activeOrder?.clicks || 245}
                  </strong>
                </div>

                <div className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 block">Orders</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-neutral-900 font-mono block mt-0.5">
                    {activeOrder?.ordersCount || 17}
                  </strong>
                </div>

                <div className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 block">Sales</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-neutral-900 font-mono block mt-0.5 truncate">
                    {(activeOrder?.salesVolume || 255000).toLocaleString('kk-KZ')} ₸
                  </strong>
                </div>

                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-semibold block">Табысыңыз</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-emerald-700 font-mono block mt-0.5 truncate">
                    {(activeOrder?.earnings || 51000).toLocaleString('kk-KZ')} ₸
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen AI Script Generator Modal */}
      {isAIScriptModalOpen && (
        <AIScriptModal
          isOpen={isAIScriptModalOpen}
          campaign={campaign}
          creator={creator}
          onClose={() => setIsAIScriptModalOpen(false)}
        />
      )}
    </>
  );
};
