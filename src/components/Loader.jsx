import { useEffect, useRef, useState } from "react";
import { profile } from "../data/content";

export default function Loader() {
  const [hidden, setHidden] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [typed, setTyped] = useState("");

  const screenRef = useRef(null);

  const name = profile.name.split(" ")[0].toUpperCase();

  // =========================
  // TYPE NAME
  // =========================
  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  useEffect(() => {
    if (sliding) {
      document.body.style.overflow = ''
    }
  }, [sliding])

  useEffect(() => {
    let i = 0;
    let glowTimer;
    let slideTimer;
    let isActive = true;

    // Fast, crisp typing cadence (~70ms per character)
    const typeInterval = setInterval(() => {
      if (!isActive) return;
      i++;

      setTyped(name.slice(0, i));

      if (i >= name.length) {
        clearInterval(typeInterval);

        // Brief pause after typing finishes before glow
        glowTimer = setTimeout(() => {
          if (!isActive) return;
          setGlowing(true);

          // Swiftly trigger curtain slide after a quick branding glimpse
          slideTimer = setTimeout(() => {
            if (!isActive) return;
            setSliding(true);
          }, 250);
        }, 150);
      }
    }, 70);

    return () => {
      isActive = false;
      clearInterval(typeInterval);
      clearTimeout(glowTimer);
      clearTimeout(slideTimer);
    };
  }, [name]);

  // =========================
  // REMOVE LOADER AFTER SLIDE
  // =========================
  useEffect(() => {
    const element = screenRef.current;

    if (!element) return;

    const handleTransitionEnd = (event) => {
      if (
        event.propertyName === "transform" &&
        sliding
      ) {
        setHidden(true);
      }
    };

    element.addEventListener(
      "transitionend",
      handleTransitionEnd
    );

    let fallbackTimer;
    if (sliding) {
      fallbackTimer = setTimeout(() => setHidden(true), 900);
    }

    return () => {
      element.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );
      clearTimeout(fallbackTimer);
    };
  }, [sliding]);

  // Quick skip on keyboard press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        if (!sliding) setSliding(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sliding])

  // =========================
  // HIDE LOADER
  // =========================
  if (hidden) {
    return null;
  }

  function handleSkip() {
    if (sliding) return
    setSliding(true)
  }
  return (
    <div
      ref={screenRef}
      onClick={sliding ? undefined : handleSkip}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${profile.name}'s portfolio`}
      className={`loader-screen ${sliding ? "loader-slide-up" : ""
        }`}
    >
      <div className="loader-inner">

        <div
          className={`loader-big-name ${glowing ? "loader-text-glow" : ""
            }`}
          aria-hidden="true"
        >
          {typed.split("").map((char, index) => (
            <span
              key={index}
              className="loader-letter"
            >
              {char}
            </span>
          ))}
        </div>


        {glowing && <p className="loader-role-tag">{profile.role.toUpperCase()}</p>}

        <div className="loader-progress-track">
          <div
            className="loader-progress-fill"
            style={{ width: `${(typed.length / name.length) * 100}%` }}
          />
        </div>

        <span className="loader-skip-hint">Click anywhere to skip</span>
      </div>
    </div>
  );
}