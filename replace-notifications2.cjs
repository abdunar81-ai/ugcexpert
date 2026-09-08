const fs = require('fs');
let code = fs.readFileSync('src/components/NotificationsModal.tsx', 'utf8');

code = code.replace(
  /export const NotificationsModal.*?\];/s,
  `export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}) => {
  if (!isOpen) return null;`
);

fs.writeFileSync('src/components/NotificationsModal.tsx', code);
