const fs = require('fs');
let code = fs.readFileSync('src/components/NotificationsModal.tsx', 'utf8');

code = code.replace(
  'interface NotificationsModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n}',
  `interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: any[];
  onMarkRead: (id: string) => void;
}`
);

code = code.replace(
  'export const NotificationsModal: React.FC<NotificationsModalProps> = ({\n  isOpen,\n  onClose,\n}) => {\n  if (!isOpen) return null;\n\n  const notifications = [\n    {\n      id: \'n-1\',\n      title: \'Жаңа сатылым расталды!\',\n      description: \'GlowSkin Табиғи бет күтімі бойынша рефералдық сілтемеңізден тапсырыс түсті. +15 000 ₸ әмияныңызға есептелді.\',\n      time: \'15 минут бұрын\',\n      type: \'sale\',\n      unread: true,\n    },\n    {\n      id: \'n-2\',\n      title: \'Жаңа UGC Кампания: PowerFuel Pro\',\n      description: \'Спорттық тағам санатында жаңа жоба іске қосылды. Әр сатылымға 20 000 ₸ комиссия ұсынылады.\',\n      time: \'2 сағат бұрын\',\n      type: \'campaign\',\n      unread: true,\n    }\n  ];',
  `export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}) => {
  if (!isOpen) return null;`
);

// We also need to add onClick={onMarkRead} logic to notifications
code = code.replace(
  `key={notif.id}
                className={\`p-4 rounded-2xl flex gap-4 transition-colors \${
                  notif.unread ? 'bg-emerald-50/50' : 'bg-white'
                }\`}`,
  `key={notif.id}
                onClick={() => notif.unread && onMarkRead(notif.id)}
                className={\`p-4 rounded-2xl flex gap-4 transition-colors \${
                  notif.unread ? 'bg-emerald-50/50 cursor-pointer hover:bg-emerald-50' : 'bg-white'
                }\`}`
);

fs.writeFileSync('src/components/NotificationsModal.tsx', code);
