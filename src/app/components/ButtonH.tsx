"use client";

import React from "react";
import { Button, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

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
      500: "#FCABFC",
      border: "#312DFF",
    },
  },
});

interface ButtonHProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ButtonH: React.FC<ButtonHProps> = ({ children, onClick }) => {
  return (
    <ChakraProvider theme={theme}>
      <Button
        backgroundColor="custom.500"
        color="#FFFFFF"
        _hover={{ backgroundColor: "custom.500", opacity: 0.8 }}
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
              "-1px -1px 0 #312DFF, 1px -1px 0 #312DFF, -1px 1px 0 #312DFF, 1px 1px 0 #312DFF",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
            animation: `${shimmer} 4s infinite`,
          },
        }}
        data-text={children}
      >
        {children}
      </Button>
    </ChakraProvider>
  );
};

export default ButtonH;
