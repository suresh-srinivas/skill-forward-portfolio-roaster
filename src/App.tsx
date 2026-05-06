import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Key } from 'lucide-react';
import { generateRoast, type RoastResponse } from './lib/gemini';
import { PersonaCard } from './components/PersonaCard';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkApiKey() {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        setHasApiKey(true); // Default to true if not running in the platform, using environment var
      }
    }
    checkApiKey();
  }, []);

  const handleSetupKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasApiKey(true); // Assume success to mitigate race condition
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const roast = await generateRoast(finalUrl);
      setResult(roast);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Failed to analyze portfolio. Please try again.';
      setError(errorMessage);
      
      // If the error relates to a missing entity or unauthorized, prompt for key
      if (errorMessage.toLowerCase().includes('requested entity was not found') || errorMessage.toLowerCase().includes('api key not valid')) {
        setHasApiKey(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] p-4 sm:p-8 lg:p-12 flex justify-center selection:bg-[#1A1A1A] selection:text-[#F5F2ED]">
      <div className="w-full max-w-6xl border-[8px] sm:border-[12px] border-[#1A1A1A] p-6 lg:p-12 flex flex-col bg-[#F5F2ED] shadow-2xl relative overflow-hidden">
        
        <header className="flex flex-col sm:flex-row justify-between items-baseline border-b-2 border-[#1A1A1A] pb-6 mb-8 gap-4">
          <div className="flex flex-col">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-bold uppercase tracking-widest text-red-600 mb-1"
            >
              Case Study Review 082-A
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl sm:text-7xl font-serif font-black tracking-tight leading-none uppercase italic text-[#1A1A1A]"
            >
              The Critic
            </motion.h1>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
            <div>
              <p className="text-sm font-mono text-[#1A1A1A]">TARGET URL:</p>
              {result ? (
                <p className="text-lg sm:text-xl font-serif italic text-blue-600 truncate max-w-[250px] sm:max-w-xs">{url}</p>
              ) : (
                <p className="text-lg sm:text-xl font-serif italic text-[#1A1A1A]/40 truncate max-w-[250px] sm:max-w-xs">Awaiting input...</p>
              )}
            </div>
            {window.aistudio && hasApiKey !== null && (
              <button 
                onClick={handleSetupKey}
                className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-blue-600 transition-colors"
                title="Bring your own API key"
              >
                <Key className="w-4 h-4" />
                {hasApiKey ? 'Update API Key' : 'Set API Key'}
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 flex flex-col relative z-10">
          {!result && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col justify-center max-w-2xl py-12"
            >
              <h2 className="text-3xl sm:text-4xl font-serif italic mb-6 text-[#1A1A1A]">Submit your portfolio for a ruthless, three-tiered editorial audit.</h2>
              
              {hasApiKey === false && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-yellow-100/50 border border-yellow-500/30 flex flex-col items-start"
                >
                  <p className="text-sm font-sans mb-3 text-yellow-800 font-medium">To use The Critic, please provide your own Gemini API Key.</p>
                  <button
                    onClick={handleSetupKey}
                    className="bg-yellow-500 text-white px-4 py-2 font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-sm hover:bg-yellow-600 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Provide API Key
                  </button>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mt-8">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. radha-portfolio-craft.vercel.app"
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-b-2 border-[#1A1A1A] py-3 px-2 text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-blue-600 transition-colors font-mono text-sm sm:text-base disabled:opacity-50 rounded-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !url.trim() || hasApiKey === false}
                  className="bg-[#1A1A1A] text-[#F5F2ED] hover:bg-blue-600 disabled:bg-[#1A1A1A]/20 disabled:text-[#1A1A1A]/50 px-8 py-3 font-bold uppercase tracking-widest text-xs transition-colors shrink-0"
                >
                  Analyze
                </button>
              </form>
              {error && (
                <p className="text-red-600 text-sm mt-4 font-mono font-bold uppercase tracking-wider">{error}</p>
              )}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center py-32"
              >
                <Loader2 className="w-12 h-12 animate-spin text-[#1A1A1A] mb-6" />
                <p className="font-mono text-sm font-bold uppercase tracking-widest text-[#1A1A1A] animate-pulse">Running Editorial Audit...</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8"
              >
                <PersonaCard 
                  variant="ramsay"
                  title="The Brutal Roast"
                  subtitle="Gordon Ramsay's Kitchen"
                  content={result.gordonRamsay}
                />
                <PersonaCard 
                  variant="lead"
                  title="Senior Lead Audit"
                  subtitle="Immediate Friction Points"
                  content={result.seniorLead}
                />
                <PersonaCard 
                  variant="coach"
                  title="The Wise Coach"
                  subtitle="The Soul of Work"
                  content={result.wiseCoach}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {(result || isLoading) && (
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 pt-8 border-t-2 border-[#1A1A1A] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6"
          >
            <div className="w-full sm:w-2/3 lg:w-1/2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-[#1A1A1A]">Auditor Note</p>
              <p className="text-2xl sm:text-3xl font-serif leading-none italic text-[#1A1A1A]">
                "Technically proficient, but strategically silent. You are a designer, not a decorator. Act like it."
              </p>
            </div>
            <div className="flex gap-4 self-end sm:self-auto shrink-0 mt-4 sm:mt-0">
              {result && (
                <button 
                  onClick={() => { setResult(null); setUrl(''); }}
                  className="h-12 px-6 bg-[#1A1A1A] text-[#F5F2ED] uppercase font-bold tracking-widest text-xs hover:bg-blue-600 transition-colors"
                >
                  New Audit
                </button>
              )}
              <div className="w-12 h-12 border-2 border-[#1A1A1A] flex items-center justify-center font-bold italic font-serif">
                {String(new Date().getDate()).padStart(2, '0')}
              </div>
            </div>
          </motion.footer>
        )}
      </div>
    </div>
  );
}
