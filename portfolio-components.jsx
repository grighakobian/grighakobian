// Portfolio components — Grigor Hakobyan
// Sections, helpers, easter eggs

const { useEffect, useState, useRef, useMemo } = React;

// ─── Icons (inline SVG, kept tiny) ───────────────────────────────────────────
function Icon({ name, size = 14 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'pin': return <svg {...props}><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'mail': return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case 'github': return <svg {...props}><path d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.59.69.49A10 10 0 0 0 12 2z"/></svg>;
    case 'linkedin': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v8M8 7v.01M12 18v-5a2 2 0 1 1 4 0v5M12 13v-3"/></svg>;
    case 'arrow': return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-out': return <svg {...props}><path d="M7 17 17 7M9 7h8v8"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'sun': return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
    case 'moon': return <svg {...props}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>;
    case 'phone': return <svg {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>;
    case 'sparkle': return <svg {...props}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>;
    case 'menu': return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case 'close': return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    default: return null;
  }
}

// ─── Reveal-on-scroll ────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ value, suffix = '', duration = 1600 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{n}<span className="suffix">{suffix}</span></span>;
}

// ─── Cursor glow ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const isTouch = matchMedia('(hover: none)').matches;
    if (isTouch) return;
    document.body.classList.add('cursor-on');
    const onMove = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return <div ref={ref} className="cursor-glow" />;
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ dark, onToggleTheme, onOpenCmdk }) {
  const links = [
    { href: '#top', label: 'Intro' },
    { href: '#inspiration', label: 'Inspiration' },
    { href: '#work', label: 'Work' },
    { href: '#skills', label: 'Stack' },
    { href: '#contact', label: 'Contact' },
  ];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleNav = (e, href) => {
    smoothScroll(e, href);
    setMenuOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav-spacer">
        <button
          className="nav-burger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={18} />
        </button>
      </div>
      <div className="nav-links">
        {links.map(l => (
          <a key={l.href} href={l.href} className="nav-link" onClick={(e) => handleNav(e, l.href)}>{l.label}</a>
        ))}
      </div>
      <div className="nav-actions">
        <button className="cmdk-hint" onClick={onOpenCmdk} title="Command palette">⌘ K</button>
        <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme" aria-label="Toggle theme">
          <Icon name={dark ? 'sun' : 'moon'} size={14} />
        </button>
      </div>

      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} className="nav-mobile-link" onClick={(e) => handleNav(e, l.href)}>{l.label}</a>
        ))}
      </div>
    </nav>
  );
}

function smoothScroll(e, href) {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero({ data }) {
  return (
    <section className="hero" id="top">
      <div className="hero-eyebrow">
        <span className="live" />
        <span>Available for Senior iOS roles · Q1 2026</span>
      </div>
      <h1 className="hero-name">
        <span className="word">Hi, I'm</span>
        <span className="word">Grig</span>
        <span className="glyph">👋🏻</span>
      </h1>
      <p className="hero-role">
        Senior Software Engineer building <span className="accent">audiobooks, dating apps, and learning platforms</span> for tens of millions of people.
      </p>
      <div className="hero-meta">
        <span className="hero-meta-item"><Icon name="pin" /> Yerevan, Armenia · UTC+4</span>
        <a className="hero-meta-item" href={`mailto:${data.email}`}><Icon name="mail" /> e-mail</a>
        <a className="hero-meta-item" href={data.links.github} target="_blank" rel="noopener"><Icon name="github" /> github</a>
        <a className="hero-meta-item" href={data.links.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" /> linkedin</a>
      </div>

      <div className="hero-stats">
        {data.stats.map((s, i) => (
          <div key={i} className="hero-stat">
            <div className="stat-value">
              <Counter value={s.value} suffix={s.suffix} duration={1400 + i * 100} />
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="scroll-cue">
        <span>scroll</span>
        <div className="line" />
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
function About({ data }) {
  return (
    <section className="section section-narrow reveal" id="about" style={{ maxWidth: 1200 }}>
      <div className="section-head">
        <span>01 / About</span>
        <span className="dash" />
        <span>The human behind the commits</span>
      </div>
      <div className="about-grid">
        <div className="about-portrait">
          <img src="assets/grigor-portrait.jpeg" alt={`${data.name} — ${data.role}`} />
        </div>
        <div className="about-copy">
          <p>{data.about.p1}</p>
          <p>{data.about.p2}</p>
          <p>{data.about.p3}</p>
          <div className="hobbies">
            {data.hobbies.map((h, i) => (
              <span key={i} className="hobby" data-hobby={h.label.toLowerCase()}>
                <span className="sym">{h.symbol}</span>{h.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Work ────────────────────────────────────────────────────────────────────
function Work({ data }) {
  const [open, setOpen] = useState(null); // all collapsed by default
  return (
    <section className="section reveal" id="work">
      <div className="section-head">
        <span>02 / Selected Work</span>
        <span className="dash" />
        <span>{data.projects.length} apps · 50M+ humans</span>
      </div>
      <div className="work-list">
        {data.projects.map(p => (
          <article
            key={p.id}
            className={`project ${open === p.id ? 'open' : ''}`}
            onClick={() => setOpen(open === p.id ? null : p.id)}
          >
            <div className="project-period">{p.period}</div>
            <div className="project-main">
              <div className="project-id-row">
                <img
                  className="app-icon"
                  src={`assets/${p.iconId}.png`}
                  alt={`${p.company} icon`}
                  loading="lazy"
                />
                <div className="project-id-text">
                  <div className="project-head">
                    <h3 className="project-name">{p.company}</h3>
                    <span className="project-role">{p.role}</span>
                  </div>
                  <p className="project-tagline">{p.tagline}</p>
                  <div className="project-tags">
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="project-metric">
              <div className="project-metric-val">{p.metric.value}</div>
              <div className="project-metric-lbl">{p.metric.label}</div>
            </div>
            <button className="project-expand" aria-label="Toggle">
              <Icon name="plus" size={12} />
            </button>
            <div className="project-reveal">
              <div className="project-reveal-inner">
                <div className="project-summary">
                  {p.summary}
                  {p.url && (
                    <a className="project-visit" href={p.url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>
                      View on the App Store <Icon name="arrow-out" size={12} />
                    </a>
                  )}
                </div>
                <ul className="project-highlights">
                  {p.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
                {p.shots && p.shots.length > 0 && (
                  <div className={`project-shots ${p.platform === 'mac' ? 'is-mac' : 'is-ios'}`}>
                    {p.shots.map((label, i) => (
                      <figure key={i} className={p.platform === 'mac' ? 'shot shot-mac' : 'shot shot-phone'}>
                        <img
                          className="shot-screen"
                          src={`assets/shot-${p.id}-${i}.png`}
                          alt={label}
                          loading="lazy"
                        />
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Experience ──────────────────────────────────────────────────────────────
function Experience({ data }) {
  return (
    <section className="section section-narrow reveal" id="experience" style={{ maxWidth: 1200 }}>
      <div className="section-head">
        <span>03 / Experience</span>
        <span className="dash" />
        <span>2016 → today</span>
      </div>
      <div className="timeline">
        {data.experience.map((e, i) => (
          <div key={i} className="tl-item">
            <span className="tl-dot" />
            <div className="tl-period">{e.period}</div>
            <h4 className="tl-title">{e.role} <span className="at">{e.edu ? '·' : '@'} {e.company}</span></h4>
            <div className="tl-location">{e.location}</div>
            {e.blurb && <p className="tl-blurb">{e.blurb}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Inspiration ─────────────────────────────────────────────────────────────
function Inspiration({ data }) {
  const insp = data.inspiration;
  if (!insp) return null;
  return (
    <section className="section reveal" id="inspiration">
      <div className="section-head">
        <span>01 / Inspiration</span>
        <span className="dash" />
        <span>Why I love iOS</span>
      </div>
      <p className="insp-lead">
        {insp.leadEmphasis && insp.lead.includes(insp.leadEmphasis)
          ? (() => {
              const [before, after] = insp.lead.split(insp.leadEmphasis);
              return (<React.Fragment>{before}<span className="insp-em">{insp.leadEmphasis}</span>{after}</React.Fragment>);
            })()
          : insp.lead}
      </p>
      <div className="insp-grid">
        {insp.facets.map((f, i) => (
          <div key={i} className="insp-card">
            <div className="insp-k">{f.k}</div>
            <p className="insp-v">{f.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────
function Skills({ data }) {
  return (
    <section className="section reveal" id="skills">
      <div className="section-head">
        <span>04 / Stack</span>
        <span className="dash" />
        <span>Tools of the trade</span>
      </div>
      <div className="skills-grid">
        {data.skills.map((s, i) => (
          <div key={i} className="skill-card">
            <div className="skill-group">{s.group}</div>
            <div className="skill-items">
              {s.items.map(it => <span key={it} className="skill-pill">{it}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Blog ────────────────────────────────────────────────────────────────────
function Blog({ data }) {
  return (
    <section className="section reveal" id="blog">
      <div className="section-head">
        <span>05 / Writing</span>
        <span className="dash" />
        <span>Notes on shipping iOS</span>
      </div>
      <div className="blog-grid">
        {data.blogs.map((b, i) => (
          <article key={i} className={`blog-card ${b.featured ? 'featured' : ''}`}>
            <div className="blog-meta">
              {b.featured && <span className="featured-tag">Featured</span>}
              <span>{b.date}</span>
              <span className="dot" />
              <span>{b.readTime}</span>
            </div>
            <h3 className="blog-title">{b.title}</h3>
            <p className="blog-excerpt">{b.excerpt}</p>
            <div className="blog-foot">
              <div className="blog-tags">
                {b.tags.map(t => <span key={t} className="blog-tag">{t}</span>)}
              </div>
              <span className="blog-arrow">Read <Icon name="arrow" size={12} /></span>
            </div>
          </article>
        ))}
      </div>
      <a href="#" className="blog-all" onClick={(e) => e.preventDefault()}>
        All posts <Icon name="arrow-out" size={12} />
      </a>
    </section>
  );
}

// ─── Open source ─────────────────────────────────────────────────────────────
function OpenSource({ data }) {
  return (
    <section className="section reveal" id="opensource">
      <div className="section-head">
        <span>03 / Open Source</span>
        <span className="dash" />
        <span>Code that lives in public</span>
      </div>
      <div className="os-grid">
        {data.openSource.map((o, i) => (
          <a key={i} className="os-card" href={o.url || '#'} target="_blank" rel="noopener">
            <div className="os-head">
              <h4 className="os-title">{o.title}</h4>
              <span className="os-lang">{o.lang}</span>
            </div>
            <div className="os-role">{o.role}{o.meta ? ` · ${o.meta}` : ''}</div>
            <p className="os-blurb">{o.blurb}</p>
            {o.url && (
              <span className="os-link">
                View on GitHub <Icon name="arrow-out" size={12} />
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer({ data }) {
  return (
    <footer className="footer reveal" id="contact">
      <h2 className="footer-cta">
        Got an iOS problem worth solving?<br />
        <a href={`mailto:${data.email}`}>Drop me a line ↗</a>
      </h2>
      <div className="footer-meta">
        <div className="footer-links">
          <a href={data.links.github} target="_blank" rel="noopener"><Icon name="github" /> github</a>
          <a href={data.links.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" /> linkedin</a>
          <a href={`mailto:${data.email}`}><Icon name="mail" /> e-mail</a>
        </div>
        <div className="footer-fine">
          © 2026 · Built with Claude with too much tokens · Press ⌘K for shortcuts
        </div>
      </div>
    </footer>
  );
}

// ─── Command palette ─────────────────────────────────────────────────────────
function CmdK({ open, onClose, data, onToggleTheme }) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  const items = useMemo(() => [
    { id: 'inspiration', label: 'Jump to Inspiration', icon: '↓', kbd: 'I', action: () => jump('#inspiration') },
    { id: 'work', label: 'Jump to Selected Work', icon: '↓', kbd: 'W', action: () => jump('#work') },
    { id: 'skills', label: 'Jump to Stack', icon: '↓', kbd: 'S', action: () => jump('#skills') },
    { id: 'email', label: `Email ${data.email}`, icon: '✉', kbd: '↵', action: () => location.href = `mailto:${data.email}` },
    { id: 'github', label: 'Open GitHub profile', icon: '↗', kbd: 'G', action: () => window.open(data.links.github, '_blank') },
    { id: 'linkedin', label: 'Open LinkedIn', icon: '↗', kbd: 'L', action: () => window.open(data.links.linkedin, '_blank') },
    { id: 'theme', label: 'Toggle theme', icon: '◐', kbd: 'T', action: onToggleTheme },
    { id: 'top', label: 'Back to top', icon: '↑', kbd: 'H', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  ], [data, onToggleTheme]);

  function jump(href) {
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
    onClose();
  }

  const filtered = items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQ(''); setIdx(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
    }
  }, [open]);

  useEffect(() => { setIdx(0); }, [q]);

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); filtered[idx] && filtered[idx].action(); onClose(); }
    if (e.key === 'Escape') { onClose(); }
  }

  return (
    <div className={`cmdk-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="Type a command, or scroll somewhere…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
        />
        <div className="cmdk-list">
          {filtered.map((it, i) => (
            <div
              key={it.id}
              className={`cmdk-item ${i === idx ? 'active' : ''}`}
              onMouseEnter={() => setIdx(i)}
              onClick={() => { it.action(); onClose(); }}
            >
              <span className="icon">{it.icon}</span>
              <span>{it.label}</span>
              <kbd>{it.kbd}</kbd>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="cmdk-item">
              <span className="icon">∅</span>
              <span>No matches. Try "work", "email", or "theme".</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Easter eggs ─────────────────────────────────────────────────────────────
function EasterEggs() {
  const [chess, setChess] = useState(null);
  const [konami, setKonami] = useState(false);

  useEffect(() => {
    // Chess piece on hobby hover
    function onHobbyClick(e) {
      const t = e.target.closest('[data-hobby="chess"]');
      if (!t) return;
      setChess('♞');
      setTimeout(() => setChess(null), 1400);
    }
    document.addEventListener('click', onHobbyClick);

    // Konami: ↑↑↓↓←→←→BA
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let buf = [];
    function onKey(e) {
      buf.push(e.key);
      if (buf.length > seq.length) buf.shift();
      if (buf.join(',').toLowerCase() === seq.join(',').toLowerCase()) {
        setKonami(true);
        setTimeout(() => setKonami(false), 3200);
        document.body.style.setProperty('--accent', '#ff7b72');
        document.body.style.setProperty('--accent-soft', 'rgba(255, 123, 114, 0.14)');
        document.body.style.setProperty('--accent-glow', 'rgba(255, 123, 114, 0.35)');
        setTimeout(() => {
          document.body.style.removeProperty('--accent');
          document.body.style.removeProperty('--accent-soft');
          document.body.style.removeProperty('--accent-glow');
        }, 6000);
      }
    }
    window.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('click', onHobbyClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <React.Fragment>
      {chess && <div className="chess-burst go">{chess}</div>}
      <div className={`konami-toast ${konami ? 'show' : ''}`}>
        ⬆⬆⬇⬇⬅➡⬅➡ B A · You found the secret. Have a 🍫
      </div>
    </React.Fragment>
  );
}

// Expose to window
Object.assign(window, {
  Icon, Nav, Hero, About, Work, Experience, Inspiration, Skills, Blog, OpenSource, Footer,
  CmdK, EasterEggs, CursorGlow, useReveal, Counter, smoothScroll,
});
