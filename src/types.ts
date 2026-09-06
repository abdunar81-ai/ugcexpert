export interface SocialAccount {
  username: string;
  link: string;
  followers?: string;
}

export interface PortfolioItem {
  id: string;
  companyName: string;
  productName: string;
  productImage: string;
  videoUrl?: string;
  salesCount: number;
  revenueGenerated: number;
  commissionEarned: number;
  date: string;
  rating: number;
  clientReview?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  collectedAmount: number;
  targetDate?: string; // қай уақытқа үлкен мақсатқа жеткісі келеді - датасы (уақыт шектеуі)
  image?: string;
  category: 'car' | 'travel' | 'house' | 'gadget' | 'custom';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonModule {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  videoThumbnail: string;
  videoDuration: string;
  isCompleted: boolean;
  isLocked: boolean;
  score?: number;
  keyPoints: string[];
  practicalTask: string;
  quiz: QuizQuestion[];
}

export interface ProductDetails {
  name: string;
  photo: string;
  description: string;
  price: number;
  usp?: string;
  targetAudience?: string;
  offer?: string;
  ctaText?: string;
}

export interface Campaign {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  category: string;
  commission: number;
  duration: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Барлығы' | string;
  deadline: string;
  isNew?: boolean;
  product: ProductDetails;
  requirements: string[];
  status?: 'active' | 'pending_approval' | 'closed';
  creatorsCount?: number;
}

export interface OrderTracking {
  id: string;
  campaignId: string;
  creatorId: string;
  companyName: string;
  companyLogo: string;
  productName: string;
  productPhoto: string;
  commission: number;
  referralCode: string;
  referralLink: string;
  clicks: number;
  ordersCount: number;
  salesVolume: number;
  earnings: number;
  status: 'active' | 'in_review' | 'approved' | 'paid' | 'disputed';
  submittedVideoUrl?: string;
  submittedAt?: string;
  reviewComment?: string;
  approvedAt?: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'payout' | 'withdrawal' | 'bonus';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
  accountNumber?: string;
}

export interface Wallet {
  balance: number;
  pending: number;
  totalWithdrawn: number;
  transactions: Transaction[];
}

export type CreatorArchetype = 'Данышпан' | 'Жұмбақ' | 'Сенімді' | 'Дос';

export interface CreatorQuestionnaire {
  archetype: CreatorArchetype;
  speakingStyle: string; // e.g. "Сабырлы, дәлелді", "Энергиялы, жылдам", "Жылы, шынайы"
  targetAudience: string; // e.g. "Жастар (18-25)", "Қыз-келіншектер (20-35)", "Жалпы аудитория"
  toneFocus: string; // e.g. "Құрам мен ғылым", "Эмоция мен интрига", "Кепілдік пен нәтиже", "Жеке тәжірибе"
}

export interface CreatorProfile {
  id: string;
  name: string;
  avatar: string;
  city: string;
  categories: string[];
  level: number;
  rating: number;
  reviewsCount: number;
  totalEarnings: number;
  salesCount: number;
  completedOrdersCount: number;
  points: number; // жиналған ұпай (200 ұпайда барлық компаниялар ашылады)
  archetype: CreatorArchetype;
  questionnaire?: CreatorQuestionnaire;
  socialMedia: {
    instagram: SocialAccount;
    tiktok: SocialAccount;
    youtube: SocialAccount;
  };
  goal: Goal;
  wallet: Wallet;
  portfolio: PortfolioItem[];
  bio?: string;
  verified?: boolean;
  status: 'active' | 'blocked';
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  category: string;
  website: string;
  about: string;
  verified: boolean;
  totalSpent: number;
  totalSalesGenerated: number;
  activeCampaigns: number;
  analytics: {
    totalCreators: number;
    totalClicks: number;
    totalOrders: number;
    totalRevenue: number;
    totalCreatorPayout: number;
  };
  status: 'active' | 'pending_approval' | 'blocked';
}

export interface AIScriptResult {
  authorScript: string; // Тек автордың айтатын толық мәтіні (сценарий)
  postCaption: string; // Астына/описаниясына қойылатын қысқа мәтін (копи-паста үшін)
  archetype?: CreatorArchetype;
  hook?: string;
  speakingScript?: string;
  bRoll?: string[];
  cta?: string;
  tips?: string[];
}

export type ViewRole = 'creator' | 'company' | 'admin';
export type CreatorTab = 'profile' | 'companies' | 'creators';
export type AdminTab = 'users' | 'lessons' | 'companies' | 'orders' | 'finance' | 'analytics';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'admin' | 'company';
}
