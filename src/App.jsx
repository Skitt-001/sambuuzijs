import React, { useEffect, useMemo, useState } from "react";
import { config } from "./config.js";

const photoUrl = (file) =>
  /^https?:\/\//.test(file) ? file : `${import.meta.env.BASE_URL}photos/${file}`;

function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 26,
        delay: Math.random() * 12,
        duration: 9 + Math.random() * 10,
        char: ["❤", "💖", "💗", "♥"][i % 4],
      })),
    []
  );
  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}

function Typewriter({ lines }) {
  const [text, setText] = useState("");
  useEffect(() => {
    let line = 0, char = 0, deleting = false, timer;
    const tick = () => {
      const current = lines[line];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));
      let delay = deleting ? 30 : 65;
      if (!deleting && char === current.length) { deleting = true; delay = 1800; }
      else if (deleting && char === 0) { deleting = false; line = (line + 1) % lines.length; delay = 400; }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [lines]);
  return <p className="tagline">{text}<span className="caret">|</span></p>;
}

function Counter({ startDate }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const start = new Date(startDate).getTime();
  if (!startDate || Number.isNaN(start)) return null;
  const s = Math.max(0, Math.floor((now - start) / 1000));
  const parts = [
    ["dienas", Math.floor(s / 86400)],
    ["stundas", Math.floor((s % 86400) / 3600)],
    ["minūtes", Math.floor((s % 3600) / 60)],
    ["sekundes", s % 60],
  ];
  return (
    <section className="section reveal">
      <h2>Mēs esam kopā</h2>
      <div className="counter">
        {parts.map(([label, value]) => (
          <div key={label} className="count-box">
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Gallery({ photos }) {
  const [open, setOpen] = useState(null);
  const items = photos.length
    ? photos.map((p) => ({ src: photoUrl(p.file), caption: p.caption }))
    : Array.from({ length: 4 }, (_, i) => ({ src: null, caption: `Photo ${i + 1}` }));

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="section">
      <h2>Pāris bildes :D</h2>
      <div className="gallery">
        {items.map((it, i) => (
          <figure
            key={i}
            className="photo reveal"
            style={{ animationDelay: `${i * 0.12}s`, "--tilt": `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` }}
            onClick={() => it.src && setOpen(it)}
          >
            {it.src ? <img src={it.src} alt={it.caption || ""} loading="lazy" /> : <div className="placeholder">❤</div>}
            {it.caption && <figcaption>{it.caption}</figcaption>}
          </figure>
        ))}
      </div>
      {open && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          <img src={open.src} alt={open.caption || ""} />
          {open.caption && <p>{open.caption}</p>}
        </div>
      )}
    </section>
  );
}

function Reasons({ reasons }) {
  return (
    <section className="section">
      <h2>Kapec es tevi miilu</h2>
      <div className="reasons">
        {reasons.map((r, i) => (
          <div key={i} className="reason reveal" style={{ animationDelay: `${i * 0.1}s` }}>
            <span>{i + 1}</span>
            {r}
          </div>
        ))}
      </div>
    </section>
  );
}

function Letter() {
  const [open, setOpen] = useState(false);
  return (
    <section className="section">
      <h2>Maza Zimīte</h2>
      <button className={`envelope ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        {open ? (
          <div className="letter">
            <h3>{config.letterTitle}</h3>
            <p>{config.letter}</p>
            <p className="sig">{config.signature}</p>
          </div>
        ) : (
          <span className="env-icon">💌<small>Uzspied lai atvērtu!</small></span>
        )}
      </button>
    </section>
  );
}

export default function App() {
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    const r = document.documentElement.style;
    const c = config.colors;
    r.setProperty("--accent", c.accent);
    r.setProperty("--accent2", c.accent2);
    r.setProperty("--bg-from", c.bgFrom);
    r.setProperty("--bg-to", c.bgTo);
    document.title = `${config.eyebrow} ${config.name} ❤`;
  }, []);

  const burst = (e) => {
    const id = Date.now() + Math.random();
    const items = Array.from({ length: 14 }, (_, i) => ({
      id: id + i,
      x: e.clientX,
      y: e.clientY,
      dx: (Math.random() - 0.5) * 260,
      dy: -60 - Math.random() * 220,
    }));
    setBursts((b) => [...b, ...items]);
    setTimeout(() => setBursts((b) => b.filter((p) => !items.some((n) => n.id === p.id))), 1400);
  };

  return (
    <div className="app" onClick={burst}>
      <FloatingHearts />
      {bursts.map((p) => (
        <span key={p.id} className="burst" style={{ left: p.x, top: p.y, "--dx": `${p.dx}px`, "--dy": `${p.dy}px` }}>
          ❤
        </span>
      ))}

      <header className="hero">
        <div className="big-heart">❤</div>
        <p className="eyebrow">{config.eyebrow}</p>
        <h1>{config.name}</h1>
        <Typewriter lines={config.taglines} />
        <div className="scroll-hint">↓</div>
      </header>

      <main>
        <Counter startDate={config.startDate} />
        <Gallery photos={config.photos} />
        <Reasons reasons={config.reasons} />
        <Letter />
      </main>

  
    </div>
  );
}
