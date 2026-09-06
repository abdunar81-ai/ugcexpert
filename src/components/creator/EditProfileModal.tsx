import React, { useState } from 'react';
import { CreatorProfile, CreatorArchetype, CreatorQuestionnaire } from '../../types';
import { 
  X, 
  Save, 
  User, 
  Sparkles, 
  MapPin, 
  Instagram, 
  Video, 
  Youtube, 
  Check, 
  BookOpen, 
  Brain, 
  Flame, 
  HeartHandshake, 
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

interface EditProfileModalProps {
  creator: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: Partial<CreatorProfile>) => void;
}

const ARCHETYPES_CONFIG: {
  id: CreatorArchetype;
  title: string;
  badge: string;
  icon: any;
  colorClass: string;
  borderClass: string;
  bgLinear: string;
  description: string;
  exampleHook: string;
  keywords: string[];
}[] = [
  {
    id: 'Данышпан',
    title: 'Данышпан (Эксперт)',
    badge: 'Сарапшылық & Фактілер',
    icon: Brain,
    colorClass: 'text-indigo-600',
    borderClass: 'border-indigo-200',
    bgLinear: 'from-indigo-50/70 to-white',
    description: 'Терең талдау жасайды, құрамы мен механизмін ғылыми әрі практикалық тұрғыдан нанымды түсіндіреді.',
    exampleHook: '«Көпшілік бұны таңдауда үлкен қателік жібереді: мына құрамына қараңыздар...»',
    keywords: ['Логика', 'Құрамы', 'Талдау', 'Сапа']
  },
  {
    id: 'Жұмбақ',
    title: 'Жұмбақ (Интригант)',
    badge: 'Интрига & Эстетика',
    icon: Flame,
    colorClass: 'text-purple-600',
    borderClass: 'border-purple-200',
    bgLinear: 'from-purple-50/70 to-white',
    description: 'Интрига сақтайды, қызықтырады, эстетикалық сезім сыйлайды, көрерменнің назарын бірден тартып ұстайды.',
    exampleHook: '«Бұл туралы неге ешкім айтпайды? Осы құпияны білгенде таңғалдым...»',
    keywords: ['Интрига', 'Құпия', 'Эстетика', 'Шолу']
  },
  {
    id: 'Сенімді',
    title: 'Сенімді (Көшбасшы)',
    badge: 'Батылдық & Кепілдік',
    icon: ShieldCheck,
    colorClass: 'text-amber-600',
    borderClass: 'border-amber-200',
    bgLinear: 'from-amber-50/70 to-white',
    description: 'Өзіне 100% сенімді, нақты, батыл сөйлейді, нәтижеге кепілдік беріп, шешім қабылдауға жетелейді.',
    exampleHook: '«Уақытыңызды босқа кетірмеңіз, егер нақты нәтиже керек болса, бірден мынаны алыңыз...»',
    keywords: ['Нақтылық', 'Кепілдік', 'Нәтиже', 'Сенім']
  },
  {
    id: 'Дос',
    title: 'Дос (Құрбы)',
    badge: 'Жылылық & Шынайылық',
    icon: HeartHandshake,
    colorClass: 'text-emerald-600',
    borderClass: 'border-emerald-200',
    bgLinear: 'from-emerald-50/70 to-white',
    description: 'Өте жылы, ашық, күлімсіреп, эмоциялы. Жақын құрбысына шәй үстінде шынайы кеңес бергендей сөйлейді.',
    exampleHook: '«Қыздар, сәлем! Өзім байқап көрген керемет жаңалығыммен бөліспесем болмайды...»',
    keywords: ['Жылылық', 'Шынайы эмоция', 'Кеңес', 'Лайфстайл']
  }
];

const AVAILABLE_CATEGORIES = [
  'Әсемдік UGC',
  'Beauty & Skincare',
  'Lifestyle',
  'Денсаулық',
  'Спорт & Фитнес',
  'Tech & Гаджеттер',
  'Тағам & Рецепттер',
  'Fashion & Сән',
  'Үй & Жайлылық',
  'Авто & Көлік'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  creator,
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'archetype' | 'basic'>('archetype');

  // Form State
  const [name, setName] = useState(creator.name);
  const [city, setCity] = useState(creator.city);
  const [bio, setBio] = useState(creator.bio || '');
  const [avatar, setAvatar] = useState(creator.avatar);
  const [categories, setCategories] = useState<string[]>(creator.categories);

  // Archetype & Questionnaire State
  const [archetype, setArchetype] = useState<CreatorArchetype>(creator.archetype || 'Дос');
  const [speakingStyle, setSpeakingStyle] = useState(
    creator.questionnaire?.speakingStyle || 'Жылы, шынайы әрі эмоциялы'
  );
  const [targetAudience, setTargetAudience] = useState(
    creator.questionnaire?.targetAudience || 'Қыз-келіншектер және жастар (18-35 жас)'
  );
  const [toneFocus, setToneFocus] = useState(
    creator.questionnaire?.toneFocus || 'Шынайы жеке тәжірибе, досқа кеңес беру'
  );

  // Socials State
  const [instagramUser, setInstagramUser] = useState(creator.socialMedia.instagram.username);
  const [tiktokUser, setTiktokUser] = useState(creator.socialMedia.tiktok.username);
  const [youtubeUser, setYoutubeUser] = useState(creator.socialMedia.youtube.username);

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      if (categories.length < 4) {
        setCategories([...categories, cat]);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const questionnaire: CreatorQuestionnaire = {
      archetype,
      speakingStyle,
      targetAudience,
      toneFocus,
    };

    onSave({
      ...creator,
      name,
      city,
      bio,
      avatar,
      categories,
      archetype,
      questionnaire,
      socialMedia: {
        instagram: {
          username: instagramUser,
          link: `https://instagram.com/${instagramUser.replace('@', '')}`,
          followers: creator.socialMedia.instagram.followers,
        },
        tiktok: {
          username: tiktokUser,
          link: `https://tiktok.com/@${tiktokUser.replace('@', '')}`,
          followers: creator.socialMedia.tiktok.followers,
        },
        youtube: {
          username: youtubeUser,
          link: `https://youtube.com/@${youtubeUser.replace('@', '')}`,
          followers: creator.socialMedia.youtube.followers,
        },
      },
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white sm:rounded-3xl w-full max-w-2xl h-full sm:h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-neutral-900 flex items-center gap-2">
              <span>Профильді және Образды өңдеу</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                AI жекелендіру
              </span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Таңдалған образыңызға қарай ИИ компанияларға арналған сценарий жазып береді
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-200 bg-neutral-50/70 p-1.5 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('archetype')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'archetype'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>1. Креатор Образы & Анкета (4 Образ)</span>
          </button>

          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'basic'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-white/50'
            }`}
          >
            <User className="w-4 h-4 text-neutral-600" />
            <span>2. Негізгі ақпарат & Желілер</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'archetype' ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Questionnaire Header Notice */}
              <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-emerald-950">
                    Өз UGC индивидумыңызды таңдаңыз
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    Қай образды таңдасаңыз, компанияның кез келген өнімін ашқанда AI сценарий дәл осы мінезіңіз бен сөйлеу мәнеріңізге сай жасалады.
                  </p>
                </div>
              </div>

              {/* 4 Archetypes Selection Grid */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider block">
                  Негізгі Образды (Архетипті) таңдаңыз:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ARCHETYPES_CONFIG.map((arch) => {
                    const isSelected = archetype === arch.id;
                    const IconComp = arch.icon;

                    return (
                      <div
                        key={arch.id}
                        onClick={() => setArchetype(arch.id)}
                        className={`cursor-pointer rounded-2xl p-4 transition-all border-2 flex flex-col justify-between relative ${
                          isSelected
                            ? `border-emerald-600 bg-linear-to-b from-emerald-50/40 to-white shadow-md ring-2 ring-emerald-500/20`
                            : `border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50`
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-neutral-100 text-neutral-700'
                              }`}
                            >
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900">
                                {arch.title}
                              </h4>
                              <span className="text-[10px] font-semibold text-neutral-500 block">
                                {arch.badge}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {arch.description}
                          </p>

                          <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-700 italic">
                            {arch.exampleHook}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-neutral-100">
                          {arch.keywords.map((kw, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Questionnaire Details */}
              <div className="p-5 rounded-3xl border border-neutral-200 bg-neutral-50/50 space-y-4">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Қосымша анкета баптаулары (AI дәлдігі үшін):</span>
                </h3>

                {/* 1. Сөйлеу мәнері */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">
                    Сөйлеу қарқыны мен интонацияңыз:
                  </label>
                  <select
                    value={speakingStyle}
                    onChange={(e) => setSpeakingStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  >
                    <option value="Жылы, шынайы әрі эмоциялы">Жылы, шынайы әрі эмоциялы (Достық кеңес)</option>
                    <option value="Энергиялы, динамикалық әрі жылдам">Энергиялы, динамикалық әрі жылдам (TikTok trend)</option>
                    <option value="Сабырлы, нақты әрі эксперттік">Сабырлы, нақты әрі эксперттік (Терең талдау)</option>
                    <option value="Көңілді, әзіл мен сарказм аралас">Көңілді, әзіл мен сарказм аралас (Тартымды интрига)</option>
                  </select>
                </div>

                {/* 2. Мақсатты аудитория */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">
                    Негізгі аудиторияңыздың сипаты:
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  >
                    <option value="Қыз-келіншектер және жастар (18-35 жас)">Қыз-келіншектер және жастар (18-35 жас)</option>
                    <option value="Студенттер мен жасөспірімдер (16-24 жас)">Студенттер мен жасөспірімдер (16-24 жас)</option>
                    <option value="Ер азаматтар (Авто, Гаджеттер, Спорт)">Ер азаматтар (Авто, Гаджеттер, Спорт)</option>
                    <option value="Отбасылық аудитория және аналар">Отбасылық аудитория және аналар</option>
                  </select>
                </div>

                {/* 3. Негізгі фокус */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">
                    Видеодағы негізгі фокус:
                  </label>
                  <select
                    value={toneFocus}
                    onChange={(e) => setToneFocus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  >
                    <option value="Шынайы жеке тәжірибе, досқа кеңес беру">Шынайы жеке тәжірибе, досқа кеңес беру</option>
                    <option value="Құрамы мен ғылыми дәлелдемелері">Құрамы мен ғылыми дәлелдемелері (Expert)</option>
                    <option value="Нақты шешім, кепілдік және тез нәтиже">Нақты шешім, кепілдік және тез нәтиже (Leader)</option>
                    <option value="Күтпеген құпия және эстетикалық әсер">Күтпеген құпия және эстетикалық әсер (Mystery)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              {/* Avatar & Name */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start p-4 rounded-3xl bg-neutral-50 border border-neutral-200">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md shrink-0"
                />

                <div className="space-y-3 w-full">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-700 block">
                      Аватар фотосының сілтемесі (URL):
                    </label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">
                    Аты-жөніңіз:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">
                    Қалаңыз:
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">
                  Өзіңіз туралы қысқаша (Bio):
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="TikTok & Reels жасаушы..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 block">
                    Мамандану бағыттарыңыз (1-4 таңдаңыз):
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    {categories.length}/4 таңдалды
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isCatSelected = categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleToggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          isCatSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="p-4 rounded-3xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Әлеуметтік желі аккаунттары:
                </h3>

                <div className="space-y-2.5">
                  {/* Instagram */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={instagramUser}
                      onChange={(e) => setInstagramUser(e.target.value)}
                      placeholder="@username (Instagram)"
                      className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* TikTok */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={tiktokUser}
                      onChange={(e) => setTiktokUser(e.target.value)}
                      placeholder="@username (TikTok)"
                      className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                      <Youtube className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={youtubeUser}
                      onChange={(e) => setYoutubeUser(e.target.value)}
                      placeholder="@channel (YouTube)"
                      className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Submit Action */}
          <div className="pt-2 sticky bottom-0 bg-white/95 backdrop-blur-xs">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Сақталды!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Өзгерістерді сақтау</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
