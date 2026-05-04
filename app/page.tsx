"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/* ─── SVG Icons ─────────────────────────────────────────────── */

function SparkleIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 1.5 9.75 9.75 1.5 12l8.25 2.25L12 22.5l2.25-8.25L22.5 12l-8.25-2.25Z" />
    </svg>
  );
}

function HeartIcon({ size = 24, color = "currentColor", filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function NoteIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" fill={color} stroke="none" />
      <circle cx="18" cy="16" r="3" fill={color} stroke="none" />
    </svg>
  );
}

function SunIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"     x2="12" y2="4.5" />
      <line x1="12" y1="19.5"  x2="12" y2="22" />
      <line x1="4.22" y1="4.22"   x2="5.98" y2="5.98" />
      <line x1="18.02" y1="18.02" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78"  x2="5.98" y2="18.02" />
      <line x1="18.02" y1="5.98"  x2="19.78" y2="4.22" />
    </svg>
  );
}

function InfinityIcon({ size = 40, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 0.48)} viewBox="0 0 52 25" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M26 12.5c0 0-5-9.5-12.5-9.5a9.5 9.5 0 0 0 0 19C21 22 26 12.5 26 12.5s5 9.5 12.5 9.5a9.5 9.5 0 0 0 0-19C31 3 26 12.5 26 12.5z" />
    </svg>
  );
}

function FlowerIcon({ size = 26, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="6.2"  rx="2.1" ry="3.8" fill={color} opacity="0.72" />
      <ellipse cx="12" cy="17.8" rx="2.1" ry="3.8" fill={color} opacity="0.72" />
      <ellipse cx="6.2"  cy="12" rx="3.8" ry="2.1" fill={color} opacity="0.72" />
      <ellipse cx="17.8" cy="12" rx="3.8" ry="2.1" fill={color} opacity="0.72" />
      <ellipse cx="7.86"  cy="7.86"  rx="2.1" ry="3.8" transform="rotate(-45 7.86 7.86)"   fill={color} opacity="0.5" />
      <ellipse cx="16.14" cy="16.14" rx="2.1" ry="3.8" transform="rotate(-45 16.14 16.14)" fill={color} opacity="0.5" />
      <ellipse cx="16.14" cy="7.86"  rx="2.1" ry="3.8" transform="rotate(45 16.14 7.86)"   fill={color} opacity="0.5" />
      <ellipse cx="7.86"  cy="16.14" rx="2.1" ry="3.8" transform="rotate(45 7.86 16.14)"   fill={color} opacity="0.5" />
      <circle cx="12" cy="12" r="3" fill={color} />
    </svg>
  );
}

function ChevronDownIcon({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Types ─────────────────────────────────────────────────── */

interface FireworkParticle {
  id: number; originX: number; originY: number;
  tx: number; ty: number; color: string;
  size: number; duration: number; delay: number;
}
interface Star    { id: number; x: number; y: number; size: number; dur: number; dly: number }
interface Petal   { id: number; x: number; size: number; dur: number; dly: number; drift: number; rot: number }
interface Confetti{ id: number; x: number; color: string; size: number; dur: number; dly: number; drift: number; spin: number; rect: boolean }

/* ─── Static data ────────────────────────────────────────────── */

const TRAITS: { icon: ReactNode; accentColor: string; title: string; text: string }[] = [
  {
    icon: <SparkleIcon size={28} color="#e8a0b4" />,
    accentColor: "#e8a0b4",
    title: "Tes yeux",
    text: "Dans tes yeux, je lis toute l'histoire que je veux vivre. Ils me disent tout ce que les mots n'arrivent pas à exprimer.",
  },
  {
    icon: <NoteIcon size={28} color="#c9a96e" />,
    accentColor: "#c9a96e",
    title: "Ton rire",
    text: "Ton rire est la plus belle mélodie que mes oreilles aient jamais entendue. J'en ferais volontiers la bande-son de toute ma vie.",
  },
  {
    icon: <HeartIcon size={28} color="#e8a0b4" />,
    accentColor: "#e8a0b4",
    title: "Ta force",
    text: "Tu portes le monde avec une grâce que tu ne vois même pas toi-même. Ta résilience m'inspire chaque jour davantage.",
  },
  {
    icon: <SunIcon size={28} color="#c9a96e" />,
    accentColor: "#c9a96e",
    title: "Ta douceur",
    text: "Ta gentillesse illumine tout ce qu'elle touche. Tu as ce don rare de rendre les gens meilleurs rien qu'en étant toi.",
  },
  {
    icon: <InfinityIcon size={36} color="#e8a0b4" />,
    accentColor: "#e8a0b4",
    title: "Toi, simplement toi",
    text: "Tout en toi est parfait, même tes imperfections. Je n'échangerais rien — pas même les jours difficiles — car c'est toi dans toute ta vérité.",
  },
];

const WISHES: { icon: ReactNode; text: string }[] = [
  {
    icon: <SparkleIcon size={32} color="#f0d090" />,
    text: "Que chaque matin se lève aussi lumineux que ton sourire, et que chaque soir t'apporte la paix que tu mérites.",
  },
  {
    icon: <FlowerIcon size={32} color="#e8a0b4" />,
    text: "Que tous tes rêves prennent vie, un par un, et que l'univers te rende au centuple tout l'amour que tu donnes.",
  },
  {
    icon: <HeartIcon size={32} color="#e8a0b4" />,
    text: "Que tu saches, aujourd'hui et tous les jours, combien tu es aimée — par moi, et par tout ce qui t'entoure.",
  },
];

/* ─── Name letters ───────────────────────────────────────────── */

const FIRSTNAME = "Yasminatou";
const LASTNAME  = "OURO";

/* ─── Component ─────────────────────────────────────────────── */

export default function BirthdayPage() {
  const [mounted,    setMounted]    = useState(false);
  const [stars,      setStars]      = useState<Star[]>([]);
  const [petals,     setPetals]     = useState<Petal[]>([]);
  const [confetti,   setConfetti]   = useState<Confetti[]>([]);
  const [fireworks,  setFireworks]  = useState<FireworkParticle[]>([]);
  const [confettiOn, setConfettiOn] = useState(false);
  const [isMuted,    setIsMuted]    = useState(false);
  const [scrollVol,  setScrollVol]  = useState(0.18);
  const [needsClick, setNeedsClick] = useState(false);

  const finalRef    = useRef<HTMLElement>(null);
  const audioRef    = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isMutedRef  = useRef(false);

  /* ── helpers ─────────────────────────────────────────────── */

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playBang = (delayMs = 0) => {
    setTimeout(() => {
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      const sr  = ctx.sampleRate;
      const buf = ctx.createBuffer(1, Math.ceil(sr * 0.3), sr);
      const d   = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++)
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.04));
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const lpf = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 600;
      const g = ctx.createGain();
      g.gain.setValueAtTime(1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      src.connect(lpf); lpf.connect(g); g.connect(ctx.destination);
      src.start();
    }, delayMs);
  };

  const spawnFireworks = () => {
    const origins  = [[20,35],[80,28],[50,45],[15,65],[85,60],[50,20],[35,75],[65,72]];
    const fw_colors = ["#ffd700","#ff6b9d","#e8a0b4","#c9a96e","#ffffff","#ff4757","#f0d090","#7efff5"];
    let id = 0;
    const batch = (origs: number[][], baseId: number, extraDelay = 0): FireworkParticle[] => {
      const particles: FireworkParticle[] = [];
      origs.forEach(([ox, oy], oi) => {
        const delay = extraDelay + oi * 0.18;
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2;
          const dist  = 70 + Math.random() * 90;
          particles.push({
            id: baseId + id++,
            originX: ox + (Math.random() - 0.5) * 8,
            originY: oy + (Math.random() - 0.5) * 8,
            tx: Math.cos(angle) * dist,
            ty: Math.sin(angle) * dist,
            color: fw_colors[Math.floor(Math.random() * fw_colors.length)],
            size: Math.random() * 6 + 2,
            duration: 0.55 + Math.random() * 0.45,
            delay,
          });
        }
        playBang(delay * 1000);
      });
      return particles;
    };
    const wave1 = batch(origins, 0);
    setFireworks(wave1);
    setTimeout(() => {
      const wave2 = batch(origins.slice(0, 5), wave1.length, 0);
      setFireworks(prev => [...prev, ...wave2]);
    }, 1900);
  };

  /* ── main effect ─────────────────────────────────────────── */

  useEffect(() => {
    setMounted(true);

    setStars(Array.from({ length: 200 }, (_, i) => ({
      id: i, x: Math.random()*100, y: Math.random()*100,
      size: Math.random()*2.5+0.4, dur: Math.random()*4+2, dly: Math.random()*7,
    })));

    setPetals(Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random()*100, size: Math.random()*16+8,
      dur: Math.random()*12+10, dly: Math.random()*20,
      drift: (Math.random()-0.5)*280, rot: Math.random()*360,
    })));

    const cols = ["#e8a0b4","#f4c2c2","#c9a96e","#f0d090","#ffffff","#d4b0ff","#ffb7d5"];
    setConfetti(Array.from({ length: 90 }, (_, i) => ({
      id: i, x: Math.random()*100, color: cols[i%cols.length],
      size: Math.random()*9+4, dur: Math.random()*3+3, dly: Math.random()*5,
      drift: (Math.random()-0.5)*300,
      spin: (Math.random()>0.5?1:-1)*(Math.random()*720+360),
      rect: Math.random()>0.5,
    })));

    /* scroll → volume */
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      const vol = Math.min(1, 0.18 + pct * 0.82);
      setScrollVol(vol);
      if (audioRef.current && !isMutedRef.current) audioRef.current.volume = vol;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const t = setTimeout(() => {
      /* scroll animations */
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
        { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
      );
      document.querySelectorAll("[data-animate]").forEach(el => obs.observe(el));

      /* final section → fireworks + confetti */
      const cur = finalRef.current;
      if (cur) {
        const fo = new IntersectionObserver(
          entries => { if (entries[0].isIntersecting) { setConfettiOn(true); spawnFireworks(); } },
          { threshold: 0.25 }
        );
        fo.observe(cur);
      }
    }, 80);

    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* audio play — runs after mounted so audioRef.current is in the DOM */
  useEffect(() => {
    if (!mounted) return;
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.18;
      audio.loop   = true;
      audio.play().catch(() => setNeedsClick(true));
    }
  }, [mounted]);

  const toggleMute = () => {
    const next = !isMuted;
    isMutedRef.current = next;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.volume = next ? 0 : scrollVol;
  };

  const handleClickStart = () => {
    audioRef.current?.play().catch(() => {});
    setNeedsClick(false);
  };

  if (!mounted) return null;

  const C       = "var(--font-cormorant), Georgia, serif";
  const D       = "var(--font-dancing), cursive";
  const volPct  = Math.round(scrollVol * 100);
  const speakerLabel = isMuted || volPct < 5 ? "off" : volPct < 40 ? "low" : volPct < 75 ? "mid" : "high";

  return (
    <div style={{ background: "#04000d", color: "#ffe8f0", overflowX: "hidden" }}>

      {/* ── hidden audio ── */}
      <audio ref={audioRef} src="/Le_monde_chante.mp3" loop preload="auto" />

      {/* ── click-to-start overlay ── */}
      {needsClick && (
        <div
          onClick={handleClickStart}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "rgba(4,0,13,0.88)", backdropFilter: "blur(12px)",
            cursor: "pointer", gap: "1.8rem",
          }}
        >
          <div style={{ animation: "heartbeat 1.6s ease-in-out infinite", color: "#e8a0b4" }}>
            <HeartIcon size={60} color="#e8a0b4" filled />
          </div>
          <p style={{ fontFamily: C, fontSize: "clamp(1.5rem,4vw,2.5rem)", color: "#f4c2c2", margin: 0 }}>
            Toucher pour commencer
          </p>
          <p style={{ fontFamily: D, fontSize: "clamp(1rem,2.5vw,1.5rem)", color: "#c9a96e", margin: 0 }}>
            Le monde chante — pour toi
          </p>
        </div>
      )}

      {/* ── volume control ── */}
      <div style={{ position: "fixed", bottom: "1.8rem", right: "1.8rem", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ width: "3px", height: "56px", borderRadius: "2px", background: "rgba(255,255,255,0.1)", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ width: "100%", height: `${isMuted ? 0 : volPct}%`, background: "linear-gradient(to top, #c9a96e, #e8a0b4)", transition: "height 0.3s ease", borderRadius: "2px" }} />
        </div>
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Activer le son" : "Couper le son"}
          style={{
            width: "46px", height: "46px", borderRadius: "50%",
            border: "1px solid rgba(232,160,180,0.35)",
            background: "rgba(4,0,13,0.82)", backdropFilter: "blur(14px)",
            color: "#e8a0b4", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: isMuted ? "none" : "0 0 12px rgba(232,160,180,0.22)",
            transition: "box-shadow 0.3s",
          }}
        >
          {/* Speaker SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={isMuted ? "none" : "currentColor"} strokeWidth="1.3" />
            {speakerLabel === "off"  && <line x1="23" y1="9" x2="17" y2="15" />}
            {speakerLabel === "off"  && <line x1="17" y1="9" x2="23" y2="15" />}
            {speakerLabel === "low"  && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
            {speakerLabel === "mid"  && <><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>}
            {speakerLabel === "high" && <><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>}
          </svg>
        </button>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1 — HÉRO
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, #180030 0%, #04000d 70%)",
      }}>
        {/* Stars */}
        {stars.map(s => (
          <span key={s.id} style={{
            position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size, borderRadius: "50%", background: "white",
            animation: `twinkle ${s.dur}s ease-in-out ${s.dly}s infinite`, pointerEvents: "none",
          }} />
        ))}

        {/* Petals */}
        {petals.map(p => (
          <span key={p.id} style={{
            position: "fixed", left: `${p.x}%`, top: "-60px",
            width: p.size, height: p.size,
            background: "radial-gradient(ellipse, rgba(244,194,194,0.85), rgba(232,160,180,0.4))",
            borderRadius: "50% 10% 50% 10%",
            animation: `petalFloat ${p.dur}s linear ${p.dly}s infinite`,
            "--drift": `${p.drift}px`, "--rot": `${p.rot}deg`,
            pointerEvents: "none", zIndex: 2,
          } as React.CSSProperties} />
        ))}

        {/* Rings */}
        {[700, 500].map(sz => (
          <div key={sz} style={{
            position: "absolute", width: sz, height: sz, borderRadius: "50%",
            border: `1px solid rgba(232,160,180,${sz === 700 ? 0.06 : 0.1})`,
            left: "50%", top: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
          }} />
        ))}

        {/* Content */}
        <div style={{ textAlign: "center", zIndex: 10, padding: "2rem", maxWidth: "900px" }}>

          {/* Date */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.8rem", marginBottom: "2.5rem",
            animation: "fadeInUp 1s ease 0.2s both",
          }}>
            <SparkleIcon size={10} color="#c9a96e" />
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.55em", color: "#c9a96e", textTransform: "uppercase" }}>
              05 · 05 · 2005
            </span>
            <SparkleIcon size={10} color="#c9a96e" />
          </div>

          {/* Title */}
          <h1 className="gradient-text" style={{
            fontFamily: C, fontSize: "clamp(2.8rem, 11vw, 9rem)", fontWeight: 300,
            lineHeight: 1.05, margin: "0 0 1.5rem",
            animation: "fadeInUp 1.1s ease 0.5s both",
          }}>
            Joyeux<br />Anniversaire
          </h1>

          {/* ── Name: Yasminatou ── */}
          <div style={{ marginBottom: "0.4rem", lineHeight: 1.1 }}>
            {FIRSTNAME.split("").map((letter, i) => (
              <span key={i} style={{
                fontFamily: D,
                fontSize: "clamp(2.2rem, 6.5vw, 5rem)",
                color: "#f4c2c2",
                display: "inline-block",
                animation: `letterReveal 0.65s cubic-bezier(0.16,1,0.3,1) ${1.0 + i * 0.08}s both`,
              }}>
                {letter}
              </span>
            ))}
          </div>

          {/* ── Name: OURO ── */}
          <div style={{
            fontFamily: C, fontWeight: 300,
            fontSize: "clamp(1rem, 2.8vw, 2rem)",
            letterSpacing: "0.65em",
            paddingLeft: "0.65em",
            background: "linear-gradient(135deg, #c9a96e 0%, #f0d090 45%, #c9a96e 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: `letterReveal 0.9s cubic-bezier(0.16,1,0.3,1) ${1.0 + FIRSTNAME.length * 0.08 + 0.3}s both, shimmer 4s ease ${1.0 + FIRSTNAME.length * 0.08 + 1.2}s infinite`,
            marginBottom: "2.8rem",
          }}>
            {LASTNAME}
          </div>

          {/* Thin divider */}
          <div style={{
            width: "60px", height: "1px", margin: "0 auto 2.2rem",
            background: "linear-gradient(90deg, transparent, rgba(232,160,180,0.5), transparent)",
            animation: `fadeIn 1s ease ${1.0 + FIRSTNAME.length * 0.08 + 0.8}s both`,
          }} />

          {/* Beating heart SVG */}
          <div style={{
            display: "inline-flex",
            color: "#e8a0b4",
            animation: `heartbeat 1.6s ease-in-out infinite, fadeIn 1s ease ${1.0 + FIRSTNAME.length * 0.08 + 1.0}s both`,
            filter: "drop-shadow(0 0 18px rgba(232,160,180,0.7))",
          }}>
            <HeartIcon size={48} color="#e8a0b4" filled />
          </div>

          {/* Age */}
          <div style={{
            marginTop: "1.8rem", fontSize: "0.68rem", letterSpacing: "0.52em",
            color: "#c9a96e", opacity: 0.7, textTransform: "uppercase",
            animation: `fadeIn 1.5s ease ${1.0 + FIRSTNAME.length * 0.08 + 1.4}s both`,
          }}>
            21 ans de lumière
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute", bottom: "2.5rem", left: "50%",
          color: "#e8a0b4", animation: "scrollBounce 2s ease-in-out infinite", opacity: 0.5,
        }}>
          <ChevronDownIcon size={30} color="#e8a0b4" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — L'ÉTOILE
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.2rem, 5vw, 2rem)",
        background: "radial-gradient(ellipse 60% 60% at 30% 50%, #0c0030 0%, #04000d 65%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: "-2rem", top: "50%", transform: "translateY(-50%)",
          fontSize: "clamp(18rem, 35vw, 32rem)", fontFamily: C, fontWeight: 300,
          color: "rgba(232,160,180,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
        }}>21</div>

        <div style={{ maxWidth: "700px", zIndex: 2 }}>
          <div data-animate="fade" style={{ fontSize: "0.7rem", letterSpacing: "0.5em", color: "#c9a96e", marginBottom: "2rem", textTransform: "uppercase" }}>
            Il y a 21 ans...
          </div>

          <h2 data-animate="up" className="gradient-text" style={{
            fontFamily: C, fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 300,
            lineHeight: 1.1, margin: "0 0 2rem",
          }}>
            Une étoile<br />est née
          </h2>

          <div data-animate="fade" style={{ "--delay": "0.2s" } as React.CSSProperties}>
            <div style={{ width: "80px", height: "1px", background: "linear-gradient(90deg, transparent, #c9a96e, transparent)", margin: "0 0 2.5rem" }} />
          </div>

          <p data-animate="up" style={{
            fontFamily: D, fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            color: "#f4c2c2", margin: "0 0 1.5rem", lineHeight: 1.6,
            "--delay": "0.3s",
          } as React.CSSProperties}>
            Le 05 Mai 2005, tu as illuminé ce monde pour la première fois.
          </p>

          <p data-animate="up" style={{
            fontFamily: C, fontWeight: 300, fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
            color: "#c8a0b0", lineHeight: 1.9, maxWidth: "580px",
            "--delay": "0.5s",
          } as React.CSSProperties}>
            Le monde ne savait pas encore à quel point il allait avoir besoin de toi.
            Mais moi, maintenant, je sais. Et je suis tellement reconnaissant que tu existes.
          </p>

          {/* Sparkle row */}
          <div data-animate="fade" style={{
            marginTop: "3rem", display: "flex", gap: "1.2rem", alignItems: "center",
            "--delay": "0.7s",
          } as React.CSSProperties}>
            <SparkleIcon size={14} color="#c9a96e" />
            <SparkleIcon size={8}  color="#c9a96e" />
            <SparkleIcon size={14} color="#c9a96e" />
            <SparkleIcon size={8}  color="#c9a96e" />
            <SparkleIcon size={14} color="#c9a96e" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — TU ES...
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.2rem, 5vw, 2rem)",
        background: "radial-gradient(ellipse 70% 70% at 70% 50%, #0a001f 0%, #04000d 65%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div data-animate="fade" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontFamily: C, fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 300, color: "#c9a96e", letterSpacing: "0.3em" }}>
            Tu es...
          </span>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0 1rem" }}>
          {([
            { text: "Belle",        size: "clamp(3.5rem,9vw,7.5rem)",  align: "flex-start", weight: 300 },
            { text: "Forte",        size: "clamp(2.5rem,6vw,5rem)",    align: "flex-end",   weight: 400 },
            { text: "Lumineuse",    size: "clamp(3rem,7.5vw,6.5rem)",  align: "center",     weight: 300 },
            { text: "Précieuse",    size: "clamp(2rem,5vw,4rem)",      align: "flex-start", weight: 500, color: "#c9a96e" },
            { text: "Unique",       size: "clamp(4rem,10vw,9rem)",     align: "flex-end",   weight: 300 },
            { text: "Mon âme sœur", size: "clamp(2rem,4.5vw,3.5rem)", align: "center",     dancing: true },
            { text: "Ma vie",       size: "clamp(3rem,7vw,6rem)",      align: "flex-start", dancing: true },
            { text: "Mon tout",     size: "clamp(2.5rem,5.5vw,4.5rem)",align: "flex-end",   dancing: true, color: "#e8a0b4" },
          ] as { text: string; size: string; align: string; weight?: number; dancing?: boolean; color?: string }[]).map((w, i) => (
            <div key={i} data-animate="blur" style={{ display: "flex", justifyContent: w.align, "--delay": `${i * 0.18}s` } as React.CSSProperties}>
              <span style={{
                fontFamily: w.dancing ? D : C,
                fontSize: w.size,
                fontWeight: w.dancing ? undefined : w.weight,
                color: w.color ?? (w.dancing ? "#f4c2c2" : "#ffe8f0"),
                lineHeight: 1.15,
              }}>{w.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — CE QUE J'AIME EN TOI
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.2rem, 5vw, 2rem)",
        background: "linear-gradient(180deg, #04000d 0%, #080018 50%, #04000d 100%)",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div data-animate="up" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: D, fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "#c9a96e", marginBottom: "0.5rem" }}>
              Ce que j'aime en toi
            </p>
            <h2 className="gradient-text" style={{ fontFamily: C, fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 300, margin: 0, lineHeight: 1.1 }}>
              Tout
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "1.5rem" }}>
            {TRAITS.map((t, i) => (
              <div key={i} data-animate={i % 2 === 0 ? "left" : "right"} className="glass"
                style={{ borderRadius: "20px", padding: "2rem", position: "relative", overflow: "hidden", "--delay": `${i * 0.15}s` } as React.CSSProperties}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${t.accentColor}, transparent)` }} />
                <div style={{ marginBottom: "1rem", color: t.accentColor }}>
                  {t.icon}
                </div>
                <h3 style={{ fontFamily: C, fontSize: "1.6rem", fontWeight: 500, color: "#ffe8f0", margin: "0 0 1rem" }}>
                  {t.title}
                </h3>
                <p style={{ fontFamily: C, fontWeight: 300, fontSize: "1.05rem", color: "#c8a0b0", lineHeight: 1.85, margin: 0 }}>
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — MON AMOUR
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.2rem, 5vw, 2rem)",
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, #200010 0%, #04000d 65%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "3%", left: "2%",
          fontFamily: C, fontSize: "clamp(12rem, 22vw, 20rem)",
          color: "rgba(232,160,180,0.04)", lineHeight: 1,
          userSelect: "none", pointerEvents: "none", fontWeight: 300,
        }}>"</div>

        <div style={{ maxWidth: "750px", textAlign: "center", zIndex: 2 }}>
          <div data-animate="fade" style={{ fontFamily: D, fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "#c9a96e", marginBottom: "2rem" }}>
            Mon Amour,
          </div>

          <blockquote data-animate="up" style={{
            fontFamily: C, fontWeight: 300, fontSize: "clamp(1.3rem, 3.5vw, 2rem)",
            color: "#ffe8f0", lineHeight: 1.9, margin: "0 0 2.5rem", padding: 0, border: "none",
            "--delay": "0.2s",
          } as React.CSSProperties}>
            Je ne sais pas par quel miracle nos chemins se sont croisés, mais chaque matin
            je me réveille reconnaissant pour ce hasard. Tu es la chose la plus précieuse
            dans ma vie, et je veux te le dire aujourd'hui — et tous les jours qui suivront.
          </blockquote>

          <p data-animate="up" style={{
            fontFamily: C, fontWeight: 300, fontSize: "clamp(1.1rem, 2.8vw, 1.6rem)",
            color: "#c8a0b0", lineHeight: 1.9, marginBottom: "3rem",
            "--delay": "0.4s",
          } as React.CSSProperties}>
            Tu n'as pas besoin d'être parfaite pour être parfaite à mes yeux.
            Tu es mon chez-moi, ma paix, mon ancre. Avec toi, tout a un sens.
          </p>

          <div data-animate="scale" style={{
            display: "inline-flex", color: "#e8a0b4",
            animation: "heartbeat 1.8s ease-in-out infinite",
            filter: "drop-shadow(0 0 22px rgba(232,160,180,0.65))",
            "--delay": "0.6s",
          } as React.CSSProperties}>
            <HeartIcon size={52} color="#e8a0b4" filled />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — MES VŒUX
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.2rem, 5vw, 2rem)",
        background: "linear-gradient(180deg, #04000d 0%, #0c0020 50%, #04000d 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
          <div data-animate="up" style={{ marginBottom: "3.5rem" }}>
            <p style={{ fontFamily: D, fontSize: "clamp(1rem, 2.5vw, 1.4rem)", color: "#c9a96e", marginBottom: "0.5rem" }}>
              Mes Vœux pour toi
            </p>
            <h2 className="gradient-text" style={{ fontFamily: C, fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 300, margin: 0 }}>
              21 bougies
            </h2>
          </div>

          {/* Candles */}
          <div data-animate="fade" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px", marginBottom: "3rem", "--delay": "0.2s" } as React.CSSProperties}>
            {Array.from({ length: 21 }, (_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: "7px", height: "13px",
                  background: "linear-gradient(to top, #ffd700 0%, #ff9500 40%, rgba(255,149,0,0) 100%)",
                  borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%",
                  animation: `flicker ${0.5 + (i % 5) * 0.12}s ease-in-out ${i * 0.07}s infinite`,
                  transformOrigin: "bottom center",
                  boxShadow: "0 0 8px rgba(255,200,0,0.6), 0 0 16px rgba(255,150,0,0.3)",
                }} />
                <div style={{ width: "1px", height: "3px", background: "#888" }} />
                <div style={{
                  width: "9px", height: "26px", borderRadius: "2px",
                  background: `linear-gradient(to bottom, ${i % 3 === 0 ? "#e8a0b4, #c9a96e" : i % 3 === 1 ? "#f4c2c2, #e8a0b4" : "#c9a96e, #f4c2c2"})`,
                  boxShadow: "inset -2px 0 4px rgba(0,0,0,0.2)",
                }} />
              </div>
            ))}
          </div>

          <p data-animate="fade" style={{
            fontFamily: D, fontSize: "clamp(1.3rem, 3.5vw, 2.2rem)",
            color: "#f4c2c2", marginBottom: "4rem",
            "--delay": "0.4s",
          } as React.CSSProperties}>
            21 ans de bonheur que tu as apporté à ce monde
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "1.5rem", textAlign: "left" }}>
            {WISHES.map((w, i) => (
              <div key={i} data-animate="up" className="glass"
                style={{ borderRadius: "16px", padding: "1.8rem", "--delay": `${0.5 + i * 0.18}s` } as React.CSSProperties}
              >
                <div style={{ marginBottom: "1rem" }}>{w.icon}</div>
                <p style={{ fontFamily: C, fontWeight: 300, fontSize: "1.05rem", color: "#d4b0c0", lineHeight: 1.8, margin: 0 }}>
                  {w.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — POUR TOUJOURS
      ══════════════════════════════════════════ */}
      <section ref={finalRef} style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.2rem, 5vw, 2rem)",
        background: "radial-gradient(ellipse 90% 80% at 50% 50%, #200040 0%, #04000d 65%)",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* Fireworks */}
        {fireworks.map(fw => (
          <span key={fw.id} style={{
            position: "fixed", left: `${fw.originX}vw`, top: `${fw.originY}vh`,
            width: fw.size, height: fw.size, borderRadius: "50%", background: fw.color,
            animation: `burst ${fw.duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${fw.delay}s both`,
            "--tx": `${fw.tx}px`, "--ty": `${fw.ty}px`,
            pointerEvents: "none", zIndex: 30,
            boxShadow: `0 0 ${fw.size * 2}px ${fw.color}`,
          } as React.CSSProperties} />
        ))}

        {/* Confetti */}
        {confettiOn && confetti.map(c => (
          <span key={c.id} style={{
            position: "fixed", left: `${c.x}%`, top: 0,
            width: `${c.size}px`, height: c.rect ? `${c.size * 0.4}px` : `${c.size}px`,
            background: c.color, borderRadius: c.rect ? "2px" : "50%",
            animation: `confettiFall ${c.dur}s ease-in ${c.dly}s both`,
            "--spin": `${c.spin}deg`, "--drift": `${c.drift}px`,
            pointerEvents: "none", zIndex: 20,
          } as React.CSSProperties} />
        ))}

        {/* Stars backdrop */}
        {stars.slice(0, 80).map(s => (
          <span key={s.id} style={{
            position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size, borderRadius: "50%", background: "white",
            animation: `twinkle ${s.dur}s ease-in-out ${s.dly}s infinite`, pointerEvents: "none",
          }} />
        ))}

        <div style={{ zIndex: 2, maxWidth: "800px" }}>
          {/* Sparkle row */}
          <div data-animate="fade" style={{ display: "flex", justifyContent: "center", gap: "1.2rem", alignItems: "center", marginBottom: "1.8rem" }}>
            <SparkleIcon size={10} color="#c9a96e" />
            <SparkleIcon size={16} color="#c9a96e" />
            <SparkleIcon size={10} color="#c9a96e" />
          </div>

          <h2 data-animate="scale" className="gradient-text" style={{
            fontFamily: C, fontSize: "clamp(3rem, 18vw, 14rem)", fontWeight: 300,
            lineHeight: 0.95, margin: "0 0 1.5rem",
            "--delay": "0.2s",
            animation: "shimmer 6s ease infinite, glow 3s ease-in-out infinite",
          } as React.CSSProperties}>
            Je T'Aime
          </h2>

          <p data-animate="up" style={{
            fontFamily: C, fontWeight: 300, fontSize: "clamp(1.1rem, 3vw, 1.7rem)",
            color: "#d4b0c0", lineHeight: 2, marginBottom: "2.5rem",
            "--delay": "0.4s",
          } as React.CSSProperties}>
            Pour tout ce que tu es.<br />
            Pour tout ce que tu m'apportes.<br />
            Pour tous nos demains.
          </p>

          {/* Divider */}
          <div data-animate="fade" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "1rem", marginBottom: "2.5rem",
            "--delay": "0.6s",
          } as React.CSSProperties}>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(90deg, transparent, #c9a96e)" }} />
            <div style={{ color: "#e8a0b4", filter: "drop-shadow(0 0 8px rgba(232,160,180,0.5))" }}>
              <HeartIcon size={22} color="#e8a0b4" filled />
            </div>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(90deg, #c9a96e, transparent)" }} />
          </div>

          {/* Final name */}
          <div data-animate="up" style={{ marginBottom: "0.6rem", "--delay": "0.8s" } as React.CSSProperties}>
            <span style={{ fontFamily: D, fontSize: "clamp(1.5rem, 4vw, 2.8rem)", color: "#f4c2c2" }}>
              Joyeux Anniversaire,
            </span>
          </div>
          <div data-animate="up" style={{ "--delay": "1s" } as React.CSSProperties}>
            <span style={{
              fontFamily: C, fontWeight: 300,
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
              letterSpacing: "0.12em",
              background: "linear-gradient(135deg, #f4c2c2 0%, #e8a0b4 30%, #c9a96e 60%, #f4c2c2 100%)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 5s ease infinite",
            }}>
              Yasminatou Ouro
            </span>
          </div>

          <div data-animate="fade" style={{ marginTop: "2rem", fontSize: "0.68rem", letterSpacing: "0.55em", color: "#c9a96e", opacity: 0.7, textTransform: "uppercase", "--delay": "1.2s" } as React.CSSProperties}>
            05 Mai 2026 · 21 ans
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 8 — NOS MOMENTS
      ══════════════════════════════════════════ */}
      <section style={{
        padding: "7rem 0 6rem",
        background: "linear-gradient(180deg, #04000d 0%, #08001a 40%, #04000d 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,160,180,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "5rem", padding: "0 2rem" }}>
          <div data-animate="fade" style={{ fontSize: "0.65rem", letterSpacing: "0.6em", color: "#c9a96e", textTransform: "uppercase", marginBottom: "1.4rem" }}>
            Notre Histoire · En Images
          </div>
          <h2 data-animate="up" style={{
            fontFamily: C, fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 300,
            background: "linear-gradient(135deg, #f4c2c2 0%, #e8a0b4 35%, #c9a96e 65%, #f4c2c2 100%)",
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            animation: "shimmer 6s ease infinite",
            margin: "0 0 1.5rem", lineHeight: 1.1,
          }}>
            Nos Moments
          </h2>
          <p data-animate="up" style={{
            fontFamily: C, fontWeight: 300, fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
            color: "#c8a0b0", lineHeight: 1.85, maxWidth: "520px",
            margin: "0 auto", "--delay": "0.25s",
          } as React.CSSProperties}>
            Chaque image, chaque seconde — une preuve que tu es l'amour de ma vie.
          </p>
        </div>

        {/* Photo 1 — wide hero */}
        <div data-animate="up" style={{ maxWidth: "900px", margin: "0 auto 2.5rem", padding: "0 2rem" }}>
          <div className="glass" style={{ borderRadius: "28px", overflow: "hidden", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photo-1.jpeg" alt="Yasminatou"
              style={{ width: "100%", height: "clamp(280px, 50vw, 520px)", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(4,0,13,0.88) 0%, rgba(4,0,13,0.25) 50%, transparent 100%)",
              display: "flex", alignItems: "flex-end", padding: "2.5rem 2.8rem",
            }}>
              <div>
                <p style={{ fontFamily: D, fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", color: "#f4c2c2", margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                  Tu es ma plus belle histoire.
                </p>
                <p style={{ fontFamily: C, fontWeight: 300, fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)", color: "#c9a96e", margin: 0, letterSpacing: "0.06em" }}>
                  Chaque instant passé avec toi est un trésor que je chéris.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo 2 + Video 1 */}
        <div style={{ maxWidth: "900px", margin: "0 auto 2.5rem", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "1.8rem" }}>
          <div data-animate="left" className="glass" style={{ borderRadius: "22px", overflow: "hidden", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photo-2.jpeg" alt="Yasminatou"
              style={{ width: "100%", height: "clamp(220px, 38vw, 400px)", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(4,0,13,0.85) 0%, transparent 58%)",
              display: "flex", alignItems: "flex-end", padding: "1.8rem 2rem",
            }}>
              <p style={{ fontFamily: D, fontSize: "clamp(1rem, 2.8vw, 1.55rem)", color: "#f4c2c2", margin: 0, lineHeight: 1.45 }}>
                Dans tes yeux,<br />je lis mon avenir.
              </p>
            </div>
          </div>

          <div data-animate="right" className="glass" style={{ borderRadius: "22px", overflow: "hidden", position: "relative" }}>
            <video
              src="/video-1.mp4" autoPlay muted loop playsInline
              style={{ width: "100%", height: "clamp(220px, 38vw, 400px)", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(4,0,13,0.82) 0%, transparent 58%)",
              display: "flex", alignItems: "flex-end", padding: "1.8rem 2rem",
            }}>
              <p style={{ fontFamily: D, fontSize: "clamp(1rem, 2.8vw, 1.55rem)", color: "#f4c2c2", margin: 0, lineHeight: 1.45 }}>
                Chaque instant<br />avec toi compte.
              </p>
            </div>
          </div>
        </div>

        {/* Videos 2 & 3 */}
        <div style={{ maxWidth: "900px", margin: "0 auto 5rem", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "1.8rem" }}>
          <div data-animate="up" className="glass" style={{ borderRadius: "22px", overflow: "hidden", position: "relative", "--delay": "0.15s" } as React.CSSProperties}>
            <video
              src="/video-2.mp4" autoPlay muted loop playsInline
              style={{ width: "100%", height: "clamp(220px, 38vw, 400px)", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(4,0,13,0.82) 0%, transparent 58%)",
              display: "flex", alignItems: "flex-end", padding: "1.8rem 2rem",
            }}>
              <p style={{ fontFamily: D, fontSize: "clamp(1rem, 2.8vw, 1.55rem)", color: "#f4c2c2", margin: 0, lineHeight: 1.45 }}>
                Ton sourire est<br />ma raison de sourire.
              </p>
            </div>
          </div>

          <div data-animate="up" className="glass" style={{ borderRadius: "22px", overflow: "hidden", position: "relative", "--delay": "0.3s" } as React.CSSProperties}>
            <video
              src="/video-3.mp4" autoPlay muted loop playsInline
              style={{ width: "100%", height: "clamp(220px, 38vw, 400px)", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(4,0,13,0.82) 0%, transparent 58%)",
              display: "flex", alignItems: "flex-end", padding: "1.8rem 2rem",
            }}>
              <p style={{ fontFamily: D, fontSize: "clamp(1rem, 2.8vw, 1.55rem)", color: "#f4c2c2", margin: 0, lineHeight: 1.45 }}>
                Je veux mille<br />jours comme ça.
              </p>
            </div>
          </div>
        </div>

        {/* Closing message */}
        <div data-animate="up" style={{ textAlign: "center", padding: "0 2rem", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ height: "1px", flex: 1, maxWidth: "100px", background: "linear-gradient(90deg, transparent, #c9a96e)" }} />
            <div style={{ color: "#e8a0b4", filter: "drop-shadow(0 0 8px rgba(232,160,180,0.5))", animation: "heartbeat 1.8s ease-in-out infinite" }}>
              <HeartIcon size={20} color="#e8a0b4" filled />
            </div>
            <div style={{ height: "1px", flex: 1, maxWidth: "100px", background: "linear-gradient(90deg, #c9a96e, transparent)" }} />
          </div>
          <p style={{
            fontFamily: C, fontWeight: 300, fontSize: "clamp(1.1rem, 2.8vw, 1.55rem)",
            color: "#d4b0c0", lineHeight: 2, margin: "0 0 1.2rem",
          }}>
            Ces souvenirs sont le plus beau cadeau que la vie m'ait offert.
          </p>
          <p style={{
            fontFamily: D, fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            color: "#f4c2c2", margin: 0,
          }}>
            Je t'aime, Yasminatou — aujourd'hui, demain, et bien au-delà.
          </p>
        </div>
      </section>
    </div>
  );
}
