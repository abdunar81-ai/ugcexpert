import React from 'react';
import { CreatorProfile, LessonModule } from '../../types';
import { 
  CheckCircle, 
  Star, 
  MapPin, 
  ShoppingBag, 
  BookOpen, 
  ChevronRight, 
  Instagram, 
  Video, 
  Youtube, 
  Sparkles, 
  Target, 
  Wallet as WalletIcon, 
  Edit3,
  ExternalLink,
  Brain,
  Flame,
  ShieldCheck,
  HeartHandshake,
  UserCheck,
  Calendar,
  Clock,
  Lock,
  Zap
} from 'lucide-react';

interface ProfileViewProps {
  creator: CreatorProfile;
  lessons: LessonModule[];
  onOpenGoalModal: () => void;
  onOpenLessonsModal: () => void;
  onOpenWalletModal: () => void;
  onOpenSalesModal: () => void;
  onOpenEditProfileModal: () => void;
  onUpdateSocials?: (socials: CreatorProfile['socialMedia']) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  creator,
  lessons,
  onOpenGoalModal,
  onOpenLessonsModal,
  onOpenWalletModal,
  onOpenSalesModal,
  onOpenEditProfileModal,
}) => {
  const completedLessons = lessons.filter((l) => l.isCompleted).length;
  const lessonsPercent = Math.round((completedLessons / lessons.length) * 100);

  // Goal calculation with safe defaults
  const goal = creator?.goal || {
    id: 'goal-default',
    title: 'Үлкен Мақсат',
    targetAmount: 5000000,
    collectedAmount: 0,
    category: 'custom' as const,
  };

  const goalTargetAmount = Math.max(1, goal.targetAmount || 1);
  const goalCollectedAmount = goal.collectedAmount || 0;
  const goalPercent = Math.min(
    100,
    Math.round((goalCollectedAmount / goalTargetAmount) * 100)
  );
  const goalRemaining = Math.max(0, goalTargetAmount - goalCollectedAmount);

  // Time remaining to goal calculation
  const daysLeft = goal.targetDate
    ? Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Archetype Meta
  const getArchetypeMeta = () => {
    switch (creator.archetype) {
      case 'Данышпан':
        return {
          icon: Brain,
          title: 'Данышпан (Эксперт)',
          desc: 'Сарапшылық, фактілер және терең талдау',
          badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        };
      case 'Жұмбақ':
        return {
          icon: Flame,
          title: 'Жұмбақ (Интригант)',
          desc: 'Интрига, эстетика және тылсым тартымдылық',
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'Сенімді':
        return {
          icon: ShieldCheck,
          title: 'Сенімді (Көшбасшы)',
          desc: 'Батыл шешімдер, кепілдік және нақты нәтиже',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
        };
      case 'Дос':
      default:
        return {
          icon: HeartHandshake,
          title: 'Дос (Құрбы)',
          desc: 'Жылылық, шынайы эмоция және достық кеңес',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
    }
  };

  const archMeta = getArchetypeMeta();
  const ArchIcon = archMeta.icon;

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Profile Top Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-emerald-50 shadow-xs"
            />
            {creator.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 truncate">
                  {creator.name}
                </h1>
                {creator.verified && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </span>
                )}
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={onOpenEditProfileModal}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-emerald-500 bg-neutral-50 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
                title="Профильді және Образды өңдеу"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Өңдеу</span>
              </button>
            </div>

            <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {creator.city}
            </p>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {creator.categories.map((cat, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    i === 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Level, Points & Rating */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
              <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md font-mono">
                LVL {creator.level}
              </span>
              <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-mono flex items-center gap-1" title="Компанияларды ашу үшін сатылым жасап 200 ұпай жинаңыз">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                {creator.points ?? 0} ұпай
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {creator.rating}
              </span>
              <span className="text-neutral-400 text-[11px]">
                ({creator.reviewsCount} пікір)
              </span>
            </div>
          </div>
        </div>

        {/* 2 Combined Metric Cards: 1) Жалпы табыс (Opens Wallet Modal), 2) Сатылымдар (Opens Sales & Portfolio Modal) */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-neutral-100">
          {/* Card 1: Жалпы табыс */}
          <button
            onClick={onOpenWalletModal}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-emerald-50/70 border border-neutral-200/80 hover:border-emerald-300 text-left transition-all group flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-semibold text-neutral-500">Жалпы табыс</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <WalletIcon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-lg font-black text-neutral-900 group-hover:text-emerald-700 font-mono block">
                {creator.totalEarnings.toLocaleString('kk-KZ')} ₸
              </span>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                Әмиян & Баланс →
              </span>
            </div>
          </button>

          {/* Card 2: Сатылымдар (Merged with Completed & Opens Portfolio) */}
          <button
            onClick={onOpenSalesModal}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-emerald-50/70 border border-neutral-200/80 hover:border-emerald-300 text-left transition-all group flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-semibold text-neutral-500">Сатылымдар</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-lg font-black text-neutral-900 group-hover:text-emerald-700 font-mono block">
                {creator.salesCount} дана
              </span>
              <span className="text-[11px] text-neutral-500 group-hover:text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                Портфолио ({creator.portfolio.length}) →
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. АРХЕТИП & AI АНКЕТА БЛОГЫ (Interactive Persona Card) */}
      <div 
        onClick={onOpenEditProfileModal}
        className="cursor-pointer bg-white hover:bg-neutral-50/70 rounded-3xl p-5 shadow-xs border-2 border-emerald-200/90 hover:border-emerald-400 transition-all group space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ArchIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Креатор Образы & Анкета
              </span>
              <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base flex items-center gap-2">
                <span>{archMeta.title}</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  AI Сценарийге белсенді
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
            <span>Өзгерту</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          {archMeta.desc}. Компания өнімдеріне AI сценарий жазғанда дәл осы образыңызға сай сөйлеу мәтіні шығады.
        </p>

        {creator.questionnaire && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-100 text-[11px]">
            <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg font-medium">
              🎙️ {creator.questionnaire.speakingStyle}
            </span>
            <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg font-medium">
              👥 {creator.questionnaire.targetAudience}
            </span>
          </div>
        )}
      </div>

      {/* 3. МАҚСАТ (Dream Goal Card) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Үлкен Мақсат
              </span>
              <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                {goal.title} — {(goal.targetAmount || 0).toLocaleString('kk-KZ')} ₸
              </h3>
            </div>
          </div>

          <button
            onClick={onOpenGoalModal}
            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-emerald-600 hover:bg-neutral-50 transition-colors"
            title="Мақсатты өңдеу"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Goal Graphic / Image */}
        {goal.image && (
          <div className="relative rounded-2xl overflow-hidden aspect-21/9 bg-neutral-900">
            <img
              src={goal.image}
              alt={goal.title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5 justify-between text-white">
              <span className="text-xs font-bold font-mono">
                Жиналды: {(goal.collectedAmount || 0).toLocaleString('kk-KZ')} ₸
              </span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-600 font-mono">
                {goalPercent}%
              </span>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/60">
            <div
              className="h-full bg-linear-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-700"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500 font-medium">
            <span>Жиналды: <strong className="text-neutral-900 font-mono">{(goal.collectedAmount || 0).toLocaleString('kk-KZ')} ₸</strong></span>
            <span>Қалды: <strong className="text-neutral-900 font-mono">{goalRemaining.toLocaleString('kk-KZ')} ₸</strong></span>
          </div>
        </div>

        {/* Уақытпен шектеу (Target Date Banner) */}
        {goal.targetDate && (
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs">
            <div className="flex items-center gap-2 text-neutral-600 min-w-0">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Мерзімі (Дедлайн)</span>
                <span className="text-neutral-900 font-bold font-mono text-xs">
                  {new Date(goal.targetDate).toLocaleDateString('kk-KZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            {daysLeft !== null && (
              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono shrink-0 flex items-center gap-1 ${
                daysLeft > 0 
                  ? 'bg-emerald-100/80 text-emerald-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {daysLeft > 0 ? `${daysLeft} күн қалды` : 'Мерзімге жетті'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. САБАҚТАР (Lessons Progress Card) */}
      <button
        onClick={onOpenLessonsModal}
        className="w-full bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 text-left hover:border-emerald-500/50 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                  Сабақтар
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-600 font-mono">
                  {completedLessons} / {lessons.length} модуль
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {lessonsPercent}% аяқталды • Деңгейді көтеру үшін оқуды жалғастырыңыз
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Progress line */}
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mt-3.5">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${lessonsPercent}%` }}
          />
        </div>
      </button>

      {/* 5. Әлеуметтік желілер (Enlarged Social Media Icons at the bottom) */}
      <div className="flex items-center justify-center gap-5 pt-2 pb-1">
        {/* Instagram */}
        <a
          href={creator.socialMedia.instagram.link}
          target="_blank"
          rel="noreferrer"
          title={`Instagram: ${creator.socialMedia.instagram.username}`}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          <Instagram className="w-7 h-7 sm:w-8 sm:h-8" />
        </a>

        {/* TikTok */}
        <a
          href={creator.socialMedia.tiktok.link}
          target="_blank"
          rel="noreferrer"
          title={`TikTok: ${creator.socialMedia.tiktok.username}`}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-neutral-950 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          <Video className="w-7 h-7 sm:w-8 sm:h-8" />
        </a>

        {/* YouTube */}
        <a
          href={creator.socialMedia.youtube.link}
          target="_blank"
          rel="noreferrer"
          title={`YouTube: ${creator.socialMedia.youtube.username}`}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          <Youtube className="w-7 h-7 sm:w-8 sm:h-8" />
        </a>
      </div>
    </div>
  );
};
