import React, { useState, useRef } from 'react';
import { generateHologram } from '../services/aiService';

interface HoloGeneratorProps {
  onClose: () => void;
}

export const HoloGenerator: React.FC<HoloGeneratorProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    // Check for API Key first (Veo Requirement)
    try {
        const aiStudio = (window as any).aistudio;
        if (aiStudio) {
            const hasKey = await aiStudio.hasSelectedApiKey();
            if (!hasKey) {
                await aiStudio.openSelectKey();
            }
        }
    } catch (e) {
        console.warn("API Key selection check failed", e);
    }

    if (!selectedFile || !prompt) return;
    
    setLoading(true);
    setStatus('Initializing Veo Protocol...');
    setVideoUrl(null);

    try {
        // Convert file to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            
            setStatus('Generating Hologram (This may take a minute)...');
            
            try {
                const url = await generateHologram(base64String, prompt, aspectRatio);
                if (url) {
                    setVideoUrl(url);
                    setStatus('Hologram Rendered Successfully.');
                } else {
                    setStatus('Generation Failed.');
                }
            } catch (err) {
                 setStatus('Error: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        reader.readAsDataURL(selectedFile);

    } catch (e) {
        setStatus('System Failure.');
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-cyber-dark border border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)] p-6 relative" onClick={e => e.stopPropagation()}>
         
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                <span className="text-2xl">📽️</span> VEO HOLOGRAPHIC RECONSTRUCTION
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
         </div>

         {!videoUrl ? (
             <div className="space-y-4">
                 
                 {/* Upload */}
                 <div className="border-2 border-dashed border-gray-700 rounded p-6 text-center hover:border-purple-500 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                     {selectedFile ? (
                         <div className="text-purple-300 font-mono text-sm">{selectedFile.name}</div>
                     ) : (
                         <div className="text-gray-500 text-sm">Click to upload source image</div>
                     )}
                 </div>

                 {/* Prompt */}
                 <div>
                     <label className="text-xs text-gray-400 uppercase font-bold">Animation Prompt</label>
                     <textarea 
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        className="w-full bg-black border border-gray-700 text-white text-sm p-2 h-20 outline-none focus:border-purple-500 mt-1"
                        placeholder="Describe how the image should move (e.g., 'A cyberpunk city with flying cars zooming by')"
                     />
                 </div>

                 {/* Aspect Ratio */}
                 <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Aspect Ratio</label>
                    <div className="flex gap-2 mt-1">
                        <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-2 text-xs border ${aspectRatio === '16:9' ? 'bg-purple-900/50 border-purple-500 text-purple-300' : 'bg-black border-gray-700 text-gray-500'}`}>16:9 (Landscape)</button>
                        <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-2 text-xs border ${aspectRatio === '9:16' ? 'bg-purple-900/50 border-purple-500 text-purple-300' : 'bg-black border-gray-700 text-gray-500'}`}>9:16 (Portrait)</button>
                    </div>
                 </div>

                 <button 
                    onClick={handleGenerate}
                    disabled={loading || !selectedFile || !prompt}
                    className="w-full py-3 bg-purple-600 text-white font-bold uppercase tracking-wider hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {loading ? 'PROCESSING...' : 'GENERATE VIDEO'}
                 </button>

                 {status && <div className="text-center text-xs font-mono text-gray-400 mt-2">{status}</div>}
             </div>
         ) : (
             <div className="flex flex-col gap-4">
                 <div className="relative pt-[56.25%] bg-black">
                     <video src={videoUrl} controls autoPlay loop className="absolute top-0 left-0 w-full h-full object-contain" />
                 </div>
                 <div className="flex gap-2">
                     <button onClick={() => setVideoUrl(null)} className="flex-1 py-2 border border-gray-600 text-gray-300 hover:text-white text-xs">NEW GENERATION</button>
                     <a href={videoUrl} download="hologram.mp4" className="flex-1 py-2 bg-purple-600 text-white text-center text-xs font-bold hover:bg-purple-500 flex items-center justify-center">DOWNLOAD</a>
                 </div>
             </div>
         )}
         
         <div className="mt-4 text-[10px] text-gray-600 text-center">
            Powered by Google Veo Model (veo-3.1-fast-generate-preview). Requires Paid API Key.
         </div>

      </div>
    </div>
  );
};