import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, Sparkles, Camera, Coffee, Smile, Music, Gift, Lock, User, ArrowRight, X, Image as ImageIcon, ChevronLeft, ChevronRight, Calendar, Maximize, Minimize } from 'lucide-react';

// Stili personalizzati per le animazioni dei cuori fluttuanti
const customStyles = `
  @keyframes floatUp {
    0% { transform: translateY(100vh) scale(0.5) rotate(0deg); opacity: 0; }
    20% { opacity: 0.8; }
    80% { opacity: 0.8; }
    100% { transform: translateY(-20vh) scale(1.2) rotate(360deg); opacity: 0; }
  }
  
  @keyframes popIn {
    0% { transform: scale(0); }
    80% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .animate-float {
    animation: floatUp 6s linear forwards;
  }

  .animate-pop {
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  @keyframes dropInJar {
    0% { transform: translateY(-150vh) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    70% { transform: translateY(15px) rotate(var(--rotation)); }
    85% { transform: translateY(-5px) rotate(var(--rotation)); }
    100% { transform: translateY(0) rotate(var(--rotation)); opacity: 1; }
  }

  .animate-drop {
    animation: dropInJar 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0; /* Partono invisibili finché non inizia l'animazione */
  }

  @keyframes sway {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }

  .animate-sway {
    animation: sway 6s ease-in-out infinite;
    transform-origin: bottom center;
  }
`;

// Spostato FUORI dal componente App per evitare bug di re-rendering ad ogni secondo dell'orologio
const DesktopIcon = ({ icon: Icon, label, onClick, color }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center gap-2 cursor-pointer group hover:bg-white/20 p-4 rounded-xl transition-all duration-300 w-28"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform ${color} bg-gradient-to-br border border-white/50 backdrop-blur-sm`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <span className="text-pink-900 font-bold text-sm text-center bg-white/40 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">{label}</span>
  </div>
);

const reasons = [
  { text: "Hai il sorriso più bello dell'universo", icon: <Smile className="text-pink-500 w-8 h-8" /> },
  { text: "Rendi ogni giorno un'avventura speciale", icon: <Star className="text-yellow-400 w-8 h-8" /> },
  { text: "Sopporti le mie battute pessime (quasi sempre)", icon: <Coffee className="text-amber-700 w-8 h-8" /> },
  { text: "Sei la mia persona preferita con cui fare nulla", icon: <Heart className="text-red-500 w-8 h-8" /> },
  { text: "Perché sei semplicemente tu.", icon: <Sparkles className="text-purple-500 w-8 h-8" /> }
];

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const [showMessage, setShowMessage] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [surpriseHearts, setSurpriseHearts] = useState([]); // Nuovo stato per i cuori a cascata
  const [reasonIndex, setReasonIndex] = useState(0);

  // Nuovi stati per il Desktop
  const [activeApp, setActiveApp] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Stato per il carosello della galleria
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false); // Nuovo stato per il fullscreen

  // Array di immagini per la galleria (senza caption, ordine casuale con aura.jpg per ultimo)
  const galleryImages = [
    { src: "public/birs.jpg" },
    { src: "public/marispa.jpg" },
    { src: "bacios.jpg" },
    { src: "public/dorms.jpg" },
    { src: "public/figa.jpg" },
    { src: "public/romaspecchio.jpg" },
    { src: "public/cols.jpg" },
    { src: "public/bershka.jpg" },
    { src: "public/duoms.jpg" },
    { src: "public/boh.jpg" },
    { src: "aura.jpg" }
  ];

  const nextImage = () => setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  // Aggiorna l'orologio della taskbar
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    const normalizedPassword = password.trim().toLowerCase();
    if (normalizedPassword === '14 febbraio 2026' || normalizedPassword === '14/02/2026' || normalizedPassword === '1') {
      setIsUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000); // L'errore scompare dopo 3 secondi
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setPassword('');
    setActiveApp(null);
    setShowMessage(false);
    setSurpriseHearts([]);
    setIsFullscreen(false);
  };

  // Generatore di cuori fluttuanti
  const spawnHeart = useCallback(() => {
    const newHeart = {
      id: Math.random(),
      left: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 3 + 4,
    };
    
    setHearts(prev => [...prev, newHeart]);
    
    // Rimuovi il cuore dopo che l'animazione finisce
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 7000);
  }, []);

  // Cuori casuali in background all'inizio
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) spawnHeart();
    }, 800);
    return () => clearInterval(interval);
  }, [spawnHeart]);

  const handleSurpriseClick = () => {
    setShowMessage(true);
    
    // Algoritmo per l'effetto "barattolo che si riempie"
    const numHearts = 250; 
    const numCols = window.innerWidth < 768 ? 15 : 30; // Più colonne su schermi grandi
    const columnHeights = new Array(numCols).fill(0);
    const newHearts = [];
    
    // Mix di emoji per la pioggia di fiori e cuori
    const surpriseEmojis = ['❤️', '🌷', '🌷', '🌸', '💖']; // Più probabilità di avere tulipani e cuori

    for (let i = 0; i < numHearts; i++) {
      const col = Math.floor(Math.random() * numCols);
      const heartSize = Math.random() * 20 + 20; // grandezza tra 20px e 40px
      const randomEmoji = surpriseEmojis[Math.floor(Math.random() * surpriseEmojis.length)];
      
      // Calcola l'altezza in base a quanti cuori ci sono già nella colonna
      // Moltiplicato per 0.45 crea un effetto di "sovrapposizione" realistico
      const bottomPos = columnHeights[col] * (heartSize * 0.45); 
      columnHeights[col]++; // Aumenta il livello della colonna

      const leftPos = (col / numCols) * 100 + (Math.random() * 2);

      newHearts.push({
        id: `jar-${i}`,
        left: `${leftPos}%`,
        bottom: `${bottomPos + 56}px`, // +56px per farli fermare sopra la barra delle applicazioni
        size: heartSize,
        delay: Math.random() * 3, // cadono sparpagliati nell'arco di 3 secondi
        rotation: Math.random() * 60 - 30, // rotazione casuale
        emoji: randomEmoji // Assegna l'emoji casuale calcolata prima
      });
    }
    setSurpriseHearts(newHearts);
  };

  const nextReason = () => {
    setReasonIndex((prev) => (prev + 1) % reasons.length);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden bg-slate-900">
        <style>{customStyles}</style>
        
        {/* Sfondo in stile sistema operativo (sfumature e blur) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 opacity-80"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl mix-blend-screen"></div>
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm animate-pop">
          
          {/* Avatar utente */}
          <div className="w-28 h-28 rounded-full bg-slate-700/50 border border-white/20 shadow-2xl flex items-center justify-center mb-4 backdrop-blur-md overflow-hidden">
            <img 
              src="public/dorms.jpg" 
              alt="Profilo Mari" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback nel caso in cui l'immagine non venga trovata
                e.target.onerror = null; 
                e.target.src = "https://picsum.photos/seed/mari/200/200"; 
              }}
            />
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-8 tracking-wide drop-shadow-lg">
            Mari
          </h2>
          
          {/* Form di Login */}
          <form onSubmit={handleUnlock} className="w-full flex flex-col items-center gap-3">
            <div className="relative w-full max-w-xs group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2.5 pr-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/30 backdrop-blur-md transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-2 text-white/70 hover:text-white hover:bg-white/20 rounded-md transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          {/* Suggerimento / Errore */}
          <div className="h-12 mt-4 flex items-center justify-center text-center">
            {error ? (
              <p className="text-white bg-red-500/80 px-4 py-1.5 rounded-full text-sm backdrop-blur-md shadow-lg animate-pop">
                La password non è corretta. Riprova.
              </p>
            ) : (
              <div className="text-white/50 text-sm font-medium animate-pop">
                <p>Suggerimento password: una giornata speciale</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden relative font-sans text-slate-800">
      <style>{customStyles}</style>

      {/* Background Hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute text-pink-400 animate-float pointer-events-none"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            bottom: '-20px',
            zIndex: 100
          }}
        >
          ❤️
        </div>
      ))}

      {/* Surprise Jar Hearts & Flowers (Effetto accumulo gravità) */}
      {surpriseHearts.map(heart => (
        <div
          key={heart.id}
          className="absolute animate-drop pointer-events-none drop-shadow-md"
          style={{
            left: heart.left,
            bottom: heart.bottom,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            zIndex: 100, // Passano sopra le finestre
            '--rotation': `${heart.rotation}deg`
          }}
        >
          {heart.emoji}
        </div>
      ))}

      {/* Tulipano in basso a destra */}
      <div className="absolute bottom-14 right-2 md:right-8 z-20 pointer-events-none animate-sway">
        <img 
          src="tulipano.png" 
          alt="Tulipano" 
          className="w-32 md:w-48 lg:w-56 object-contain opacity-90 drop-shadow-[0_10px_15px_rgba(236,72,153,0.3)]"
          onError={(e) => {
            e.target.onerror = null;
            // Fallback a un tulipano png online nel caso non sia presente il file locale
            e.target.src = "https://cdn3.iconfinder.com/data/icons/spring-23/32/tulip-flower-spring-nature-floral-512.png";
          }}
        />
      </div>

      {/* Desktop Area */}
      <div className="relative z-10 p-4 sm:p-8 h-[calc(100vh-3rem)]">
        {/* Intestazione Desktop */}
        <div className="absolute top-8 right-8 text-right hidden md:block opacity-60">
          <h1 className="text-4xl font-extrabold text-pink-400">MariOS</h1>
          <p className="text-pink-500 font-medium">Versione 1.1</p>
        </div>

        <div className="flex flex-col flex-wrap h-full gap-4 sm:gap-6 content-start pt-4">
          <DesktopIcon 
            icon={Heart} 
            label="Motivi" 
            color="from-pink-400 to-red-500" 
            onClick={() => setActiveApp('reasons')} 
          />
          <DesktopIcon 
            icon={ImageIcon} 
            label="Galleria" 
            color="from-yellow-400 to-orange-500" 
            onClick={() => setActiveApp('gallery')} 
          />
          <DesktopIcon 
            icon={Music} 
            label="Musica" 
            color="from-purple-400 to-indigo-500" 
            onClick={() => setActiveApp('music')} 
          />
          <DesktopIcon 
            icon={Gift} 
            label="Sorpresa" 
            color="from-emerald-400 to-teal-500" 
            onClick={() => setActiveApp('surprise')} 
          />
          <DesktopIcon 
            icon={Calendar} 
            label="Noi" 
            color="from-rose-400 to-pink-500" 
            onClick={() => setActiveApp('counter')} 
          />
        </div>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 w-full h-14 bg-white/70 backdrop-blur-lg flex items-center px-4 z-40 border-t border-white shadow-[0_-4px_20px_rgba(255,192,203,0.3)]">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer hover:bg-white/60 px-3 py-2 rounded-xl transition-colors"
          title="Disconnetti"
        >
          <Heart className="text-pink-500 w-6 h-6 fill-current" /> 
          <span className="text-pink-800 font-bold tracking-wide hidden sm:inline">Inizio</span>
        </div>
        
        {/* Active Apps Indicators in Taskbar */}
        <div className="flex-1 flex justify-center gap-2">
          {activeApp && (
            <div className="h-9 px-4 sm:px-6 bg-white rounded-full flex items-center shadow-sm border border-pink-200 text-sm font-semibold text-pink-600">
              <div className="w-2 h-2 rounded-full bg-pink-500 mr-2 animate-pulse"></div>
              {activeApp === 'reasons' && 'Motivi per cui ti amo'}
              {activeApp === 'gallery' && 'Galleria'}
              {activeApp === 'music' && 'La Nostra Playlist'}
              {activeApp === 'counter' && 'Il Nostro Tempo Insieme'}
              {activeApp === 'surprise' && 'Sorpresa Segreta'}
            </div>
          )}
        </div>

        <div className="text-pink-800 font-bold px-4 py-2 rounded-xl hover:bg-white/60 transition-colors cursor-default bg-white/40 shadow-sm">
          {currentTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Window System */}
      {activeApp && (
        <div className={`absolute inset-0 flex items-center justify-center animate-pop pointer-events-none ${isFullscreen ? 'z-[100] p-0' : 'z-30 p-4 sm:p-8'}`}>
          {/* Backdrop (clicca fuori per chiudere) */}
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm pointer-events-auto" onClick={() => !isFullscreen && setActiveApp(null)}></div>
          
          <div className={`flex flex-col pointer-events-auto overflow-hidden relative transition-all duration-300 ${isFullscreen ? 'w-full h-full bg-black/95 backdrop-blur-2xl' : 'bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl max-h-full border border-white'}`}>
            
            {/* Window Title Bar */}
            {!isFullscreen && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 flex items-center justify-between border-b border-pink-100">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setActiveApp(null); setIsFullscreen(false); }} className="w-3.5 h-3.5 rounded-full bg-red-400 hover:bg-red-500 shadow-inner flex items-center justify-center group"><X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" /></button>
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-inner"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-inner"></div>
                  <span className="ml-3 font-bold text-slate-600 text-sm tracking-wide">
                    {activeApp === 'reasons' && 'Motivi.app'}
                    {activeApp === 'gallery' && 'Galleria.app'}
                    {activeApp === 'music' && 'Musica.app'}
                    {activeApp === 'counter' && 'Noi.app'}
                    {activeApp === 'surprise' && 'Sorpresa.app'}
                  </span>
                </div>
              </div>
            )}

            {/* Window Content */}
            <div className={`overflow-y-auto flex-1 custom-scrollbar ${isFullscreen ? 'p-0 flex items-center justify-center' : 'p-6 md:p-10'}`}>
              
              {activeApp === 'reasons' && (
                <div className="flex flex-col items-center">
                  <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6" /> Motivi per cui ti amo <Sparkles className="w-6 h-6" />
                  </h2>
                  <div className="flex flex-col items-center justify-center min-h-[200px] w-full p-8 bg-pink-50 rounded-3xl mb-8 border border-pink-100 transition-all duration-300">
                    <div className="mb-6 transform scale-150 animate-pop">
                      {reasons[reasonIndex].icon}
                    </div>
                    <p className="text-2xl font-semibold text-slate-700 text-center leading-relaxed">
                      "{reasons[reasonIndex].text}"
                    </p>
                  </div>
                  <button 
                    onClick={nextReason}
                    className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Svelane un altro <Heart className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeApp === 'gallery' && (
                <div className={`flex flex-col items-center w-full ${isFullscreen ? 'h-full justify-center' : 'max-w-2xl mx-auto'}`}>
                  {!isFullscreen && (
                    <h3 className="text-2xl font-bold text-pink-600 mb-6 flex items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-pink-500" /> I Nostri Momenti Più Belli
                    </h3>
                  )}
                  
                  <div className={isFullscreen ? "relative w-full h-full flex flex-col items-center justify-center" : "relative w-full bg-pink-50/50 rounded-3xl p-3 md:p-6 border border-pink-100 shadow-sm flex flex-col items-center"}>
                    
                    {isFullscreen && (
                      <button 
                        onClick={() => setIsFullscreen(false)} 
                        className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-md z-50 transition-colors"
                        title="Chiudi schermo intero"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    )}

                    {/* Contenitore Immagine con frecce */}
                    <div className={`relative w-full overflow-hidden bg-black group shadow-md flex items-center justify-center ${isFullscreen ? 'h-full' : 'h-64 md:h-96 rounded-2xl border-4 border-white'}`}>
                      
                      {/* Nastro scorrevole delle immagini */}
                      <div 
                        className="flex transition-transform duration-500 ease-in-out h-full w-full"
                        style={{ transform: `translateX(-${galleryIndex * 100}%)` }}
                      >
                        {galleryImages.map((image, idx) => (
                          <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center">
                            <img 
                              src={image.src} 
                              alt={`Ricordo ${idx + 1}`} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Pulsante Schermo Intero */}
                      {!isFullscreen && (
                        <button 
                          onClick={() => setIsFullscreen(true)}
                          className="absolute right-2 md:right-4 top-2 md:top-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg backdrop-blur-sm transition-all shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
                          title="Schermo intero"
                        >
                          <Maximize className="w-5 h-5" />
                        </button>
                      )}
                      
                      {/* Pulsante Precedente */}
                      <button 
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-pink-600 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transform hover:scale-110 z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      
                      {/* Pulsante Successivo */}
                      <button 
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-pink-600 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transform hover:scale-110 z-10"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Indicatori (Pallini) */}
                    <div className={`flex gap-4 flex-wrap justify-center ${isFullscreen ? 'absolute bottom-8' : 'mt-6'}`}>
                      {galleryImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalleryIndex(idx)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            idx === galleryIndex ? (isFullscreen ? 'bg-white w-8' : 'bg-pink-500 w-8') : (isFullscreen ? 'bg-white/50 hover:bg-white w-2.5' : 'bg-pink-200 hover:bg-pink-400 w-2.5')
                          }`}
                          aria-label={`Vai all'immagine ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeApp === 'music' && (
                <div className="flex flex-col items-center w-full h-full min-h-[450px]">
                  <h3 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                    <Music className="w-6 h-6 text-purple-500" /> La Nostra Colonna Sonora
                  </h3>
                  <div className="w-full max-w-[660px] rounded-2xl overflow-hidden shadow-xl border border-purple-100 bg-white">
                    <iframe 
                      title="Apple Music Playlist"
                      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                      frameBorder="0" 
                      height="450" 
                      style={{ width: '100%', overflow: 'hidden', background: 'transparent' }} 
                      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                      src="https://embed.music.apple.com/it/playlist/pl.u-AkAm8ENs2LPLR5q"
                    ></iframe>
                  </div>
                  <p className="text-purple-700 mt-6 text-center font-medium">
                    Tutte le canzoni che mi fanno pensare a te 🎧❤️
                  </p>
                </div>
              )}

              {activeApp === 'counter' && (
                <div className="flex flex-col items-center justify-center min-h-[350px]">
                  <h3 className="text-3xl font-bold text-rose-600 mb-8 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-rose-500" /> Il Nostro Tempo Insieme
                  </h3>
                  
                  {(() => {
                    // Impostiamo la data del fidanzamento: Anno, Mese (0-indexed, quindi 1 = Febbraio), Giorno
                    const startDate = new Date(2026, 1, 14, 0, 0, 0); 
                    const diff = Math.max(0, currentTime - startDate); // Calcola la differenza in millisecondi
                    
                    const totalSeconds = Math.floor(diff / 1000);
                    const days = Math.floor(totalSeconds / (3600 * 24));
                    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;

                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-4">
                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm animate-pop" style={{animationDelay: '0.1s'}}>
                          <span className="text-4xl md:text-5xl font-black text-rose-500 mb-2">{days}</span>
                          <span className="text-rose-800 font-bold uppercase tracking-wider text-xs">Giorni</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm animate-pop" style={{animationDelay: '0.2s'}}>
                          <span className="text-4xl md:text-5xl font-black text-rose-500 mb-2">{hours}</span>
                          <span className="text-rose-800 font-bold uppercase tracking-wider text-xs">Ore</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm animate-pop" style={{animationDelay: '0.3s'}}>
                          <span className="text-4xl md:text-5xl font-black text-rose-500 mb-2">{minutes}</span>
                          <span className="text-rose-800 font-bold uppercase tracking-wider text-xs">Minuti</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm animate-pop" style={{animationDelay: '0.4s'}}>
                          <span className="text-4xl md:text-5xl font-black text-rose-500 mb-2">{seconds}</span>
                          <span className="text-rose-800 font-bold uppercase tracking-wider text-xs">Secondi</span>
                        </div>
                      </div>
                    );
                  })()}
                  
                  <p className="text-rose-600 mt-10 text-lg font-medium animate-pulse">
                    ...e questo è solo l'inizio. ❤️
                  </p>
                </div>
              )}

              {activeApp === 'surprise' && (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  {!showMessage ? (
                    <button 
                      onClick={handleSurpriseClick}
                      className="group relative inline-flex items-center justify-center px-8 py-5 font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300"
                    >
                      <Gift className="w-8 h-8 mr-3 group-hover:scale-125 transition-transform duration-300" />
                      <span className="text-2xl">Clicca qui!</span>
                      <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 group-hover:scale-110 transition-transform duration-300"></div>
                    </button>
                  ) : (
                    <div className="animate-pop text-center">
                      <Heart className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pop" fill="currentColor" />
                      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-4">
                        Ti amo tantissimo ❤️
                      </h2>
                      <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
                        Sei la cosa migliore che mi sia mai capitata.
                      </p>
                      <button 
                        onClick={() => {
                          setShowMessage(false);
                          setSurpriseHearts([]); // Svuota il "barattolo" quando chiude
                        }}
                        className="text-pink-500 font-medium hover:text-pink-700 bg-pink-100 px-6 py-2 rounded-full transition-colors"
                      >
                        Ripristina sorpresa
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;