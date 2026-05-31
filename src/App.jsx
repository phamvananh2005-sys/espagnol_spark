import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  Upload, User, Volume2, Volume1, Download, Star, Award, MessageSquare,
  RefreshCcw, CheckCircle2, Mic, Square, ChevronRight,
  BookOpen, MessageCircle, Eye, EyeOff, ShieldCheck, Sparkles, BookA,
  Lock, LogOut, Plus, Save, X, Info, Trash2, Activity, Globe
} from 'lucide-react';
import { supabase } from './supabase';

const normalizeDbItem = (item) => ({
  ...item,
  isPublished: item.isPublished ?? item.ispublished
});

const toDbItem = ({ isPublished, ispublished, ...item }) => ({
  ...item,
  ispublished: isPublished ?? ispublished
});

// --- HỆ THỐNG ĐA NGÔN NGỮ (i18n) ---
const dict = {
  vi: {
    welcome: "Chào mừng đến với Espagnol Spark",
    subtitle: "Hệ thống luyện nói và phát âm tiếng Tây Ban Nha thông minh tích hợp AI.",
    step1: "1. Nhập tên của bạn để bắt đầu:",
    namePlaceholder: "Ví dụ: Nguyễn Văn A...",
    received: "Đã nhận",
    step2: "2. Chọn chế độ luyện tập:",
    shadowingTitle: "Shadowing",
    shadowingDesc: "Bắt chước lại theo từ vựng hoặc câu mẫu tiếng Tây Ban Nha. AI đánh giá phát âm, nhịp điệu và độ tự nhiên.",
    topicTitle: "Nói theo chủ đề",
    topicDesc: "Thuyết trình theo chủ đề. AI đánh giá độ trôi chảy, bám sát nội dung, từ vựng và ngữ pháp tiếng Tây Ban Nha.",
    freeTitle: "Nói tự do",
    freeDesc: "Thu âm tự do bằng tiếng Tây Ban Nha. AI đánh giá độ lưu loát, mạch lạc, phát triển ý và tính tự nhiên.",
    adminLink: "Dành cho Quản trị viên",
    adminMode: "QUẢN TRỊ",
    logout: "Đăng xuất",
    changeMode: "Đổi chế độ",
    adminLoginTitle: "Đăng nhập Admin",
    passPlaceholder: "Nhập mật khẩu...",
    loginBtn: "Đăng nhập",
    backBtn: "Quay lại",
    chooseLevel: "1. Chọn cấp độ:",
    chooseType: "2. Chọn loại luyện tập:",
    vocab: "Từ vựng",
    sentence: "Câu văn",
    chooseLesson: "3. Chọn bài học:",
    noLesson: "Chưa có bài học nào cho phần này.",
    lessonItems: "Gồm {0} hạng mục",
    startPractice: "BẮT ĐẦU LUYỆN TẬP",
    completed: "Hoàn thành bài học!",
    completedDesc: "Tuyệt vời, bạn đã luyện xong bài",
    chooseOther: "Chọn bài khác",
    listenSlow: "Chậm",
    listenNormal: "Chuẩn",
    yourTurn: "Hãy thu âm trực tiếp bằng tiếng Tây Ban Nha. Nếu bạn nói tiếng Việt, tiếng Anh hoặc ngôn ngữ khác không liên quan, hệ thống sẽ nhắc bạn nói lại.",
    uploadFile: "Tải file lên",
    uploadWarn: "Hệ thống sẽ không thể nhận diện lỗi phát âm chi tiết bằng cách này.",
    recDirect: "Thu âm trực tiếp",
    recBtn: "Chấm điểm bằng giọng nói",
    stopRec: "DỪNG THU",
    recommended: "Khuyên dùng",
    aiEvaluating: "AI đang thẩm định và viết nhận xét...",
    waitMsg: "Quá trình đánh giá ngôn ngữ mất vài giây nhé!",
    grading: "AI đang phân tích tiếng Tây Ban Nha của bạn...",
    tryAgain: "Thử lại câu này",
    nextItem: "Chuyển tiếp",
    analysis: "Phân tích chi tiết từ AI:",
    selectTopic: "Chọn chủ đề thuyết trình:",
    selectTopicHolder: "-- Bấm để chọn một chủ đề --",
    reqLevel: "Yêu cầu (Cấp độ {0}):",
    hintModel: "Gợi ý bài nói mẫu:",
    uploadOrRec: "Tải lên hoặc thu âm bài nói của bạn:",
    startGrading: "Bắt đầu chấm điểm AI",
    cancel: "✕ Hủy",
    aiRecognized: "AI đã nhận diện được giọng nói của bạn.",
    gradeAnother: "Chấm bài khác",
    exportPDF: "XUẤT PHIẾU PDF",
    reportTitle: "PHIẾU ĐÁNH GIÁ KỸ NĂNG NÓI TIẾNG TÂY BAN NHA",
    analyzedBy: "Phân tích bởi Espagnol Spark Generative AI",
    student: "Học Viên",
    originalAudio: "Bản ghi âm gốc:",
    avgScore: "Điểm trung bình / 10",
    rank: "XẾP LOẠI:",
    estimatedLevel: "TRÌNH ĐỘ TƯƠNG ĐƯƠNG:",
    systemAnalysis: "Nhận xét và góp ý từ hệ thống AI:",
    forgotPwd: "Quên mật khẩu?",
    forgotPwdDesc: "Để đảm bảo bảo mật, hệ thống không tự động cấp lại mật khẩu. Vui lòng gửi email yêu cầu khôi phục mật khẩu về:",
    sendEmail: "Gửi email yêu cầu",
    cPronunciation: "Phát âm",
    cFluency: "Độ trôi chảy",
    cClarity: "Độ rõ ràng",
    cContentAccuracy: "Độ chính xác nội dung",
    cPronunRhythm: "Phát âm & Nhịp điệu",
    cTopicRelevance: "Bám sát chủ đề",
    cCompleteness: "Nội dung đủ ý",
    cGrammar: "Ngữ pháp",
    cVocabRichness: "Từ vựng phong phú",
    cNaturalness: "Độ tự nhiên",
    cVocab: "Từ vựng",
    cIdeaDev: "Khả năng phát triển ý"
  },
  en: {
    welcome: "Welcome to Espagnol Spark",
    subtitle: "Smart Spanish speaking and pronunciation training system powered by AI.",
    step1: "1. Enter your name to start:",
    namePlaceholder: "e.g. John Doe...",
    received: "Received",
    step2: "2. Select training mode:",
    shadowingTitle: "Shadowing",
    shadowingDesc: "Imitate Spanish vocabulary or sentences. Get AI feedback on pronunciation, rhythm, and naturalness.",
    topicTitle: "Topic Speaking",
    topicDesc: "Present on a topic. AI evaluates fluency, relevance, vocabulary, and Spanish grammar.",
    freeTitle: "Free Speaking",
    freeDesc: "Record freely in Spanish. AI scoring based on fluency, coherence, idea development, and naturalness.",
    adminLink: "For Administrators",
    adminMode: "ADMIN",
    logout: "Logout",
    changeMode: "Change Mode",
    adminLoginTitle: "Admin Login",
    passPlaceholder: "Enter password...",
    loginBtn: "Login",
    backBtn: "Go Back",
    chooseLevel: "1. Select Level:",
    chooseType: "2. Select Type:",
    vocab: "Vocabulary",
    sentence: "Sentences",
    chooseLesson: "3. Select Lesson:",
    noLesson: "No lessons available for this section.",
    lessonItems: "Contains {0} items",
    startPractice: "START PRACTICING",
    completed: "Lesson Completed!",
    completedDesc: "Great job, you have finished",
    chooseOther: "Choose another lesson",
    listenSlow: "Slow",
    listenNormal: "Normal",
    yourTurn: "Record directly in Spanish. If you speak Vietnamese, English, or another unrelated language, the system will ask you to try again.",
    uploadFile: "Upload File",
    uploadWarn: "System cannot provide detailed pronunciation errors via file upload.",
    recDirect: "Direct Record",
    recBtn: "Grade my speech",
    stopRec: "STOP REC",
    recommended: "Recommended",
    aiEvaluating: "AI is evaluating and generating feedback...",
    waitMsg: "Linguistic analysis takes a few seconds!",
    grading: "AI is analyzing your Spanish speech...",
    tryAgain: "Try Again",
    nextItem: "Next",
    analysis: "AI Detailed Analysis:",
    selectTopic: "Select Presentation Topic:",
    selectTopicHolder: "-- Click to select a topic --",
    reqLevel: "Requirement (Level {0}):",
    hintModel: "Suggested Model Speech:",
    uploadOrRec: "Upload or record your speech:",
    startGrading: "Start AI Grading",
    cancel: "✕ Cancel",
    aiRecognized: "AI has successfully recognized your voice.",
    gradeAnother: "Grade Another",
    exportPDF: "EXPORT PDF",
    reportTitle: "SPANISH SPEAKING SKILL ASSESSMENT",
    analyzedBy: "Analyzed by Espagnol Spark Generative AI",
    student: "Student",
    originalAudio: "Original Recording:",
    avgScore: "Average Score / 10",
    rank: "RANK:",
    estimatedLevel: "ESTIMATED LEVEL:",
    systemAnalysis: "Feedback and advice from AI Teacher:",
    forgotPwd: "Forgot password?",
    forgotPwdDesc: "For security reasons, the system does not automatically reset passwords. Please send a password recovery request to:",
    sendEmail: "Send request email",
    cPronunciation: "Pronunciation",
    cFluency: "Fluency",
    cClarity: "Clarity",
    cContentAccuracy: "Content Accuracy",
    cPronunRhythm: "Pronunciation & Rhythm",
    cTopicRelevance: "Topic Relevance",
    cCompleteness: "Completeness",
    cGrammar: "Grammar",
    cVocabRichness: "Lexical Richness",
    cNaturalness: "Naturalness",
    cVocab: "Vocabulary",
    cIdeaDev: "Idea Development"
  }
};

const LanguageContext = createContext();

// --- HELPER: chọn giọng đọc tiếng Tây Ban Nha rõ hơn cho phần nghe mẫu ---
const cleanSpanishTextForTTS = (textRaw = '') => {
  return String(textRaw || '')
    // Nếu dữ liệu cũ còn dạng [text|pronunciation] thì chỉ lấy text chính, không lấy pronunciation kiểu tiếng Nhật cũ.
    .replace(/\[([^|]+)\|([^\]]+)\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
};

const getBestSpanishVoice = () => {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices() || [];
  const spanishVoices = voices.filter((voice) => String(voice.lang || '').toLowerCase().startsWith('es'));

  const priorityNames = [
    /google.*español/i,
    /google.*spanish/i,
    /microsoft.*spanish/i,
    /microsoft.*español/i,
    /natural/i,
    /premium/i,
    /helena/i,
    /elvira/i,
    /alvaro/i,
    /jorge/i,
    /sabina/i
  ];

  for (const pattern of priorityNames) {
    const found = spanishVoices.find((voice) => pattern.test(voice.name || ''));
    if (found) return found;
  }

  return (
    spanishVoices.find((voice) => voice.lang === 'es-ES') ||
    spanishVoices.find((voice) => voice.lang === 'es-MX') ||
    spanishVoices.find((voice) => voice.lang === 'es-US') ||
    spanishVoices[0] ||
    null
  );
};

const speakSpanishModelAudio = ({ textRaw, speedMode = 'normal', level = 'A1', onStart, onEnd, lang = 'vi' }) => {
  if (!('speechSynthesis' in window)) {
    alert(lang === 'en' ? 'Your browser does not support model audio.' : 'Trình duyệt của bạn không hỗ trợ đọc âm mẫu.');
    return;
  }

  const cleanText = cleanSpanishTextForTTS(textRaw);
  if (!cleanText) return;

  const startSpeaking = () => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = getBestSpanishVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'es-ES';
    } else {
      utterance.lang = 'es-ES';
    }

    // Tốc độ cũ 0.35 làm giọng bị kéo dài, méo và khó nghe.
    // Tốc độ mới chậm vừa phải, rõ nhưng vẫn tự nhiên.
    const normalRateMap = {
      A1: 0.82,
      A2: 0.86,
      B1: 0.90,
      B2: 0.94,
      C1: 0.98,
      C2: 1.0
    };

    utterance.rate = speedMode === 'slow' ? 0.72 : (normalRateMap[String(level || 'A1').toUpperCase()] || 0.88);
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (typeof onStart === 'function') onStart();
    };

    utterance.onend = () => {
      if (typeof onEnd === 'function') onEnd();
    };

    utterance.onerror = () => {
      if (typeof onEnd === 'function') onEnd();
      alert(
        lang === 'en'
          ? 'The sample audio could not be played clearly. Please check whether your browser/computer has a Spanish voice installed.'
          : 'Không đọc được âm mẫu rõ ràng. Vui lòng kiểm tra trình duyệt/máy tính có giọng đọc tiếng Tây Ban Nha hay chưa.'
      );
    };

    window.speechSynthesis.speak(utterance);
  };

  // Một số trình duyệt load danh sách voice chậm, cần đợi onvoiceschanged.
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = startSpeaking;
  } else {
    startSpeaking();
  }
};


// --- HELPER: hiển thị văn bản tiếng Tây Ban Nha thuần, không yêu cầu pronunciation ---
function SpanishText({ text }) {
  if (!text) return null;
  return (
    <span className="leading-loose break-words inline-block max-w-full whitespace-pre-wrap">
      {text}
    </span>
  );
}

// --- MOCK DATABASE ---
// Removed initialTopics and initialShadowing, now using Supabase

export default function App() {
  const [lang, setLang] = useState('vi'); // 'vi' or 'en'
  const t = (key) => dict[lang][key] || dict['vi'][key] || key;

  const [role, setRole] = useState('user');
  const [activeMode, setActiveMode] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [isForgotPwd, setIsForgotPwd] = useState(false);

  const [dbTopics, setDbTopics] = useState([]);
  const [dbShadowing, setDbShadowing] = useState([]);

  // Lưu trữ và lấy mật khẩu Admin từ localStorage
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('espagnol_admin_pwd') || 'admin123';
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { background: white !important; }
        body * { visibility: hidden; }
        #printable-report, #printable-report * { visibility: visible; }
        #printable-report { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
        .no-print { display: none !important; }
      }
      :root {
        --esp-orange: #F26522;
        --esp-gold: #F6B817;
        --esp-navy: #10213A;
        --esp-coral: #F49A78;
      }

      /* BACKGROUND GIỐNG ẢNH MẪU:
         - Dùng một ảnh nền Tây Ban Nha đặt trong thư mục /public.
         - File cần có tên: espagnol-spark-bg.png
         - Đây là cách duy nhất để background trông chân thật, không còn kiểu vẽ vector/gradient giả. */
      .spain-bg {
        position: relative;
        min-height: 100vh;
        overflow-x: hidden;
        background: #f7c6ad;
      }

      .spanish-scene {
        position: fixed;
        inset: 64px 0 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
        background-image:
          linear-gradient(90deg, rgba(242,101,34,.08) 0%, rgba(255,255,255,.03) 44%, rgba(255,188,104,.07) 100%),
          url('/espagnol-spark-bg.png');
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
      }

      .spanish-scene::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 50% 38%, rgba(255,255,255,.10), transparent 36%),
          linear-gradient(180deg, rgba(255,255,255,.03), rgba(242,101,34,.03));
        z-index: 1;
      }

      /* Tắt toàn bộ background vector cũ để không bị sai như ảnh hiện tại */
      .photo-left,
      .photo-right,
      .scene-haze,
      .sun-disc,
      .flow-lines,
      .gaudi-mosaic,
      .soft-wave {
        display: none !important;
      }

      .glass-home-panel {
        position: relative;
        max-width: 890px;
        min-height: 575px;
        margin: 72px auto 0;
        padding: 54px 70px 42px;
        border-radius: 46px;
        background: linear-gradient(135deg, rgba(255,255,255,.72), rgba(255,255,255,.42));
        border: 1.5px solid rgba(255,255,255,.72);
        box-shadow: 0 32px 90px rgba(116,57,35,.14), inset 0 1px 0 rgba(255,255,255,.66);
        backdrop-filter: blur(16px);
      }

      .home-spark-badge {
        position: absolute;
        top: -23px;
        left: 50%;
        transform: translateX(-50%);
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 9999px;
        background: rgba(255,255,255,.90);
        box-shadow: 0 8px 18px rgba(75,42,25,.16);
        border: 1px solid rgba(255,255,255,.78);
      }

      .section-title-line {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
      }
      .section-title-line::before,
      .section-title-line::after {
        content: '';
        width: 54px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(242,101,34,.42));
      }
      .section-title-line::after {
        background: linear-gradient(90deg, rgba(242,101,34,.42), transparent);
      }
      .section-title-line span::after {
        content: '';
        display: block;
        margin: 10px auto 0;
        width: 34px;
        height: 3px;
        border-radius: 9999px;
        background: var(--esp-orange);
      }

      .mode-card-real {
        border-radius: 30px;
        padding: 32px 32px 26px;
        min-height: 250px;
        background: linear-gradient(145deg, rgba(255,255,255,.90), rgba(255,255,255,.67));
        border: 1px solid rgba(255,255,255,.78);
        box-shadow: 0 26px 55px rgba(98,54,31,.16), inset 0 1px 0 rgba(255,255,255,.72);
        backdrop-filter: blur(12px);
        transition: transform .25s ease, box-shadow .25s ease;
      }
      .mode-card-real:hover {
        transform: translateY(-7px);
        box-shadow: 0 34px 70px rgba(98,54,31,.22);
      }
      .mode-icon-real {
        width: 58px;
        height: 58px;
        border-radius: 9999px;
        display: grid;
        place-items: center;
        color: white;
        margin: 0 auto 20px;
        box-shadow: 0 12px 22px rgba(86,54,30,.17);
      }

      @media (max-width: 900px) {
        .glass-home-panel {
          margin: 34px 16px 0;
          padding: 42px 20px 28px;
          border-radius: 32px;
        }
      }

      .app-content { position: relative; z-index: 10; }    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select('*');

        if (topicsError) throw topicsError;
        setDbTopics((topicsData || []).map(item => ({
          ...item,
          isPublished: item.isPublished ?? item.ispublished
        })));

        const { data: shadowingData, error: shadowingError } = await supabase
          .from('shadowing')
          .select('*');

        if (shadowingError) throw shadowingError;
        setDbShadowing((shadowingData || []).map(item => ({
          ...item,
          isPublished: item.isPublished ?? item.ispublished
        })));
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
        alert('Lỗi khi tải dữ liệu từ cơ sở dữ liệu. Vui lòng thử lại.');
      }
    };

    fetchData();
  }, []);

  const handleAdminLogin = (password) => {
    if (password === adminPassword) { setRole('admin'); setActiveMode(null); }
    else { alert(lang === 'en' ? 'Wrong admin password!' : 'Sai mật khẩu quản trị!'); }
  };

  const handleModeSelect = (mode) => {
    if (!studentName.trim()) {
      alert(lang === 'en' ? "Please enter your name first!" : "Vui lòng nhập tên học viên trước khi bắt đầu!");
      document.getElementById('student-name-input')?.focus();
      return;
    }
    setActiveMode(mode);
  };

  const renderHome = () => (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto px-4 pb-20">
      <div className="glass-home-panel">
        <div className="home-spark-badge">
          <Sparkles size={22} className="text-[#F26522]" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-[#10213A] leading-tight tracking-tight mb-4">
            {lang === 'vi' ? 'Chào mừng đến với' : 'Welcome to'}<br />
            <span className="text-[#F26522]">Espagnol</span> Spark
          </h2>
          <p className="text-slate-700 font-medium text-base md:text-lg flex items-center justify-center gap-2 leading-relaxed">
            {t('subtitle')} <Sparkles size={16} className="text-[#F26522]" />
          </p>
        </div>

        <div className="mb-10 max-w-xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl border border-white/80 flex items-center gap-4 focus-within:ring-2 focus-within:ring-[#F26522]/40 transition-all">
            <User size={23} className={studentName.trim() ? "text-green-500 transition-colors" : "text-[#F26522] transition-colors"} />
            <input
              id="student-name-input"
              type="text"
              placeholder={t('namePlaceholder')}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
              className="flex-1 bg-transparent outline-none font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium py-1"
            />
            {studentName.trim() && (
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-bold animate-in zoom-in flex items-center gap-1">
                <CheckCircle2 size={14} /> {t('received')}
              </span>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <label className="section-title-line font-bold text-[#10213A] text-lg"><span>{lang === 'vi' ? 'Chọn chế độ luyện tập' : 'Select training mode'}</span></label>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <button onClick={() => handleModeSelect('shadowing')} className="mode-card-real group text-center relative overflow-hidden">
            <div className="mode-icon-real bg-gradient-to-br from-[#ff8a00] to-[#F26522]"><MessageCircle size={30} /></div>
            <h3 className="text-xl font-black text-[#10213A] mb-4 relative z-10">{t('shadowingTitle')}</h3>
            <p className="text-slate-700 text-sm relative z-10 leading-relaxed">{t('shadowingDesc')}</p>
            <ChevronRight size={22} className="mx-auto mt-7 text-[#F26522] group-hover:translate-x-1 transition-transform" />
          </button>

          <button onClick={() => handleModeSelect('topic')} className="mode-card-real group text-center relative overflow-hidden">
            <div className="mode-icon-real bg-gradient-to-br from-[#ffc928] to-[#f2a900]"><BookOpen size={30} /></div>
            <h3 className="text-xl font-black text-[#10213A] mb-4 relative z-10">{t('topicTitle')}</h3>
            <p className="text-slate-700 text-sm relative z-10 leading-relaxed">{t('topicDesc')}</p>
            <ChevronRight size={22} className="mx-auto mt-7 text-[#f2a900] group-hover:translate-x-1 transition-transform" />
          </button>

          <button onClick={() => handleModeSelect('free')} className="mode-card-real group text-center relative overflow-hidden">
            <div className="mode-icon-real bg-gradient-to-br from-[#46d38b] to-[#18bca8]"><Mic size={30} /></div>
            <h3 className="text-xl font-black text-[#10213A] mb-4 relative z-10">{t('freeTitle')}</h3>
            <p className="text-slate-700 text-sm relative z-10 leading-relaxed">{t('freeDesc')}</p>
            <ChevronRight size={22} className="mx-auto mt-7 text-[#18bca8] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button onClick={() => setActiveMode('adminLogin')} className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-[#F26522] transition-colors bg-white/55 backdrop-blur-md px-7 py-3 rounded-full shadow-sm border border-white/70">
          <ShieldCheck size={14} /> {t('adminLink')}
        </button>
      </div>
    </div>
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="spain-bg text-slate-800 font-sans selection:bg-[#F26522] selection:text-white">

        {/* BACKGROUND TÂY BAN NHA: ảnh thật + lớp màu hoàng hôn + đường cong như mẫu */}
        <div className="spanish-scene">
          <div className="photo-left"></div>
          <div className="photo-right"></div>
          <div className="scene-haze"></div>
          <div className="sun-disc"></div>

          <svg className="flow-lines" viewBox="0 0 1600 900" preserveAspectRatio="none">
            <path d="M-60 255 C260 500 600 265 920 255 C1170 248 1360 145 1660 -20" fill="none" stroke="rgba(255,255,255,.62)" strokeWidth="1.4" />
            <path d="M-70 315 C250 560 610 375 935 350 C1210 330 1390 210 1660 62" fill="none" stroke="rgba(255,255,255,.48)" strokeWidth="1.2" />
            <path d="M-60 775 C260 705 430 845 690 765 C950 685 1135 790 1650 695" fill="none" stroke="rgba(255,255,255,.58)" strokeWidth="1.3" />
            <path d="M-60 805 C260 742 420 885 690 810 C960 735 1195 842 1650 760" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1.2" />
          </svg>

          <svg className="gaudi-mosaic" viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet">
            <path d="M0 230 C60 205 105 176 138 128 L205 212 L290 105 L378 205 L520 150 L520 320 L0 320 Z" fill="rgba(255,255,255,.64)" />
            <path d="M0 260 L55 225 L92 280 L0 320 Z" fill="#6ba4c9" opacity=".85" />
            <path d="M42 218 L132 130 L190 214 L100 282 Z" fill="#fff3c3" opacity=".9" />
            <path d="M135 129 L226 215 L174 284 L92 280 Z" fill="#f4aa2f" opacity=".9" />
            <path d="M228 216 L308 104 L382 204 L318 280 Z" fill="#355b86" opacity=".95" />
            <path d="M318 280 L382 204 L520 150 L520 320 Z" fill="#f1e4d1" opacity=".88" />
            <path d="M0 260 L55 225 L92 280 L135 129 L226 215 L308 104 L382 204" fill="none" stroke="rgba(255,255,255,.92)" strokeWidth="5" />
            <path d="M92 280 C165 250 260 292 382 204" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="3" />
          </svg>

          <svg className="soft-wave" viewBox="0 0 1600 220" preserveAspectRatio="none">
            <path d="M0 95 C210 55 345 115 555 100 C770 84 920 30 1120 66 C1320 102 1440 80 1600 40 L1600 220 L0 220 Z" fill="rgba(255,255,255,.32)" />
            <path d="M0 145 C240 115 400 155 600 135 C840 110 1000 130 1185 138 C1350 146 1450 128 1600 90 L1600 220 L0 220 Z" fill="rgba(255,255,255,.24)" />
          </svg>
        </div>

        <header className="bg-white/60 backdrop-blur-xl shadow-sm border-b border-white/50 sticky top-0 z-50 app-content no-print">
          <div className="max-w-7xl mx-auto px-5 h-16 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveMode(null); }}>
            <div className="w-8 h-8 flex items-center justify-center"><svg viewBox="0 0 100 100" fill="none" stroke="#F26522" strokeWidth="12" strokeLinecap="butt" strokeLinejoin="miter" className="w-full h-full"><path d="M 15 90 L 15 15 L 50 50 L 85 15 L 85 90"></path><path d="M 85 90 L 50 50"></path></svg></div>
              <h1 className="font-bold text-xl tracking-tight hidden sm:block"><span className="text-[#FDD116] drop-shadow-sm">ESPAGNOL</span><span className="text-slate-800"> SPARK</span></h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switch */}
              <div className="flex bg-slate-100/80 rounded-full p-1 border border-slate-200">
                <button onClick={() => setLang('vi')} className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${lang === 'vi' ? 'bg-white shadow text-[#F26522]' : 'text-slate-500'}`}>VI</button>
                <button onClick={() => setLang('en')} className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${lang === 'en' ? 'bg-white shadow text-[#F26522]' : 'text-slate-500'}`}>EN</button>
              </div>

              {role === 'admin' ? (
                <div className="flex items-center gap-3">
                  <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md hidden sm:flex">
                    <ShieldCheck size={14} /> {t('adminMode')}
                  </span>
                  <button onClick={() => { setRole('user'); setActiveMode(null); }} className="text-sm font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <LogOut size={16} className="sm:hidden" /><span className="hidden sm:block">{t('logout')}</span>
                  </button>
                </div>
              ) : (
                activeMode && activeMode !== 'adminLogin' && (
                  <button onClick={() => setActiveMode(null)} className="text-sm font-bold text-slate-500 hover:text-[#F26522] flex items-center gap-1 transition-colors">
                    <RefreshCcw size={14} /> <span className="hidden sm:block">{t('changeMode')}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </header>

        <main className="app-content min-h-[calc(100vh-64px)]">
          {activeMode === 'adminLogin' && (
            <div className="max-w-sm mx-auto mt-20 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 animate-in fade-in zoom-in">
              <Lock className="text-[#F26522] mx-auto mb-4" size={40} />
              <h2 className="text-xl font-bold text-center text-slate-800 mb-6">{isForgotPwd ? t('forgotPwd') : t('adminLoginTitle')}</h2>

              {isForgotPwd ? (
                <div className="text-center animate-in fade-in">
                  <p className="text-sm text-slate-600 mb-4">{t('forgotPwdDesc')}</p>
                  <p className="font-bold text-[#F26522] mb-6">vananh.pham@minhvietacademy.org</p>
                  <a href="mailto:vananh.pham@minhvietacademy.org?subject=Yêu cầu khôi phục mật khẩu Admin - Espagnol Spark" className="block w-full bg-[#F26522] text-white font-bold py-3 rounded-xl shadow hover:bg-[#d95618] mb-3 transition-colors">
                    {t('sendEmail')}
                  </a>
                  <button onClick={() => setIsForgotPwd(false)} className="w-full mt-2 text-sm text-slate-500 hover:text-slate-800">{t('backBtn')}</button>
                </div>
              ) : (
                <div className="animate-in fade-in">
                  <input
                    type="password" id="adminPwd" placeholder={t('passPlaceholder')}
                    className="w-full p-3 border border-slate-300 rounded-xl mb-4 focus:outline-none focus:border-[#F26522]"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAdminLogin(document.getElementById('adminPwd').value) }}
                  />
                  <button onClick={() => handleAdminLogin(document.getElementById('adminPwd').value)} className="w-full bg-[#F26522] text-white font-bold py-3 rounded-xl shadow hover:bg-[#d95618] mb-3 transition-colors">
                    {t('loginBtn')}
                  </button>
                  <div className="flex justify-between items-center mt-3 px-1">
                    <button onClick={() => { setActiveMode(null); setIsForgotPwd(false); }} className="text-sm text-slate-500 hover:text-slate-800">{t('backBtn')}</button>
                    <button onClick={() => setIsForgotPwd(true)} className="text-sm text-[#F26522] hover:underline font-medium">{t('forgotPwd')}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {role === 'admin' && !activeMode ? (
            <AdminPanel
              dbTopics={dbTopics} setDbTopics={setDbTopics}
              dbShadowing={dbShadowing} setDbShadowing={setDbShadowing}
              adminPassword={adminPassword} setAdminPassword={setAdminPassword}
            />
          ) : role === 'user' ? (
            <>
              {!activeMode && renderHome()}
              {activeMode === 'free' && <FreeAndTopicMode type="free" studentName={studentName} onRequireName={() => setActiveMode(null)} dbTopics={dbTopics} />}
              {activeMode === 'topic' && <FreeAndTopicMode type="topic" studentName={studentName} onRequireName={() => setActiveMode(null)} dbTopics={dbTopics} />}
              {activeMode === 'shadowing' && <ShadowingMode studentName={studentName} onRequireName={() => setActiveMode(null)} dbShadowing={dbShadowing} />}
            </>
          ) : null}
        </main>
      </div>
    </LanguageContext.Provider>
  );
}

// ---------------------------------------------------------
// COMPONENT: ADMIN PANEL
// ---------------------------------------------------------
function AdminPanel({ dbTopics, setDbTopics, dbShadowing, setDbShadowing, adminPassword, setAdminPassword }) {
  const [tab, setTab] = useState('topics');
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingShadow, setEditingShadow] = useState(null);
  const [shadowRows, setShadowRows] = useState([]);

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const handleChangePassword = () => {
    if (!newPwd || !confirmPwd) return alert("Vui lòng nhập đầy đủ mật khẩu mới!");
    if (newPwd !== confirmPwd) return alert("Mật khẩu xác nhận không khớp!");
    setAdminPassword(newPwd);
    localStorage.setItem('espagnol_admin_pwd', newPwd);
    alert("Đổi mật khẩu thành công!");
    setNewPwd('');
    setConfirmPwd('');
  };

  const saveTopic = async (isPublished) => {
    if (!editingTopic.title) { alert("Nhập tên chủ đề!"); return; }
    const newTopic = { ...editingTopic, isPublished };
    if (!newTopic.id) newTopic.id = 't_' + Date.now();

    try {
      const { error } = await supabase
        .from('topics')
        .upsert(toDbItem(newTopic));

      if (error) throw error;

      // Refresh data
      const { data: topicsData, error: fetchError } = await supabase
        .from('topics')
        .select('*');

      if (fetchError) throw fetchError;
      setDbTopics((topicsData || []).map(normalizeDbItem));

      setEditingTopic(null);
      alert("Lưu thành công!");
    } catch (error) {
      console.error('Error saving topic:', error);
      alert("Lỗi khi lưu dữ liệu. Vui lòng thử lại.");
    }
  };

  const saveShadow = async (isPublished) => {
    if (!editingShadow.title) { alert("Nhập tên bài học!"); return; }
    const parsedItems = shadowRows
      .map(row => ({
        jp: (row.jp || '').trim(),
        vi: (row.vi || '').trim(),
        en: (row.en || '').trim()
      }))
      .filter(row => row.jp || row.vi || row.en);

    if (parsedItems.length === 0) { alert("Vui lòng nhập ít nhất một từ hoặc một câu!"); return; }

    const newShadow = { ...editingShadow, items: parsedItems, isPublished };
    if (!newShadow.id) newShadow.id = 's_' + Date.now();

    try {
      const { error } = await supabase
        .from('shadowing')
        .upsert(toDbItem(newShadow));

      if (error) throw error;

      // Refresh data
      const { data: shadowingData, error: fetchError } = await supabase
        .from('shadowing')
        .select('*');

      if (fetchError) throw fetchError;
      setDbShadowing((shadowingData || []).map(normalizeDbItem));

      setEditingShadow(null);
      alert("Lưu thành công!");
    } catch (error) {
      console.error('Error saving shadowing:', error);
      alert("Lỗi khi lưu dữ liệu. Vui lòng thử lại.");
    }
  };

  const toggleTopicPublish = async (id) => {
    const topic = dbTopics.find(t => t.id === id);
    if (!topic) return;

    try {
      const { error } = await supabase
        .from('topics')
        .update({ ispublished: !topic.isPublished })
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      const { data: topicsData, error: fetchError } = await supabase
        .from('topics')
        .select('*');

      if (fetchError) throw fetchError;
      setDbTopics((topicsData || []).map(normalizeDbItem));
    } catch (error) {
      console.error('Error toggling topic publish:', error);
      alert("Lỗi khi cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const toggleShadowPublish = async (id) => {
    const shadow = dbShadowing.find(s => s.id === id);
    if (!shadow) return;

    try {
      const { error } = await supabase
        .from('shadowing')
        .update({ ispublished: !shadow.isPublished })
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      const { data: shadowingData, error: fetchError } = await supabase
        .from('shadowing')
        .select('*');

      if (fetchError) throw fetchError;
      setDbShadowing((shadowingData || []).map(normalizeDbItem));
    } catch (error) {
      console.error('Error toggling shadowing publish:', error);
      alert("Lỗi khi cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm("Xóa vĩnh viễn?")) return;

    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      const { data: topicsData, error: fetchError } = await supabase
        .from('topics')
        .select('*');

      if (fetchError) throw fetchError;
      setDbTopics((topicsData || []).map(normalizeDbItem));
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert("Lỗi khi xóa dữ liệu. Vui lòng thử lại.");
    }
  };

  const handleDeleteShadow = async (id) => {
    if (!window.confirm("Xóa vĩnh viễn?")) return;

    try {
      const { error } = await supabase
        .from('shadowing')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      const { data: shadowingData, error: fetchError } = await supabase
        .from('shadowing')
        .select('*');

      if (fetchError) throw fetchError;
      setDbShadowing((shadowingData || []).map(normalizeDbItem));
    } catch (error) {
      console.error('Error deleting shadowing:', error);
      alert("Lỗi khi xóa dữ liệu. Vui lòng thử lại.");
    }
  };

  const startEditTopic = (t) => {
    setEditingTopic({
      ...t,
      hint: { jp: '', vi: '', en: '', ...(t.hint || {}) }
    });
  };
  const startEditShadow = (s) => {
    setEditingShadow({ ...s });
    setShadowRows((s.items || []).map(i => ({
      jp: i.jp || '',
      vi: i.vi || '',
      en: i.en || ''
    })));
  };

  const addShadowRow = () => {
    setShadowRows(prev => [...prev, { jp: '', vi: '', en: '' }]);
  };

  const updateShadowRow = (index, field, value) => {
    setShadowRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const removeShadowRow = (index) => {
    setShadowRows(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 animate-in fade-in duration-500 px-4 pb-20">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50">
          <button onClick={() => { setTab('topics'); setEditingTopic(null); }} className={`flex-1 py-4 font-bold text-center border-b-2 ${tab === 'topics' ? 'border-[#F26522] text-[#F26522] bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Quản lý Chủ đề</button>
          <button onClick={() => { setTab('shadowing'); setEditingShadow(null); }} className={`flex-1 py-4 font-bold text-center border-b-2 ${tab === 'shadowing' ? 'border-[#F26522] text-[#F26522] bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Quản lý Shadowing</button>
          <button onClick={() => setTab('settings')} className={`flex-1 py-4 font-bold text-center border-b-2 ${tab === 'settings' ? 'border-[#F26522] text-[#F26522] bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Cài đặt</button>
        </div>
        <div className="p-8">

          {tab === 'settings' && (
            <div className="max-w-md mx-auto py-8 animate-in fade-in">
              <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2"><Lock className="text-[#F26522]" /> Đổi mật khẩu Admin</h3>
              <div className="space-y-4">
                <div className="bg-orange-50 text-orange-800 p-3 rounded-lg text-sm font-medium mb-4 border border-orange-200">
                  Mật khẩu sẽ được lưu trên trình duyệt hiện tại.
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mật khẩu mới</label>
                  <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#F26522] outline-none" placeholder="Nhập mật khẩu mới..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                  <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#F26522] outline-none" placeholder="Nhập lại mật khẩu..." />
                </div>
                <button onClick={handleChangePassword} className="w-full bg-[#F26522] text-white font-bold py-3 rounded-xl hover:bg-[#d95618] shadow-md mt-4 transition-colors">
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {tab === 'topics' && (
            <div>
              {!editingTopic ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-800">Kho Chủ đề</h3>
                    <button onClick={() => setEditingTopic({ id: 't_' + Date.now(), title: '', level: 'A1', req: '', isPublished: false, hint: { jp: '', vi: '', en: '' } })} className="bg-[#F26522] text-white hover:bg-[#d95618] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md"><Plus size={18} /> Thêm mới</button>
                  </div>
                  <div className="space-y-4">
                    {dbTopics.map(topic => (
                      <div key={topic.id} className={`p-5 rounded-2xl border ${topic.isPublished ? 'border-slate-200 bg-white' : 'border-orange-200 bg-orange-50'}`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                          <div>
                            <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded mr-2">{topic.level}</span>
                            <h4 className="font-bold text-lg text-[#F26522] inline-block">{topic.title}</h4>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button onClick={() => toggleTopicPublish(topic.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${topic.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{topic.isPublished ? <><Eye size={14} /> Công khai</> : <><EyeOff size={14} /> Nháp</>}</button>
                            <button onClick={() => startEditTopic(topic)} className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">Sửa</button>
                            <button onClick={() => handleDeleteTopic(topic.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center gap-1"><Trash2 size={14} /> Xóa</button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2 truncate">{topic.req}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="font-bold text-xl text-slate-800">Soạn thảo Chủ đề</h3>
                    <button onClick={() => setEditingTopic(null)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Tên chủ đề</label><input type="text" value={editingTopic.title} onChange={e => setEditingTopic({ ...editingTopic, title: e.target.value })} className="w-full p-3 border rounded-xl" /></div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Cấp độ</label>
                      <select value={editingTopic.level} onChange={e => setEditingTopic({ ...editingTopic, level: e.target.value })} className="w-full p-3 border rounded-xl">
                        <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4"><label className="block text-sm font-bold text-slate-700 mb-1">Yêu cầu</label><textarea value={editingTopic.req} onChange={e => setEditingTopic({ ...editingTopic, req: e.target.value })} className="w-full p-3 border rounded-xl h-20" /></div>
                  <div className="p-4 border rounded-xl bg-slate-50 space-y-3">
                    <label className="block text-sm font-bold text-slate-800 border-b pb-2">Bài nói mẫu</label>
                    <div className="bg-orange-50 text-orange-800 p-3 rounded-lg text-xs font-medium border border-orange-200">
                      Chỉ cần nhập bài mẫu bằng tiếng Tây Ban Nha, tiếng Việt và tiếng Anh. Không cần nhập pronunciation.
                    </div>
                    <div><label className="block text-xs font-bold mb-1">Tiếng Tây Ban Nha</label><textarea value={editingTopic.hint.jp} onChange={e => setEditingTopic({ ...editingTopic, hint: { ...editingTopic.hint, jp: e.target.value } })} className="w-full p-2 border rounded-lg h-24" placeholder="VD: Hola, me llamo Ana. Vivo en Hanói..." /></div>
                    <div><label className="block text-xs font-bold mb-1">Tiếng Việt</label><textarea value={editingTopic.hint.vi} onChange={e => setEditingTopic({ ...editingTopic, hint: { ...editingTopic.hint, vi: e.target.value } })} className="w-full p-2 border rounded-lg h-20" /></div>
                    <div><label className="block text-xs font-bold mb-1">Tiếng Anh (Cho giao diện EN)</label><textarea value={editingTopic.hint.en || ''} onChange={e => setEditingTopic({ ...editingTopic, hint: { ...editingTopic.hint, en: e.target.value } })} className="w-full p-2 border rounded-lg h-20" /></div>
                  </div>
                  <div className="flex gap-4 mt-8 pt-4 border-t"><button onClick={() => saveTopic(false)} className="flex-1 bg-slate-200 py-3 rounded-xl font-bold">Lưu Nháp</button><button onClick={() => saveTopic(true)} className="flex-1 bg-[#F26522] text-white py-3 rounded-xl font-bold">Lưu & Public</button></div>
                </div>
              )}
            </div>
          )}

          {tab === 'shadowing' && (
            <div>
              {!editingShadow ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-800">Kho Shadowing</h3>
                    <button onClick={() => { setEditingShadow({ id: 's_' + Date.now(), title: '', level: 'A1', type: 'sentence', isPublished: false, items: [] }); setShadowRows([{ jp: '', vi: '', en: '' }]); }} className="bg-[#F26522] text-white px-4 py-2 rounded-lg font-bold text-sm"><Plus size={18} className="inline" /> Thêm mới</button>
                  </div>
                  <div className="space-y-4">
                    {dbShadowing.map(shadow => (
                      <div key={shadow.id} className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${shadow.isPublished ? 'border-slate-200 bg-white' : 'border-orange-200 bg-orange-50'}`}>
                        <div>
                          <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded mr-2">{shadow.level}</span>
                          <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded mr-2">{shadow.type === 'vocab' ? 'Từ vựng' : 'Câu'}</span>
                          <h4 className="font-bold text-lg inline">{shadow.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{shadow.items.length} hạng mục</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => toggleShadowPublish(shadow.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${shadow.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{shadow.isPublished ? 'Public' : 'Nháp'}</button>
                          <button onClick={() => startEditShadow(shadow)} className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">Sửa</button>
                          <button onClick={() => handleDeleteShadow(shadow.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="font-bold text-xl text-slate-800">Soạn thảo Bài học Shadowing</h3>
                    <button onClick={() => setEditingShadow(null)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div><label className="block text-sm font-bold mb-1">Cấp độ</label><select value={editingShadow.level} onChange={e => setEditingShadow({ ...editingShadow, level: e.target.value })} className="w-full p-3 border rounded-xl"><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option></select></div>
                    <div><label className="block text-sm font-bold mb-1">Loại</label><select value={editingShadow.type} onChange={e => setEditingShadow({ ...editingShadow, type: e.target.value })} className="w-full p-3 border rounded-xl"><option value="sentence">Câu văn</option><option value="vocab">Từ vựng</option></select></div>
                    <div><label className="block text-sm font-bold mb-1">Tên bài học</label><input type="text" value={editingShadow.title} onChange={e => setEditingShadow({ ...editingShadow, title: e.target.value })} className="w-full p-3 border rounded-xl" /></div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold">Danh sách Từ vựng / Câu</label>
                      <button type="button" onClick={addShadowRow} className="bg-orange-100 text-[#F26522] hover:bg-orange-200 px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1">
                        <Plus size={14} /> Thêm dòng
                      </button>
                    </div>
                    <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm font-medium mb-3 border border-orange-200 shadow-inner">
                      Mỗi hạng mục được nhập thành 3 ô riêng: <strong>Tiếng Tây Ban Nha</strong>, <strong>Tiếng Việt</strong>, <strong>Tiếng Anh</strong>. Không cần nhập pronunciation.
                    </div>

                    <div className="space-y-3">
                      {shadowRows.map((row, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start bg-slate-50 border border-slate-200 rounded-2xl p-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Tiếng Tây Ban Nha</label>
                            <textarea value={row.jp} onChange={e => updateShadowRow(index, 'jp', e.target.value)} className="w-full p-2 border rounded-lg min-h-[54px] text-sm" placeholder="perro / Buenos días." />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Tiếng Việt</label>
                            <textarea value={row.vi} onChange={e => updateShadowRow(index, 'vi', e.target.value)} className="w-full p-2 border rounded-lg min-h-[54px] text-sm" placeholder="con chó / Chào buổi sáng." />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Tiếng Anh</label>
                            <textarea value={row.en} onChange={e => updateShadowRow(index, 'en', e.target.value)} className="w-full p-2 border rounded-lg min-h-[54px] text-sm" placeholder="dog / Good morning." />
                          </div>
                          <button type="button" onClick={() => removeShadowRow(index)} className="mt-5 md:mt-6 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100" title="Xóa dòng">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8 pt-4 border-t"><button onClick={() => saveShadow(false)} className="flex-1 bg-slate-200 py-3 rounded-xl font-bold">Lưu Nháp</button><button onClick={() => saveShadow(true)} className="flex-1 bg-[#F26522] text-white py-3 rounded-xl font-bold">Lưu & Public</button></div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// ENGINE CHẤM ĐIỂM GENERATIVE AI (THÔNG MINH)
// ---------------------------------------------------------

function generateGradingResultFallback(transcript, expectedRawText, level, mode, lang, t) {
  const clamp = (val) => Math.min(10.0, Math.max(0.0, parseFloat(val) || 0)).toFixed(1);

  // Fallback: so khớp văn bản tiếng Tây Ban Nha thuần, không cần pronunciation
  const cleanExpectedMain = expectedRawText ? expectedRawText.replace(/[.,;:!?¿¡\s]/g, '').toLowerCase() : '';
  const cleanTranscript = transcript ? transcript.replace(/[.,;:!?¿¡\s]/g, '').toLowerCase() : '';

  let finalScore = 5.0;
  let criteriaObj = {};
  let estimatedLevel = '';

  if (mode === 'vocab' || mode === 'sentence') {
    let matchCount = 0;
    const targetString = cleanExpectedMain;
    for (let char of cleanTranscript) { if (targetString.includes(char)) matchCount++; }

    const matchRate = Math.min(1.0, matchCount / Math.max(1, cleanExpectedMain.length));
    finalScore = matchRate * 10;
    criteriaObj = {
      [t('cPronunciation')]: clamp(finalScore),
      [t('cFluency')]: clamp(finalScore + 0.5)
    };
  } else if (mode === 'topic') {
    if (cleanTranscript.length < 15) {
      finalScore = 4.0;
    } else {
      finalScore = Math.min(9.5, 6.0 + (cleanTranscript.length / 40));
    }
    criteriaObj = {
      [t('cPronunciation')]: clamp(finalScore - 0.5),
      [t('cTopicRelevance')]: clamp(finalScore + 0.2),
      [t('cCompleteness')]: clamp(finalScore),
      [t('cFluency')]: clamp(finalScore + 0.4),
      [t('cGrammar')]: clamp(finalScore - 0.3),
      [t('cVocabRichness')]: clamp(finalScore + 0.3),
      [t('cNaturalness')]: clamp(finalScore - 0.4)
    };
  } else {
    finalScore = Math.min(9.5, 5.0 + (cleanTranscript.length / 50));
    criteriaObj = {
      [t('cPronunciation')]: clamp(finalScore - 0.5),
      [t('cFluency')]: clamp(finalScore),
      [t('cGrammar')]: clamp(finalScore - 0.3)
    };
    if (cleanTranscript.length > 180) estimatedLevel = 'C1';
    else if (cleanTranscript.length > 120) estimatedLevel = 'B2';
    else if (cleanTranscript.length > 70) estimatedLevel = 'B1';
    else if (cleanTranscript.length > 25) estimatedLevel = 'A2';
    else estimatedLevel = 'A1';
  }

  return {
    score: clamp(finalScore),
    level: lang === 'en' ? (finalScore > 8 ? 'Good' : 'Needs Practice') : (finalScore > 8 ? 'Giỏi' : 'Cần luyện thêm'),
    estimated_cefr: estimatedLevel,
    criteria: criteriaObj,
    feedback: lang === 'en' ? "This is a basic evaluation. Please connect to internet for full AI Analysis." : "Đây là đánh giá cơ bản. Hãy kết nối mạng để AI Phân tích chi tiết lỗi ngữ pháp và phát âm."
  };
}

const evaluateWithGemini = async (transcript, expectedText, level, mode, lang, requirement = '') => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const systemPrompt = `Bạn là một giáo viên tiếng Tây Ban Nha giàu kinh nghiệm chuyên dạy phát âm, speaking và giao tiếp thực tế cho người học ngoại ngữ.
Language for feedback: ${lang === 'en' ? 'English' : 'Vietnamese'}.
Task Mode: ${mode} (vocab = single word, sentence = shadowing, topic = presentation, free = unstructured speech).
Student CEFR Target Level: ${level}.
Topic Requirement: "${requirement || 'None'}"
Model Answer / Expected Spanish: "${expectedText || 'None'}"
Student's Voice Transcript: "${transcript}"

CORE RULES:
1. Evaluate Spanish speech naturally, fairly, and practically like a real teacher, not like a mechanical speech recognition system.
2. Spanish has connected speech, linking, light reduction, natural rhythm, and sentence melody. Do not punish natural linking heavily.
3. If the student is fluent, understandable, and has reasonably correct stress/rhythm, give a fair high score even with a light foreign accent.
4. If the student speaks too slowly, separates every word unnaturally, or sounds robotic, reduce naturalness/fluency.
5. WORD MODE: check vowels, consonants, tapped r, trilled rr, j, b/v, and word stress more carefully.
6. SENTENCE/TOPIC/FREE MODE: prioritize fluency, rhythm, stress pattern, naturalness, and comprehensibility.
7. TOPIC MODE: the model answer is only a suggestion. Evaluate primarily against the topic requirement.
8. FREE MODE: estimate CEFR level (A1, A2, B1, B2, C1, or C2) based on vocabulary, grammar complexity, fluency, and naturalness.
9. LANGUAGE/TOPIC GUARDRAIL: If the transcript is mostly Vietnamese, English, Japanese, Chinese, French, German, or another non-Spanish language, or if the speech is unrelated to the selected Spanish practice task, give a low score and clearly say: "Bạn đang nói ngôn ngữ khác hoặc nội dung chưa liên quan đến bài luyện tiếng Tây Ban Nha. Vui lòng nói lại bằng tiếng Tây Ban Nha theo đúng chủ đề." In English feedback, say: "You are speaking another language or the content is not related to this Spanish practice task. Please try again in Spanish and stay on topic."
10. CRITICAL VIETNAMESE TONE RULE: When writing feedback in Vietnamese, always use the neutral pronoun "bạn" for the student and "Hệ thống" or "AI" for yourself. Never use "em", "thầy", "cô", "mình", or "tôi".

Return a JSON object matching this schema:
{
  "score": "Overall score from 0.0 to 10.0, e.g. '8.5'",
  "level": "Performance rank. English: Excellent/Good/Fair/Needs Practice. Vietnamese: Xuất sắc/Giỏi/Khá/Cần cố gắng",
  "estimated_cefr": "Estimated CEFR level, mandatory for free mode, otherwise empty",
  "feedback": "Detailed personalized feedback. Mention exact pronunciation/stress/grammar issues and suggestions. If wrong language/off-topic, include the warning.",
  "pronunciation_score": "0.0 to 10.0 string",
  "fluency_score": "0.0 to 10.0 string",
  "accuracy_score": "0.0 to 10.0 string",
  "grammar_score": "0.0 to 10.0 string",
  "vocab_score": "0.0 to 10.0 string"
}`;

  const payload = {
    model: "gpt-4.1-nano",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Grade this student's speech based on the transcript provided." }
    ],
    temperature: 0.2,
    max_tokens: 800
  };

  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let attempt = 0; attempt <= 5; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`API Error ${res.status}`);

      const data = await res.json();
      const textRes = data.choices?.[0]?.message?.content;

      if (textRes) {
        const match = textRes.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (parseErr) {
            console.error("JSON Parse Error", parseErr);
            throw new Error("Invalid JSON format");
          }
        }
        throw new Error("No JSON object found");
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      if (attempt === 5) return null;
      await new Promise(resolve => setTimeout(resolve, delays[attempt]));
    }
  }
  return null;
};

// ---------------------------------------------------------
// COMPONENT: THU ÂM (TÍCH HỢP SPEECH RECOGNITION + OPENAI )
// ---------------------------------------------------------

export const AudioInput = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // 🎧 Recorder ổn định
  const createRecorder = (stream) => {
    if (MediaRecorder.isTypeSupported("audio/mp4")) {
      return new MediaRecorder(stream, { mimeType: "audio/mp4" });
    }
    if (MediaRecorder.isTypeSupported("audio/webm")) {
      return new MediaRecorder(stream, { mimeType: "audio/webm" });
    }
    return new MediaRecorder(stream);
  };

  // 🧠 OpenAI transcribe
  const transcribe = async (file) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "gpt-4o-mini-transcribe");
    formData.append("language", "es");

    const res = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Transcribe failed");

    const data = await res.json();
    return data.text;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = createRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType,
        });

        const file = new File([blob], "recorded.mp4", {
          type: blob.type,
        });

        let finalTranscript = null;

        try {
          finalTranscript = await transcribe(file);

          // 🔥 CHỈ log sau khi có kết quả
          console.log("✅ AI RESULT:", finalTranscript);
        } catch (err) {
          console.log("❌ OpenAI error:", err);
        }

        onAudioReady(
          file,
          URL.createObjectURL(blob),
          finalTranscript,
          false
        );

        clearInterval(timerRef.current);
        setRecordingTime(0);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      alert("Không thể truy cập microphone");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.stop();
    recorder.stream.getTracks().forEach((t) => t.stop());

    setIsRecording(false);
  };

  const handleFileChange = (e) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    onAudioReady(file, URL.createObjectURL(file), null, true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Upload */}
      <div
        onClick={() =>
          !isRecording && document.getElementById("file-upload").click()
        }
        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group bg-white border-slate-300 hover:border-[#F26522]/50 ${
          isRecording ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <input
          id="file-upload"
          type="file"
          accept="audio/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload
          size={28}
          className="text-[#F26522] mb-3 group-hover:-translate-y-1 transition-transform"
        />
        <h3 className="font-bold text-slate-800">Tải file lên</h3>
        <p className="text-xs text-slate-500 mt-1">
          Hệ thống sẽ giả lập chấm điểm
        </p>
      </div>

      {/* Record */}
      <div
        className={`border-2 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-200 ${
          isRecording
            ? "border-[#F26522] bg-[#fff0f5] shadow-inner"
            : "border-[#F26522]/30 bg-orange-50/30 relative overflow-hidden"
        }`}
      >
        {!isRecording && (
          <div className="absolute top-0 right-0 bg-[#F26522] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
            Khuyên dùng AI
          </div>
        )}

        {isRecording ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <span className="font-mono text-lg font-bold text-[#F26522]">
                {Math.floor(recordingTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(recordingTime % 60).toString().padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center gap-2 px-6 font-bold text-sm transition-transform active:scale-95"
            >
              <Square size={16} fill="currentColor" /> DỪNG THU
            </button>
          </>
        ) : (
          <>
            <Mic size={28} className="text-[#F26522] mb-3" />
            <h3 className="font-bold text-slate-800 mb-2">
              Thu âm trực tiếp
            </h3>
            <button
              onClick={startRecording}
              className="bg-[#F26522] hover:bg-[#d95618] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
            >
              Chấm điểm bằng giọng nói
            </button>
          </>
        )}
      </div>
    </div>
  );
};


// ---------------------------------------------------------
// COMPONENT: NÓI TỰ DO & NÓI THEO CHỦ ĐỀ
// ---------------------------------------------------------
function FreeAndTopicMode({ type, studentName, onRequireName, dbTopics }) {
  const { lang, t } = useContext(LanguageContext);
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState('');

  const [isPlayingModel, setIsPlayingModel] = useState(false);

  const publishedTopics = dbTopics.filter(t => {
    if (t.isPublished === undefined || t.isPublished === null) return true;
    return t.isPublished === true || t.isPublished === 'true' || t.isPublished === 1 || t.isPublished === '1';
  });
  const currentTopic = publishedTopics.find(t => t.id === selectedTopicId);

  useEffect(() => { if (!studentName) onRequireName(); }, []);

  const playModelAudio = (textRaw, speedMode = 'normal') => {
    speakSpanishModelAudio({
      textRaw,
      speedMode,
      level: currentTopic?.level || 'A1',
      lang,
      onStart: () => setIsPlayingModel(speedMode),
      onEnd: () => setIsPlayingModel(false)
    });
  };

  const handleAudioReady = (file, url, text, isFile) => {
    setSelectedFile(file);
    setFileUrl(url);
    setTranscript(text);
    setIsFileUpload(isFile);
  };

  const startGrading = async () => {
    if (type === 'topic' && !selectedTopicId) { alert(lang === 'en' ? "Please select a topic!" : "Vui lòng chọn một chủ đề!"); return; }
    if (!selectedFile) { alert(lang === 'en' ? "Please provide audio!" : "Vui lòng tải lên hoặc thu âm bài nói!"); return; }

    setStep(1); // Cập nhật state để hiển thị màn hình loading

    try {
      // Đợi 0.5s để React ưu tiên hiển thị UI màn hình Đang Tải trước khi khối lệnh chấm điểm chạy
      await new Promise(r => setTimeout(r, 500));

      let finalResult;
      if (isFileUpload) {
        const baseScore = 6.0 + Math.random() * 3.0;
        const clamp = (val) => Math.min(10.0, Math.max(0.0, parseFloat(val) || 0)).toFixed(1);
        finalResult = {
          score: clamp(baseScore),
          level: lang === 'en' ? (baseScore >= 8 ? 'Good' : 'Fair') : (baseScore >= 8 ? 'Giỏi' : 'Khá'),
          criteria: {
            [t('cPronunciation')]: clamp(baseScore - 0.2),
            [t('cFluency')]: clamp(baseScore)
          },
          feedback: lang === 'en'
            ? `[AUDIO FILE UPLOAD MODE]\nDue to browser limits, detailed pronunciation errors cannot be extracted from uploaded files. Use "Direct Record" for full AI capabilities.`
            : `[CHÚ Ý: BẠN ĐANG TẢI FILE ÂM THANH]\nDo hạn chế của trình duyệt, hệ thống không thể bóc tách từng lỗi ngữ âm chính xác từ file có sẵn. Hãy dùng nút "Thu âm trực tiếp" để AI đọc chính xác từng từ bạn nói nhé!`
        };
      } else {
        const expectedText = type === 'topic' ? currentTopic?.hint?.jp || '' : '';
        const topicRequirement = type === 'topic' ? currentTopic?.req || '' : '';
        const levelTarget = type === 'topic' ? currentTopic?.level || 'B1' : 'B1';

        // SỬA LỖI: Cho phép nhận diện cả những từ có 1 ký tự (độ dài === 0 mới báo lỗi)
        if (!transcript || transcript.trim().length === 0) {
          finalResult = {
            score: '2.0', level: lang === 'en' ? 'Needs Practice' : 'Cần luyện tập thêm',
            criteria: { [t('cPronunciation')]: '2.0', [t('cFluency')]: '2.0' },
            feedback: lang === 'en' ? 'The system could not clearly recognize what you said. Please check your microphone and speak louder.' : 'Hệ thống không nhận diện rõ bạn nói gì. Vui lòng kiểm tra Micro và thử nói lớn hơn nhé.'
          };
        } else {
          const apiRes = await evaluateWithGemini(transcript, expectedText, levelTarget, type, lang, topicRequirement);
          if (apiRes) {
            finalResult = {
              score: apiRes.score,
              level: apiRes.level,
              estimated_cefr: apiRes.estimated_cefr || '',
              criteria: {
                [t('cPronunciation')]: apiRes.pronunciation_score || "0.0",
                [t('cFluency')]: apiRes.fluency_score || "0.0",
              },
              feedback: apiRes.feedback
            };
            if (type === 'topic') {
              finalResult.criteria[t('cGrammar')] = apiRes.grammar_score || "0.0";
              finalResult.criteria[t('cVocabRichness')] = apiRes.vocab_score || "0.0";
              finalResult.criteria[t('cTopicRelevance')] = apiRes.accuracy_score || "0.0";
            } else {
              finalResult.criteria[t('cGrammar')] = apiRes.grammar_score || "0.0";
              finalResult.criteria[t('cIdeaDev')] = apiRes.vocab_score || "0.0";
            }
          } else {
            // Fallback an toàn nếu API quá tải
            finalResult = generateGradingResultFallback(transcript, expectedText, levelTarget, type, lang, t);
          }
        }
      }

      setResult(finalResult);
      setStep(2);
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
      const expectedText = type === 'topic' ? currentTopic?.hint?.jp || '' : '';
      const levelTarget = type === 'topic' ? currentTopic?.level || 'B1' : 'B1';
      setResult(generateGradingResultFallback(transcript, expectedText, levelTarget, type, lang, t));
      setStep(2);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-in fade-in duration-500 px-4 pb-20">
      {step === 0 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 border border-[#f0e0d8]">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            {type === 'topic' ? <BookOpen className="text-[#F26522]" /> : <Mic className="text-[#F26522]" />}
            {type === 'topic' ? t('topicTitle') : t('freeTitle')}
          </h2>

          {type === 'topic' && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('selectTopic')}</label>
              <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20 outline-none font-medium text-slate-800 transition-all cursor-pointer shadow-sm">
                <option value="">{t('selectTopicHolder')}</option>
                {publishedTopics.map(tData => <option key={tData.id} value={tData.id}>[{tData.level}] {tData.title}</option>)}
              </select>

              {publishedTopics.length === 0 && (
                <div className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                  Hiện chưa có chủ đề nào được công khai. Vui lòng kiểm tra dữ liệu topic trong Supabase hoặc bật trường <strong>isPublished</strong>.
                </div>
              )}

              {currentTopic && (
                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-slate-700">
                    <span className="font-bold text-[#F26522] flex items-center gap-1 mb-1"><Star size={14} /> {t('reqLevel').replace('{0}', currentTopic.level)}</span>
                    <p className="leading-relaxed">{currentTopic.req}</p>
                  </div>

                  <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm relative">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 border-b pb-3">
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <BookA size={16} className="text-blue-500" /> {t('hintModel')}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => playModelAudio(currentTopic.hint.jp, 'slow')} disabled={isPlayingModel !== false} className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all flex items-center gap-1 ${isPlayingModel === 'slow' ? 'bg-blue-50 border-blue-400 text-blue-600 animate-pulse' : 'bg-white border-slate-300 hover:border-[#F26522] hover:text-[#F26522] text-slate-600'}`}>
                          <Volume1 size={14} /> {t('listenSlow')}
                        </button>
                        <button onClick={() => playModelAudio(currentTopic.hint.jp, 'normal')} disabled={isPlayingModel !== false} className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all flex items-center gap-1 ${isPlayingModel === 'normal' ? 'bg-blue-50 border-blue-400 text-blue-600 animate-pulse' : 'bg-white border-slate-300 hover:border-[#F26522] hover:text-[#F26522] text-slate-600'}`}>
                          <Volume2 size={14} /> {t('listenNormal')}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-lg font-medium text-slate-900 tracking-wide break-words">
                        <SpanishText text={currentTopic.hint.jp} />
                      </div>
                      <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3 leading-relaxed mt-2">{currentTopic.hint[lang] || currentTopic.hint.vi}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-6 mt-8 pt-6 border-t border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-3">{t('uploadOrRec')}</label>
            {!selectedFile ? (
              <AudioInput onAudioReady={handleAudioReady} />
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center justify-center relative shadow-sm">
                <button onClick={() => { setSelectedFile(null); setFileUrl(null); setTranscript(null) }} className="absolute top-3 right-4 text-sm text-slate-500 hover:text-red-500 font-bold transition-colors">{t('cancel')}</button>
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 shadow-sm"><CheckCircle2 size={24} /></div>
                <p className="font-medium text-slate-800 text-center mb-1 px-8 truncate w-full">{selectedFile.name}</p>
                {!isFileUpload && transcript && <p className="text-xs text-green-700 italic mb-3">{t('aiRecognized')}</p>}
                <audio controls src={fileUrl} className="w-full max-w-sm rounded-lg" />
              </div>
            )}
          </div>

          <button onClick={startGrading} className="w-full mt-6 bg-[#F26522] hover:bg-[#d95618] text-white font-black tracking-wide py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex justify-center items-center gap-2">
            <Sparkles size={18} /> {t('startGrading')}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col items-center justify-center py-32 bg-white/90 backdrop-blur-md rounded-3xl border border-[#f0e0d8] shadow-xl">
          <Activity size={64} className="text-[#F26522] animate-bounce mb-4" />
          <h2 className="font-bold text-xl text-slate-800">{t('aiEvaluating')}</h2>
          <p className="text-slate-500 text-sm mt-2">{t('waitMsg')}</p>
        </div>
      )}

      {step === 2 && result && (
        <ReportCard result={result} studentName={studentName} fileUrl={fileUrl} onReset={() => { setStep(0); setSelectedFile(null); }} />
      )}
    </div>
  );
}

// ---------------------------------------------------------
// COMPONENT: SHADOWING 
// ---------------------------------------------------------
function ShadowingMode({ studentName, onRequireName, dbShadowing }) {
  const { lang, t } = useContext(LanguageContext);
  const [setupStep, setSetupStep] = useState(true);
  const [level, setLevel] = useState('A1');
  const [type, setType] = useState('sentence');

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [recordedFile, setRecordedFile] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [sentenceResult, setSentenceResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isPlayingModel, setIsPlayingModel] = useState(false);

  useEffect(() => { if (!studentName) onRequireName(); }, []);

  useEffect(() => {
    const normalizedLevel = String(level || '').trim().toUpperCase();
    const levelLessons = dbShadowing.filter(item => {
      const published = item.isPublished ?? item.ispublished;
      const itemLevel = String(item.level || '').trim().toUpperCase();
      const isPublished = published === true || published === 'true' || published === 1 || published === '1';
      return isPublished && itemLevel === normalizedLevel;
    });

    const selectedTypeExists = levelLessons.some(item => String(item.type || '').trim().toLowerCase() === type);
    if (!selectedTypeExists && levelLessons.length > 0) {
      setType(String(levelLessons[0].type || '').trim().toLowerCase() || 'vocab');
    }
  }, [level, dbShadowing, type]);

  const lessons = dbShadowing.filter(item => {
    const published = item.isPublished ?? item.ispublished;
    const itemLevel = String(item.level || '').trim().toUpperCase();
    const itemType = String(item.type || '').trim().toLowerCase();
    const isPublished = published === true || published === 'true' || published === 1 || published === '1';
    return isPublished && itemLevel === level && itemType === type;
  });

  const startPractice = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentIndex(0);
    setSetupStep(false);
  };

  const playModelAudio = (textRaw, speedMode = 'normal') => {
    speakSpanishModelAudio({
      textRaw,
      speedMode,
      level,
      lang,
      onStart: () => setIsPlayingModel(speedMode),
      onEnd: () => setIsPlayingModel(false)
    });
  };

  const handleAudioReady = async (file, url, transcriptStr, isFile) => {
    setRecordedFile(file);
    setRecordedUrl(url);
    setIsEvaluating(true);

    try {
      // Đợi 0.5s để UI "Đang phân tích" kịp hiển thị trước khi gọi AI
      await new Promise(r => setTimeout(r, 500));

      let res;
      if (isFile) {
        res = {
          score: '7.5', level: lang === 'en' ? 'Fair' : 'Khá',
          criteria: { [t('cPronunciation')]: '7.5', [t('cFluency')]: '7.5' },
          feedback: lang === 'en' ? "Use Direct Record for accurate evaluation." : "[CHẾ ĐỘ TẢI FILE]\nHệ thống không thể bóc tách lỗi chi tiết từ file ghi âm tải lên. Hãy dùng Thu âm trực tiếp."
        };
      } else {
        const currentItem = selectedLesson.items[currentIndex];

        // SỬA LỖI: Cho phép nhận diện cả những từ vựng có 1 chữ Hán (length === 0 mới báo lỗi)
        if (!transcriptStr || transcriptStr.trim().length === 0) {
          res = {
            score: '2.0', level: lang === 'en' ? 'Needs Practice' : 'Cần luyện tập thêm',
            criteria: { [t('cPronunciation')]: '2.0', [t('cFluency')]: '2.0' },
            feedback: lang === 'en' ? 'The system could not clearly recognize what you said. Please check your microphone and speak louder.' : 'Hệ thống không nhận diện rõ bạn nói gì. Vui lòng kiểm tra Micro và thử nói lớn hơn nhé.'
          };
        } else {
          const apiRes = await evaluateWithGemini(transcriptStr, currentItem.jp, level, type, lang);
          if (apiRes) {
            res = {
              score: apiRes.score,
              level: apiRes.level,
              criteria: {
                [t('cPronunciation')]: apiRes.pronunciation_score || "0.0",
                [t('cFluency')]: apiRes.fluency_score || "0.0",
                [t('cContentAccuracy')]: apiRes.accuracy_score || "0.0"
              },
              feedback: apiRes.feedback
            };
          } else {
            // Fallback an toàn nếu API quá tải
            res = generateGradingResultFallback(transcriptStr, currentItem.jp, level, type, lang, t);
          }
        }
      }
      setSentenceResult(res);
    } catch (error) {
      console.error("Shadowing Error:", error);
      const currentItem = selectedLesson.items[currentIndex];
      setSentenceResult(generateGradingResultFallback(transcriptStr, currentItem.jp, level, type, lang, t));
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextItem = () => {
    setRecordedFile(null); setRecordedUrl(null); setSentenceResult(null);
    setCurrentIndex(prev => prev + 1);
  };

  if (setupStep) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#f0e0d8] animate-in fade-in pb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <MessageCircle className="text-[#F26522]" /> {t('shadowingTitle')}
        </h2>

        <div className="mb-6">
          <label className="block font-bold text-slate-700 mb-2">{t('chooseLevel')}</label>
          <div className="flex gap-2 flex-wrap">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
              <button key={lvl} onClick={() => setLevel(lvl)} className={`flex-1 py-3 rounded-xl font-bold border transition-all ${level === lvl ? 'bg-[#F26522] text-white border-[#F26522] shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:border-[#F26522]'}`}>
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-bold text-slate-700 mb-2">{t('chooseType')}</label>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setType('vocab')} className={`py-4 rounded-xl font-bold border flex flex-col items-center justify-center gap-2 transition-all ${type === 'vocab' ? 'bg-orange-50 border-[#F26522] text-[#F26522]' : 'bg-white text-slate-600 border-slate-300 hover:border-[#F26522]'}`}>
              <span className="text-2xl">Palabra</span>{t('vocab')}
            </button>
            <button onClick={() => setType('sentence')} className={`py-4 rounded-xl font-bold border flex flex-col items-center justify-center gap-2 transition-all ${type === 'sentence' ? 'bg-orange-50 border-[#F26522] text-[#F26522]' : 'bg-white text-slate-600 border-slate-300 hover:border-[#F26522]'}`}>
              <span className="text-2xl">Frase</span>{t('sentence')}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-bold text-slate-700 mb-2">{t('chooseLesson')}</label>
          {lessons.length === 0 ? (
            <p className="text-sm text-red-500 italic">{t('noLesson')}</p>
          ) : (
            <div className="space-y-3">
              {lessons.map(lesson => (
                <button key={lesson.id} onClick={() => startPractice(lesson)} className="w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-[#F26522] hover:shadow-md transition-all flex justify-between items-center group">
                  <div>
                    <h4 className="font-bold text-slate-800">{lesson.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('lessonItems').replace('{0}', lesson.items.length)}</p>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-[#F26522]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentIndex >= selectedLesson.items.length) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white/95 rounded-3xl p-10 text-center shadow-xl border border-[#f0e0d8]">
        <Award size={64} className="text-[#F26522] mx-auto mb-4" />
        <h2 className="text-3xl font-black text-slate-800 mb-2">{t('completed')}</h2>
        <p className="text-slate-600 mb-8">{t('completedDesc')} "{selectedLesson.title}".</p>
        <button onClick={() => setSetupStep(true)} className="bg-[#F26522] text-white px-8 py-3 rounded-xl font-bold shadow-lg">{t('chooseOther')}</button>
      </div>
    );
  }

  const currentItem = selectedLesson.items[currentIndex];

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-in fade-in duration-500 px-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle className="text-[#F26522]" /> {selectedLesson.title} ({level})
        </h2>
        <span className="bg-white px-4 py-1.5 rounded-full font-bold text-[#F26522] shadow-sm text-sm border border-[#f0e0d8]">
          {currentIndex + 1} / {selectedLesson.items.length}
        </span>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 border border-[#f0e0d8]">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 relative shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F26522] rounded-l-2xl"></div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="w-full min-w-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-medium text-slate-900 mb-4 font-serif tracking-wide leading-relaxed break-words">
                <SpanishText text={currentItem.jp} />
              </div>
              <p className="text-sm text-slate-500 italic break-words">{currentItem[lang] || currentItem.vi}</p>
            </div>

            <div className="flex gap-2 shrink-0 self-start mt-2 sm:mt-0">
              <button onClick={() => playModelAudio(currentItem.jp, 'slow')} disabled={isPlayingModel !== false} className={`flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-md transition-all border-2 ${isPlayingModel === 'slow' ? 'bg-blue-50 border-blue-400 text-blue-600 animate-pulse' : 'bg-white border-slate-200 hover:border-[#F26522] hover:text-[#F26522] text-slate-700'}`} title="Nghe đọc chậm">
                <Volume1 size={20} className={isPlayingModel === 'slow' ? "opacity-50" : ""} />
                <span className="text-[9px] font-bold mt-0.5 uppercase">{t('listenSlow')}</span>
              </button>
              <button onClick={() => playModelAudio(currentItem.jp, 'normal')} disabled={isPlayingModel !== false} className={`flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-md transition-all border-2 ${isPlayingModel === 'normal' ? 'bg-blue-50 border-blue-400 text-blue-600 animate-pulse' : 'bg-white border-slate-200 hover:border-[#F26522] hover:text-[#F26522] text-slate-700'}`} title="Nghe đọc chuẩn">
                <Volume2 size={20} className={isPlayingModel === 'normal' ? "opacity-50" : ""} />
                <span className="text-[9px] font-bold mt-0.5 uppercase">{t('listenNormal')}</span>
              </button>
            </div>
          </div>
        </div>

        {!recordedFile && !isEvaluating && (
          <div className="animate-in fade-in">
            <div className="bg-orange-50 text-orange-800 p-3 rounded-lg mb-4 text-sm font-medium border border-orange-200">
              <Info size={16} className="inline mr-1" />
              {t('yourTurn')}
            </div>
            <AudioInput onAudioReady={handleAudioReady} />
          </div>
        )}

        {isEvaluating && (
          <div className="py-8 flex flex-col items-center">
            <Activity size={48} className="text-[#F26522] animate-bounce mb-4" />
            <p className="font-medium text-slate-600">{t('grading')}</p>
          </div>
        )}

        {sentenceResult && !isEvaluating && (
          <div className="animate-in slide-in-from-bottom-4">
            <div className={`p-6 rounded-2xl border shadow-sm ${parseFloat(sentenceResult.score) >= 8.0 ? 'bg-green-50 border-green-200' : parseFloat(sentenceResult.score) >= 6.0 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} mb-6 flex flex-col md:flex-row gap-6 items-center md:items-start`}>

              <div className={`w-24 h-24 rounded-full flex items-center justify-center flex-col shadow-inner shrink-0 ${parseFloat(sentenceResult.score) >= 8.0 ? 'bg-green-500 text-white' : parseFloat(sentenceResult.score) >= 6.0 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>
                <span className="font-black text-3xl">{sentenceResult.score}</span>
              </div>

              <div className="flex-1 w-full text-center md:text-left">
                <h4 className="font-bold text-slate-800 mb-2 text-lg">{t('analysis')}</h4>
                <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">{sentenceResult.feedback}</p>
                <div className="bg-white/50 p-2 rounded-lg inline-block w-full">
                  <audio controls src={recordedUrl} className="h-10 w-full rounded" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
              <button onClick={() => { setRecordedFile(null); setSentenceResult(null); }} className="flex-1 py-4 bg-white border border-slate-300 hover:border-[#F26522] hover:text-[#F26522] text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <RefreshCcw size={18} /> {t('tryAgain')}
              </button>
              <button onClick={nextItem} className="flex-1 py-4 bg-[#F26522] hover:bg-[#d95618] text-white font-black tracking-wide rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                {t('nextItem')} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// COMPONENT: PHIẾU BÁO CÁO (CHUNG)
// ---------------------------------------------------------
function ReportCard({ result, studentName, fileUrl, onReset }) {
  const { t } = useContext(LanguageContext);
  const criteriaKeys = Object.keys(result.criteria);

  return (
    <>
      <div className="flex justify-between items-center mb-6 no-print">
        <button onClick={onReset} className="flex items-center gap-2 text-slate-600 hover:text-[#F26522] font-bold bg-white/80 px-5 py-2.5 rounded-xl shadow-sm border border-slate-200">
          <RefreshCcw size={18} /> {t('gradeAnother')}
        </button>
        <button onClick={() => window.print()} className="bg-[#F26522] hover:bg-[#d95618] text-white px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95">
          <Download size={18} /> {t('exportPDF')}
        </button>
      </div>

      <div id="printable-report" className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-[#f0e0d8]">
        <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] bg-[#fffcf9]">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-[#F26522] rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
              <Star size={28} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-black text-2xl text-slate-800 leading-tight">{t('reportTitle')}</h2>
              <p className="text-xs text-[#F26522] font-bold tracking-widest mt-2 uppercase">{t('analyzedBy')}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          <div className="bg-[#fff0f5] border border-[#ffe4e1] rounded-2xl p-3 text-center min-w-[120px]">
            <p className="text-[10px] font-bold text-[#F26522] tracking-widest uppercase mb-1">{t('student')}</p>
            <p className="font-bold text-slate-800 text-lg">{studentName}</p>
          </div>
        </div>

        <div className="p-8">
          {fileUrl && (
            <div className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100 no-print flex items-center gap-4">
              <Volume2 size={24} className="text-[#F26522] shrink-0" />
              <div className="flex-1 w-full">
                <p className="text-sm font-bold text-slate-700 mb-2">{t('originalAudio')}</p>
                <audio controls src={fileUrl} className="w-full h-10" />
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-[#fff0f5] flex items-center justify-center bg-white shadow-inner relative z-10">
                <span className="text-5xl font-black text-[#F26522]">{result.score}</span>
              </div>
              <div className="absolute inset-[-4px] rounded-full border border-[#ffe4e1] z-0"></div>
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">
                <Award size={20} />
              </div>
            </div>
            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase mt-4">{t('avgScore')}</p>

            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <div className="px-6 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-black tracking-wide uppercase border border-green-200 shadow-sm">
                {t('rank')} {result.level}
              </div>
              {result.estimated_cefr && result.estimated_cefr.trim() !== '' && (
                <div className="px-6 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-black tracking-wide uppercase border border-blue-200 shadow-sm animate-in zoom-in">
                  {t('estimatedLevel')} {result.estimated_cefr}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            {criteriaKeys.map(key => (
              <CriteriaBar key={key} label={key} score={result.criteria[key]} />
            ))}
          </div>

          <div className="bg-orange-50/50 rounded-2xl p-6 md:p-8 relative border border-orange-100 shadow-sm mt-8">
            <div className="absolute -top-4 left-6 bg-white p-1.5 rounded-lg shadow-sm text-[#F26522] border border-orange-100">
              <MessageSquare size={20} fill="currentColor" />
            </div>
            <h3 className="font-bold text-slate-800 mb-4 text-lg border-b border-orange-200/50 pb-3">{t('systemAnalysis')}</h3>
            <p className="text-slate-800 leading-relaxed text-sm whitespace-pre-line font-medium">
              {result.feedback}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function CriteriaBar({ label, score }) {
  const percentage = (parseFloat(score) / 10) * 100;
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm text-slate-600">{label}</span>
        <span className="font-black text-[#F26522] text-base">{score}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-400 to-[#F26522]" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

