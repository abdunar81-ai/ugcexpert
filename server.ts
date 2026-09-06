import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { 
  initDatabase, 
  getDbStatus, 
  getCreatorsList, 
  getActiveCreatorProfile,
  updateCreatorProfileRecord,
  updateGoalRecord,
  getCampaignsList, 
  createCampaignRecord, 
  getOrdersList, 
  submitOrderVideoUrl, 
  getLessonsList,
  completeLessonModule,
  requestWithdrawalRecord
} from "./server/db.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to generate contextual archetype-based UGC script and post caption
function createFallbackScript(creator: any, brief: any) {
  const archetype = creator?.archetype || 'Дос';
  const creatorFirstName = (creator?.name || 'Айжан').split(' ')[0].toUpperCase();
  const prodName = brief?.productName || 'өнімді';
  const compName = brief?.companyName || 'компаниясы';
  const usp = brief?.usp || 'сапалы әрі жылдам нәтиже беретін қасиеті';
  const category = brief?.category || 'күнделікті';

  let authorScript = '';
  let postCaption = '';

  switch (archetype) {
    case 'Данышпан':
      authorScript = `Көпшілік ${category} таңдауда бір үлкен қателік жібереді: сыртқы жарнамаға алданып, нақты құрамына мән бермейді. 

Мен ${compName} ұсынған ${prodName} өнімін арнайы зерттеп, тексеріп көрдім. Мұндағы ең басты артықшылық — ${usp}. 

Құрамы мен жасалу технологиясы шынымен де ойластырылған: ол тек уақытша бүркемелемейді, нақты нәтижеге жұмыс істейді. Егер сізге сапасы ғылыми әрі практикалық тұрғыда дәлелденген өнім керек болса, бұл — ең ұтымды шешім. Менің промокодымды қолданып, жеңілдікпен алыңыз!`;
      postCaption = `Неге ${prodName} басқа баламалардан әлдеқайда сапалы? 💡

Талдау нәтижесі: негізгі формуласы ${usp} бойынша ерекшеленеді. 
🎯 Менің жеке "${creatorFirstName}" промокодыммен тапсырыс беріп, арнайы жеңілдікке ие болыңыз.
🔗 Сілтеме профильде!

#${category.replace(/\s+/g, '')} #UGCKazakhstan #${prodName.split(' ')[0]} #СапалыӨнім #СарапшыКеңесі`;
      break;

    case 'Жұмбақ':
      authorScript = `Шыныңызды айтыңызшы... Сіз де осы құпияны білмей жүрсіз бе? Неге соңғы кездері барлық блогерлер бір ғана құралды жарыса мақтап жатыр?

Мен шыдай алмай, ${compName} шығарған ${prodName} өнімін өзіме тапсырыс бердім. Алғашқыда күмәнданғаным рас... Бірақ нәтижесін көргенде, бұны неге сонша құпия ұстап келгендерін түсіндім! 

Мұның бүкіл сыры — ${usp}. Егер сіз де өзіңізді жаңа деңгейде сезінгіңіз келсе, төмендегі сілтемені басып, құпия промокодты пайдаланыңыз. Әйтпесе кеш қаласыз!`;
      postCaption = `Бұл туралы неге бәрі жасырын айтып жүр? 🤫✨

${compName} ұсынған ${prodName} жайлы шындық осында. 
🔥 Сыры — ${usp}. 
Профильдегі сілтемеге өтіп, "${creatorFirstName}" промокодымен арнайы бонусқа ие болыңыз!

#UGCKazakhstan #Құпия #TrendKazakhstan #${prodName.split(' ')[0]} #Эстетика`;
      break;

    case 'Сенімді':
      authorScript = `Уақытыңызды босқа кетіріп, нәтиже бермейтін нәрселерге ақша шашпаңыз. Егер сізге нақты әрі кепілдендірілген нәтиже керек болса, бірден ${compName} жасаған ${prodName} өнімін алыңыз.

Мен бұны жайдан-жай айтып тұрған жоқпын: ${usp}. Бір аптаның ішінде айырмашылықты өзіңіз көресіз. 

Сөздің қысқасы — өз өміріңізге тек ең жақсысын таңдаңыз. Профиль басындағы сілтемеге өтіп, менің "${creatorFirstName}" промокодыммен дәл қазір тапсырыс беріңіз!`;
      postCaption = `Нақты нәтиже керек пе? Сонда мына шешім сіз үшін ⚡

${prodName} — сыналған сапа және ${usp}.
🎁 Тапсырыс беру кезінде "${creatorFirstName}" промокодын енгізіп, жеңілдік пен сыйлық алыңыз!
📲 Сілтеме профиль сипаттамасында.

#Нәтиже #Сапа #UGCKazakhstan #${prodName.split(' ')[0]} #КәсібиТаңдау`;
      break;

    case 'Дос':
    default:
      authorScript = `Қыздар, достар, сәлем! Өзім байқап көрген керемет жаңалығыммен бөліспесем болмайды! 

Соңғы күндері ${compName} компаниясының ${prodName} өнімін үзбей қолданып жүрмін. Маған ерекше ұнағаны — ${usp}. Күнделікті өмірде нағыз көмекшім болып кетті, өзімді сондай керемет әрі сергек сезінемін!

Шынайы досыңыз ретінде кеңес беремін: өзіңіз де байқап көріңіз, өкінбейсіз. Менің "${creatorFirstName}" промокодыммен жеңілдікпен алып үлгеріңіз, сілтеме профилімде тұр!`;
      postCaption = `Жақын құрбым ретінде сіздерге шын кеңесім! 💛✨

${prodName} менің күнделікті сүйіктіме айналды. Себебі — ${usp}.
🛍️ Профильдегі сілтеме арқылы менің "${creatorFirstName}" промокодыммен жеңілдікпен алып үлгеріңіз!

#ДосКеңесі #UGCKazakhstan #${prodName.split(' ')[0]} #Lifestyle #ШынайыПікір`;
      break;
  }

  return {
    authorScript,
    postCaption,
    archetype,
    hook: authorScript.split('\n')[0] || '',
    speakingScript: authorScript,
    bRoll: [],
    cta: `Сілтеме профильде! Промокод: ${creatorFirstName}`,
    tips: []
  };
}

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Database status & mode
app.get("/api/status", (req, res) => {
  const status = getDbStatus();
  res.json({
    status: "ok",
    database: status,
    timestamp: new Date().toISOString()
  });
});

// API: Initialize or reconnect database
app.post("/api/db/init", async (req, res) => {
  const result = await initDatabase();
  res.json(result);
});

// API: Get creators list
app.get("/api/creators", async (req, res) => {
  const creators = await getCreatorsList();
  res.json({ success: true, creators });
});

// API: Get current active creator profile
app.get("/api/creator/profile", async (req, res) => {
  const profile = await getActiveCreatorProfile();
  res.json({ success: true, profile });
});

// API: Update creator profile
app.put("/api/creator/profile", async (req, res) => {
  const updates = req.body || {};
  const updated = await updateCreatorProfileRecord(updates);
  res.json({ success: true, profile: updated });
});

// API: Update creator goal
app.put("/api/creator/goal", async (req, res) => {
  const goal = req.body;
  if (!goal) return res.status(400).json({ error: "Goal required" });
  const updated = await updateGoalRecord(goal);
  res.json({ success: true, goal: updated });
});

// API: Get campaigns
app.get("/api/campaigns", async (req, res) => {
  const campaigns = await getCampaignsList();
  res.json({ success: true, campaigns });
});

// API: Create a new campaign
app.post("/api/campaigns", async (req, res) => {
  const newCampaign = req.body;
  if (!newCampaign || !newCampaign.id) {
    return res.status(400).json({ error: "Invalid campaign payload" });
  }
  const created = await createCampaignRecord(newCampaign);
  res.status(201).json({ success: true, campaign: created });
});

// API: Get orders
app.get("/api/orders", async (req, res) => {
  const orders = await getOrdersList();
  res.json({ success: true, orders });
});

// API: Submit video for an order
app.post("/api/orders/:id/submit", async (req, res) => {
  const { id } = req.params;
  const { videoUrl } = req.body || {};
  if (!videoUrl) {
    return res.status(400).json({ error: "videoUrl is required" });
  }
  const updatedOrder = await submitOrderVideoUrl(id, videoUrl);
  res.json({ success: true, order: updatedOrder });
});

// API: Get lessons
app.get("/api/lessons", async (req, res) => {
  const lessons = await getLessonsList();
  res.json({ success: true, lessons });
});

// API: Complete lesson module
app.post("/api/lessons/:id/complete", async (req, res) => {
  const moduleId = parseInt(req.params.id, 10);
  const result = await completeLessonModule(moduleId);
  res.json({ 
    success: true, 
    lessons: result.lessons, 
    newLevel: result.newLevel 
  });
});

// API: Get wallet
app.get("/api/wallet", async (req, res) => {
  const profile = await getActiveCreatorProfile();
  res.json({ success: true, wallet: profile.wallet });
});

// API: Request withdrawal
app.post("/api/wallet/withdraw", async (req, res) => {
  const { amount, method, account } = req.body || {};
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Valid amount required" });
  }
  const result = await requestWithdrawalRecord(Number(amount), method, account);
  res.json({ 
    success: true, 
    wallet: result.wallet, 
    transaction: result.transaction 
  });
});

// API: Generate AI UGC Script in Kazakh with Creator Archetype
app.post("/api/gemini/script", async (req, res) => {
  const { creator, brief } = req.body || {};
  const archetype = creator?.archetype || 'Дос';

  try {
    const ai = getGeminiClient();

    if (!ai) {
      const defaultScript = createFallbackScript(creator, brief);
      return res.json({ success: true, script: defaultScript, isFallback: true });
    }

    const archetypeDescriptions: Record<string, string> = {
      'Данышпан': 'Данышпан (Эксперт, сарапшы). Терең талдау жасайды, өнімнің құрамы мен механизмін логикалық және ғылыми тұрғыдан нанымды түсіндіреді. Сабырлы, нақты, дәлелді тонда сөйлейді.',
      'Жұмбақ': 'Жұмбақ (Интригант, қызықтырушы). Басынан бастап интрига сақтайды, "Бұл туралы неге ешкім айтпайды?", "Осы құпияны білгенде таңғалдым..." сияқты тылсым тартымдылықпен көрерменді экранға байлайды.',
      'Сенімді': 'Сенімді (Көшбасшы, батыл). Өзіне 100% сенімді, нақты, батыл сөйлейді. "Босқа уақыт өткізбеңіз, мынау нақты жұмыс істейді" деп кепілдікпен әрекетке шақырады.',
      'Дос': 'Дос (Жақын құрбы, шынайы дос). Өте жылы, ашық, күлімсіреп, эмоциялы, жақын досына шәй үстінде шынайы кеңес бергендей сөйлейді.'
    };

    const prompt = `Сіз - қазақша TikTok және Instagram Reels UGC видеоларының сатылым әкелетін кәсіби сценарисіз.

КРЕАТОРДЫҢ ТАҢДАҒАН ОБРАЗЫ (АРХЕТИПІ):
👉 Образ: "${archetype}" — ${archetypeDescriptions[archetype] || archetypeDescriptions['Дос']}

КРЕАТОР ТУРАЛЫ:
- Аты: ${creator?.name || 'Айжан'}
- Қаласы: ${creator?.city || 'Алматы'}
- Категориясы: ${creator?.categories?.join(', ') || 'Beauty, Lifestyle'}
- Қосымша стилі: ${creator?.questionnaire?.speakingStyle || 'Табиғи, жанды'}

КОМПАНИЯ ЖӘНЕ ӨНІМ БРИФІ:
- Компания: ${brief?.companyName || 'Компания'}
- Өнім атауы: ${brief?.productName || 'Өнім'}
- Категория: ${brief?.category || 'Beauty'}
- Сипаттамасы: ${brief?.productDescription || 'Сапалы өнім'}
- Бағасы: ${brief?.productPrice || '10000 ₸'}
- Негізгі артықшылығы (USP): ${brief?.usp || 'Табиғи, сапалы және жылдам нәтиже'}
- Талаптар: ${brief?.requirements?.join(', ') || 'Қазақша, өнімді көрсету, табиғи сөйлеу'}

ТАЛАПТАР:
1. Сценарий дәл осы "${archetype}" образына 100% сәйкес келуі шарт.
2. authorScript өрісінде: ТЕК автордың камераға қарап айтатын дауыстық мәтіні болуы керек (ешқандай жақшадағы түсініктемелер, режиссерлік кадр нұсқаулары жазылмасын, тек таза сөйлеу мәтіні абзацтармен бөлініп жазылсын).
3. postCaption өрісінде: Видеоның астына (Instagram/TikTok описаниесіне) қойылатын дайын қысқа мәтін, промокодты пайдалану шақыруы және 3-5 хэштег болсын (автор оны бірден көшіріп алып қоя алатындай).

МЫНА ҚҰРЫЛЫМДЫ JSON ТҮРІНДЕ ҚАЙТАРЫҢЫЗ:
{
  "authorScript": "Автордың айтатын толық табиғи қазақша сөйлеу мәтіні...",
  "postCaption": "Видео астына жазылатын сипаттама, промокод және хэштегтер..."
}`;

    const config = {
      systemInstruction: `Сіз кәсіби қазақша UGC контент сценарисіз. Мәтін таза қазақша, заманауи және нақты таңдалған образға (${archetype}) сәйкес болуы керек. Тек JSON форматында жауап беріңіз.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          authorScript: { type: Type.STRING, description: "Тек автордың айтатын мәтіні" },
          postCaption: { type: Type.STRING, description: "Посттың сипаттамасына (описанияға) арналған мәтін" }
        },
        required: ["authorScript", "postCaption"]
      }
    };

    // Resilient fallback order: gemini-3.8-flash -> gemini-3.1-flash-lite -> gemini-flash-latest
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let response: any = null;

    for (let i = 0; i < candidateModels.length; i++) {
      const modelName = candidateModels[i];
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config
        });
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        const isTemporaryBusy = err?.status === 503 || err?.code === 503 || `${err?.message || err}`.includes("503");
        if (i < candidateModels.length - 1) {
          console.log(`Model ${modelName} unavailable, switching to backup model ${candidateModels[i + 1]}...`);
          if (isTemporaryBusy) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }
    }

    if (response && response.text) {
      try {
        const scriptJson = JSON.parse(response.text.trim());
        if (scriptJson.authorScript && scriptJson.postCaption) {
          return res.json({
            success: true,
            script: {
              authorScript: scriptJson.authorScript,
              postCaption: scriptJson.postCaption,
              archetype,
              hook: scriptJson.authorScript.split('\n')[0] || '',
              speakingScript: scriptJson.authorScript,
              bRoll: [],
              cta: `Сілтеме профильде! Промокод: ${(creator?.name || 'Айжан').split(' ')[0].toUpperCase()}`,
              tips: []
            }
          });
        }
      } catch {
        // Fall through to fallback script if JSON parse fails
      }
    }

    const fallbackScript = createFallbackScript(creator, brief);
    return res.json({ success: true, script: fallbackScript, isFallback: true });
  } catch {
    console.log("AI Script generation completed with contextual archetype fallback");
    const fallbackScript = createFallbackScript(creator, brief);
    return res.json({
      success: true,
      script: fallbackScript,
      isFallback: true
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  // Attempt PostgreSQL connection if DATABASE_URL is configured
  initDatabase().then((res) => {
    if (res.connected) {
      console.log(`[DB] Database connected: ${res.message}`);
    } else {
      console.log(`[DB] Standby mode: ${res.message}`);
    }
  }).catch((err) => {
    console.warn(`[DB] Standby init error:`, err);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UGC EXPERT Server running on http://localhost:${PORT}`);
  });
}

startServer();
