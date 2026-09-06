import React, { useState, useEffect } from 'react';
import { 
  ViewRole, 
  CreatorTab, 
  CreatorProfile, 
  Campaign, 
  LessonModule, 
  Goal,
  Transaction,
  OrderTracking
} from './types';
import { 
  fetchCampaigns, 
  fetchOrders, 
  fetchCreatorsList, 
  fetchCreatorProfile, 
  fetchLessons, 
  getDatabaseStatus, 
  updateCreatorProfile as apiUpdateProfile, 
  updateCreatorGoal as apiUpdateGoal, 
  createCampaign as apiCreateCampaign, 
  submitOrderVideo as apiSubmitVideo, 
  completeLesson as apiCompleteLesson, 
  requestWithdrawal as apiWithdraw,
  DatabaseStatus
} from './services/api';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ProfileView } from './components/creator/ProfileView';
import { CompaniesView } from './components/creator/CompaniesView';
import { CreatorsView } from './components/creator/CreatorsView';
import { GoalModal } from './components/creator/GoalModal';
import { LessonsModal } from './components/creator/LessonsModal';
import { WalletModal } from './components/creator/WalletModal';
import { SalesPortfolioModal } from './components/creator/SalesPortfolioModal';
import { OrderDetailModal } from './components/creator/OrderDetailModal';
import { PublicCreatorModal } from './components/creator/PublicCreatorModal';
import { EditProfileModal } from './components/creator/EditProfileModal';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationsModal } from './components/NotificationsModal';

const defaultEmptyProfile: CreatorProfile = {
  id: '',
  name: 'Жүктелуде...',
  avatar: '',
  city: 'Алматы',
  categories: [],
  level: 1,
  rating: 5.0,
  reviewsCount: 0,
  totalEarnings: 0,
  salesCount: 0,
  completedOrdersCount: 0,
  points: 100,
  archetype: 'Дос',
  socialMedia: {
    instagram: { username: '', link: '' },
    tiktok: { username: '', link: '' },
    youtube: { username: '', link: '' },
  },
  goal: {
    id: 'goal-1',
    title: 'Мақсат',
    targetAmount: 0,
    collectedAmount: 0,
    category: 'car'
  },
  wallet: {
    balance: 0,
    pending: 0,
    totalWithdrawn: 0,
    transactions: []
  },
  portfolio: [],
  status: 'active'
};

export const App: React.FC = () => {
  // Navigation State
  const [currentRole, setCurrentRole] = useState<ViewRole>('creator');
  const [creatorTab, setCreatorTab] = useState<CreatorTab>('profile');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus['database'] | null>(null);

  // Domain State (Loaded directly from SQLite Database API)
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>(defaultEmptyProfile);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [lessons, setLessons] = useState<LessonModule[]>([]);
  const [creatorsList, setCreatorsList] = useState<CreatorProfile[]>([]);
  const [orders, setOrders] = useState<OrderTracking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial Load from Backend API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [statusRes, campaignsRes, ordersRes, creatorsRes, profileRes, lessonsRes] = await Promise.allSettled([
          getDatabaseStatus(),
          fetchCampaigns(),
          fetchOrders(),
          fetchCreatorsList(),
          fetchCreatorProfile(),
          fetchLessons(),
        ]);

        if (!isMounted) return;

        if (statusRes.status === 'fulfilled' && statusRes.value?.database) {
          setDbStatus(statusRes.value.database);
        }
        if (campaignsRes.status === 'fulfilled' && campaignsRes.value) {
          setCampaigns(campaignsRes.value);
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value) {
          setOrders(ordersRes.value);
        }
        if (creatorsRes.status === 'fulfilled' && creatorsRes.value) {
          setCreatorsList(creatorsRes.value);
        }
        if (profileRes.status === 'fulfilled' && profileRes.value) {
          setCreatorProfile(profileRes.value);
        }
        if (lessonsRes.status === 'fulfilled' && lessonsRes.value) {
          setLessons(lessonsRes.value);
        }
      } catch (err) {
        console.warn('Initial server sync error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedPublicCreator, setSelectedPublicCreator] = useState<CreatorProfile | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [isLessonsModalOpen, setIsLessonsModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Handlers
  const handleSaveProfile = (updatedProfile: Partial<CreatorProfile>) => {
    setCreatorProfile((prev) => {
      const merged: CreatorProfile = {
        ...prev,
        ...updatedProfile,
        goal: updatedProfile.goal || prev.goal,
        wallet: updatedProfile.wallet || prev.wallet,
        socialMedia: updatedProfile.socialMedia || prev.socialMedia,
      };
      return merged;
    });
    setCreatorsList((prev) =>
      prev.map((c) =>
        c.id === (updatedProfile.id || creatorProfile.id)
          ? { ...c, ...updatedProfile }
          : c
      )
    );
    // Sync to backend API
    apiUpdateProfile(updatedProfile).catch(console.warn);
  };

  const handleSaveGoal = (updatedGoal: Goal) => {
    setCreatorProfile((prev) => ({
      ...prev,
      goal: updatedGoal,
    }));
    // Sync to backend API
    apiUpdateGoal(updatedGoal).catch(console.warn);
  };

  const handleCompleteLessonModule = (moduleId: number) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === moduleId) {
          return { ...l, isCompleted: true };
        }
        if (l.id === moduleId + 1) {
          return { ...l, isLocked: false };
        }
        return l;
      })
    );

    // Increase Creator Level (+10 LVL) per completed module
    setCreatorProfile((prev) => ({
      ...prev,
      level: prev.level + 10,
    }));

    // Sync to backend API
    apiCompleteLesson(moduleId).catch(console.warn);
  };

  const handleWithdraw = (amount: number, method: string, account: string) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `${method} шығару`,
      amount: -amount,
      date: 'Бүгін, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      type: 'withdrawal',
      paymentMethod: method,
    };

    setCreatorProfile((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance - amount,
        pending: prev.wallet.pending + amount,
        transactions: [newTx, ...prev.wallet.transactions],
      },
    }));

    // Sync to backend API
    apiWithdraw(amount, method, account).catch(console.warn);
  };

  const handleSubmitVideo = (orderId: string, videoUrl: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, submittedVideoUrl: videoUrl, status: 'review' }
          : ord
      )
    );
    // Sync to backend API
    apiSubmitVideo(orderId, videoUrl).catch(console.warn);
  };

  const handleAddCampaign = (newCampaign: Campaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    // Sync to backend API
    apiCreateCampaign(newCampaign).catch(console.warn);
  };

  const handleToggleVerifyCreator = (creatorId: string) => {
    setCreatorsList((prev) =>
      prev.map((c) => (c.id === creatorId ? { ...c, verified: !c.verified } : c))
    );
    if (creatorProfile.id === creatorId) {
      setCreatorProfile((prev) => ({ ...prev, verified: !prev.verified }));
    }
  };

  const handleUpdateCreatorLevel = (creatorId: string, newLevel: number) => {
    setCreatorsList((prev) =>
      prev.map((c) => (c.id === creatorId ? { ...c, level: newLevel } : c))
    );
    if (creatorProfile.id === creatorId) {
      setCreatorProfile((prev) => ({ ...prev, level: newLevel }));
    }
  };

  const handleApproveWithdrawal = (txId: string) => {
    setCreatorProfile((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        pending: Math.max(0, prev.wallet.pending - 50000),
        totalWithdrawn: prev.wallet.totalWithdrawn + 50000,
        transactions: prev.wallet.transactions.map((tx) =>
          tx.id === txId ? { ...tx, status: 'completed' } : tx
        ),
      },
    }));
  };

  if (isLoading && !creatorProfile.id) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-tight">UGC EXPERT</h2>
        <p className="text-sm text-slate-400 mt-1">Деректер базасынан (SQLite) ақпарат жүктелуде...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100/90 text-neutral-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Universal Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        dbStatus={dbStatus}
      />

      {/* Main Container Wrapper */}
      <main className={`flex-1 flex justify-center py-3 sm:py-6 px-2 sm:px-4 ${currentRole === 'creator' && !isMobileFrame ? 'pb-20 sm:pb-24' : ''}`}>
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'max-w-md bg-neutral-50 rounded-3xl shadow-2xl border-4 border-neutral-800 overflow-hidden flex flex-col min-h-[750px] relative'
              : 'max-w-4xl'
          }`}
        >
          {/* Active View Container */}
          <div className="flex-1 p-2 sm:p-4">
            {/* ROLE 1: CREATOR DASHBOARD */}
            {currentRole === 'creator' && (
              <>
                {creatorTab === 'profile' && (
                  <ProfileView
                    creator={creatorProfile}
                    lessons={lessons}
                    onOpenGoalModal={() => setIsGoalModalOpen(true)}
                    onOpenLessonsModal={() => setIsLessonsModalOpen(true)}
                    onOpenWalletModal={() => setIsWalletModalOpen(true)}
                    onOpenSalesModal={() => setIsSalesModalOpen(true)}
                    onOpenEditProfileModal={() => setIsEditProfileOpen(true)}
                    onUpdateSocials={(socials) =>
                      setCreatorProfile((prev) => ({ ...prev, socialMedia: socials }))
                    }
                  />
                )}

                {creatorTab === 'companies' && (
                  <CompaniesView
                    campaigns={campaigns}
                    creatorPoints={creatorProfile.points ?? 0}
                    onSelectCampaign={(camp) => setSelectedCampaign(camp)}
                  />
                )}

                {creatorTab === 'creators' && (
                  <CreatorsView
                    creators={creatorsList}
                    onSelectCreator={(c) => setSelectedPublicCreator(c)}
                  />
                )}
              </>
            )}

            {/* ROLE 2: COMPANY DASHBOARD */}
            {currentRole === 'company' && (
              <CompanyDashboard
                campaigns={campaigns}
                onAddCampaign={handleAddCampaign}
              />
            )}

            {/* ROLE 3: ADMIN DASHBOARD */}
            {currentRole === 'admin' && (
              <AdminDashboard
                creators={creatorsList}
                campaigns={campaigns}
                lessons={lessons}
                onToggleVerifyCreator={handleToggleVerifyCreator}
                onUpdateCreatorLevel={handleUpdateCreatorLevel}
                onApproveWithdrawal={handleApproveWithdrawal}
              />
            )}
          </div>

          {/* Bottom Mobile Navigation for Creator view */}
          {currentRole === 'creator' && (
            <BottomNav
              currentTab={creatorTab}
              onTabChange={(tab) => setCreatorTab(tab)}
              companiesBadge={campaigns.length}
              isMobileFrame={isMobileFrame}
            />
          )}
        </div>
      </main>

      {/* Global Interactive Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={creatorProfile.goal}
        onSaveGoal={handleSaveGoal}
      />

      <LessonsModal
        isOpen={isLessonsModalOpen}
        onClose={() => setIsLessonsModalOpen(false)}
        lessons={lessons}
        onCompleteModule={handleCompleteLessonModule}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={creatorProfile.wallet}
        onWithdraw={handleWithdraw}
      />

      <SalesPortfolioModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        creator={creatorProfile}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        creator={creatorProfile}
        onSave={handleSaveProfile}
      />

      {selectedCampaign && (
        <OrderDetailModal
          campaign={selectedCampaign}
          creator={creatorProfile}
          activeOrder={orders.find((o) => o.campaignId === selectedCampaign.id)}
          onClose={() => setSelectedCampaign(null)}
          onSubmitVideo={handleSubmitVideo}
        />
      )}

      <PublicCreatorModal
        creator={selectedPublicCreator}
        onClose={() => setSelectedPublicCreator(null)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export default App;
