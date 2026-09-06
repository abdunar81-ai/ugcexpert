import React from 'react';
import { CreatorProfile } from '../../types';
import { X, CheckCircle, Star, MapPin, Award, Instagram, Video, Youtube, ExternalLink, ShoppingBag, TrendingUp } from 'lucide-react';

interface PublicCreatorModalProps {
  creator: CreatorProfile | null;
  onClose: () => void;
}

export const PublicCreatorModal: React.FC<PublicCreatorModalProps> = ({
  creator,
  onClose,
}) => {
  if (!creator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Креатор Портфолиосы
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Creator Profile Top */}
          <div className="flex items-start gap-4">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-emerald-50 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-extrabold text-neutral-900 truncate">{creator.name}</h3>
                {creator.verified && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
              </div>
              <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {creator.city}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-white font-mono font-bold text-xs">
                  LVL {creator.level}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {creator.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Level Info Banner */}
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1">
            <p className="font-bold text-neutral-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Деңгей қалай есептеледі?
            </p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Алғашқы 40 деңгей UGC сабақтарын өткенде беріледі. Одан кейінгі деңгейлер сатылымдар мен орындалған кампаниялар нәтижесінде үздіксіз өседі.
            </p>
          </div>

          {/* Bio */}
          {creator.bio && (
            <p className="text-xs text-neutral-700 leading-relaxed bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100/60">
              "{creator.bio}"
            </p>
          )}

          {/* Social Links */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
              Әлеуметтік желілері:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={creator.socialMedia.instagram.link}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-pink-50 text-pink-700 border border-pink-100 flex flex-col items-center justify-center gap-1 text-center hover:bg-pink-100 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-[10px] font-bold font-mono truncate max-w-full">
                  {creator.socialMedia.instagram.username}
                </span>
              </a>

              <a
                href={creator.socialMedia.tiktok.link}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 text-white flex flex-col items-center justify-center gap-1 text-center hover:bg-neutral-800 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span className="text-[10px] font-bold font-mono truncate max-w-full">
                  {creator.socialMedia.tiktok.username}
                </span>
              </a>

              <a
                href={creator.socialMedia.youtube.link}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-red-50 text-red-700 border border-red-100 flex flex-col items-center justify-center gap-1 text-center hover:bg-red-100 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span className="text-[10px] font-bold font-mono truncate max-w-full">
                  {creator.socialMedia.youtube.username}
                </span>
              </a>
            </div>
          </div>

          {/* Portfolio Showcase */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
              Орындаған жұмыстары:
            </span>

            {creator.portfolio && creator.portfolio.length > 0 ? (
              <div className="space-y-2">
                {creator.portfolio.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{item.companyName}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{item.productName}</p>
                      <p className="text-[10px] font-mono text-emerald-600 font-bold">
                        {item.salesCount} сатылым • +{item.commissionEarned.toLocaleString('kk-KZ')} ₸
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic text-center py-3 bg-neutral-50 rounded-xl">
                Әзірге аяқталған жұмыстар тіркелмеген
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
