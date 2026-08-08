import React, { useState } from 'react';
import Garage from './components/Garage'; 
import ArtSlideshow from './components/ArtSlideshow'; 
import jailbreakImg from './assets/jailbreak.png';

// ==========================================
// 📬 CLEAN OMNIROUTE UTILITY FUNCTION
// ==========================================
const OMNIROUTE_URL = "http://localhost:20128/v1/chat/completions";

const fetchOmniRouteColor = async (userPrompt) => {
  if (!userPrompt.trim()) return null;

  try {
    const response = await fetch(OMNIROUTE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-fable-5", // 👈 Swapped to Claude Fable 5
        messages: [
          {
            role: "system",
            content: "You are a color extractor for a 3D app. Extract the closest matching CSS hex code from the user's request. Reply ONLY with the hex code string (e.g., #FF0000). Absolutely no extra words, markdown, or punctuation."
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      })
    });

    const data = await response.json();
    const aiHexReply = data.choices[0].message.content.trim();
    
    if (/^#[0-9A-F]{6}$/i.test(aiHexReply)) {
      return aiHexReply;
    } else {
      console.warn("AI returned an invalid hex code format:", aiHexReply);
      return null;
    }
  } catch (error) {
    console.error("Failed to connect to OmniRoute server:", error);
    alert("Make sure the local OmniRoute desktop application is open and running!");
    return null;
  }
};

function App() {
  // --- STATE ---
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('menu');

  // --- THEME ---
  const theme = isDarkMode 
    ? { bg: '#030712', panelBg: '#111827', sidebarBg: '#000000', text: '#ffffff', subText: '#9ca3af', border: '#1f2937', toggleBg: '#1f2937', toggleText: '#fbbf24' }
    : { bg: '#f3f4f6', panelBg: '#ffffff', sidebarBg: '#e5e7eb', text: '#000000', subText: '#4b5563', border: '#cbd5e1', toggleBg: '#ffffff', toggleText: '#312e81' };

  // --- NAVIGATION ---
  if (currentPage === 'customisation') {
    // We pass our OmniRoute function directly down into the Garage component where the 3D viewer lives!
    return <Garage onBack={() => setCurrentPage('menu')} getAIColor={fetchOmniRouteColor} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif', overflow: 'hidden', backgroundColor: theme.bg, color: theme.text }}>
      
      {/* LEFT AREA: Game Selector Panel */}
      <div style={{ width: '25%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRight: `1px solid ${theme.border}`, backgroundColor: theme.panelBg }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '8px', color: theme.subText }}>SELECT GAME</h2>
        
        <div onClick={() => setCurrentPage('customisation')} style={{ height: '96px', width: '100%', backgroundImage: `url(${jailbreakImg})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `2px solid ${theme.border}` }}>
          <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', textShadow: '-2px -2px 0 #3b82f6, 2px -2px 0 #3b82f6, -2px 2px 0 #f97316, 2px 2px 0 #f97316' }}>Jailbreak</span>
        </div>
        
        <button disabled style={{ height: '96px', width: '100%', border: `2px dashed ${theme.border}`, borderRadius: '12px', fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', color: theme.subText, opacity: 0.4, cursor: 'not-allowed' }}>
          (more coming soon...)
        </button>
      </div>

      {/* CENTER AREA: Slideshow */}
      <ArtSlideshow 
        theme={theme} 
        onClick={() => setCurrentPage('customisation')} 
      />

      {/* RIGHT AREA: Menu Sidebar */}
      <div style={{ width: '16.666%', borderLeft: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', justifyContent: 'space-between', backgroundColor: theme.sidebarBg }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '12px', marginLeft: 'auto', marginRight: 'auto', backgroundColor: theme.panelBg, border: `1px solid ${theme.border}` }}></div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.7, color: theme.text }}>Roblox/Google Profile</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', textAlign: 'center', margin: 'auto 0' }}>
          <button style={{ width: '100%', padding: '10px 0', borderRadius: '12px', fontWeight: 'bold', backgroundColor: 'transparent', border: 'none', color: theme.text, cursor: 'pointer' }}>⚙️ Settings</button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ width: '100%', padding: '10px 0', borderRadius: '12px', fontWeight: '800', border: `1px solid ${theme.border}`, cursor: 'pointer', backgroundColor: theme.toggleBg, color: theme.toggleText }}>{isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</button>
          <button style={{ width: '100%', padding: '10px 0', borderRadius: '12px', fontWeight: 'bold', backgroundColor: 'transparent', border: 'none', color: theme.text, cursor: 'pointer' }}>🎚️ Slider</button>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.15, transform: 'rotate(-90deg)', whiteSpace: 'nowrap', userSelect: 'none', color: theme.text, margin: '30px 0' }}>MENU</p>
          <button style={{ border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 16px', color: '#ef4444', fontWeight: '600', borderRadius: '12px', backgroundColor: 'transparent', width: '100%', fontSize: '0.875rem', cursor: 'pointer' }}>Log out</button>
        </div>
      </div>
    </div>
  );
}

export default App;