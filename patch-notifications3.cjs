const fs = require('fs');
let code = fs.readFileSync('src/components/NotificationsModal.tsx', 'utf8');

code = code.replace(
  '            <div\n              key={n.id}\n              className={`p-3.5 rounded-2xl border transition-all ${',
  `            <div\n              key={n.id}\n              onClick={() => n.unread && onMarkRead(n.id)}\n              className={\`p-3.5 rounded-2xl border transition-all \${n.unread ? "cursor-pointer hover:bg-emerald-50/50" : ""} \${`
);

fs.writeFileSync('src/components/NotificationsModal.tsx', code);
