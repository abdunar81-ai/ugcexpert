import React, { useState } from 'react';
import { Wallet, Transaction } from '../../types';
import { X, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, CreditCard, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet;
  onWithdraw: (amount: number, method: string, account: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onWithdraw,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'withdraw'>('overview');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50000);
  const [paymentMethod, setPaymentMethod] = useState<string>('Kaspi Gold');
  const [accountNumber, setAccountNumber] = useState<string>('+7 (707) 890-12-34');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > wallet.balance) {
      alert('Шығару сомасы қолжетімді баланстан аспауы керек!');
      return;
    }
    if (withdrawAmount < 5000) {
      alert('Ең төменгі шығару сомасы: 5 000 ₸');
      return;
    }

    onWithdraw(withdrawAmount, paymentMethod, accountNumber);
    setSuccessNotice(`Тапсырыс қабылданды! ${withdrawAmount.toLocaleString('kk-KZ')} ₸ ${paymentMethod} шотыңызға 15 минут ішінде түседі.`);
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setActiveTab('overview');
      setSuccessNotice(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <WalletIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-base">Креатор Әмияны</h2>
              <p className="text-xs text-neutral-500">Табысты бақылау және ақша шығару</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-100/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Баланс және тарих
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'withdraw'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Ақша шығару (Kaspi)
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {activeTab === 'overview' ? (
            <>
              {/* Balance Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[11px] font-semibold text-emerald-800">Баланс</p>
                  <p className="text-sm sm:text-base font-extrabold text-emerald-950 font-mono mt-0.5">
                    {wallet.balance.toLocaleString('kk-KZ')} ₸
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-[11px] font-semibold text-amber-800">Күтілуде</p>
                  <p className="text-sm sm:text-base font-extrabold text-amber-950 font-mono mt-0.5">
                    {wallet.pending.toLocaleString('kk-KZ')} ₸
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-100 border border-neutral-200">
                  <p className="text-[11px] font-semibold text-neutral-600">Төленді</p>
                  <p className="text-sm sm:text-base font-extrabold text-neutral-900 font-mono mt-0.5">
                    {wallet.totalWithdrawn.toLocaleString('kk-KZ')} ₸
                  </p>
                </div>
              </div>

              {/* Quick Withdraw CTA */}
              <button
                onClick={() => setActiveTab('withdraw')}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
                Қаражатты Kaspi / Картаға шығару
              </button>

              {/* Transactions History */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Төлемдер мен түсімдер тарихы
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {wallet.transactions.length} транзакция
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                  {wallet.transactions.map((tx) => (
                    <div key={tx.id} className="p-3 flex items-center justify-between gap-2 hover:bg-neutral-50/70 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          tx.type === 'withdrawal'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {tx.type === 'withdrawal' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-900 line-clamp-1">{tx.title}</p>
                          <p className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" /> {tx.date}
                            {tx.paymentMethod && ` • ${tx.paymentMethod}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-extrabold font-mono ${
                          tx.type === 'withdrawal' ? 'text-neutral-900' : 'text-emerald-600'
                        }`}>
                          {tx.amount > 0 ? `+${tx.amount.toLocaleString('kk-KZ')}` : tx.amount.toLocaleString('kk-KZ')} ₸
                        </span>
                        <span className={`block text-[10px] font-medium ${
                          tx.status === 'completed' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {tx.status === 'completed' ? 'Сәтті' : 'Күтілуде'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {successNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Төлем әдісін таңдаңыз:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Kaspi Gold', label: 'Kaspi Gold', color: 'border-red-400' },
                    { id: 'Halyk Bank', label: 'Halyk Bank', color: 'border-emerald-400' },
                    { id: 'Банк IBAN', label: 'Банк шоты', color: 'border-blue-400' }
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMethod === m.id
                          ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-emerald-500/50 shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account / Phone */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {paymentMethod === 'Kaspi Gold' ? 'Телефон нөмірі (Kaspi)' : 'Карта немесе IBAN'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  placeholder="+7 (7XX) XXX-XX-XX"
                />
              </div>

              {/* Amount */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Шығару сомасы (₸)
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    Қолжетімді: <strong className="text-emerald-600 font-mono">{wallet.balance.toLocaleString('kk-KZ')} ₸</strong>
                  </span>
                </div>
                <input
                  type="number"
                  min="5000"
                  max={wallet.balance}
                  step="5000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  Төлем комиссиясыз аударылады. Көп жағдайда қаражат Kaspi шотыңызға лезде немесе 15 минут ішінде түседі.
                </p>
              </div>

              <button
                type="submit"
                disabled={wallet.balance < 5000}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Шығаруға өтінім беру ({withdrawAmount.toLocaleString('kk-KZ')} ₸)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
