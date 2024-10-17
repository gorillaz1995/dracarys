"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Srvs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newPosition = scrollPosition + e.deltaY;
      setScrollPosition(
        Math.max(
          0,
          Math.min(newPosition, content.offsetWidth - container.offsetWidth)
        )
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const deltaY = e.touches[0].clientY - startY;
      const newPosition = scrollPosition - deltaY * 2;
      setScrollPosition(
        Math.max(
          0,
          Math.min(newPosition, content.offsetWidth - container.offsetWidth)
        )
      );
      setStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollPosition, isDragging, startY]);

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.to(contentRef.current, {
      x: -scrollPosition,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [scrollPosition]);

  return (
    <div
      ref={containerRef}
      style={{
        overflowX: "hidden",
        overflowY: "hidden",
        width: "100%",
        height: "100vh",
        touchAction: "none",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "row",
          width: "400%",
          height: "100%",
        }}
      >
        {[1, 2, 3, 4].map((section) => (
          <section
            key={section}
            className="section"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              backgroundColor: `hsl(${section * 60}, 70%, 60%)`,
            }}
          >
            Section {section}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Srvs;
