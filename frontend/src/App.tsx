import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  FileQuestion,
  Settings as SettingsIcon,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronLeft,
  Search,
  BookMarked,
  ArrowRight,
  Send,
  HelpCircle,
  Award,
  AlertCircle,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';

interface Curriculum {
  id: number;
  name: string;
  subject: string;
  stage?: string;
  grade?: string;
  year?: string;
  edition?: string;
  status: string;
  description?: string;
}

interface Chapter {
  id: number;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  order_index: number;
  summary?: string;
  status: string;
}

interface ContentChunk {
  id: number;
  page_number?: number;
  heading?: string;
  content_text: string;
  image_paths: string[];
  has_math: boolean;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  sources: Array<{ page: number; heading: string; snippet: string }>;
  has_external_content?: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'curriculums' | 'study' | 'exams' | 'settings'>('dashboard');
  const [serverStatus, setServerStatus] = useState<{ online: boolean; hasKey: boolean }>({ online: false, hasKey: false });
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonChunks, setLessonChunks] = useState<ContentChunk[]>([]);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState<'standard' | 'simple' | 'deep' | 'step_by_step'>('standard');
  const [allowExternal, setAllowExternal] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<number | null>(null);

  // New curriculum modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCurrName, setNewCurrName] = useState('');
  const [newCurrSubject, setNewCurrSubject] = useState('');
  const [newCurrGrade, setNewCurrGrade] = useState('');
  const [newCurrStage, setNewCurrStage] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Check backend health
  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setServerStatus({ online: true, hasKey: data.has_ai_key });
      } else {
        setServerStatus({ online: false, hasKey: false });
      }
    } catch {
      setServerStatus({ online: false, hasKey: false });
    }
  };

  // Fetch curriculums
  const fetchCurriculums = async () => {
    try {
      const res = await fetch('/api/curriculums');
      if (res.ok) {
        const data = await res.json();
        setCurriculums(data);
        if (data.length > 0 && !selectedCurriculum) {
          setSelectedCurriculum(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchCurriculums();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch chapters when curriculum changes
  useEffect(() => {
    if (selectedCurriculum) {
      fetch(`/api/curriculums/${selectedCurriculum.id}/chapters`)
        .then(r => r.json())
        .then(data => {
          setChapters(data);
          if (data.length > 0 && data[0].lessons.length > 0) {
            setSelectedLesson(data[0].lessons[0]);
          } else {
            setSelectedLesson(null);
          }
        })
        .catch(console.error);
    }
  }, [selectedCurriculum]);

  // Fetch lesson chunks and start session
  useEffect(() => {
    if (selectedCurriculum && selectedLesson) {
      // Get chunks
      fetch(`/api/curriculums/${selectedCurriculum.id}/chunks?lesson_id=${selectedLesson.id}`)
        .then(r => r.json())
        .then(setLessonChunks)
        .catch(console.error);

      // Create or get chat session
      fetch('/api/tutor/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculum_id: selectedCurriculum.id,
          lesson_id: selectedLesson.id,
          title: `محادثة درس ${selectedLesson.title}`
        })
      })
        .then(r => r.json())
        .then(sess => {
          setChatSessionId(sess.id);
          setMessages([
            {
              id: 0,
              role: 'assistant',
              content: `أهلاً بك! أنا معلمك الذكي لدرس «${selectedLesson.title}». يمكنك طرح أي سؤال وسأجيبك بالدليل من نصوص وصفحات كتابك.`,
              sources: []
            }
          ]);
        })
        .catch(console.error);
    }
  }, [selectedCurriculum, selectedLesson]);

  // Send message to AI Tutor
  const handleSendMessage = async () => {
    if (!inputQuery.trim() || !chatSessionId) return;

    const userText = inputQuery;
    setInputQuery('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userText, sources: [] }]);
    setIsAiLoading(true);

    try {
      const res = await fetch(`/api/tutor/sessions/${chatSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userText,
          explanation_level: explanationLevel,
          allow_external_enrichment: allowExternal
        })
      });

      if (res.ok) {
        const botMsg = await res.json();
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Add Curriculum Handler
  const handleCreateCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCurrName || !newCurrSubject) return;

    setIsUploading(true);
    try {
      // 1. Create curriculum
      const res = await fetch('/api/curriculums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCurrName,
          subject: newCurrSubject,
          grade: newCurrGrade,
          stage: newCurrStage,
          description: 'منهج مضاف بواسطة المستخدم'
        })
      });

      if (res.ok) {
        const created = await res.json();
        
        // 2. Upload file if provided
        if (uploadFile) {
          const formData = new FormData();
          formData.append('file', uploadFile);
          await fetch(`/api/curriculums/${created.id}/upload`, {
            method: 'POST',
            body: formData
          });
        }

        setShowAddModal(false);
        setNewCurrName('');
        setNewCurrSubject('');
        setUploadFile(null);
        await fetchCurriculums();
        setSelectedCurriculum(created);
        setActiveTab('curriculums');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  // Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!selectedLesson) return;
    setIsGeneratingQuiz(true);
    setQuizSubmitted(false);
    setUserAnswers({});
    setQuizResult(null);

    try {
      const res = await fetch(`/api/exams/generate-lesson-quiz/${selectedLesson.id}?count=4`, {
        method: 'POST'
      });
      if (res.ok) {
        // Fetch generated questions
        const qRes = await fetch(`/api/exams/questions?curriculum_id=${selectedCurriculum?.id}&lesson_id=${selectedLesson.id}`);
        const qs = await qRes.json();
        setQuizQuestions(qs);
        setActiveTab('exams');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correct_answer) {
        score += q.points;
      }
    });
    const total = quizQuestions.reduce((acc, q) => acc + q.points, 0);
    const percentage = total > 0 ? (score / total) * 100 : 0;
    setQuizResult({ score, total, percentage });
    setQuizSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">النظام التعليمي التفاعلي</h1>
              <p className="text-xs text-slate-500">منصة المناهج والمساعد الذكي الموثق</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: BookOpen },
              { id: 'curriculums', label: 'المناهج والمحتوى', icon: BookMarked },
              { id: 'study', label: 'المذاكرة والمساعد', icon: MessageSquare },
              { id: 'exams', label: 'الاختبارات والتقييم', icon: FileQuestion },
              { id: 'settings', label: 'الإعدادات', icon: SettingsIcon },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Status Indicators */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                serverStatus.online
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${serverStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{serverStatus.online ? 'الخادم متصل' : 'جارٍ الاتصال...'}</span>
            </div>
            {serverStatus.hasKey && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Gemini AI نشط
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Welcome Card */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  النسخة الأولى (MVP) جاهزة للعمل المحلي
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">مرحباً بك في منصتك التعليمية الشخصية</h2>
                <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6">
                  ارفع كتبك ومذكراتك بصيغة PDF أو Word، ليتكفل النظام بهيكلتها واستخراج صورها ومعادلاتها، ثم استمتع بمذاكرة تفاعلية مع مساعد ذكي يوثق كل إجابة بالصفحة والمصدر.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (curriculums.length > 0) setActiveTab('study');
                      else setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md"
                  >
                    <BookOpen className="w-4 h-4" />
                    {curriculums.length > 0 ? 'استئناف المذاكرة' : 'إضافة منهج أول'}
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-medium px-4 py-2.5 rounded-xl text-sm border border-white/20 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    رفع كتاب جديد
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">المناهج المعتمدة</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{curriculums.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookMarked className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">الفصول الدراسية</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{chapters.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">الأسئلة المتوفرة</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{quizQuestions.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileQuestion className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">حالة المساعد الذكي</p>
                  <p className="text-sm font-bold text-emerald-600 mt-1">إسناد موثق 100%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Workflow Guidance according to Project Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                دورة العمل وفق وثيقة المشروع المعتمدة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: '1', title: 'رفع واستخراج المنهج', desc: 'قبول ملفات PDF و Word واستخراج النصوص والصور وتفكيك الفصول تلقائياً.' },
                  { step: '2', title: 'المراجعة والاعتماد', desc: 'مقارنة المستخرج بالأصل والتأكد من وضوح المعادلات والجداول ثم اعتماد النسخة.' },
                  { step: '3', title: 'المذاكرة والمساعد الموثق', desc: 'طرح الأسئلة مع ربط الإجابة بالصفحات المحددة ومنع الهلوسة وخيار الإثراء الخارجي.' },
                  { step: '4', title: 'التدريب والاختبارات', desc: 'توليد اختبارات ومحاكاة الامتحانات والتصحيح الفوري مع التدريب العلاجي.' },
                ].map(item => (
                  <div key={item.step} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                        {item.step}
                      </span>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CURRICULUMS & CONTENT LIBRARY */}
        {activeTab === 'curriculums' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">مكتبة المناهج والمحتوى</h2>
                <p className="text-xs text-slate-500">إدارة الكتب الدراسية والملفات المرفوعة وهيكلتها</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-all"
              >
                <Upload className="w-4 h-4" />
                إضافة منهج دراسي جديد
              </button>
            </div>

            {/* Curriculums Cards */}
            {curriculums.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800">لا توجد مناهج مضافة بعد</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  ابدأ برفع أول كتاب بصيغة PDF أو Word ليقوم النظام باستخراج الفصول والدروس فورياً.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  إضافة كتاب الآن
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {curriculums.map(curr => (
                  <div
                    key={curr.id}
                    className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                      selectedCurriculum?.id === curr.id ? 'border-indigo-500 ring-2 ring-indigo-50' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
                          {curr.subject}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                          curr.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {curr.status === 'approved' ? 'معتمد للتعلم' : 'قيد المراجعة'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">{curr.name}</h3>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{curr.description || 'لا يوجد وصف مضاف'}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-4">
                        <div>
                          <span className="text-slate-400 block text-[10px]">الصف:</span>
                          <span className="font-medium">{curr.grade || 'غير محدد'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">المرحلة:</span>
                          <span className="font-medium">{curr.stage || 'غير محدد'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedCurriculum(curr);
                          setActiveTab('study');
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-semibold transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        بدء المذاكرة
                      </button>
                      {curr.status !== 'approved' && (
                        <button
                          onClick={async () => {
                            await fetch(`/api/curriculums/${curr.id}/approve`, { method: 'POST' });
                            fetchCurriculums();
                          }}
                          className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                          title="اعتماد المنهج"
                        >
                          اعتماد
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STUDY & AI TUTOR */}
        {activeTab === 'study' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
            
            {/* Sidebar: Chapters & Lessons Navigator */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <label className="text-xs font-semibold text-slate-500 block mb-1">المنهج الحالي</label>
                <select
                  value={selectedCurriculum?.id || ''}
                  onChange={e => {
                    const c = curriculums.find(item => item.id === Number(e.target.value));
                    if (c) setSelectedCurriculum(c);
                  }}
                  className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                >
                  {curriculums.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.subject})</option>
                  ))}
                </select>
              </div>

              {/* Chapters Tree */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chapters.length === 0 ? (
                  <div className="text-center p-6 text-slate-400 text-xs">
                    لم يتم استخراج فصول بعد. يرجى رفع ملف للمنهج.
                  </div>
                ) : (
                  chapters.map(chap => (
                    <div key={chap.id} className="border border-slate-100 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>{chap.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{chap.lessons?.length || 0} دروس</span>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {chap.lessons?.map(les => (
                          <button
                            key={les.id}
                            onClick={() => setSelectedLesson(les)}
                            className={`w-full text-right px-3 py-2.5 text-xs flex items-center justify-between transition-all ${
                              selectedLesson?.id === les.id
                                ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span>{les.title}</span>
                            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Lesson Action Bar */}
              {selectedLesson && (
                <div className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={isGeneratingQuiz}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-xl text-xs font-semibold shadow-xs hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGeneratingQuiz ? 'جارٍ إعداد الاختبار...' : 'اختبار فوري على الدرس'}
                  </button>
                </div>
              )}
            </div>

            {/* Main Area: Lesson Content & AI Assistant */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              
              {/* Left Column: Lesson Extracted Text & Sources */}
              <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      {selectedLesson ? selectedLesson.title : 'اختر درساً للمطالعة'}
                    </h3>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    {lessonChunks.length} مقاطع معتمدة
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed text-slate-700">
                  {lessonChunks.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      لا توجد نصوص متوفرة لهذا الدرس حالياً.
                    </div>
                  ) : (
                    lessonChunks.map((chunk, idx) => (
                      <div key={chunk.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 relative group">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 pb-1 border-b border-slate-200/50">
                          <span className="font-semibold text-indigo-600">
                            {chunk.heading || `فقرة ${chunk.id}`}
                          </span>
                          <span>صفحة الكتاب: {chunk.page_number || '1'}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{chunk.content_text}</p>
                        
                        {/* Display extracted images if any */}
                        {chunk.image_paths && chunk.image_paths.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {chunk.image_paths.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt="مخطط توضيحي"
                                className="max-h-36 rounded-lg border border-slate-200 shadow-xs object-contain bg-white"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: AI Tutor Chat */}
              <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-xs">
                {/* Chat Header & Options */}
                <div className="p-3 border-b border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">المعلم الذكي الموثق</span>
                    </div>
                    
                    {/* External Enrichment Toggle */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-600">
                      <input
                        type="checkbox"
                        checked={allowExternal}
                        onChange={e => setAllowExternal(e.target.checked)}
                        className="rounded-sm text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                      />
                      <span>إثراء خارجي</span>
                    </label>
                  </div>

                  {/* Explanation Level Selector */}
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-slate-400">مستوى الشرح:</span>
                    {(['standard', 'simple', 'deep', 'step_by_step'] as const).map(lvl => {
                      const labels = { standard: 'قياسي', simple: 'مبسط', deep: 'متعمق', step_by_step: 'خطوات' };
                      return (
                        <button
                          key={lvl}
                          onClick={() => setExplanationLevel(lvl)}
                          className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                            explanationLevel === lvl
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {labels[lvl]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60'
                        }`}
                      >
                        {msg.content}

                        {/* Grounding Sources Badges */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 block">مصادر الإسناد بالكتاب:</span>
                            <div className="flex flex-wrap gap-1">
                              {msg.sources.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-600"
                                  title={s.snippet}
                                >
                                  <BookOpen className="w-2.5 h-2.5 text-indigo-600" />
                                  صفحة {s.page}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>المعلم الذكي يطالع نصوص المنهج ويبني إجابتك...</span>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <div className="p-2.5 border-t border-slate-100 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputQuery}
                      onChange={e => setInputQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اسأل المعلم عن أي نقطة في هذا الدرس..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isAiLoading || !inputQuery.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXAMS & ASSESSMENT */}
        {activeTab === 'exams' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">اختبار تدريبي على الدرس</h2>
                <p className="text-xs text-slate-500">
                  {selectedLesson ? `درس: ${selectedLesson.title}` : 'يرجى اختيار درس أولاً'}
                </p>
              </div>
              <button
                onClick={handleGenerateQuiz}
                disabled={isGeneratingQuiz}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingQuiz ? 'animate-spin' : ''}`} />
                توليد أسئلة جديدة
              </button>
            </div>

            {/* Quiz Result Banner */}
            {quizSubmitted && quizResult && (
              <div className={`p-6 rounded-2xl border text-center ${
                quizResult.percentage >= 60
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <Award className="w-12 h-12 mx-auto mb-2 text-emerald-600" />
                <h3 className="text-xl font-bold mb-1">
                  {quizResult.percentage >= 60 ? 'أحسنت! اجتزت الاختبار بنجاح' : 'تحتاج لمراجعة بعض المفاهيم'}
                </h3>
                <p className="text-sm font-semibold">
                  درجتك: {quizResult.score} من {quizResult.total} ({quizResult.percentage}%)
                </p>
              </div>
            )}

            {/* Questions List */}
            {quizQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800">لا توجد أسئلة حالية لهذا الدرس</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  انقر على زر التوليد في الأسفل ليقوم الذكاء الاصطناعي ببناء اختبار فوري مبني على نصوص الكتاب.
                </p>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs"
                >
                  توليد اختبار تدريبي الآن
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {quizQuestions.map((q, qIdx) => (
                  <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-indigo-600">سؤال {qIdx + 1}</span>
                      <span className="text-[10px] text-slate-400">{q.points} درجة</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.question_text}</p>
                    
                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isSelected = userAnswers[q.id] === opt;
                        const isCorrect = q.correct_answer === opt;
                        let optionStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                        if (quizSubmitted) {
                          if (isCorrect) optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
                          else if (isSelected && !isCorrect) optionStyle = 'border-rose-500 bg-rose-50 text-rose-800';
                        } else if (isSelected) {
                          optionStyle = 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className={`w-full text-right p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission */}
                    {quizSubmitted && q.explanation && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                        <span className="font-bold text-slate-700 block">تفسير الإجابة:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}

                {!quizSubmitted && (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm shadow-md transition-all"
                  >
                    تسليم الإجابات وعرض النتيجة
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">إعدادات النظام والتشغيل</h2>
              <p className="text-xs text-slate-500">إدارة مفاتيح الذكاء الاصطناعي والنسخ الاحتياطي وحالة الشبكة</p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">حالة الخادم المحلي</h4>
                  <p className="text-xs text-slate-500">يعمل محلياً على المنفذ 8000</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  متصل ونشط
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">مزود الذكاء الاصطناعي</h4>
                  <p className="text-xs text-slate-500">Google Gemini 2.5 Flash للتوثيق والإسناد</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  مهيأ عبر البيئة
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">الوصول من الهاتف والأجهزة اللوحية</h4>
                  <p className="text-xs text-slate-500">الشبكة المحلية مفعلة (Host mode ON)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  متاح عبر الـ IP
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add Curriculum Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">إضافة منهج دراسي جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCurriculum} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">اسم المنهج *</label>
                <input
                  type="text"
                  required
                  value={newCurrName}
                  onChange={e => setNewCurrName(e.target.value)}
                  placeholder="مثال: كتاب الأحياء للصف الثالث الثانوي"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">المادة الدراسية *</label>
                  <input
                    type="text"
                    required
                    value={newCurrSubject}
                    onChange={e => setNewCurrSubject(e.target.value)}
                    placeholder="مثال: أحياء، رياضيات..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">الصف</label>
                  <input
                    type="text"
                    value={newCurrGrade}
                    onChange={e => setNewCurrGrade(e.target.value)}
                    placeholder="مثال: الثالث الثانوي"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ملف الكتاب (PDF أو Word أو صورة)</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50 transition-all">
                  <input
                    type="file"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={e => e.target.files && setUploadFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-xs font-medium text-indigo-600 block">
                      {uploadFile ? uploadFile.name : 'انقر لاختيار ملف المنهج'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      يدعم PDF و Word و صور الصفحات
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !newCurrName || !newCurrSubject}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs"
                >
                  {isUploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {isUploading ? 'جارٍ الرفع والمعالجة...' : 'حفظ المنهج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
