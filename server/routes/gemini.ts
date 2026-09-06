import { Router } from "express";
import { GoogleGenAI, Type } from "@google/genai";

export const geminiRouter = Router();

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

geminiRouter.post("/script", async (req, res) => {
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
