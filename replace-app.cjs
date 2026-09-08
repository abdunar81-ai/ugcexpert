const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const [withdrawals, setWithdrawals] = useState<any[]>([]);\n  const [isLoading, setIsLoading] = useState<boolean>(true);',
  `const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);`
);

code = code.replace(
  'fetchWithdrawals(),\n        ]);',
  `fetchWithdrawals(),
          fetchNotifications(),
        ]);`
);

code = code.replace(
  'const [statusRes, campaignsRes, ordersRes, creatorsRes, profileRes, lessonsRes, withdrawalsRes] = await Promise.allSettled',
  `const [statusRes, campaignsRes, ordersRes, creatorsRes, profileRes, lessonsRes, withdrawalsRes, notificationsRes] = await Promise.allSettled`
);

code = code.replace(
  'if (withdrawalsRes.status === \'fulfilled\' && withdrawalsRes.value) {\n          setWithdrawals(withdrawalsRes.value);\n        }',
  `if (withdrawalsRes.status === 'fulfilled' && withdrawalsRes.value) {
          setWithdrawals(withdrawalsRes.value);
        }
        if (notificationsRes.status === 'fulfilled' && notificationsRes.value) {
          setNotifications(notificationsRes.value);
        }`
);

code = code.replace(
  'const handleApproveSubmission = (orderId: string) => {',
  `const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    markNotificationRead(id).catch(console.warn);
  };

  const handleApproveSubmission = (orderId: string) => {`
);

code = code.replace(
  '<NotificationsModal\n        isOpen={isNotificationsOpen}\n        onClose={() => setIsNotificationsOpen(false)}\n      />',
  `<NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
      />`
);

fs.writeFileSync('src/App.tsx', code);
