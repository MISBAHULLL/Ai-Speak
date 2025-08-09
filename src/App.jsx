import { useState, useEffect } from 'react';

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiReady, setAiready] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [voice, setVoice] = useState('en-US');
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if(
        window.puter &&
        window.puter.ai &&
        typeof window.puter.ai.txt2speech === "function"
      ){
        setAiready(true);
        clearInterval(checkReady);
      }

    }, 300)
    return () => clearInterval(checkReady);
  }, []);

  const speakText = async () => {
    if(text.length > 3000){
      setError("Text is too long. Please limit to 3000 characters.");
      return;
    }

    setLoading(true);
    setError("");

    if(currentAudio){
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    try{
      const audio = await window.puter.ai.txt2speech(text, {
        engine: "standard",
        language: voice,
        speed: speed
      });
      setCurrentAudio(audio);
      audio.play();
      audio.addEventListener("ended",() => {
        setLoading(false);
        setIsPlaying(false);
      });
      audio.addEventListener("error",() => {
        setLoading(false);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }catch(err){
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }


   const stopAudio = () => {
    if(currentAudio){
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setLoading(false);
      setIsPlaying(false);
    }
   }

   const toggleTheme = () => setIsDark(!isDark);

   const voices = [
     { value: 'en-US', label: '🇺🇸 English (US)' },
     { value: 'en-GB', label: '🇬🇧 English (UK)' },
     { value: 'es-ES', label: '🇪🇸 Spanish' },
     { value: 'fr-FR', label: '🇫🇷 French' },
     { value: 'de-DE', label: '🇩🇪 German' },
     { value: 'it-IT', label: '🇮🇹 Italian' },
     { value: 'ja-JP', label: '🇯🇵 Japanese' },
     { value: 'ko-KR', label: '🇰🇷 Korean' }
   ];

  return (
    <>
      <div className={`min-h-screen transition-all duration-500 flex flex-col items-center justify-center p-3 gap-6 ${
        isDark 
          ? 'bg-gradient-to-br from-rose-950 via-slate-950 to-purple-950' 
          : 'bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isDark ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 'bg-gray-800/20 text-gray-700 hover:bg-gray-800/30'
            }`}
          >
            {isDark ? 'Dark' : 'White'}
          </button>
        </div>
        
        <h1 className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light bg-gradient-to-r from-blue-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent text-center animate-pulse`}>
          AI Text To Speech
        </h1>

        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          aiReady ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        }`}>
          {aiReady ? "Ai Ready" : "Waiting for Ai..."}
        </div>
        <div className={`w-full max-w-4xl backdrop-blur-md rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:shadow-3xl ${
          isDark 
            ? 'bg-gradient-to-r from-gray-800/90 to-gray-700/90 border border-gray-600' 
            : 'bg-white/80 border border-gray-200'
        }`}>
          
          {/* Voice & Speed Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                🗣️ Voice Language
              </label>
              <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                className={`w-full p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-fuchsia-400 ${
                  isDark 
                    ? 'bg-gray-700/80 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {voices.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                ⚡ Speed: {speed}x
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
          <textarea className={`w-full h-40 p-4 border rounded-2xl
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400
          transition-all duration-300 disabled:opacity-50 resize-none shadow-xl
          focus:shadow-fuchsia-700/70 hover:shadow-lg ${
            isDark 
              ? 'bg-gray-700/80 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`} placeholder="✨ Enter your text here... (max 3000 characters)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!aiReady}
          maxLength={3000}></textarea>

          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              📝 {text.length} / 3000 characters
            </span>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {text.split(' ').filter(w => w.length > 0).length} words
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 to-purple-500
            hover:from-rose-600 hover:to-purple-600 text-white font-semibold rounded-2xl transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-101 active:scale-95
            shadow-lg hover:shadow-xl"
            onClick={speakText}
            disabled={!aiReady || loading || !text.trim()}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                  🎵 Speaking...
                </div>
              ):(
                <div className="flex items-center justify-center gap-2">
                  {isPlaying ? '🔊' : '🎤'} {isPlaying ? 'Playing' : 'Speak Text'}
                </div>
              )}
            </button>

            {currentAudio && (
              <button className={`px-6 py-4 font-semibold rounded-2xl border transition-all duration-300
              transform hover:scale-100 active:scale-95 shadow-lg hover:shadow-xl ${
                isDark 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-neutral-500/30' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border-gray-300'
              }`}
              onClick={stopAudio}>
                ⏹️ Stop
              </button>
            )}
            
            <button className={`px-6 py-4 font-semibold rounded-2xl border transition-all duration-300
            transform hover:scale-101 active:scale-95 shadow-lg hover:shadow-xl ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500/30' 
                : 'bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-blue-800 border-blue-300'
            }`}
            onClick={() => setText('')}
            disabled={!text.trim()}>
              🗑️ Clear
            </button>
          </div>

          {/* Progress Bar */}
          {isPlaying && (
            <div className="mt-4">
              <div className={`w-full bg-gray-200 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="bg-gradient-to-r from-rose-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
              <p className={`text-center mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                🎵 Audio is playing...
              </p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {error && (
              <div className={`p-4 border rounded-2xl animate-shake ${
                isDark 
                  ? 'bg-red-900/50 text-red-300 border-red-700' 
                  : 'bg-red-50 text-red-700 border-red-300'
              }`}>
                ❌ {error}
              </div>
            )}
          </div>

        </div>
        
        {/* Footer */}
        <div className={`text-center mt-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-sm"> Powered by Puter.js AI • Misbahul Munir</p>
        </div>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f43f5e, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
);
}

export default App
