import React, { useState } from 'react';
import { Campaign, CreatorProfile } from '../../types';
import { 
  Building2, 
  Plus, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Video, 
  ExternalLink,
  Filter,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompanyDashboardProps {
  campaigns: Campaign[];
  orders: any[];
  creators: CreatorProfile[];
  onAddCampaign: (newCampaign: Campaign) => void;
  onApproveSubmission: (orderId: string) => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  campaigns,
  orders,
  creators,
  onAddCampaign,
  onApproveSubmission,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('GlowSkin KZ');
  const [newCategory, setNewCategory] = useState('Косметика');
  const [newCommission, setNewCommission] = useState(15000);
  const [newPlatform, setNewPlatform] = useState('TikTok');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(18000);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPhoto, setNewProductPhoto] = useState('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80');

  const submissions = orders
    .filter((o) => o.submittedVideoUrl)
    .map((o) => {
      const creator = creators.find(c => c.id === o.creatorId);
      const campaign = campaigns.find(c => c.id === o.campaignId);
      return {
        id: o.id,
        creatorName: creator?.name || 'Белгісіз',
        creatorAvatar: creator?.avatar || '',
        campaignTitle: campaign?.title || o.productName,
        videoUrl: o.submittedVideoUrl,
        date: o.submittedAt || 'Бүгін',
        status: o.status === 'approved' ? 'approved' : 'pending',
      };
    });

  const handleApproveSubmission = (subId: string) => {
    onApproveSubmission(subId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Campaign = {
      id: `camp-${Date.now()}`,
      companyId: 'comp-1',
      companyName: newCompany,
      title: newTitle,
      category: newCategory,
      commission: Number(newCommission),
      platform: newPlatform,
      deadline: '30.10.2026',
      duration: '15-30 сек',
      isNew: true,
      product: {
        name: newProductName || newTitle,
        photo: newProductPhoto,
        description: newProductDesc || 'UGC видео түсіруге арналған сапалы өнім.',
        price: Number(newProductPrice),
        usp: 'Табиғи құрам және лезде әсер ету',
        targetAudience: '18-35 жас аралығындағы белсенді қолданушылар',
        offer: 'Алғашқы тапсырысқа 15% жеңілдік + тегін жеткізу',
      },
      requirements: [
        'Табиғи жарықта түсіру',
        'Сөйлеу тілі қазақша',
        'Логотип пен өнімді 3 секундтан артық көрсету',
        'Бекітілген хэштегтерді қосу',
      ],
    };

    onAddCampaign(created);
    setIsAddModalOpen(false);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Company Header */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shadow-xs">
            GS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900">
                GlowSkin KZ
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Тексерілген серіктес
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Табиғи косметика және бет күтімі өнімдері • Алматы
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Жаңа кампания қосу</span>
        </button>
      </div>

      {/* Analytics 4 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            Қатысушылар
          </span>
          <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1">
            48 креатор
          </strong>
          <span className="text-[10px] text-emerald-600 font-medium">Белсенді жұмыс</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            Сатылымдар
          </span>
          <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1">
            312 тапсырыс
          </strong>
          <span className="text-[10px] text-neutral-400 font-mono">+24% осы айда</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Жалпы сауда
          </span>
          <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1 truncate">
            4.68 млн ₸
          </strong>
          <span className="text-[10px] text-neutral-400 font-mono">UGC арқылы</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Төленген комиссия
          </span>
          <strong className="text-xl font-extrabold text-emerald-600 font-mono block mt-1 truncate">
            936 000 ₸
          </strong>
          <span className="text-[10px] text-emerald-700 font-medium">100% төленді</span>
        </div>
      </div>

      {/* Incoming UGC Submissions Queue */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-neutral-900 text-base">
              Креаторлардан түскен видеолар (Тексеру кезегі)
            </h2>
          </div>
          <span className="text-xs font-bold text-neutral-400 font-mono">
            {submissions.length} өтінім
          </span>
        </div>

        <div className="space-y-2.5">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={sub.creatorAvatar}
                  alt={sub.creatorName}
                  className="w-11 h-11 rounded-full object-cover border border-neutral-200 shrink-0"
                />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">{sub.creatorName}</h3>
                  <p className="text-[11px] text-neutral-500">{sub.campaignTitle} • {sub.date}</p>
                  <a
                    href={sub.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Видео сілтемесін ашу</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {sub.status === 'approved' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Мақұлданды
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleApproveSubmission(sub.id)}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Мақұлдау & Төлеу
                    </button>
                    <button
                      onClick={() => alert('Түзету туралы хабарлама креаторға жіберілді!')}
                      className="px-3 py-1.5 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-100 font-bold text-xs transition-colors"
                    >
                      Түзетуге жіберу
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Company Campaigns */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-neutral-900 text-base">
            Белсенді Кампаниялар
          </h2>
          <span className="text-xs font-mono text-neutral-400">{campaigns.length} кампания</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-emerald-300 transition-all space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={camp.product.photo}
                  alt={camp.product.name}
                  className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {camp.category}
                  </span>
                  <h3 className="text-xs font-bold text-neutral-900 mt-1 truncate">{camp.title}</h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Комиссия: <strong className="text-emerald-600">{camp.commission.toLocaleString('kk-KZ')} ₸</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                <span className="text-neutral-400">{camp.platform} • {camp.duration}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                  Белсенді
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Campaign Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-neutral-900 text-base">Жаңа UGC Кампания Қосу</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Кампания атауы
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Мысалы: Бет тазартатын крем UGC жарнамасы"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Санат
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  >
                    <option>Косметика</option>
                    <option>Денсаулық</option>
                    <option>Тағам</option>
                    <option>Спорт</option>
                    <option>Fashion</option>
                    <option>Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Комиссия (₸ / сатылым)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={newCommission}
                    onChange={(e) => setNewCommission(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Өнім атауы және сипаттамасы
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Өнім атауы"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs mb-2"
                />
                <textarea
                  rows={2}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Өнімнің негізгі артықшылықтары мен құрамы..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700"
                >
                  Бас тарту
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Кампанияны жариялау
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
