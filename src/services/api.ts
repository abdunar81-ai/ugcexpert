import { AIScriptResult, Campaign, CreatorProfile, Goal, LessonModule, OrderTracking, Wallet } from '../types';

export interface DatabaseStatus {
  status: string;
  database: {
    isPostgresConnected: boolean;
    databaseUrlConfigured: boolean;
    mode: 'postgresql' | 'in-memory-fallback';
  };
  timestamp: string;
}

export async function getDatabaseStatus(): Promise<DatabaseStatus | null> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchCreatorsList(): Promise<CreatorProfile[] | null> {
  try {
    const res = await fetch('/api/creators');
    if (!res.ok) return null;
    const data = await res.json();
    return data.creators || null;
  } catch {
    return null;
  }
}

export async function fetchCreatorProfile(): Promise<CreatorProfile | null> {
  try {
    const res = await fetch('/api/creator/profile');
    if (!res.ok) return null;
    const data = await res.json();
    return data.profile || null;
  } catch {
    return null;
  }
}

export async function updateCreatorProfile(updates: Partial<CreatorProfile>): Promise<CreatorProfile | null> {
  try {
    const res = await fetch('/api/creator/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.profile || null;
  } catch {
    return null;
  }
}

export async function updateCreatorGoal(goal: Goal): Promise<Goal | null> {
  try {
    const res = await fetch('/api/creator/goal', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.goal || null;
  } catch {
    return null;
  }
}

export async function fetchCampaigns(): Promise<Campaign[] | null> {
  try {
    const res = await fetch('/api/campaigns');
    if (!res.ok) return null;
    const data = await res.json();
    return data.campaigns || null;
  } catch {
    return null;
  }
}

export async function createCampaign(campaign: Campaign): Promise<Campaign | null> {
  try {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.campaign || null;
  } catch {
    return null;
  }
}

export async function fetchOrders(): Promise<OrderTracking[] | null> {
  try {
    const res = await fetch('/api/orders');
    if (!res.ok) return null;
    const data = await res.json();
    return data.orders || null;
  } catch {
    return null;
  }
}

export async function submitOrderVideo(orderId: string, videoUrl: string): Promise<OrderTracking | null> {
  try {
    const res = await fetch(`/api/orders/${orderId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.order || null;
  } catch {
    return null;
  }
}

export async function fetchLessons(): Promise<LessonModule[] | null> {
  try {
    const res = await fetch('/api/lessons');
    if (!res.ok) return null;
    const data = await res.json();
    return data.lessons || null;
  } catch {
    return null;
  }
}

export async function completeLesson(moduleId: number): Promise<{ lessons: LessonModule[]; newLevel: number } | null> {
  try {
    const res = await fetch(`/api/lessons/${moduleId}/complete`, {
      method: 'POST',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function requestWithdrawal(amount: number, method: string, account: string): Promise<{ wallet: Wallet } | null> {
  try {
    const res = await fetch('/api/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, method, account }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateAIScript(
  creator: CreatorProfile,
  campaign: Campaign
): Promise<AIScriptResult> {
  try {
    const response = await fetch('/api/gemini/script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creator: {
          name: creator.name,
          city: creator.city,
          categories: creator.categories,
          bio: creator.bio,
          archetype: creator.archetype || 'Дос',
          questionnaire: creator.questionnaire,
        },
        brief: {
          companyName: campaign.companyName,
          productName: campaign.product.name,
          category: campaign.category,
          productDescription: campaign.product.description,
          productPrice: `${campaign.product.price.toLocaleString('kk-KZ')} ₸`,
          commission: `${campaign.commission.toLocaleString('kk-KZ')} ₸`,
          usp: campaign.product.usp,
          targetAudience: campaign.product.targetAudience,
          offer: campaign.product.offer,
          ctaText: campaign.product.ctaText,
          requirements: campaign.requirements,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.script) {
      return data.script;
    }
    throw new Error(data.error || 'Failed to parse AI script');
  } catch (error) {
    console.warn('AI API call fallback activated:', error);
    const creatorFirstName = (creator.name || 'Айжан').split(' ')[0].toUpperCase();
    const prodName = campaign.product.name;
    const compName = campaign.companyName;
    const usp = campaign.product.usp || 'сапалы әрі жылдам нәтиже беретін қасиеті';

    const fallbackAuthorScript = `Сәлем, достар! Соңғы кездері ${compName} компаниясының ${prodName} өнімін үзбей қолданып жүрмін.

Маған ерекше ұнағаны — ${usp}. Күнделікті өмірде нағыз таптырмас көмекшім болып кетті, нәтижесін тез арада байқадым.

Сіздерге де шын кеңес беремін: өзіңіз де алып байқап көріңіз, өкінбейсіз! Менің "${creatorFirstName}" промокодыммен жеңілдікпен тапсырыс беріп үлгеріңіз, сілтеме профилімде!`;

    const fallbackPostCaption = `${compName} ұсынған ${prodName} жайлы шынайы пікірім! ✨

Негізгі артықшылығы — ${usp}.
🛍️ Менің "${creatorFirstName}" жеке промокодыммен жеңілдікпен алып үлгеріңіз.
🔗 Сілтеме профиль сипаттамасында!

#UGCKazakhstan #${campaign.category.replace(/\s+/g, '')} #${prodName.split(' ')[0]} #ReelsKZ #ШынайыПікір`;

    return {
      authorScript: fallbackAuthorScript,
      postCaption: fallbackPostCaption,
      archetype: creator.archetype || 'Дос',
      hook: fallbackAuthorScript.split('\n')[0] || '',
      speakingScript: fallbackAuthorScript,
      bRoll: [],
      cta: `Сілтеме профильде! Промокод: ${creatorFirstName}`,
      tips: []
    };
  }
}
