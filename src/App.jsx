import { useState } from 'react';
import Garage from './components/Garage';
import ArtSlideshow from './components/ArtSlideshow';
import jailbreakImg from './assets/jailbreak.png';

const OMNIROUTE_URL = 'http://localhost:20128/v1/chat/completions';

const fetchOmniRouteColor = async (userPrompt) => {
  if (!userPrompt.trim()) return null;

  try {
    const response = await fetch(OMNIROUTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'anthropic/claude-fable-5',
        messages: [
          {
            role: 'system',
            content:
              'You are a color extractor for a 3D app. Extract the closest matching CSS hex code from the user request. Reply only with the hex code string.',
          },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    const data = await response.json();
    const aiHexReply = data.choices[0].message.content.trim();
    return /^#[0-9A-F]{6}$/i.test(aiHexReply) ? aiHexReply : null;
  } catch (error) {
    console.error('Failed to connect to OmniRoute server:', error);
    alert('Make sure the local OmniRoute desktop application is open and running!');
    return null;
  }
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('menu');

  if (currentPage === 'customisation') {
    return <Garage onBack={() => setCurrentPage('menu')} getAIColor={fetchOmniRouteColor} />;
  }

  return (
    <main className={`app-shell ${isDarkMode ? '' : 'light-mode'}`}>
      <header className="topbar">
        <button className="brand" onClick={() => setCurrentPage('menu')} aria-label="Return to home">
          <span className="brand-mark">AC</span>
          <span>
            <strong>AutoCraft</strong>
            <small>Custom garage</small>
          </span>
        </button>
        <div className="topbar-status">
          <span className="status-dot" />
          <span>Garage online</span>
          <button className="icon-button" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle color theme">
            {isDarkMode ? '☼' : '☾'}
          </button>
          <div className="avatar">AP</div>
        </div>
      </header>

      <div className="dashboard">
        <aside className="side-nav">
          <div>
            <p className="eyebrow">Workspace</p>
            <nav>
              <button className="nav-item active"><span>⌂</span> Overview</button>
              <button className="nav-item" onClick={() => setCurrentPage('customisation')}><span>◈</span> My garage</button>
              <button className="nav-item"><span>◌</span> Collections</button>
            </nav>
          </div>
          <div className="side-nav-footer">
            <div className="upgrade-card">
              <span className="upgrade-icon">✦</span>
              <strong>Build your dream car</strong>
              <small>Make every detail yours.</small>
              <button onClick={() => setCurrentPage('customisation')}>Start building <span>↗</span></button>
            </div>
            <button className="nav-item muted"><span>⚙</span> Settings</button>
          </div>
        </aside>

        <section className="content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow accent">THURSDAY, OCTOBER 29</p>
              <h1>Welcome back, <em>builder.</em></h1>
              <p className="lede">Your garage is ready for its next masterpiece.</p>
            </div>
            <button className="primary-button" onClick={() => setCurrentPage('customisation')}>
              <span>＋</span> New build
            </button>
          </div>

          <div className="hero-grid">
            <ArtSlideshow onClick={() => setCurrentPage('customisation')} />
            <div className="game-card">
              <div className="card-heading">
                <div>
                  <p className="eyebrow">Featured experience</p>
                  <h2>Jailbreak</h2>
                </div>
                <span className="live-pill">LIVE</span>
              </div>
              <div className="game-art" style={{ backgroundImage: `url(${jailbreakImg})` }}>
                <div className="game-art-shade" />
                <span className="game-logo">JAIL<br /><i>BREAK</i></span>
              </div>
              <div className="game-card-footer">
                <span><b>18</b> builds created</span>
                <button onClick={() => setCurrentPage('customisation')}>Open garage <span>↗</span></button>
              </div>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">Your workspace</p>
              <h2>Pick up where you left off</h2>
            </div>
            <button className="text-button">View all <span>→</span></button>
          </div>
          <div className="stat-grid">
            <div className="stat-card"><span className="stat-icon orange">◈</span><div><strong>03</strong><small>Active builds</small></div><span className="stat-trend">+2 this week</span></div>
            <div className="stat-card"><span className="stat-icon blue">✦</span><div><strong>12</strong><small>Saved designs</small></div><span className="stat-trend">+4 this week</span></div>
            <div className="stat-card"><span className="stat-icon purple">◉</span><div><strong>86%</strong><small>Garage completion</small></div><span className="stat-trend">Looking good</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
