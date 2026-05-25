import { useState, useEffect, useRef } from "react";
import { useConfig } from "../hooks/useConfig";
import {
 generateCode,
 getClientIP,
 emptyGuest
} from "./standard1/configHelpers";
import { useCountdown } from "./standard1/hooks";
import Particles from "./standard1/components/Particles";
import Shimmer from "./standard1/components/Shimmer";
import GiftModal from "./standard1/components/GiftModal";
import GuestBlock from "./standard1/components/GuestBlock";
import MusicSection from "./standard1/sections/MusicSection";
import Footer from "./standard1/sections/Footer";
import GiftsSection from "./standard1/sections/GiftsSection";
import EventSection from "./standard1/sections/EventSection";
import Cover from "./standard1/sections/Cover";
import HeroSection from "./standard1/sections/HeroSection";
import ConfirmSection from "./standard1/sections/ConfirmSection";

// ─────────────────────────────────────────────────────────────────────────────
// ⚙️  CONFIG — cargado desde /clientes/sofia/config.json
// ─────────────────────────────────────────────────────────────────────────────
const ROSE       = "#c4848a";
const ROSE_LIGHT = "#e8b4b8";
const ROSE_DARK  = "#8b4f55";


// ─────────────────────────────────────────────────────────────────────────────
// 🚀  APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const slug = window.location.pathname.split("/")[1] || "sofia";
  const { config, error } = useConfig(slug);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.55;
        audio.play()
          .then(() => setPlaying(true))
          .catch(() => {});
      }
    }, 900);
  };

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (!entered) return;
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.8s ease";
      document.body.style.opacity = "1";
    }, 50);
  }, [entered]);

  if (!config && !error) return null;

  if (error) {
    return (
      <div style={{
        display:"flex",alignItems:"center",justifyContent:"center",
        minHeight:"100vh",background:"#1a1a1a",color:"#e8b4b8",
        fontFamily:"Georgia,serif",textAlign:"center",padding:"2rem"
      }}>
        <p>No se pudo cargar la invitación.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:wght@300;400;500;600&family=Dancing+Script:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#c4848a;}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.3);}
        select option{background:#9e6068;color:#fff;}
        @keyframes floatP{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-18px) scale(1.12);}}
        @keyframes shimLine{0%,100%{opacity:0;transform:translateY(-100%);}50%{opacity:1;transform:translateY(280%);}}
      `}</style>

      <audio ref={audioRef} loop preload="auto">
        <source src={config.musica.src} type="audio/mpeg"/>
      </audio>

      {!entered && <Cover config={config} onEnter={handleEnter}/>}
      {entered && (
        <main>
          <HeroSection config={config}/>
          <EventSection config={config}/>
          <MusicSection playing={playing} onToggle={handleToggle} config={config}/>
          <GiftsSection config={config}/>
          <ConfirmSection config={config}/>
          <Footer config={config}/>
        </main>
      )}
    </>
  );
}
