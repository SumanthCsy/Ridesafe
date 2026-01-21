
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Language, SpeedRecord } from './types';
import { translations } from './translations';

// --- Sub-components ---

const Speedometer: React.FC<{ speed: number; limit: number; lang: Language }> = ({ speed, limit, lang }) => {
  const t = translations[lang];
  const percentage = Math.min((speed / limit) * 100, 100);
  const isOverspeed = speed >= limit;
  const colorClass = isOverspeed ? 'text-red-500' : speed >= limit * 0.8 ? 'text-yellow-400' : 'text-blue-500';

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative w-72 h-72 flex items-center justify-center rounded-full bg-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,255,255,0.02)] border border-zinc-800">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 p-4">
          <circle
            cx="50%" cy="50%" r="120"
            className="stroke-zinc-800 fill-transparent"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <circle
            cx="50%" cy="50%" r="120"
            className={`fill-transparent transition-all duration-700 ease-out ${isOverspeed ? 'stroke-red-600' : 'stroke-blue-500'}`}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="754"
            strokeDashoffset={754 - (percentage / 100) * 754}
          />
        </svg>
        
        <div className="text-center z-10 flex flex-col items-center">
          <span className={`text-8xl font-black tracking-tighter leading-none mb-1 ${colorClass}`}>
            {Math.round(speed)}
          </span>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em]">{t.unit}</p>
        </div>
        <div className={`absolute inset-0 rounded-full transition-opacity duration-500 blur-2xl opacity-10 ${isOverspeed ? 'bg-red-600' : 'bg-blue-600'}`}></div>
      </div>
      <div className="flex items-center space-x-2 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md">
        <div className={`w-2 h-2 rounded-full animate-pulse ${isOverspeed ? 'bg-red-500' : 'bg-green-500'}`}></div>
        <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">{t.speedLabel}</p>
      </div>
    </div>
  );
};

const SettingsCard: React.FC<{ 
  limit: number; 
  setLimit: (l: number) => void; 
  lang: Language; 
  setLang: (l: Language) => void;
  vibrate: boolean;
  setVibrate: (v: boolean) => void;
  onEnterTest: () => void;
}> = ({ limit, setLimit, lang, setLang, vibrate, setVibrate, onEnterTest }) => {
  const t = translations[lang];

  return (
    <div className="glass p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <i className="fa-solid fa-gear text-6xl text-white"></i>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">{t.limitLabel}</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-white text-3xl font-black tracking-tighter">{limit}</span>
            <span className="text-zinc-500 text-[10px] font-bold uppercase">{t.unit}</span>
          </div>
        </div>
        <input 
          type="range" 
          min="10" 
          max="150" 
          step="5"
          value={limit} 
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
          aria-label="Speed limit"
        />
        <div className="flex justify-between mt-3 text-[10px] text-zinc-600 font-black uppercase">
          <span>10 km/h</span>
          <span>{limit} km/h</span>
          <span>150 km/h</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
          className="bg-zinc-900/50 hover:bg-zinc-800 py-5 rounded-3xl flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all border border-zinc-800"
        >
          <i className="fa-solid fa-language text-blue-500 text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{lang === 'en' ? 'తెలుగు' : 'English'}</span>
        </button>
        <button 
          onClick={() => setVibrate(!vibrate)}
          className={`py-5 rounded-3xl flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all border ${vibrate ? 'bg-blue-600 border-blue-400' : 'bg-zinc-900/50 border-zinc-800'}`}
        >
          <i className={`fa-solid fa-bolt ${vibrate ? 'text-white' : 'text-blue-500'} text-xl`}></i>
          <span className={`text-[10px] font-black uppercase tracking-widest ${vibrate ? 'text-white' : 'text-zinc-400'}`}>{t.vibrateLabel}</span>
        </button>
      </div>

      <button 
        onClick={onEnterTest}
        className="w-full py-5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 rounded-3xl flex items-center justify-center space-x-3 active:scale-95 transition-all border border-amber-600/30 font-black text-xs uppercase tracking-[0.2em]"
      >
        <i className="fa-solid fa-vial"></i>
        <span>{translations[lang].testModeLabel}</span>
      </button>
    </div>
  );
};

const TestModePage: React.FC<{ 
  speed: number; 
  limit: number; 
  setSpeed: (s: number) => void; 
  onExit: () => void;
  lang: Language;
}> = ({ speed, limit, setSpeed, onExit, lang }) => {
  const t = translations[lang];
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-flask text-white"></i>
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Simulation Mode</h2>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Test Alerts & Warnings</p>
          </div>
        </div>
        <button onClick={onExit} className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400" aria-label="Close">
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>

      <div className="space-y-6 flex-grow">
        <Speedometer speed={speed} limit={limit} lang={lang} />
        
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <p className="text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">Manual Speed Control</p>
          <div className="flex items-center justify-between space-x-4">
            <button 
              onClick={() => setSpeed(Math.max(0, speed - 10))}
              className="flex-1 py-8 bg-zinc-900 border border-zinc-800 rounded-3xl active:scale-95 transition-all"
              aria-label="Decrease speed"
            >
              <i className="fa-solid fa-minus text-2xl" aria-hidden="true"></i>
            </button>
            <button 
              onClick={() => setSpeed(speed + 10)}
              className="flex-1 py-8 bg-zinc-900 border border-zinc-800 rounded-3xl active:scale-95 transition-all"
              aria-label="Increase speed"
            >
              <i className="fa-solid fa-plus text-2xl text-blue-500" aria-hidden="true"></i>
            </button>
          </div>
          <button 
            onClick={() => setSpeed(limit + 5)}
            className="w-full py-5 bg-red-600/20 text-red-500 border border-red-600/30 rounded-3xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all"
          >
            Trigger Danger Alert ({limit + 5} km/h)
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em]">
        Simulation mode bypasses GPS. Alerts behave identically.
      </p>
    </div>
  );
};

const AlertOverlay: React.FC<{ lang: Language; speed: number; onDismiss: () => void }> = ({ lang, speed, onDismiss }) => {
  const t = translations[lang];
  const [blink, setBlink] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center px-8 text-center"
      style={{ 
        backgroundColor: blink ? 'rgba(220, 38, 38, 0.95)' : 'rgba(153, 27, 27, 0.95)',
        zIndex: 99999,
        color: '#ffffff',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        touchAction: 'manipulation'
      }}
      onClick={onDismiss}
    >
      <div className="relative mb-6" style={{ color: '#ffffff' }}>
         <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '8rem', color: '#ffffff', textShadow: '0 0 40px rgba(255,255,255,0.8)' }}></i>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-2xl mt-4" style={{ color: '#000000' }}>!</div>
      </div>
      
      <h1 className="font-black mb-4 uppercase italic tracking-tighter" style={{ fontSize: '3.5rem', color: '#ffffff', lineHeight: '1' }}>
        {t.alertMessage}
      </h1>
      
      <div className="bg-white/10 backdrop-blur-3xl px-10 py-5 rounded-[2.5rem] border border-white/20 mb-12 shadow-2xl">
        <p className="font-black" style={{ fontSize: '3.5rem', color: '#ffffff' }}>
          {Math.round(speed)} <span className="text-xl opacity-50 uppercase tracking-widest">{t.unit}</span>
        </p>
      </div>

      <button 
        className="px-14 py-6 rounded-full font-black text-2xl uppercase tracking-[0.2em] active:scale-95 transition-transform"
        style={{ backgroundColor: '#ffffff', color: '#dc2626', boxShadow: '0 20px 60px rgba(220,38,38,0.5)' }}
        onClick={onDismiss}
      >
        SLOW DOWN
      </button>
    </div>
  );
};

const HistoryLog: React.FC<{ history: SpeedRecord[]; lang: Language }> = ({ history, lang }) => {
  const t = translations[lang];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-zinc-500 font-black uppercase text-[10px] tracking-widest flex items-center">
          <i className="fa-solid fa-clock-rotate-left mr-2 text-blue-500"></i>
          {t.historyLabel}
        </h3>
        <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">{history.length} Alerts</span>
      </div>
      {history.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-10 rounded-[2.5rem] text-center">
          <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest">Safe riding. No incidents.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record.id} className="glass p-5 rounded-3xl flex items-center justify-between border-l-4 border-red-500 shadow-xl">
              <div>
                <div className="flex items-baseline space-x-1">
                  <p className="text-2xl font-black text-red-500">{record.speed}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">{t.unit}</p>
                </div>
                <p className="text-[10px] text-zinc-600 uppercase font-black">Limit: {record.limit} km/h</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400 font-black">
                  {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <span className="text-[9px] text-red-500/50 font-black uppercase">Exceeded</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(60);
  const [lang, setLang] = useState<Language>('en');
  const [isTestMode, setTestMode] = useState(false);
  const [vibrate, setVibrate] = useState(true);
  const [history, setHistory] = useState<SpeedRecord[]>([]);
  const [isAlerting, setIsAlerting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastNotifyTime = useRef<number>(0);

  // Sound initialization
  const initAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/siren.mp3');
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
      // Load the audio file
      audioRef.current.load();
    }
    // Play and pause immediately to unlock audio on mobile
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        audioRef.current!.currentTime = 0;
      }).catch((err) => {
        console.log('Audio init failed (normal on some browsers):', err);
      });
    }
  };

  // Function to request user interaction for audio on mobile
  const requestAudioPlayback = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((err) => {
        console.log('Audio playback still blocked:', err);
      });
    }
  }, []);

  const handleStartRiding = () => {
    // 1. Init audio session context (must be during user interaction)
    initAudio();

    // 2. Request permissions
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    
    // 3. Request geolocation permission explicitly
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Permission granted, start the app
        console.log('Location permission granted');
        setIsStarted(true);
      }, 
      (err) => {
        console.error("Geolocation error:", err);
        alert("Please enable location access to use this app. Make sure location services are enabled in your device settings. Error: " + err.message);
      }, 
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const sendNotification = useCallback(() => {
    const now = Date.now();
    if (Notification.permission === 'granted' && now - lastNotifyTime.current > 10000) {
      lastNotifyTime.current = now;
      new Notification("RideSafe: Speed Alert!", {
        body: translations[lang].alertMessage,
        tag: "speed-danger",
        vibrate: [500, 100, 500]
      } as any);
    }
  }, [lang]);

  // GPS Tracking
  useEffect(() => {
    let watchId: number;
    if (isStarted && !isTestMode) {
      watchId = navigator.geolocation.watchPosition((pos) => {
        const speedInKmH = (pos.coords.speed || 0) * 3.6;
        setSpeed(Math.max(0, speedInKmH));
      }, (err) => {
        console.error('GPS Error:', err);
        // Handle geolocation errors gracefully
        if (err.code === 1) {
          // PERMISSION_DENIED
          alert('Location permission denied. Please enable location access in your browser settings.');
        } else if (err.code === 2) {
          // POSITION_UNAVAILABLE
          console.warn('Location information unavailable');
        } else if (err.code === 3) {
          // TIMEOUT
          console.warn('Location request timed out');
        }
      }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      });
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isStarted, isTestMode]);

  // Alert Control
  useEffect(() => {
    if (speed >= limit && speed > 0) {
      if (!isAlerting) {
        setIsAlerting(true);
        sendNotification();
        // Attempt to play audio with proper error handling
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.error('Audio play failed:', err);
              console.log('This may be due to browser autoplay policy. Audio will be muted.');
            });
          }
        }
        if (vibrate && navigator.vibrate) {
          try {
            navigator.vibrate([1000, 200, 1000]);
          } catch (vibrateErr) {
            console.warn('Vibration failed:', vibrateErr);
          }
        }
        
        const newRecord: SpeedRecord = {
          id: Date.now().toString(),
          speed: Math.round(speed),
          limit: limit,
          timestamp: Date.now(),
          wasOverspeed: true
        };
        setHistory(prev => [newRecord, ...prev].slice(0, 5));
      }
    } else {
      if (isAlerting) {
        setIsAlerting(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        if (navigator.vibrate) {
          try {
            navigator.vibrate(0);
          } catch (vibrateErr) {
            console.warn('Vibration stop failed:', vibrateErr);
          }
        }
      }
    }
  }, [speed, limit, isAlerting, vibrate, sendNotification]);

  // Onboarding
  if (!isStarted) {
    const t = translations[lang];
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 selection:bg-blue-600">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black"></div>
        
        <div className="relative glass p-12 rounded-[4rem] text-center max-w-sm w-full shadow-2xl border border-white/10 space-y-10">
          <div className="relative w-32 h-32 mx-auto">
             <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-6 opacity-20 animate-pulse"></div>
             <div className="relative w-full h-full bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110 duration-500">
               <i className="fa-solid fa-gauge-high text-6xl text-white"></i>
             </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter leading-none text-white">{t.title}</h1>
            <p className="text-zinc-500 text-sm font-bold leading-relaxed px-4 uppercase tracking-tighter">
              Stay safe. Stay alerted. <br/> {t.permissionDesc}
            </p>
          </div>
          
          <div className="space-y-6">
            <button 
              onClick={handleStartRiding}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-3xl font-black text-xl uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-95 transition-all"
            >
              {t.allowBtn}
            </button>
            
            <div className="flex justify-center space-x-3">
              <button onClick={() => setLang('en')} className={`text-[10px] font-black tracking-widest px-6 py-2 rounded-full border transition-all ${lang === 'en' ? 'bg-white text-black border-white' : 'text-zinc-700 border-zinc-800'}`}>ENGLISH</button>
              <button onClick={() => setLang('te')} className={`text-[10px] font-black tracking-widest px-6 py-2 rounded-full border transition-all ${lang === 'te' ? 'bg-white text-black border-white' : 'text-zinc-700 border-zinc-800'}`}>తెలుగు</button>
            </div>
          </div>
        </div>
        
        <p className="relative mt-12 text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em]">
           {t.devBy}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] pb-40 overflow-y-auto" onClick={requestAudioPlayback}>
      {/* Background Decor */}
      <div className={`fixed inset-0 transition-opacity duration-1000 ${isAlerting ? 'bg-red-950/20' : 'bg-transparent'}`}></div>
      <div className="fixed top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>

      <div className="relative px-6 pt-12 max-w-md mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-black">Velocity tracking active</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic text-white leading-none">RIDƎSAFE</h1>
          </div>
          <button 
            onClick={() => setIsStarted(false)}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
            aria-label="Stop tracking"
          >
            <i className="fa-solid fa-power-off" aria-hidden="true"></i>
          </button>
        </header>

        <Speedometer speed={speed} limit={limit} lang={lang} />

        <SettingsCard 
          limit={limit} 
          setLimit={setLimit} 
          lang={lang} 
          setLang={setLang}
          vibrate={vibrate}
          setVibrate={setVibrate}
          onEnterTest={() => setTestMode(true)}
        />

        <HistoryLog history={history} lang={lang} />

        <footer className="pt-16 pb-12 text-center opacity-30 space-y-2">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em]">{translations[lang].devBy}</p>
          <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">Premium Safety Engine v2.1</p>
        </footer>
      </div>

      {/* Popups & Pages */}
      {isTestMode && (
        <TestModePage 
          speed={speed} 
          limit={limit} 
          setSpeed={setSpeed} 
          onExit={() => { setTestMode(false); setSpeed(0); }} 
          lang={lang}
        />
      )}

      {isAlerting && (
        <AlertOverlay 
          lang={lang} 
          speed={speed}
          onDismiss={() => {
            if (isTestMode) { setSpeed(limit - 5); }
          }} 
        />
      )}

      {/* Sticky footer for constraints */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-3xl border-t border-white/5 pb-safe z-50">
        <div className="p-4 flex items-center justify-center">
           <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest text-center max-w-xs leading-relaxed">
              Keep screen active for alerts. System notification sound defaults apply. Stay focused on the road.
           </p>
        </div>
      </div>
    </div>
  );
};

export default App;
