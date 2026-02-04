import React, { useState, useEffect, useCallback } from 'react';
import { SlideRenderer } from './src/engine/components/SlideRenderer';
import { ChevronLeft, ChevronRight, Maximize2, BookOpen, LogOut, Printer } from 'lucide-react';
import { decks, getDeck } from './src/contents/registry';
import { SlideData } from './src/engine/types';
import { AUTHOR_INFO, COMPANY_INFO } from './src/contents/common';

function SlideDeckApp() {
  // Get deck ID and mode from URL query parameter (e.g., ?deck=201&mode=print)
  const searchParams = new URLSearchParams(window.location.search);
  const deckId = searchParams.get('deck');
  const mode = searchParams.get('mode'); // 'print' for PDF export mode

  const [currentDeck, setCurrentDeck] = useState(deckId ? getDeck(deckId) : undefined);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Default to first deck if no deck selected and only one exists, or show selector
  useEffect(() => {
      if (!currentDeck && !deckId) {
          const deckKeys = Object.keys(decks);
          if (deckKeys.length === 1) {
              setCurrentDeck(decks[deckKeys[0]]);
          }
      }
  }, [currentDeck, deckId]);

  const SLIDES: SlideData[] = currentDeck ? currentDeck.slides : [];

  const goToNext = useCallback(() => {
    if (!currentDeck) return;
    setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
  }, [currentDeck, SLIDES.length]);

  const goToPrev = useCallback(() => {
    if (!currentDeck) return;
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, [currentDeck]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!currentDeck) return;
    switch (event.key) {
      case 'ArrowRight':
      case ' ':
      case 'Enter':
        goToNext();
        break;
      case 'ArrowLeft':
        goToPrev();
        break;
      default:
        break;
    }
  }, [currentDeck, goToNext, goToPrev]);

  useEffect(() => {
    if (!currentDeck) return;

    const handleKeyDownWrapper = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };
    
    window.addEventListener('keydown', handleKeyDownWrapper);
    
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
        window.removeEventListener('keydown', handleKeyDownWrapper);
        document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [handleKeyDown, currentDeck]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePageInput = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const targetPage = parseInt(e.currentTarget.value);
      if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= SLIDES.length) {
        setCurrentSlideIndex(targetPage - 1);
        e.currentTarget.blur(); // Lose focus after jump
      }
    }
  }, [SLIDES.length]);

  // Analytics logging removed for template
  useEffect(() => {
    // No logging
  }, [currentDeck, currentSlideIndex, SLIDES]);

  // If no deck selected, show selection menu
  if (!currentDeck) {
      const handleLogout = () => {
        // No logout for template
        window.location.href = '/';
      };

      return (
          <div className="h-screen w-full overflow-y-auto bg-black text-white font-sans relative">
              <div className="absolute top-6 right-6 flex items-center gap-3 z-[120]">
                
                {/* Discreet Logout Button - Top Right */}
                <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all duration-300 group"
                    title="Reset"
                >
                    <LogOut size={18} />
                    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-xs font-medium bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-800">
                        Reset
                    </span>
                </button>
              </div>

              <div className="min-h-full flex flex-col items-center justify-center p-8">
                  <div className="max-w-2xl w-full">
                  <div className="text-center mb-12">
                      <div className="h-20 flex items-center justify-center mx-auto mb-6">
                          <img src="/assets/icon/dify-logo-dark-mode.svg" alt="Dify" className="h-full w-auto drop-shadow-2xl" />
                      </div>
                      <h1 className="text-4xl font-bold mb-4">Select a Presentation</h1>
                      <p className="text-gray-400 text-lg">Choose a slide deck to begin</p>
                  </div>
                  
                  <div className="grid gap-4">
                      {Object.values(decks).map((deck) => (
                          <a 
                              key={deck.id}
                              href={`?deck=${deck.id}`}
                              className="group block bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-dify-blue p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                          >
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                      <div className="p-3 bg-gray-900 rounded-lg group-hover:bg-dify-blue/20 group-hover:text-dify-blue transition-colors">
                                          <BookOpen size={24} />
                                      </div>
                                      <div>
                                          <h3 className="text-xl font-bold group-hover:text-dify-blue transition-colors">{deck.title}</h3>
                                          <p className="text-gray-500 mt-1 text-sm">{deck.slides.length} slides</p>
                                      </div>
                                  </div>
                                  <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                              </div>
                          </a>
                      ))}
                  </div>
              </div>
            </div>
          </div>
      );
  }

  // Constants for fixed info
  const AUTHOR_NAME = `${AUTHOR_INFO.name}`;

  // ========== PRINT MODE ==========
  // When mode=print, render all slides for PDF export
  if (mode === 'print' && currentDeck) {
    const printDeck = currentDeck;

    return (
      <div className="bg-white">
        {/* Print-specific CSS */}
        <style>{`
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          .print-page {
            break-after: always;
            page-break-after: always;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            position: relative;
            background-color: white;
          }
          .print-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
          /* Hide scrollbar in print preview */
          body::-webkit-scrollbar {
            display: none;
          }
          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Print Header - Instructions (hidden in actual print) */}
        <div className="print:hidden bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/assets/icon/dify-logo-dark-mode.svg" alt="Dify" className="h-6" />
            <span className="font-bold">{printDeck.title}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">{printDeck.slides.length} slides</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Press <kbd className="px-2 py-1 bg-gray-700 rounded text-white font-mono text-xs">Ctrl+P</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded text-white font-mono text-xs">⌘+P</kbd> to save as PDF</span>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-dify-blue text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Printer size={16} />
              Print / Save PDF
            </button>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Spacer for fixed header */}
        <div className="print:hidden h-16"></div>

        {/* Render All Slides */}
        {printDeck.slides.map((slide, index) => {
          const isDarkBackground =
            slide.type === 'MACRO_FOCUS' ||
            slide.type === 'SECTION' ||
            slide.type === 'CHAPTER_TITLE';

          const logoSrc = isDarkBackground
            ? (slide.type === 'MACRO_FOCUS' ? '/assets/icon/dify-logo-dark-mode.svg' : '/assets/icon/dify-logo-white.svg')
            : '/assets/icon/dify-logo.svg';

          return (
            <div key={slide.id} className="print-page">
              {/* Main slide content */}
              <SlideRenderer slide={slide} />

              {/* TOP RIGHT: Logo */}
              <div className="absolute top-6 right-8 z-50 pointer-events-none select-none">
                <img src={logoSrc} alt="Dify Logo" className="h-8 w-auto" />
              </div>

              {/* BOTTOM LEFT: Deck Title */}
              <div className={`absolute bottom-6 left-12 flex items-center gap-4 text-sm font-medium tracking-wide pointer-events-none select-none ${
                  isDarkBackground ? 'text-white/80' : 'text-gray-500'
              }`}>
                 <span className="uppercase tracking-wider font-bold">{printDeck.title}</span>
              </div>

              {/* BOTTOM CENTER: Copyright */}
              <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide pointer-events-none select-none ${
                  isDarkBackground ? 'text-white/50' : 'text-gray-400'
              }`}>
                 {COMPANY_INFO.copyright}
              </div>

              {/* BOTTOM RIGHT: Year, Speaker & Page Number */}
              <div className="absolute bottom-6 right-12 flex items-center gap-6 pointer-events-none select-none">
                <span className={`text-sm font-medium ${isDarkBackground ? 'text-white/70' : 'text-gray-400'}`}>
                    {new Date().getFullYear()}
                </span>
                <span className={`h-4 w-px ${isDarkBackground ? 'bg-white/30' : 'bg-gray-300'}`}></span>
                <span className={`text-sm font-medium ${isDarkBackground ? 'text-white/80' : 'text-gray-500'}`}>
                    {AUTHOR_NAME}
                </span>
                <span className={`h-4 w-px ${isDarkBackground ? 'bg-white/30' : 'bg-gray-300'}`}></span>
                <span className={`text-lg font-mono font-bold ${isDarkBackground ? 'text-white' : 'text-dify-blue'}`}>
                  {index + 1} <span className={`${isDarkBackground ? 'text-white/50' : 'text-gray-300'} font-light`}>/</span> {printDeck.slides.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const currentSlide = SLIDES[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / SLIDES.length) * 100;
  
  const nonFullScreenStyle = {
    maxHeight: 'calc(100% - 32px)',
    maxWidth: 'calc(100% - 32px)',
  };

  // Determine logo source based on slide type (background color)
  // Added CHAPTER_TITLE to dark background list
  const isDarkBackground = 
    currentSlide.type === 'MACRO_FOCUS' || 
    currentSlide.type === 'SECTION' ||
    currentSlide.type === 'CHAPTER_TITLE';

  const logoSrc = isDarkBackground 
    ? (currentSlide.type === 'MACRO_FOCUS' ? '/assets/icon/dify-logo-dark-mode.svg' : '/assets/icon/dify-logo-white.svg')
    : '/assets/icon/dify-logo.svg';

  const handleLogout = async () => {
    // Reset
    window.location.reload();
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-900 overflow-hidden font-sans relative">

      {/* Unified Control Bar - Fixed Top, Auto-hide */}
      <div className="fixed top-0 left-0 w-full h-12 sm:h-14 md:h-16 bg-dify-dark/90 backdrop-blur-sm text-white flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 z-[100] border-b border-gray-800 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-shrink">
          <a href="/" className="w-5 h-5 sm:w-6 sm:h-6 bg-dify-blue rounded-sm flex items-center justify-center font-bold text-[10px] sm:text-xs flex-shrink-0 hover:scale-105 transition-transform">D</a>
          <span className="font-bold text-white tracking-wider text-sm sm:text-base md:text-lg flex-shrink-0">{currentDeck.title}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
           <button 
             onClick={goToPrev} 
             disabled={currentSlideIndex === 0}
             className="p-1.5 sm:p-2 hover:bg-gray-800 rounded disabled:opacity-30 transition-colors flex-shrink-0"
             aria-label="Previous slide"
           >
             <ChevronLeft size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
           </button>
           
           <div className="flex items-center text-xs sm:text-sm font-mono text-gray-400 gap-1">
             <input 
               type="text" 
               defaultValue={currentSlideIndex + 1}
               key={currentSlideIndex} // Re-render on slide change to update value
               onKeyDown={handlePageInput}
               onFocus={(e) => e.target.select()}
               className="w-8 sm:w-10 bg-gray-800 border border-gray-700 rounded text-center text-white focus:outline-none focus:border-dify-blue focus:ring-1 focus:ring-dify-blue transition-all"
             />
             <span className="flex-shrink-0">/ {SLIDES.length}</span>
           </div>

           <button 
             onClick={goToNext} 
             disabled={currentSlideIndex === SLIDES.length - 1}
             className="p-1.5 sm:p-2 hover:bg-gray-800 rounded disabled:opacity-30 transition-colors flex-shrink-0"
             aria-label="Next slide"
           >
             <ChevronRight size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
           </button>
           
           <div className="w-px h-4 sm:h-5 md:h-6 bg-gray-800 mx-1 sm:mx-1.5 md:mx-2 flex-shrink-0"></div>

           <button
             onClick={toggleFullScreen}
             className="p-1.5 sm:p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors flex-shrink-0"
             aria-label="Toggle fullscreen"
           >
             <Maximize2 size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
           </button>

           {/* Print / Export PDF Button */}
           <button
             onClick={() => window.open(`?deck=${currentDeck.id}&mode=print`, '_blank')}
             className="p-1.5 sm:p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors flex-shrink-0"
             aria-label="Print mode"
             title="Print / Export PDF"
           >
             <Printer size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
           </button>
        </div>
      </div>

      {/* Slide Container - Aspect Ratio 16:9, but responsive in fullscreen */}
      <div className={`flex-grow flex items-center justify-center ${isFullScreen ? 'p-0 bg-black' : 'p-2 sm:p-4'}`}>
        <div className={`${!isFullScreen ? 'aspect-video' : ''} bg-white shadow-2xl relative overflow-hidden slide-transition ${
          isFullScreen 
            ? 'w-full h-full max-w-full max-h-full rounded-none' 
            : 'w-full max-w-[1600px] rounded-sm'
        }`}
        style={isFullScreen ? {
          // Removed fixed 16:9 constraint logic for fullscreen
          // It will now fill the screen width/height
        } : nonFullScreenStyle}
        >
           
           {/* Render specific slide content - Key ensures state resets on slide change */}
           <SlideRenderer key={currentSlide.id} slide={currentSlide} />

           {/* === OVERLAYS (Always visible) === */}
           <>
                {/* TOP RIGHT: Logo */}
                <div className="absolute top-6 right-8 z-50 pointer-events-none select-none">
                  <img src={logoSrc} alt="Dify Logo" className="h-8 w-auto" />
                </div>

                {/* BOTTOM LEFT: Deck Info */}
                <div className={`absolute bottom-6 left-12 flex items-center gap-4 text-sm font-medium tracking-wide pointer-events-none select-none ${
                    isDarkBackground ? 'text-white/80' : 'text-gray-500'
                }`}>
                   <span className="uppercase tracking-wider font-bold">{currentDeck.title}</span>
                </div>

                {/* BOTTOM CENTER: Copyright */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide pointer-events-none select-none ${
                    isDarkBackground ? 'text-white/50' : 'text-gray-400'
                }`}>
                   {COMPANY_INFO.copyright}
                </div>
               
                {/* BOTTOM RIGHT: Year, Speaker & Page Number */}
                <div className="absolute bottom-6 right-12 flex items-center gap-6 pointer-events-none select-none">
                  <span className={`text-sm font-medium ${isDarkBackground ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date().getFullYear()}
                  </span>
                  <span className={`h-4 w-px ${isDarkBackground ? 'bg-white/30' : 'bg-gray-300'}`}></span>
                  <span className={`text-sm font-medium ${isDarkBackground ? 'text-white/80' : 'text-gray-500'}`}>
                      {AUTHOR_NAME}
                  </span>
                  <span className={`h-4 w-px ${isDarkBackground ? 'bg-white/30' : 'bg-gray-300'}`}></span>
                  <span className={`text-lg font-mono font-bold ${isDarkBackground ? 'text-white' : 'text-dify-blue'}`}>
                    {currentSlideIndex + 1} <span className={`${isDarkBackground ? 'text-white/50' : 'text-gray-300'} font-light`}>/</span> {SLIDES.length}
                  </span>
                </div>
           </>

        </div>
      </div>

      {/* Progress Bar - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-800 z-40">
        <div 
          className="h-full bg-dify-blue shadow-[0_0_10px_rgba(0,51,255,0.7)] transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SlideDeckApp />
  );
}
