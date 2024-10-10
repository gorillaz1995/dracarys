"use client";

import React, { useRef, useEffect } from "react";
import { Button, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { gsap } from "gsap";

const shimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

// Extend the theme to include custom color and font
const theme = extendTheme({
  fonts: {
    body: "Oxygen, sans-serif",
  },
  colors: {
    custom: {
      500: "#BDE54C",
      border: "#000000",
      glow: "#FCABFC",
    },
  },
});

interface ButtonHProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ButtonH: React.FC<ButtonHProps> = ({ children, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({ delay: 2 });

      const growAndTremble = (scale: number) => {
        tl.to(buttonRef.current, {
          scale: scale,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        }).to(
          buttonRef.current,
          {
            x: "random(-3, 3)",
            y: "random(-3, 3)",
            rotation: "random(-3, 3)",
            duration: 0.05,
            repeat: 4,
            yoyo: true,
            ease: "none",
          },
          "+=0.2"
        );
      };

      growAndTremble(0.3);
      growAndTremble(0.6);
      growAndTremble(0.9);

      tl.to(buttonRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      }).to(buttonRef.current, {
        x: "random(-5, 5)",
        y: "random(-5, 5)",
        rotation: "random(-5, 5)",
        duration: 0.05,
        repeat: 15,
        yoyo: true,
        ease: "none",
      });
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Button
        ref={buttonRef}
        bg="custom.500"
        color="#000000"
        _hover={{ bg: "custom.500", opacity: 0.8 }}
        fontFamily="body"
        onClick={onClick}
        border="2px solid"
        borderColor="custom.border"
        fontSize="1.04em"
        padding="1.2em 1.74em"
        position="relative"
        overflow="hidden"
        sx={{
          "&::before": {
            content: "attr(data-text)",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            color: "custom.border",
            zIndex: -1,
            textShadow:
              "-1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to right, transparent, rgba(252,171,252,0.4), transparent)",
            animation: `${shimmer} 2.4s infinite`, // 40% faster
          },
          "& > span": {
            display: "inline-block",
            position: "relative",
            "&::before": {
              content: "attr(data-text)",
              position: "absolute",
              left: 0,
              top: 0,
              color: "#000000",
              zIndex: 1,
              textShadow:
                "-1px -1px 0 #BDE54C, 1px -1px 0 #BDE54C, -1px 1px 0 #BDE54C, 1px 1px 0 #BDE54C",
            },
          },
        }}
        data-text={children}
      >
        {React.Children.map(children, (child) =>
          typeof child === "string" ? (
            <span data-text={child}>{child}</span>
          ) : (
            child
          )
        )}
      </Button>
    </ChakraProvider>
  );
};

export default ButtonH;
