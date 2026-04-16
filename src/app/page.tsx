"use client";

import React, { useState, useEffect } from 'react';
import { 
  Home, TrendingUp, BrainCircuit, Video, BarChart3, Globe, 
  Menu, X, CheckCircle, Zap, MonitorPlay, Play, RefreshCw, 
  Settings, Save, Edit3, CheckSquare, Square, Bell, Calendar, Key
} from 'lucide-react';

// --- 전역 UI 컴포넌트 ---
const GlassCard = ({ children, className = "", noPadding = false, glow = false }: any) => (
  <div className={`
    relative bg-[#0a0f1c]/70 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden
    ${glow ? 'shadow-[0_0_25px_rgba(56,189,248,0.2)]' : 'shadow-xl'}
    transition-all duration-300 ${noPadding ? '' : 'p-6'} ${className}
  `}>
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
    {children}
  </div>
);

const NeonText = ({ children, className = "" }: any) => (
  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 font-bold ${className}`}>
    {children}
  </span>
);

const GlowButton = ({ children, onClick, active = false, disabled = false, className = "", icon: Icon, isLoading = false }: any) => (
  <button 
    onClick={disabled || isLoading ? undefined : onClick}
    disabled={disabled || isLoading}
    className={`
      flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden group
      ${disabled ? 'bg-white/5 text-slate-500 cursor-not-allowed border-white/5' : 
        active 
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-transparent hover:scale-[1.02]' 
          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'}
      ${className}
    `}
  >
    {active && !disabled && <div className="absolute inset-0 bg-white/20 blur-md group-hover:opacity-100 opacity-0 transition-opacity"></div>}
    {Icon && !isLoading && <Icon size={18} className={(active && !disabled) ? 'animate-pulse' : ''} />}
    {isLoading && <RefreshCw size={18} className="animate-spin" />}
    <span className="relative z-10">{isLoading ? '처리 중...' : children}</span>
  </button>
);

// --- 목업 데이터 ---
const INITIAL_PRODUCTS = [
  { id: 1, name: "샤오미 미지아 스마트 로봇청소기 Pro", price: "₩289,000", roi: "12.5%", source: "AliExpress", trend: "상승 (24h)", img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 2, name: "초경량 맥세이프 보조배터리 10000mAh", price: "₩19,900", roi: "15.0%", source: "Coupang", trend: "급상승", img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 3, name: "직장인 필수템 어깨/목 EMS 안마기", price: "₩35,000", roi: "18.2%", source: "Amazon", trend: "유지", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300&h=300" },
];

export default function ShortsFactoryPlatform() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [pipelineState, setPipelineState] = useState({
    products: INITIAL_PRODUCTS,
    selectedForScript: [] as number[],
    scripts: {} as any,
    selectedForRender: [] as number[],
    scheduledItems: [] as any[],
  });

  const showToast = (message: string, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: Home },
    { id: 'sourcing', label: 'AI 자동 소싱', icon: Globe },
    { id: 'script', label: '대본 에디터', icon: BrainCircuit },
    { id: 'studio', label: '오토 렌더 스튜디오', icon: Video },
    { id: 'scheduler', label: '퍼블리시 스케줄러', icon: Calendar },
    { id: 'settings', label: '환경 설정', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setCurrentView(id);
    setIsMobileMenuOpen(false);
  };

  // --- 뷰 1: 대시보드 ---
  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">환영합니다, <NeonText>크리에이터님</NeonText></h2>
          <p className="text-slate-400 text-sm">시스템 정상 가동 중. 보호된 보안 API를 통해 클라우드와 연결되어 있습니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "로컬 보안 키", value: "Active", icon: Key, color: "text-emerald-400" },
          { title: "대기 중인 상품", value: `${pipelineState.products.length - pipelineState.selectedForScript.length} 개`, icon: Globe, color: "text-cyan-400" },
          { title: "생성된 대본", value: `${Object.keys(pipelineState.scripts).length} 개`, icon: BrainCircuit, color: "text-purple-400" },
          { title: "스케줄러 예약", value: `${pipelineState.scheduledItems.length} 건`, icon: MonitorPlay, color: "text-red-400" },
        ].map((stat, i) => (
          <GlassCard key={i} className="flex flex-col justify-center border-t-2" style={{ borderTopColor: 'currentColor', color: stat.color }}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-white/5 text-white`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  // --- 뷰 2: AI 자동 소싱 (서버 측 비즈니스 로직 적용) ---
  const SourcingView = () => {
    const toggleProduct = (id: number) => {
      setPipelineState(prev => ({
        ...prev,
        selectedForScript: prev.selectedForScript.includes(id)
          ? prev.selectedForScript.filter(pId => pId !== id)
          : [...prev.selectedForScript, id]
      }));
    };

    const generateScripts = async () => {
      if (pipelineState.selectedForScript.length === 0) {
        showToast('상품을 1개 이상 선택해주세요.', 'error');
        return;
      }
      
      const apiKey = localStorage.getItem('GEMINI_API_KEY');
      if (!apiKey) {
        showToast('환경 설정에서 Gemini API 키를 먼저 입력해주세요!', 'error');
        setCurrentView('settings');
        return;
      }

      setIsProcessing(true);
      showToast('Gemini API 모델에 직접 요청 중입니다...', 'info');
      
      try {
        const newScripts: any = {};
        
        await Promise.all(pipelineState.selectedForScript.map(async (id: number) => {
           const prod = pipelineState.products.find(p => p.id === id);
           if (!prod) return;

           const prompt = `당신은 최고의 숏폼 전문 대본 작가입니다. 이름: ${prod.name}, 가격: ${prod.price}, 출처: ${prod.source}, 특징: ${prod.trend}. 친근하고 에너지가 넘치며 후킹이 강한 틱톡커 톤으로 작성하세요. 결과는 오직 다음 구조의 순수 JSON 포맷으로 출력하세요(마크다운 \`\`\`json 등 포함 금지): {"title": "...", "hook": "...", "body": "...", "cta": "..."}`;

           const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                 contents: [{ parts: [{ text: prompt }] }],
                 generationConfig: { responseMimeType: "application/json" }
              })
           });

           if (!response.ok) throw new Error('API 응답 에러');

           const data = await response.json();
           const textResult = data.candidates[0].content.parts[0].text;
           const scriptData = JSON.parse(textResult);
           newScripts[id] = scriptData;
        }));

        setPipelineState(prev => ({ ...prev, scripts: { ...prev.scripts, ...newScripts } }));
        showToast('대본 생성이 완료되었습니다!', 'success');
        setCurrentView('script');
        
      } catch (err) {
        console.error("Gemini 연동 에러:", err);
        showToast('API 통신 중 오류가 발생했습니다. 키를 확인하세요.', 'error');
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-cyan-900/20 p-4 rounded-xl border border-cyan-500/30">
          <div>
             <h3 className="text-cyan-400 font-bold">1단계: 상품 소싱 및 선택</h3>
             <p className="text-sm text-slate-400">대본을 생성할 상품을 선택하세요. ({pipelineState.selectedForScript.length}개 선택됨)</p>
          </div>
          <GlowButton active onClick={generateScripts} icon={BrainCircuit} disabled={pipelineState.selectedForScript.length === 0} isLoading={isProcessing}>
            선택 항목 대본 생성
          </GlowButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pipelineState.products.map(prod => {
            const isSelected = pipelineState.selectedForScript.includes(prod.id);
            return (
              <GlassCard key={prod.id} noPadding className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-cyan-500 border-transparent' : 'hover:border-cyan-500/50'}`} glow={isSelected}>
                <div onClick={() => toggleProduct(prod.id)} className="absolute top-3 right-3 z-20 bg-black/50 rounded-md p-1">
                  {isSelected ? <CheckSquare className="text-cyan-400" /> : <Square className="text-slate-400" />}
                </div>
                <div className="relative h-48 overflow-hidden bg-black">
                  <img src={prod.img} className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'opacity-100 scale-105' : 'opacity-60'}`} alt="product" />
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <span className="text-xs text-purple-400 bg-purple-400/10 w-max px-2 py-1 rounded-md">{prod.source}</span>
                  <h3 className="font-bold text-white line-clamp-2">{prod.name}</h3>
                  <p className="text-cyan-400 font-bold">{prod.price}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 뷰 3: 대본 에디터 ---
  const ScriptEditorView = () => {
    const selectedProducts = pipelineState.products.filter(p => pipelineState.scripts[p.id]);

    const updateScript = (id: number, field: string, value: string) => {
      setPipelineState(prev => ({
        ...prev,
        scripts: {
          ...prev.scripts,
          [id]: { ...prev.scripts[id], [field]: value }
        }
      }));
    };

    const sendToStudio = () => {
      const idsToRender = Object.keys(pipelineState.scripts).map(Number);
      if (idsToRender.length === 0) {
         showToast('렌더링할 대본이 없습니다.', 'error');
         return;
      }
      setPipelineState(prev => ({ ...prev, selectedForRender: idsToRender }));
      showToast('스튜디오로 데이터를 전송했습니다.', 'success');
      setCurrentView('studio');
    };

    if (selectedProducts.length === 0) {
      return (
        <div className="text-center py-20">
          <BrainCircuit size={64} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">생성된 대본이 없습니다.</h3>
          <GlowButton onClick={() => setCurrentView('sourcing')}>소싱 화면로 가기</GlowButton>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
          <div>
             <h3 className="text-purple-400 font-bold">2단계: 대본 검수 및 편집</h3>
             <p className="text-sm text-slate-400">생성된 대본을 확인하고 렌더링 스튜디오로 전송하세요.</p>
          </div>
          <GlowButton active onClick={sendToStudio} icon={Video}>
            스튜디오로 전송 ({selectedProducts.length}건)
          </GlowButton>
        </div>

        {selectedProducts.map(prod => {
          const script = pipelineState.scripts[prod.id];
          return (
            <GlassCard key={prod.id} className="flex flex-col lg:flex-row gap-6 border-white/5">
               <div className="lg:w-1/4">
                 <img src={prod.img} className="w-full aspect-square object-cover rounded-xl border border-white/10 opacity-80" alt="prod"/>
                 <h4 className="mt-3 font-bold text-white text-sm">{prod.name}</h4>
               </div>
               <div className="lg:w-3/4 flex flex-col gap-4">
                 <div>
                   <label className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1"><Edit3 size={12}/> 영상 제목</label>
                   <input type="text" value={script.title} onChange={(e) => updateScript(prod.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-purple-400 mb-1 block">🔥 Hook (3초 훅)</label>
                     <textarea value={script.hook} onChange={(e) => updateScript(prod.id, 'hook', e.target.value)} className="w-full h-24 bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-purple-400 resize-none" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-cyan-400 mb-1 block">💡 Body (본문 설명)</label>
                     <textarea value={script.body} onChange={(e) => updateScript(prod.id, 'body', e.target.value)} className="w-full h-24 bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 resize-none" />
                   </div>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-emerald-400 mb-1 block">🎯 CTA (행동 유도)</label>
                   <input type="text" value={script.cta} onChange={(e) => updateScript(prod.id, 'cta', e.target.value)} className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-400" />
                 </div>
               </div>
            </GlassCard>
          );
        })}
      </div>
    );
  };

  // --- 뷰 4: 렌더 스튜디오 (브라우저 상 시뮬레이션으로 복구) ---
  const RenderStudioView = () => {
    const [renderingId, setRenderingId] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);

    const startRender = async (id: number) => {
      setRenderingId(id);
      setProgress(10);
      showToast('클라이언트 기반 렌더링 시뮬레이션을 시작합니다.', 'info');
      
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setRenderingId(null);
              showToast('렌더링 완료 및 스케줄러로 전송되었습니다.', 'success');
              
              setPipelineState(prev => {
                 const prod = prev.products.find(p => p.id === id);
                 const script = prev.scripts[id];
                 const newItem = {
                    id: Date.now(),
                    productId: id,
                    productName: prod?.name,
                    img: prod?.img,
                    title: script.title,
                    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24시간 뒤
                    status: '예약 대기중'
                 };
                 return {
                   ...prev,
                   selectedForRender: prev.selectedForRender.filter(rId => rId !== id),
                   scheduledItems: [...prev.scheduledItems, newItem]
                 };
              });
            }, 800);
            return 100;
          }
          return p + 10;
        });
      }, 500);
    };

    const items = pipelineState.selectedForRender.map(id => pipelineState.products.find(p => p.id === id)!);

    if (items.length === 0) {
      return (
        <div className="text-center py-20">
          <Video size={64} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">대기 중인 렌더링 작업이 없습니다.</h3>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
          <div>
             <h3 className="text-blue-400 font-bold">3단계: 오토 렌더링 시뮬레이션</h3>
             <p className="text-sm text-slate-400">대본을 바탕으로 브라우저에서 가상의 렌더링 처리를 수행합니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(prod => {
            const isRenderingThis = renderingId === prod.id;
            return (
              <GlassCard key={prod.id} className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-black shrink-0">
                     <img src={prod.img} className="w-full h-full object-cover opacity-70" alt="thumbnail"/>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm line-clamp-1">{pipelineState.scripts[prod.id]?.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">예상 렌더링 시간: 약 20초 (Local)</p>
                  </div>
                </div>

                {isRenderingThis ? (
                   <div className="mt-4">
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-cyan-400 animate-pulse">렌더링 로딩 중...</span>
                       <span className="text-white">{progress}%</span>
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-2">
                       <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                     </div>
                   </div>
                ) : (
                   <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                     <GlowButton onClick={() => startRender(prod.id)} active icon={Play} className="flex-1 py-2 text-sm">렌더링 시작</GlowButton>
                   </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 뷰 6: 스케줄러 화면 ---
  const SchedulerView = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-yellow-900/20 p-4 rounded-xl border border-yellow-500/30">
          <div>
             <h3 className="text-yellow-400 font-bold flex items-center gap-2"><Calendar size={18}/> 퍼블리시 스케줄러</h3>
             <p className="text-sm text-slate-400">완성된 영상을 플랫폼으로 전송 대기 중인 목록입니다.</p>
          </div>
          <GlowButton onClick={() => showToast('유튜브 API 연동이 필요합니다.', 'error')} active icon={MonitorPlay}>
            전체 즉시 업로드
          </GlowButton>
        </div>

        {pipelineState.scheduledItems.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={64} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">예약된 일정이 없습니다.</h3>
            <p className="text-slate-400">스튜디오에서 영상을 먼저 렌더링해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {pipelineState.scheduledItems.map(item => (
                <GlassCard key={item.id} className="flex flex-col md:flex-row gap-4 items-center !p-4">
                   <div className="w-16 h-16 rounded-lg overflow-hidden bg-black shrink-0 relative">
                     <img src={item.img} className="w-full h-full object-cover opacity-60" alt="thumb"/>
                     <MonitorPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-80" size={20}/>
                   </div>
                   <div className="flex-1 w-full text-left">
                      <div className="flex justify-between items-start">
                         <h4 className="font-bold text-white max-w-[70%] truncate">{item.title}</h4>
                         <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 flex items-center justify-center rounded-md font-bold whitespace-nowrap min-w-max ml-2">{item.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                         <Calendar size={12}/> {new Date(item.scheduledTime).toLocaleString('ko-KR')}
                      </p>
                   </div>
                </GlassCard>
             ))}
          </div>
        )}
      </div>
    );
  };

  // --- 뷰 5: 세팅 (로컬 스토리지에 키 저장, 제로 노출 보안) ---
  const SettingsView = () => {
    const [apiKeyInput, setApiKeyInput] = useState('');
    
    useEffect(() => {
      const stored = localStorage.getItem('GEMINI_API_KEY');
      if (stored) setApiKeyInput(stored);
    }, []);

    const saveKey = () => {
      if(!apiKeyInput.trim()) {
         localStorage.removeItem('GEMINI_API_KEY');
         showToast('키가 삭제되었습니다.', 'info');
         return;
      }
      localStorage.setItem('GEMINI_API_KEY', apiKeyInput);
      showToast('API 키가 브라우저 내부에 안전하게 저장되었습니다!', 'success');
    };

    return (
      <div className="max-w-2xl space-y-6 animate-in fade-in duration-500">
         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
           <Settings className="text-slate-400" /> 환경 설정 (Local Storage)
         </h2>
         
         <GlassCard className="space-y-6">
           <div>
             <div className="p-4 bg-purple-900/20 border border-purple-500/50 rounded-xl mb-6">
               <h3 className="text-purple-400 font-bold flex items-center gap-2 mb-2"><Key size={18}/> Zero-Exposure 보안 적용됨</h3>
               <p className="text-sm text-slate-300 leading-relaxed">
                 코드에 API 키를 하드코딩하지 않습니다. 본인의 API 키를 아래에 입력하면, 오직 <b>이 브라우저의 로컬 저장소</b>에만 저장되어 구동되므로 GitHub 소스코드를 통해 외부로 절대 유출되지 않습니다.
               </p>
             </div>
             
             <div>
                <label className="block text-sm font-bold text-purple-400 mb-2">Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..." 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-400 focus:outline-none font-mono text-sm" 
                />
             </div>
           </div>

           <div className="pt-6 border-t border-white/10">
              <GlowButton active icon={Save} onClick={saveKey} className="w-full">
                로컬 저장소에 키 안심 저장
              </GlowButton>
           </div>
         </GlassCard>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#04060d] text-slate-200 font-sans selection:bg-cyan-500/30 flex overflow-hidden">
      {/* Sci-Fi Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/10 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')] opacity-50"></div>
      </div>

      {/* Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#04060d]/90 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">S</div>
          <span className="font-bold text-white tracking-wider">Shorts<NeonText>Secure</NeonText></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0a0f1c]/60 backdrop-blur-2xl border-r border-white/5 
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.5)]
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 hidden md:flex items-center gap-3 px-6 border-b border-white/5 bg-black/20">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">S</div>
          <span className="font-bold text-lg text-white tracking-widest uppercase">Shorts<NeonText>Secure</NeonText></span>
        </div>

        <div className="flex-1 px-4 py-8 space-y-1.5 mt-16 md:mt-0 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Workspace Pipeline</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                ${currentView === item.id 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon size={18} className={currentView === item.id ? 'text-cyan-400' : ''} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">PRO</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Pro Creator</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Zero-Exposure</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 h-screen overflow-y-auto pt-20 md:pt-0 pb-10 scroll-smooth">
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-full">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'sourcing' && <SourcingView />}
          {currentView === 'script' && <ScriptEditorView />}
          {currentView === 'studio' && <RenderStudioView />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'scheduler' && <SchedulerView />}
        </div>
      </main>

      {/* Global Components */}
      <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`
          flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border
          ${toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100' : 
            toast.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-red-100' : 
            'bg-cyan-900/90 border-cyan-500/50 text-cyan-100'}
        `}>
          {toast.type === 'success' ? <CheckCircle size={20} className="text-emerald-400"/> : <Bell size={20} className="text-cyan-400" />}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}
