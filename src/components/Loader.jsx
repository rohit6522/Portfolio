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
    let i = 0;
    let glowTimer;
    let slideTimer;

    const typeInterval = setInterval(() => {
      i++;

      setTyped(name.slice(0, i));

      if (i >= name.length) {
        clearInterval(typeInterval);

        // Wait after typing
        glowTimer = setTimeout(() => {
          // Start glow
          setGlowing(true);

          // Start slide after glow
          slideTimer = setTimeout(() => {
            setSliding(true);
          }, 700);
        }, 500);
      }
    }, 140);

    return () => {
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

    return () => {
      element.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );
    };
  }, [sliding]);

  // =========================
  // HIDE LOADER
  // =========================
  if (hidden) {
    return null;
  }

    function handleSkip() {
    setSliding(true)
  }

  return (
    <div
      ref={screenRef}
      onClick={handleSkip}
      className={`loader-screen ${
        sliding ? "loader-slide-up" : ""
      }`}
    >
           <div className="loader-inner">
              <div
          className={`loader-big-name ${
            glowing ? "loader-text-glow" : ""
          }`}
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