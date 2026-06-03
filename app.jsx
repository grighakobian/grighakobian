// Main portfolio app — Grigor Hakobyan

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "accent": "#3fb950",
  "heroStyle": "default",
  "density": "regular"
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  '#3fb950': { soft: 'rgba(63,185,80,0.14)', glow: 'rgba(63,185,80,0.35)' },
  '#58a6ff': { soft: 'rgba(88,166,255,0.14)', glow: 'rgba(88,166,255,0.35)' },
  '#ff8fa3': { soft: 'rgba(255,143,163,0.16)', glow: 'rgba(255,143,163,0.4)' },
  '#d2a8ff': { soft: 'rgba(210,168,255,0.16)', glow: 'rgba(210,168,255,0.4)' },
  '#ffa657': { soft: 'rgba(255,166,87,0.16)', glow: 'rgba(255,166,87,0.4)' },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [cmdkOpen, setCmdkOpen] = React.useState(false);
  const data = window.PORTFOLIO;

  useReveal();

  // Theme
  React.useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
  }, [t.dark]);

  // Accent
  React.useEffect(() => {
    const preset = ACCENT_PRESETS[t.accent] || ACCENT_PRESETS['#3fb950'];
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--accent-soft', preset.soft);
    document.documentElement.style.setProperty('--accent-glow', preset.glow);
  }, [t.accent]);

  // Density
  React.useEffect(() => {
    const map = { compact: '0.85', regular: '1', comfy: '1.15' };
    document.documentElement.style.setProperty('--density', map[t.density] || '1');
  }, [t.density]);

  // Cmd+K
  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleTheme = () => setTweak('dark', !t.dark);

  return (
    <React.Fragment>
      <div className="grain" />
      <CursorGlow />
      <Nav dark={t.dark} onToggleTheme={toggleTheme} onOpenCmdk={() => setCmdkOpen(true)} />

      <main className="page">
        <Hero data={data} />
        <Inspiration data={data} />
        <Work data={data} />
        <OpenSource data={data} />
        <Skills data={data} />
        <Footer data={data} />
      </main>

      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} data={data} onToggleTheme={toggleTheme} />
      <EasterEggs />

      <TweaksPanel>
        <TweakSection label="Appearance" />
        <TweakToggle label="Dark mode" value={t.dark}
                     onChange={(v) => setTweak('dark', v)} />
        <TweakColor label="Accent" value={t.accent}
                    options={Object.keys(ACCENT_PRESETS)}
                    onChange={(v) => setTweak('accent', v)} />
        <TweakRadio label="Density" value={t.density}
                    options={['compact', 'regular', 'comfy']}
                    onChange={(v) => setTweak('density', v)} />

        <TweakSection label="Shortcuts" />
        <div style={{ fontSize: 11, lineHeight: 1.6, opacity: 0.7, padding: '2px 0' }}>
          <div><kbd style={kbdStyle}>⌘ K</kbd> Command palette</div>
          <div><kbd style={kbdStyle}>T</kbd> Toggle theme (in ⌘K)</div>
          <div><kbd style={kbdStyle}>↑↑↓↓←→←→BA</kbd> Konami</div>
          <div style={{ marginTop: 6 }}>Click the <span style={{ fontFamily: 'monospace' }}>♞ Chess</span> chip for a surprise.</div>
        </div>
      </TweaksPanel>
    </React.Fragment>
  );
}

const kbdStyle = {
  fontFamily: 'ui-monospace, SF Mono, Menlo, monospace',
  fontSize: 10,
  padding: '2px 5px',
  borderRadius: 4,
  background: 'rgba(0,0,0,0.06)',
  border: '0.5px solid rgba(0,0,0,0.12)',
  marginRight: 6,
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
