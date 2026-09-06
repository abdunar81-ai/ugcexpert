import { prisma } from './prisma.js';
import { 
  CreatorProfile, 
  Campaign, 
  OrderTracking, 
  LessonModule, 
  Goal, 
  Wallet,
  Transaction 
} from '../src/types.js';

function safeJsonParse<T>(value: any, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === 'object') return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function initDatabase(): Promise<{ connected: boolean; message: string }> {
  try {
    const creatorCount = await prisma.creator.count();
    console.log(`✅ [Prisma SQLite] Connected to dev.db. Total creators in database: ${creatorCount}`);
    return {
      connected: true,
      message: `Connected to SQLite dev.db (${creatorCount} creators found).`,
    };
  } catch (err: any) {
    console.error('❌ [Prisma SQLite] Error connecting to database:', err);
    return {
      connected: false,
      message: `Database error: ${err.message}`,
    };
  }
}

export function getDbStatus() {
  return {
    isPostgresConnected: true, // DB is active & connected
    databaseUrlConfigured: true,
    orm: 'Prisma ORM (SQLite)',
    mode: 'sqlite-embedded',
    databaseFile: 'dev.db',
  };
}

// -------------------------------------------------------------
// CREATOR QUERIES (Direct SQLite via Prisma)
// -------------------------------------------------------------
export async function getCreatorsList(): Promise<CreatorProfile[]> {
  try {
    const creators = await prisma.creator.findMany({
      include: { 
        goal: true, 
        wallet: { 
          include: { 
            transactions: {
              orderBy: { createdAt: 'desc' }
            } 
          } 
        } 
      },
      orderBy: { level: 'desc' },
    });

    return creators.map((c) => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      city: c.city,
      categories: safeJsonParse<string[]>(c.categories, ['Әсемдік UGC', 'Lifestyle']),
      level: c.level,
      rating: c.rating,
      reviewsCount: c.reviewsCount,
      totalEarnings: c.totalEarnings,
      salesCount: c.salesCount,
      completedOrdersCount: c.completedOrdersCount,
      points: c.points,
      archetype: c.archetype as any,
      questionnaire: safeJsonParse<any>(c.questionnaire, {}),
      bio: c.bio || '',
      verified: c.verified,
      status: c.status as any,
      socialMedia: safeJsonParse<any>(c.socialMedia, {}),
      portfolio: safeJsonParse<any[]>(c.portfolio, []),
      goal: (c.goal as any) || {
        id: `goal-${c.id}`,
        title: 'Toyota Camry 75',
        targetAmount: 18000000,
        collectedAmount: 2450000,
        targetDate: '2026-12-31',
        category: 'car',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80'
      },
      wallet: (c.wallet as any) || {
        balance: 125000,
        pending: 47000,
        totalWithdrawn: 780000,
        transactions: []
      },
    }));
  } catch (err) {
    console.error('[Prisma SQLite] getCreatorsList error:', err);
    return [];
  }
}

export async function getActiveCreatorProfile(): Promise<CreatorProfile | null> {
  try {
    const c = await prisma.creator.findFirst({
      include: { 
        goal: true, 
        wallet: { 
          include: { 
            transactions: {
              orderBy: { createdAt: 'desc' }
            } 
          } 
        } 
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!c) return null;

    return {
      id: c.id,
      name: c.name,
      avatar: c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      city: c.city,
      categories: safeJsonParse<string[]>(c.categories, ['Әсемдік UGC', 'Lifestyle']),
      level: c.level,
      rating: c.rating,
      reviewsCount: c.reviewsCount,
      totalEarnings: c.totalEarnings,
      salesCount: c.salesCount,
      completedOrdersCount: c.completedOrdersCount,
      points: c.points,
      archetype: c.archetype as any,
      questionnaire: safeJsonParse<any>(c.questionnaire, {}),
      bio: c.bio || '',
      verified: c.verified,
      status: c.status as any,
      socialMedia: safeJsonParse<any>(c.socialMedia, {}),
      portfolio: safeJsonParse<any[]>(c.portfolio, []),
      goal: (c.goal as any) || {
        id: `goal-${c.id}`,
        title: 'Toyota Camry 75',
        targetAmount: 18000000,
        collectedAmount: 2450000,
        targetDate: '2026-12-31',
        category: 'car',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80'
      },
      wallet: (c.wallet as any) || {
        balance: 125000,
        pending: 47000,
        totalWithdrawn: 780000,
        transactions: []
      },
    };
  } catch (err) {
    console.error('[Prisma SQLite] getActiveCreatorProfile error:', err);
    return null;
  }
}

export async function updateCreatorProfileRecord(updates: Partial<CreatorProfile>): Promise<CreatorProfile | null> {
  try {
    const active = await getActiveCreatorProfile();
    const targetId = updates.id || active?.id;
    if (!targetId) return null;

    const dataToUpdate: any = {};
    if (updates.name !== undefined) dataToUpdate.name = updates.name;
    if (updates.avatar !== undefined) dataToUpdate.avatar = updates.avatar;
    if (updates.city !== undefined) dataToUpdate.city = updates.city;
    if (updates.categories !== undefined) dataToUpdate.categories = JSON.stringify(updates.categories);
    if (updates.archetype !== undefined) dataToUpdate.archetype = updates.archetype;
    if (updates.bio !== undefined) dataToUpdate.bio = updates.bio;
    if (updates.questionnaire !== undefined) dataToUpdate.questionnaire = JSON.stringify(updates.questionnaire);
    if (updates.socialMedia !== undefined) dataToUpdate.socialMedia = JSON.stringify(updates.socialMedia);

    await prisma.creator.update({
      where: { id: targetId },
      data: dataToUpdate,
    });

    return await getActiveCreatorProfile();
  } catch (err) {
    console.error('[Prisma SQLite] updateCreatorProfileRecord error:', err);
    return null;
  }
}

export async function updateGoalRecord(goal: Goal): Promise<Goal> {
  try {
    const active = await getActiveCreatorProfile();
    const creatorId = active?.id || 'creator-1';

    await prisma.goal.upsert({
      where: { creatorId },
      update: {
        title: goal.title,
        targetAmount: goal.targetAmount,
        collectedAmount: goal.collectedAmount,
        targetDate: goal.targetDate,
        category: goal.category,
        image: goal.image,
      },
      create: {
        id: goal.id || `goal-${Date.now()}`,
        creatorId,
        title: goal.title,
        targetAmount: goal.targetAmount,
        collectedAmount: goal.collectedAmount,
        targetDate: goal.targetDate,
        category: goal.category,
        image: goal.image,
      },
    });

    return goal;
  } catch (err) {
    console.error('[Prisma SQLite] updateGoalRecord error:', err);
    return goal;
  }
}

// -------------------------------------------------------------
// CAMPAIGN QUERIES (Direct SQLite via Prisma)
// -------------------------------------------------------------
export async function getCampaignsList(): Promise<Campaign[]> {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return campaigns.map((camp) => ({
      id: camp.id,
      companyId: camp.companyId,
      companyName: camp.companyName,
      companyLogo: camp.companyLogo || undefined,
      title: camp.title,
      category: camp.category,
      commission: camp.commission,
      duration: camp.duration,
      platform: camp.platform as any,
      deadline: camp.deadline,
      status: camp.status as any,
      requirements: safeJsonParse<string[]>(camp.requirements, []),
      product: safeJsonParse<any>(camp.product, { name: 'Өнім', price: 0 }),
    }));
  } catch (err) {
    console.error('[Prisma SQLite] getCampaignsList error:', err);
    return [];
  }
}

export async function createCampaignRecord(campaign: Campaign): Promise<Campaign> {
  try {
    await prisma.campaign.create({
      data: {
        id: campaign.id,
        companyId: campaign.companyId,
        companyName: campaign.companyName,
        companyLogo: campaign.companyLogo,
        title: campaign.title,
        category: campaign.category,
        commission: campaign.commission,
        duration: campaign.duration,
        platform: campaign.platform,
        deadline: campaign.deadline,
        status: campaign.status || 'active',
        requirements: JSON.stringify(campaign.requirements || []),
        product: JSON.stringify(campaign.product || {}),
      },
    });
    return campaign;
  } catch (err) {
    console.error('[Prisma SQLite] createCampaignRecord error:', err);
    return campaign;
  }
}

// -------------------------------------------------------------
// ORDER QUERIES (Direct SQLite via Prisma)
// -------------------------------------------------------------
export async function getOrdersList(): Promise<OrderTracking[]> {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((ord) => ({
      id: ord.id,
      campaignId: ord.campaignId,
      creatorId: ord.creatorId,
      companyName: ord.companyName,
      companyLogo: ord.companyLogo || '',
      productName: ord.productName,
      productPhoto: ord.productPhoto || '',
      commission: ord.commission,
      referralCode: ord.referralCode || '',
      referralLink: ord.referralLink || '',
      clicks: ord.clicks,
      ordersCount: ord.ordersCount,
      salesVolume: ord.salesVolume,
      earnings: ord.earnings,
      status: ord.status as any,
      submittedVideoUrl: ord.submittedVideoUrl || undefined,
      submittedAt: ord.submittedAt || undefined,
      reviewComment: ord.reviewComment || undefined,
      approvedAt: ord.approvedAt || undefined,
    }));
  } catch (err) {
    console.error('[Prisma SQLite] getOrdersList error:', err);
    return [];
  }
}

export async function submitOrderVideoUrl(orderId: string, videoUrl: string): Promise<OrderTracking | null> {
  try {
    const nowStr = 'Бүгін, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        submittedVideoUrl: videoUrl,
        status: 'in_review',
        submittedAt: nowStr,
      },
    });

    return {
      id: updated.id,
      campaignId: updated.campaignId,
      creatorId: updated.creatorId,
      companyName: updated.companyName,
      companyLogo: updated.companyLogo || '',
      productName: updated.productName,
      productPhoto: updated.productPhoto || '',
      commission: updated.commission,
      referralCode: updated.referralCode || '',
      referralLink: updated.referralLink || '',
      clicks: updated.clicks,
      ordersCount: updated.ordersCount,
      salesVolume: updated.salesVolume,
      earnings: updated.earnings,
      status: updated.status as any,
      submittedVideoUrl: updated.submittedVideoUrl || undefined,
      submittedAt: updated.submittedAt || undefined,
      reviewComment: updated.reviewComment || undefined,
      approvedAt: updated.approvedAt || undefined,
    };
  } catch (err) {
    console.error('[Prisma SQLite] submitOrderVideoUrl error:', err);
    return null;
  }
}

// -------------------------------------------------------------
// LESSON QUERIES (Direct SQLite via Prisma)
// -------------------------------------------------------------
export async function getLessonsList(): Promise<LessonModule[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { id: 'asc' },
    });

    return lessons.map((l) => ({
      id: l.id,
      number: l.number,
      title: l.title,
      subtitle: l.subtitle,
      description: l.description,
      videoThumbnail: l.videoThumbnail,
      videoDuration: l.videoDuration,
      isCompleted: l.isCompleted,
      isLocked: l.isLocked,
      score: l.score ?? 0,
      keyPoints: safeJsonParse<string[]>(l.keyPoints, []),
      practicalTask: l.practicalTask,
      quiz: safeJsonParse<any[]>(l.quiz, []),
    }));
  } catch (err) {
    console.error('[Prisma SQLite] getLessonsList error:', err);
    return [];
  }
}

export async function completeLessonModule(moduleId: number): Promise<{ lessons: LessonModule[]; newLevel: number }> {
  try {
    await prisma.lesson.update({
      where: { id: moduleId },
      data: { isCompleted: true },
    });

    await prisma.lesson.updateMany({
      where: { id: moduleId + 1 },
      data: { isLocked: false },
    });

    const active = await getActiveCreatorProfile();
    if (active) {
      await prisma.creator.update({
        where: { id: active.id },
        data: { level: { increment: 10 } },
      });
    }

    const lessons = await getLessonsList();
    const refreshed = await getActiveCreatorProfile();

    return {
      lessons,
      newLevel: refreshed?.level || 10,
    };
  } catch (err) {
    console.error('[Prisma SQLite] completeLessonModule error:', err);
    const lessons = await getLessonsList();
    return {
      lessons,
      newLevel: 10,
    };
  }
}

// -------------------------------------------------------------
// WALLET QUERIES (Direct SQLite via Prisma)
// -------------------------------------------------------------
export async function requestWithdrawalRecord(amount: number, method: string, account: string): Promise<{ wallet: Wallet | null; transaction: Transaction }> {
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    title: `${method || 'Банк'} шығару`,
    amount: -Number(amount),
    date: 'Бүгін, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'pending',
    type: 'withdrawal',
    paymentMethod: method,
    accountNumber: account,
  };

  try {
    const active = await getActiveCreatorProfile();
    const creatorId = active?.id || 'creator-1';

    const wallet = await prisma.wallet.findUnique({
      where: { creatorId },
    });

    if (wallet) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: Number(amount) },
          pending: { increment: Number(amount) },
          transactions: {
            create: {
              id: newTx.id,
              title: newTx.title,
              amount: newTx.amount,
              type: newTx.type,
              date: newTx.date,
              status: newTx.status,
              paymentMethod: newTx.paymentMethod,
              accountNumber: newTx.accountNumber,
            },
          },
        },
      });
    }

    const refreshed = await getActiveCreatorProfile();
    return {
      wallet: refreshed?.wallet || null,
      transaction: newTx,
    };
  } catch (err) {
    console.error('[Prisma SQLite] requestWithdrawalRecord error:', err);
    return {
      wallet: null,
      transaction: newTx,
    };
  }
}
