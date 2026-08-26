"use client";

import { useEffect, useRef } from "react";

export default function MagneticText({ children }) {
  const textRef = useRef(null);

  useEffect(() => {
    const text = textRef.current;

    if (!text) return;

    // --------------------------------
    // Split text into letters
    // --------------------------------

    const content = text.textContent || "";

    text.innerHTML = "";

    [...content].forEach((char) => {
      const span = document.createElement("span");

      span.className = "magnetic-letter";

      span.textContent =
        char === " "
          ? "\u00A0"
          : char;

      text.appendChild(span);
    });

    const letters = [
      ...text.querySelectorAll(
        ".magnetic-letter"
      ),
    ];

    // --------------------------------
    // Mouse position
    // --------------------------------

    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove,
      { passive: true }
    );

    // --------------------------------
    // Store original letter positions
    // --------------------------------

    let positions = [];

    const calculatePositions = () => {
      positions = letters.map((letter) => {
        const rect =
          letter.getBoundingClientRect();

        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });
    };

    const updatePositions = () => {
      requestAnimationFrame(() => {
        calculatePositions();
      });
    };

    // Initial position
    updatePositions();

    // Recalculate after fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        updatePositions();
      });
    }

    // Recalculate when layout changes
    window.addEventListener(
      "resize",
      updatePositions
    );

    window.addEventListener(
      "scroll",
      updatePositions,
      { passive: true }
    );

    // --------------------------------
    // Animation state
    // --------------------------------

    const states = letters.map(() => ({
      x: 0,
      y: 0,
      rotation: 0,
    }));

    // --------------------------------
    // Smooth interpolation
    // --------------------------------

    const lerp = (
      current,
      target,
      amount
    ) => {
      return (
        current +
        (target - current) *
          amount
      );
    };

    // --------------------------------
    // Animation
    // --------------------------------

    let animationFrame;

    const animate = () => {
      letters.forEach(
        (letter, index) => {
          const state =
            states[index];

          const original =
            positions[index];

          if (!original) return;

          // --------------------------------
          // Distance from cursor
          // --------------------------------

          const dx =
            mouseX - original.x;

          const dy =
            mouseY - original.y;

          const distance =
            Math.sqrt(
              dx * dx +
                dy * dy
            );

          // --------------------------------
          // EFFECT SETTINGS
          // --------------------------------

          // Cursor must come reasonably
          // close to the letter
          const radius = 115;

          // --------------------------------
          // Default position
          // --------------------------------

          let targetX = 0;
          let targetY = 0;
          let targetRotation = 0;

          // --------------------------------
          // Cursor is near letter
          // --------------------------------

          if (
            distance < radius &&
            distance > 0
          ) {
            /*
              0 = edge of radius
              1 = cursor exactly on letter
            */

            const strength =
              1 -
              distance / radius;

            /*
              Strong only when cursor
              is actually close.

              Cubic falloff prevents
              the effect from starting
              too far away.
            */

            const power =
              Math.pow(
                strength,
                3
              );

            // --------------------------------
            // Direction away from cursor
            // --------------------------------

            const directionX =
              -dx / distance;

            const directionY =
              -dy / distance;

            // --------------------------------
            // Horizontal movement
            // --------------------------------

            // Small so word spacing
            // doesn't break too much
            targetX =
              directionX *
              power *
              20;

            // --------------------------------
            // Vertical movement
            // --------------------------------

            // Main movement
            targetY =
              directionY *
              power *
              65;

            // Individual letter movement
            targetY +=
              Math.sin(
                index * 1.8
              ) *
              power *
              25;

            // --------------------------------
            // Rotation
            // --------------------------------

            targetRotation =
              directionX *
              power *
              4;
          }

          // --------------------------------
          // Smooth movement
          // --------------------------------

          state.x = lerp(
            state.x,
            targetX,
            0.16
          );

          state.y = lerp(
            state.y,
            targetY,
            0.16
          );

          state.rotation =
            lerp(
              state.rotation,
              targetRotation,
              0.16
            );

          // --------------------------------
          // Apply transform
          // --------------------------------

          letter.style.transform = `
            translate3d(
              ${state.x}px,
              ${state.y}px,
              0
            )
            rotate(
              ${state.rotation}deg
            )
          `;
        }
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    animate();

    // --------------------------------
    // Cleanup
    // --------------------------------

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "resize",
        updatePositions
      );

      window.removeEventListener(
        "scroll",
        updatePositions
      );

      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  return (
    <span
      ref={textRef}
      className="magnetic-text"
    >
      {children}
    </span>
  );
}