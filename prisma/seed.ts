import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedCreatorProfile = {
  id: 'creator-1',
  name: 'Айжан Бекқызы',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  city: 'Шымкент',
  categories: ['Әсемдік UGC', 'Lifestyle', 'Денсаулық'],
  level: 287,
  rating: 4.8,
  reviewsCount: 39,
  totalEarnings: 1250000,
  salesCount: 162,
  completedOrdersCount: 48,
  points: 100,
  archetype: 'Дос',
  questionnaire: {
    archetype: 'Дос',
    speakingStyle: 'Жылы, шынайы әрі эмоциялы',
    targetAudience: 'Қыз-келіншектер және жастар (18-35 жас)',
    toneFocus: 'Шынайы жеке тәжірибе, досқа кеңес беру'
  },
  bio: 'TikTok & Reels контентмейкері. 3 жылдық тәжірибе. Брендтердің сатылымын 3 есеге өсіретін шынайы UGC видеолар жасаймын.',
  verified: true,
  status: 'active',
  socialMedia: {
    instagram: { username: '@aizhan.ugc', link: 'https://instagram.com/aizhan.ugc', followers: '24.5K' },
    tiktok: { username: '@aizhan_creative', link: 'https://tiktok.com/@aizhan_creative', followers: '89.2K' },
    youtube: { username: '@aizhan_shorts', link: 'https://youtube.com/@aizhan_shorts', followers: '12.1K' }
  },
  goal: {
    id: 'goal-1',
    title: 'Toyota Camry 75',
    targetAmount: 18000000,
    collectedAmount: 2450000,
    targetDate: '2026-12-31',
    category: 'car',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80'
  },
  wallet: {
    balance: 125000,
    pending: 47000,
    totalWithdrawn: 780000,
    transactions: [
      { id: 'tx-1', title: 'GlowSkin сату комиссиясы', amount: 15000, type: 'payout', date: '30.08.2026', status: 'completed' },
      { id: 'tx-2', title: 'CoffeeLand тапсырыс орындалды', amount: 10000, type: 'payout', date: '28.08.2026', status: 'completed' },
      { id: 'tx-3', title: 'PowerFuel бонустық төлем', amount: 20000, type: 'payout', date: '24.08.2026', status: 'completed' },
      { id: 'tx-4', title: 'Kaspi Gold шотына шығару', amount: -150000, type: 'withdrawal', date: '20.08.2026', status: 'completed', paymentMethod: 'Kaspi Gold', accountNumber: '+7 (707) 890-12-34' },
      { id: 'tx-5', title: 'SlimFit Detox Tea (Күтілуде)', amount: 47000, type: 'payout', date: '31.08.2026', status: 'pending' }
    ]
  },
  portfolio: [
    { id: 'port-1', companyName: 'GlowSkin', productName: 'Гидрофильді Май & Ниацинамид Серум', productImage: 'https://images.unsplash.com/photo-1608248597359-59828557e1d5?w=500&auto=format&fit=crop&q=80', salesCount: 42, revenueGenerated: 630000, commissionEarned: 105000, date: 'Тамыз 2026', rating: 5.0, clientReview: 'Айжанның видеосы TikTok-та 180К қаралым жинап, тауар 2 күнде сатылып кетті!' },
    { id: 'port-2', companyName: 'CoffeeLand', productName: 'Organic Colombia Arabica Beans', productImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80', salesCount: 28, revenueGenerated: 280000, commissionEarned: 56000, date: 'Шілде 2026', rating: 4.9, clientReview: 'Эстетикалық және өте сапалы B-roll түсірілім. Рақмет!' },
    { id: 'port-3', companyName: 'PowerFuel', productName: 'Isolate Whey Protein 1000g', productImage: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500&auto=format&fit=crop&q=80', salesCount: 35, revenueGenerated: 700000, commissionEarned: 140000, date: 'Маусым 2026', rating: 4.8, clientReview: 'Энергетикасы мықты, сенімді сөйледі. Сатылым керемет болды.' }
  ]
};

export const seedCommunityCreators = [
  {
    id: 'creator-2',
    name: 'Аружан Қанатқызы',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    city: 'Алматы',
    categories: ['Косметика', 'Fashion', 'Әсемдік UGC'],
    level: 420,
    rating: 4.9,
    reviewsCount: 76,
    totalEarnings: 2890000,
    salesCount: 342,
    completedOrdersCount: 94,
    points: 200,
    archetype: 'Данышпан',
    questionnaire: { archetype: 'Данышпан', speakingStyle: 'Сабырлы, нақты, ғылыми дәлелдермен', targetAudience: 'Қыз-келіншектер (22-40 жас)', toneFocus: 'Құрам мен ғылым, тері дерматологиясы' },
    bio: 'Дерматологиялық косметикаға UGC жасайтын сарапшы. Сертификатталған визажист.',
    verified: true,
    status: 'active',
    socialMedia: { instagram: { username: '@aruzhan_ugc', link: 'https://instagram.com' }, tiktok: { username: '@aruzhan.beauty', link: 'https://tiktok.com' } },
    portfolio: []
  },
  {
    id: 'creator-3',
    name: 'Ержан Сейіт',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    city: 'Астана',
    categories: ['Техника', 'Гаджеттер', 'Авто UGC'],
    level: 195,
    rating: 4.7,
    reviewsCount: 28,
    totalEarnings: 940000,
    salesCount: 110,
    completedOrdersCount: 36,
    points: 120,
    archetype: 'Сенімді',
    questionnaire: { archetype: 'Сенімді', speakingStyle: 'Сенімді, жылдам, еркекше тіке айтатын', targetAudience: 'Жігіттер және авто-әуесқойлар', toneFocus: 'Кепілдік пен нәтиже, сапа' },
    bio: 'Гаджеттер мен көлік құралдарына шынайы ерлерше краш-тест пен шолу жасаймын.',
    verified: true,
    status: 'active',
    socialMedia: { instagram: { username: '@erzhan_tech', link: 'https://instagram.com' }, tiktok: { username: '@erzhan.gadget', link: 'https://tiktok.com' } },
    portfolio: []
  },
  {
    id: 'creator-4',
    name: 'Мадина Омар',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    city: 'Ақтөбе',
    categories: ['Ана мен бала', 'Үй жайлылығы', 'Тағам'],
    level: 310,
    rating: 5.0,
    reviewsCount: 52,
    totalEarnings: 1840000,
    salesCount: 215,
    completedOrdersCount: 63,
    points: 180,
    archetype: 'Дос',
    questionnaire: { archetype: 'Дос', speakingStyle: 'Жылы, мейірімді, аналық қамқорлықпен', targetAudience: 'Аналар, үй шаруасындағы келіншектер', toneFocus: 'Шынайы жеке тәжірибе, балаға пайдасы' },
    bio: 'Аналарға арналған өнімдердің #1 UGC креаторы. 2 баланың анасы.',
    verified: true,
    status: 'active',
    socialMedia: { instagram: { username: '@madina_moms', link: 'https://instagram.com' }, tiktok: { username: '@madina.ugc', link: 'https://tiktok.com' } },
    portfolio: []
  }
];

export const seedCampaigns = [
  {
    id: 'camp-ugc-expert',
    companyId: 'comp-ugc-expert',
    companyName: 'UGC EXPERT',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    title: 'UGC Эксперт жобасы',
    category: 'Жоба & Білім',
    commission: 4000,
    duration: '15–30 сек',
    platform: 'Барлығы',
    deadline: '31.12.2026',
    status: 'active',
    requirements: [
      'Өз тәжірибеңізбен немесе UGC Expert мүмкіндіктерімен шынайы бөлісу',
      'AI Сценарий студиясынан дайын мәтінді алып, өз образыңызда түсіру',
      'Профиль сипаттамасына немесе бекітілген пікірге реферал сілтемеңізді қою',
      'Әрбір сатылым үшін 4 000 ₸ лезде жеке әмияныңызға түседі'
    ],
    product: {
      name: 'UGC Expert Бағдарламасы',
      photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      description: 'Қатысушыларға арналған ресми UGC Expert жобасы. Әрбір тіркелген жаңа қатысушы үшін кепілді 4 000 ₸ комиссия табыңыз!',
      price: 19900,
      usp: 'Қазақстандағы ең үздік UGC қауымдастығы, дайын AI сценарийлер және әр сатылымнан 4 000 ₸ таза пайда',
      targetAudience: 'Қосымша табыс іздеген жастар, студенттер, қыз-келіншектер, контентмейкерлер',
      offer: 'Тіркелгендерге 150+ дайын сценарийлер мен B-roll шаблондары тегін сыйлыққа!',
      ctaText: 'UGC Креатор болып табыс тапқың келсе, профильдегі сілтемеге өт!'
    }
  },
  {
    id: 'camp-1',
    companyId: 'comp-1',
    companyName: 'Арықтау жобасы',
    companyLogo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=80',
    title: 'Диет-детокс кешені',
    category: 'Денсаулық',
    commission: 5000,
    duration: '15–30 сек',
    platform: 'TikTok',
    deadline: '30.09.2026',
    status: 'active',
    requirements: [
      'Табиғи жарықта түсіру (күндізгі уақытта)',
      'Сөйлеу тілі таза, сенімді қазақша болуы тиіс',
      'Өнімнің қорабы мен құтысын міндетті түрде нақты көрсету',
      'Бетіңіз толық көрінуі және табиғи эмоция болуы шарт',
      'Хэштегтер мен жеке реферал сілтемені қосу'
    ],
    product: {
      name: 'SlimFit Detox Tea',
      photo: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80',
      description: 'Табиғи шөптерден жасалған таза детокс шай. Ағзадағы артық токсиндер мен суды шығарады.',
      price: 14990,
      usp: '100% табиғи құрам, қантсыз, 7 күнде жеңілдік сезімі',
      targetAudience: '20-45 жас аралығындағы әйелдер мен қыздар',
      offer: '2 қорап алғанға арнайы термокружка сыйлыққа!',
      ctaText: 'Төмендегі жеке сілтемеге өтіп, жеңілдікпен тапсырыс беріңіз!'
    }
  },
  {
    id: 'camp-2',
    companyId: 'comp-2',
    companyName: 'GlowSkin',
    companyLogo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80',
    title: 'Премиум корей косметикасы',
    category: 'Косметика',
    commission: 15000,
    duration: '15–30 сек',
    platform: 'Instagram',
    deadline: '15.10.2026',
    status: 'active',
    requirements: [
      'Бетті жуу немесе сарысуды жағу процесін жақыннан (Macro) көрсету',
      'Терінің жарқыраған түрін табиғи жарықта түсіру',
      'Шынайы пайдалану тәжірибеңізді бөлісу'
    ],
    product: {
      name: 'GlowSkin Centella Serum & Cleanser',
      photo: 'https://images.unsplash.com/photo-1608248597359-59828557e1d5?w=600&auto=format&fit=crop&q=80',
      description: 'Азиялық центелла негізіндегі емдік сарысу. Бет терісін терең ылғалдандырады.',
      price: 28500,
      usp: 'Кореялық сертификатталған сапа',
      targetAudience: '18-35 жастағы қыз-келіншектер',
      offer: 'Тегін жеткізу + тонер сыйлыққа',
      ctaText: 'Профильдегі сілтеме арқылы промокодпен алып үлгеріңіз!'
    }
  }
];

export const seedOrders = [
  {
    id: 'order-1',
    campaignId: 'camp-1',
    creatorId: 'creator-1',
    companyName: 'Арықтау жобасы',
    companyLogo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=80',
    productName: 'SlimFit Detox Tea',
    productPhoto: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80',
    commission: 5000,
    referralCode: 'AIZHAN-SLIM',
    referralLink: 'https://ugcexpert.kz/ref/AIZHAN-SLIM',
    clicks: 1420,
    ordersCount: 28,
    salesVolume: 419720,
    earnings: 140000,
    status: 'active',
    submittedVideoUrl: 'https://vt.tiktok.com/ZS2xX891q/',
    submittedAt: '12.08.2026',
    reviewComment: 'Видео мақұлданды! Өте жақсы нәтиже көрсетуде.',
    approvedAt: '13.08.2026'
  },
  {
    id: 'order-2',
    campaignId: 'camp-2',
    creatorId: 'creator-1',
    companyName: 'GlowSkin',
    companyLogo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80',
    productName: 'Centella Serum',
    productPhoto: 'https://images.unsplash.com/photo-1608248597359-59828557e1d5?w=600&auto=format&fit=crop&q=80',
    commission: 15000,
    referralCode: 'AIZHAN-GLOW',
    referralLink: 'https://ugcexpert.kz/ref/AIZHAN-GLOW',
    clicks: 890,
    ordersCount: 14,
    salesVolume: 399000,
    earnings: 210000,
    status: 'active',
    submittedVideoUrl: 'https://instagram.com/reel/C89xYz1q/',
    submittedAt: '20.08.2026',
    reviewComment: 'Эстетикасы керемет, сатылым жақсы жүріп жатыр.',
    approvedAt: '21.08.2026'
  }
];

export const seedLessons = [
  {
    id: 1,
    number: 1,
    title: 'Кедейлік жібін үзу',
    subtitle: 'Mindset және ақшаға көзқарас',
    description: 'Қаржылық блоктарды жою, өзіңді төмен бағалау синдромынан арылу және үлкен табыс табуға психологиялық дайындық.',
    videoThumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    videoDuration: '18 мин',
    isCompleted: true,
    isLocked: false,
    score: 100,
    keyPoints: [
      'Ақша табу қиын деген стереотипті жою',
      'UGC арқылы айына 1 000 000+ ₸ табу жол картасы',
      'Өз құныңды білу және компаниялармен келіссөз жүргізу'
    ],
    practicalTask: 'Өзіңіздің қаржылық мақсатыңызды дәптерге жазып, армандар тақтасын (Vision Board) жасаңыз.',
    quiz: [
      {
        question: 'UGC креатордың табысын арттыратын басты фактор қандай?',
        options: ['Қымбат камера сатып алу', 'Сатылым әкелетін шынайы контент жасау', 'Көп жазылушы жинау', 'Тек трендтерді қайталау'],
        correctIndex: 1,
        explanation: 'Компанияларға жазылушы емес, олардың өнімін сата алатын сенімді контент маңызды.'
      }
    ]
  },
  {
    id: 2,
    number: 2,
    title: 'UGC негізі',
    subtitle: 'UGC деген не, нарық қалай жұмыс істейді',
    description: 'User Generated Content ұғымы, дәстүрлі жарнамадан айырмашылығы және Қазақстандағы 2026 жылғы үлкен трендтер.',
    videoThumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
    videoDuration: '24 мин',
    isCompleted: true,
    isLocked: false,
    score: 95,
    keyPoints: [
      'UGC vs Инфлюенсер жарнамасы',
      'E-commerce брендтері неге креаторларды іздейді?',
      'Affiliate комиссия және фикс төлем жүйесі'
    ],
    practicalTask: 'Өзіңізге ұнайтын 3 өнімнің UGC стиліндегі видеосын талдап, скриншоттарын жүктеңіз.',
    quiz: [
      {
        question: 'UGC видеоның классикалық ұзақтығы қанша болуы керек?',
        options: ['5-10 минут', '15-30 секунд', '1 сағат', '3-5 секунд'],
        correctIndex: 1,
        explanation: 'TikTok пен Reels алгоритмдерінде 15-30 секундтық видео ең жоғары retention көрсетеді.'
      }
    ]
  },
  {
    id: 3,
    number: 3,
    title: 'Камера алдында сөйлеу',
    subtitle: 'Дауыс, эмоция, мимика, табиғилық',
    description: 'Камера алдындағы қорқынышты жеңу, табиғи сөйлеу темпі, дауыс дикциясы және көз контактісін сақтау құпиялары.',
    videoThumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    videoDuration: '29 мин',
    isCompleted: true,
    isLocked: false,
    score: 90,
    keyPoints: [
      'Камераның объективіне досқа қарағандай қарау',
      'Дауыс ырғағы (интонация) арқылы сенім ұялату',
      'Жасанды мақтаудан қашу, шынайы эмоция көрсету'
    ],
    practicalTask: 'Камераға қарап 15 секунд бойы кез келген зат туралы табиғи қазақ тілінде сөйлеп жаттығыңыз.',
    quiz: [
      {
        question: 'Сөйлеу кезінде қайда қарау керек?',
        options: ['Телефон экранындағы өз бейнеңізге', 'Камераның объективіне (линзасына)', 'Жан-жаққа', 'Еденге'],
        correctIndex: 1,
        explanation: 'Линзаға қараған кезде көрермен сіз оның көзіне тікелей қарап тұрғандай сезінеді.'
      }
    ]
  },
  {
    id: 4,
    number: 4,
    title: 'Сценарий',
    subtitle: 'Hook → Problem → Solution → Proof → CTA',
    description: 'Миллиондық сатылым әкелетін 5 қадамдық алтын UGC формуласы. Сценарийді AI арқылы тез генерациялау.',
    videoThumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    videoDuration: '32 мин',
    isCompleted: true,
    isLocked: false,
    score: 100,
    keyPoints: [
      'Stop-scrolling Hook: алғашқы 3 секундты ұтып алу',
      'Problem & Agitation: аудиторияның ауырсыну нүктесі',
      'Solution & Proof: өнімнің нақты нәтижесін дәлелдеу',
      'CTA (Call To Action): сілтемеге нақты бағыттау'
    ],
    practicalTask: 'UGC EXPERT ішіндегі AI Сценарист құралын қолданып, 1 өнімге сценарий дайындаңыз.',
    quiz: [
      {
        question: 'Hook-тың басты міндеті не?',
        options: ['Өнімнің барлық сипаттамасын айтып үлгеру', 'Көрерменнің назарын ұстап, видеоны өткізіп жібермеуіне мәжбүрлеу', 'Компанияның логотипін үлкейтіп көрсету', 'Музыканы қатты қою'],
        correctIndex: 1,
        explanation: 'Hook көрерменнің назарын аударып, лентаны айналдыруды тоқтату үшін қажет.'
      }
    ]
  },
  {
    id: 5,
    number: 5,
    title: 'Видео түсіру',
    subtitle: 'Жарық, кадр, композиция, B-roll',
    description: 'Кәсіби жарық орнату, ракурс таңдау, табиғи күн сәулесі, Macro түсірілім және динамикалық B-roll кадрлар алу.',
    videoThumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80',
    videoDuration: '38 мин',
    isCompleted: false,
    isLocked: false,
    keyPoints: [
      'Үйде терезе жарығын 100% тиімді пайдалану',
      'B-roll түсіру: текстура, пайдалану сәті, қорап ашу',
      'Кадр тазалығы және фонның эстетикасы'
    ],
    practicalTask: 'Үйдегі бір өнімнің 5 түрлі ракурстағы B-roll кадрын түсіріп көріңіз.',
    quiz: [
      {
        question: 'B-roll дегеніміз не?',
        options: ['Негізгі сөйлеу мәтіні', 'Сөзді бейнелейтін қосымша визуалды кадрлар мен қимылдар', 'Видеоның соңындағы титрлар', 'Камераның батареясы'],
        correctIndex: 1,
        explanation: 'B-roll - өнімнің қолданылуын, бөлшектерін көрсететін динамикалық визуалды кадрлар.'
      }
    ]
  }
];

async function main() {
  console.log('🌱 Starting Prisma SQLite database seeding...');

  // 1. Seed Main Creator with nested Goal and Wallet
  await prisma.creator.upsert({
    where: { id: seedCreatorProfile.id },
    update: {},
    create: {
      id: seedCreatorProfile.id,
      name: seedCreatorProfile.name,
      avatar: seedCreatorProfile.avatar,
      city: seedCreatorProfile.city,
      categories: JSON.stringify(seedCreatorProfile.categories),
      level: seedCreatorProfile.level,
      rating: seedCreatorProfile.rating,
      reviewsCount: seedCreatorProfile.reviewsCount,
      totalEarnings: seedCreatorProfile.totalEarnings,
      salesCount: seedCreatorProfile.salesCount,
      completedOrdersCount: seedCreatorProfile.completedOrdersCount,
      points: seedCreatorProfile.points,
      archetype: seedCreatorProfile.archetype,
      questionnaire: JSON.stringify(seedCreatorProfile.questionnaire),
      bio: seedCreatorProfile.bio,
      verified: seedCreatorProfile.verified,
      status: seedCreatorProfile.status,
      socialMedia: JSON.stringify(seedCreatorProfile.socialMedia),
      portfolio: JSON.stringify(seedCreatorProfile.portfolio),
      goal: {
        create: {
          id: seedCreatorProfile.goal.id,
          title: seedCreatorProfile.goal.title,
          targetAmount: seedCreatorProfile.goal.targetAmount,
          collectedAmount: seedCreatorProfile.goal.collectedAmount,
          targetDate: seedCreatorProfile.goal.targetDate,
          category: seedCreatorProfile.goal.category,
          image: seedCreatorProfile.goal.image,
        },
      },
      wallet: {
        create: {
          balance: seedCreatorProfile.wallet.balance,
          pending: seedCreatorProfile.wallet.pending,
          totalWithdrawn: seedCreatorProfile.wallet.totalWithdrawn,
          transactions: {
            create: seedCreatorProfile.wallet.transactions.map((tx) => ({
              id: tx.id,
              title: tx.title,
              amount: tx.amount,
              type: tx.type,
              date: tx.date,
              status: tx.status,
              paymentMethod: tx.paymentMethod,
              accountNumber: tx.accountNumber,
            })),
          },
        },
      },
    },
  });
  console.log(`✅ Seeded Main Creator: ${seedCreatorProfile.name} (${seedCreatorProfile.id})`);

  // 2. Seed other creators
  for (const other of seedCommunityCreators) {
    await prisma.creator.upsert({
      where: { id: other.id },
      update: {},
      create: {
        id: other.id,
        name: other.name,
        avatar: other.avatar,
        city: other.city,
        categories: JSON.stringify(other.categories),
        level: other.level,
        rating: other.rating,
        reviewsCount: other.reviewsCount,
        totalEarnings: other.totalEarnings,
        salesCount: other.salesCount,
        completedOrdersCount: other.completedOrdersCount,
        points: other.points,
        archetype: other.archetype,
        questionnaire: JSON.stringify(other.questionnaire),
        bio: other.bio,
        verified: other.verified,
        status: other.status,
        socialMedia: JSON.stringify(other.socialMedia),
        portfolio: JSON.stringify(other.portfolio),
      },
    });
    console.log(`✅ Seeded Community Creator: ${other.name}`);
  }

  // 3. Seed Campaigns
  for (const camp of seedCampaigns) {
    await prisma.campaign.upsert({
      where: { id: camp.id },
      update: {},
      create: {
        id: camp.id,
        companyId: camp.companyId,
        companyName: camp.companyName,
        companyLogo: camp.companyLogo,
        title: camp.title,
        category: camp.category,
        commission: camp.commission,
        duration: camp.duration,
        platform: camp.platform,
        deadline: camp.deadline,
        status: camp.status || 'active',
        requirements: JSON.stringify(camp.requirements || []),
        product: JSON.stringify(camp.product || {}),
      },
    });
    console.log(`✅ Seeded Campaign: ${camp.companyName} - ${camp.title}`);
  }

  // 4. Seed Orders
  for (const ord of seedOrders) {
    await prisma.order.upsert({
      where: { id: ord.id },
      update: {},
      create: {
        id: ord.id,
        campaignId: ord.campaignId,
        creatorId: ord.creatorId,
        companyName: ord.companyName,
        companyLogo: ord.companyLogo,
        productName: ord.productName,
        productPhoto: ord.productPhoto,
        commission: ord.commission,
        referralCode: ord.referralCode,
        referralLink: ord.referralLink,
        clicks: ord.clicks,
        ordersCount: ord.ordersCount,
        salesVolume: ord.salesVolume,
        earnings: ord.earnings,
        status: ord.status,
        submittedVideoUrl: ord.submittedVideoUrl,
        submittedAt: ord.submittedAt,
        reviewComment: ord.reviewComment,
        approvedAt: ord.approvedAt,
      },
    });
    console.log(`✅ Seeded Order: ${ord.productName} (${ord.id})`);
  }

  // 5. Seed Lessons
  for (const les of seedLessons) {
    await prisma.lesson.upsert({
      where: { id: les.id },
      update: {},
      create: {
        id: les.id,
        number: les.number,
        title: les.title,
        subtitle: les.subtitle,
        description: les.description,
        videoThumbnail: les.videoThumbnail,
        videoDuration: les.videoDuration,
        isCompleted: les.isCompleted,
        isLocked: les.isLocked,
        score: les.score,
        keyPoints: JSON.stringify(les.keyPoints || []),
        practicalTask: les.practicalTask,
        quiz: JSON.stringify(les.quiz || []),
      },
    });
    console.log(`✅ Seeded Lesson: ${les.title}`);
  }

  console.log('🎉 SQLite database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during Prisma seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
