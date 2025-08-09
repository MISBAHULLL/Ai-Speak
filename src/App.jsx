import { useState, useEffect } from 'react';

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiReady, setAiready] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

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

    }, 1000)
    return () => clearInterval(checkReady);
  }, []);

  const speakText = async () => {
    if(text.lenght > 3000){
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
        engine: "standart",
        language: "en-US",
      });
      setCurrentAudio(audio);
      audio.play();
      audio.addEventlistener("ended",() => setLoading(false));
      audio.addEventlistener("error",() => setLoading(false));
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
    }
   }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-950 via-slate-950 to-purple-950 flex flex-col items-center justify-center p-3 gap-6">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light bg-gradient-to-r from-blue-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent text-center">
          Ai Text To Speech
        </h1>

        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          aiReady ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        }`}>
          {aiReady ? "Ai Ready" : "Waiting for Ai..."}
        </div>
      </div>
    </>
);
}

export default App
