"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Vivus from "vivus";
import Pict from "./Pict";

const services = [
  {
    title: "Branding",
    description:
      "Creăm identități de brand puternice și memorabile care reflectă esența afacerii dumneavoastră. De la logo-uri și palette de culori până la ghiduri de brand complete, vă ajutăm să vă diferențiați și să creați o conexiune emoțională cu publicul țintă.",
  },
  {
    title: "Print",
    subtitle: "Indoor/Outdoor",
    description:
      "Oferim soluții de printare de înaltă calitate pentru toate nevoile dumneavoastră, fie că este vorba de materiale pentru interior sau exterior. De la afișe și bannere până la materiale promoționale personalizate, asigurăm că mesajul dumneavoastră este transmis clar și impactant.",
  },
  {
    title: "Graphic Design",
    description:
      "Echipa noastră de designeri talentați creează materiale vizuale captivante care comunică eficient mesajul dumneavoastră. De la broșuri și cataloage până la design-ul pentru social media, vă ajutăm să vă prezentați brandul într-un mod profesionist și atractiv.",
  },
  {
    title: "X Print",
    description:
      "X Print reprezintă serviciul nostru inovator de printare personalizată. Utilizăm tehnologii de ultimă generație pentru a crea produse unice, de la textile personalizate până la obiecte promoționale speciale. Transformăm ideile dumneavoastră în realitate, oferind soluții de printare creative și de înaltă calitate.",
  },
];

const Srvs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  useEffect(() => {
    if (arrowRef.current) {
      new Vivus(arrowRef.current as unknown as HTMLElement, {
        duration: 200,
        type: "oneByOne",
        start: "autostart",
      });
    }
  }, []);

  const handleBackToStart = () => {
    setScrollPosition(0);
    if (arrowRef.current) {
      new Vivus(arrowRef.current as unknown as HTMLElement, {
        duration: 500,
        type: "oneByOne",
        start: "autostart",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        overflowX: "hidden",
        overflowY: "hidden",
        width: "100%",
        height: "100vh",
        touchAction: "none",
        backgroundColor: "black",
        position: "relative",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "row",
          width: isMobile ? `${(services.length - 1) * 120 + 100}%` : "400%",
          height: "100%",
        }}
      >
        {services.map((service, index) => (
          <section
            key={index}
            className="section"
            style={{
              width: isMobile ? (index === 0 ? "100%" : "120%") : "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              backgroundColor: "black",
              marginLeft: isMobile && index === 0 ? "0" : "auto",
              marginRight:
                isMobile && index === services.length - 1 ? "auto" : "0",
            }}
          >
            <div
              style={{
                width: isMobile ? "80%" : "100%",
                maxWidth: isMobile ? "500px" : "none",
              }}
            >
              <Pict
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
              />
            </div>
          </section>
        ))}
      </div>
      <button
        onClick={handleBackToStart}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg
          ref={arrowRef}
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="#BDE54C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Srvs;
