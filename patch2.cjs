const fs = require('fs');
const lines = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8').split('\n');

const newContent = `      {/* Tab 5: Analytics */}
      {activeTab === 'analytics' && (() => {
        const totalCreators = creators.length;
        const totalSalesVolume = orders ? orders.reduce((sum, ord) => sum + (ord.salesVolume || 0), 0) : 0;
        const totalSalesCount = orders ? orders.reduce((sum, ord) => sum + (ord.ordersCount || 0), 0) : 0;
        const totalEarnings = orders ? orders.reduce((sum, ord) => sum + (ord.earnings || 0), 0) : 0;
        const platformCommission = totalSalesVolume * 0.1;
        
        const formatMoney = (val) => {
          if (val > 1000000) return (val / 1000000).toFixed(1) + ' млн ₸';
          return val.toLocaleString('kk-KZ') + ' ₸';
        };

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-500">Жалпы креаторлар</span>
                <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1">{totalCreators}</strong>
                <span className="text-[10px] text-emerald-600 font-bold">Осы айда қосылғандар бар</span>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-500">Жалпы сауда (GMV)</span>
                <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1 truncate">{formatMoney(totalSalesVolume)}</strong>
                <span className="text-[10px] text-neutral-400 font-mono">{totalSalesCount} сатылым</span>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-500">Креаторлар табысы</span>
                <strong className="text-xl font-extrabold text-emerald-600 font-mono block mt-1 truncate">{formatMoney(totalEarnings)}</strong>
                <span className="text-[10px] text-emerald-700 font-medium">Белсенді кіріс</span>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-500">Платформа комиссиясы</span>
                <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1 truncate">{formatMoney(platformCommission)}</strong>
                <span className="text-[10px] text-emerald-600 font-bold">10% таза маржа</span>
              </div>
            </div>
          </div>
        );
      })()}`;

const startIndex = lines.findIndex(l => l.includes('{/* Tab 5: Analytics */}'));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.includes('{/* Tab 6: Users */}'));

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex, newContent);
  fs.writeFileSync('src/components/admin/AdminDashboard.tsx', lines.join('\n'));
} else {
  console.log('Not found');
}
