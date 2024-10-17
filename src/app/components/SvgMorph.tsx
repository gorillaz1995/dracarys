"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SvgMorph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Load the Rufina font
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Rufina:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll("path");

      // Initialize paths
      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length.toString();
        path.style.strokeDashoffset = length.toString();
        path.style.fill = "none"; // Ensure paths are not filled
        // Don't overwrite existing stroke colors
      });

      // Create a master timeline
      const masterTimeline = gsap.timeline();

      // Animate each path
      paths.forEach((path, i) => {
        const tl = gsap.timeline();

        tl.to(path, {
          strokeDashoffset: 0,
          duration: 6,
          ease: "power2.out",
          onStart: () => {
            // Add glow effect to this path
            gsap.to(path, {
              filter: "drop-shadow(0 0 8px #BDE54C)",
              duration: 0.35,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
            });
          },
          onComplete: () => {
            // Keep the glow effect
            gsap.to(path, {
              filter: "drop-shadow(0 0 8px #BDE54C)",
              duration: 0.35,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
            });
          },
        });

        // Stagger the start times
        masterTimeline.add(tl, i * 0.3);
      });
    }
  }, []);

  return (
    <div
      className="flex justify-center items-center bg-black"
      style={{ flexDirection: "column", padding: "20px 0" }}
    >
      <svg
        ref={svgRef}
        width="456px"
        height="456px"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        strokeWidth="2"
        style={{
          width: "clamp(300px, 50vw, 550px)",
          height: "auto",
        }}
        className="transition-all duration-300 ease-in-out"
      >
        <g id="SVGRepo_iconCarrier">
          <path
            d="M416 425.6l78.4 44.8c9.6 6.4 16 16 16 27.2v91.2c0 11.2-6.4 22.4-16 27.2L416 662.4c-9.6 6.4-22.4 6.4-32 0l-78.4-44.8c-9.6-6.4-16-16-16-27.2v-91.2c0-11.2 6.4-22.4 16-27.2l78.4-44.8c9.6-8 22.4-8 32-1.6z"
            fill="none"
            stroke="#312DFF"
          ></path>
          <path
            d="M643.2 267.2c-3.2-1.6-4.8-1.6-8 0l-67.2 38.4c-3.2 1.6-3.2 4.8-3.2 6.4v76.8c0 3.2 1.6 4.8 3.2 6.4l67.2 38.4c3.2 1.6 4.8 1.6 8 0l67.2-38.4c3.2-1.6 3.2-4.8 3.2-6.4v-76.8c0-3.2-1.6-4.8-3.2-6.4l-67.2-38.4z m9.6-12.8l67.2 38.4c8 4.8 12.8 12.8 12.8 20.8v76.8c0 8-4.8 16-12.8 20.8l-67.2 38.4c-8 4.8-16 4.8-24 0l-67.2-38.4c-8-4.8-12.8-12.8-12.8-20.8v-76.8c0-8 4.8-16 12.8-20.8l67.2-38.4c6.4-4.8 16-4.8 24 0zM688 691.2l-67.2 38.4v76.8l67.2 38.4 67.2-38.4v-76.8L688 691.2z m83.2 9.6c9.6 6.4 16 16 16 27.2v76.8c0 11.2-6.4 22.4-16 27.2L704 873.6c-9.6 6.4-22.4 6.4-32 0l-67.2-38.4c-9.6-6.4-16-16-16-27.2v-76.8c0-11.2 6.4-22.4 16-27.2l67.2-38.4c9.6-6.4 22.4-6.4 32 0l67.2 35.2zM176 169.6v44.8l40 22.4 40-22.4v-44.8l-40-22.4-40 22.4zM275.2 144c8 4.8 12.8 12.8 12.8 20.8v54.4c0 8-4.8 16-12.8 20.8l-48 27.2c-8 4.8-16 4.8-24 0l-48-27.2c-6.4-4.8-11.2-12.8-11.2-20.8v-54.4c0-8 4.8-16 12.8-20.8l48-27.2c8-4.8 16-4.8 24 0L275.2 144zM192 777.6l-48 27.2v54.4l48 27.2 48-27.2v-54.4l-48-27.2z m8-14.4l48 27.2c4.8 3.2 8 8 8 14.4v54.4c0 6.4-3.2 11.2-8 14.4l-48 27.2c-4.8 3.2-11.2 3.2-16 0l-48-27.2c-4.8-3.2-8-8-8-14.4v-54.4c0-6.4 3.2-11.2 8-14.4l48-27.2c4.8-3.2 11.2-3.2 16 0z"
            fill="none"
            stroke="#FCABFC"
          ></path>
          <path
            d="M403.2 776l-62.4 62.4c-1.6 1.6-3.2 1.6-6.4 1.6h-88c-4.8 0-8-3.2-8-8s3.2-8 8-8h84.8l59.2-59.2v-68.8c0-4.8 3.2-8 8-8s8 3.2 8 8v64H576c4.8 0 8 3.2 8 8s-3.2 8-8 8H403.2z m-11.2-436.8l-108.8-94.4c-3.2-3.2-3.2-8-1.6-11.2 3.2-3.2 8-3.2 11.2-1.6l110.4 94.4H528c4.8 0 8 3.2 8 8s-3.2 8-8 8h-120V400c0 4.8-3.2 8-8 8s-8-3.2-8-8v-60.8zM800 728c-4.8 0-8-3.2-8-8s3.2-8 8-8h88c4.8 0 8 3.2 8 8s-3.2 8-8 8H800z m-49.6-435.2c-3.2 3.2-8 3.2-11.2 1.6-3.2-3.2-3.2-8-1.6-11.2l96-112c3.2-3.2 8-3.2 11.2-1.6 3.2 3.2 3.2 8 1.6 11.2l-96 112zM160 504c-4.8 0-8-3.2-8-8s3.2-8 8-8h112c4.8 0 8 3.2 8 8s-3.2 8-8 8h-112z m536 144c0 4.8-3.2 8-8 8s-8-3.2-8-8V544c0-4.8 3.2-8 8-8s8 3.2 8 8v104z"
            fill="none"
            stroke="#FCABFC"
          ></path>
        </g>
      </svg>
      <p
        style={{
          fontFamily: "'Rufina', serif",
          color: "#FCABFC",
          fontSize: "3em",
          fontWeight: "800",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        ABOUT US
      </p>
    </div>
  );
};

export default SvgMorph;
