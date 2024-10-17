"use client";

import React from "react";
import {
  Box,
  Card,
  CardBody,
  Stack,
  Heading,
  Button,
  Text,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      100: "#BDE54C",
      200: "#BDE54C",
      300: "#BDE54C",
    },
  },
});

interface PictProps {
  title: string;
  subtitle?: string;
  description: string;
}

const Pict: React.FC<PictProps> = ({ title, subtitle, description }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box
        className="min-h-[90vh] md:min-h-screen flex flex-col lg:flex-row"
        bg="#000000"
      >
        <Box className="flex-[0.6] lg:flex-1 flex justify-center items-center p-4 lg:p-6">
          <Card
            maxW={{ base: "sm", lg: "xl" }}
            w="100%"
            h={{ base: "100%", lg: "xl" }}
            bgGradient="linear(to-br, brand.100, brand.200, brand.300)"
            borderRadius="0"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            p={{ base: 4, lg: 6 }}
            position="relative"
            style={{
              transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg)",
              transition: "transform 0.3s ease-in-out",
              boxShadow:
                "8px 8px 14px rgba(189, 229, 76, 0.3), -8px -8px 14px rgba(189, 229, 76, 0.3)",
            }}
            _hover={{
              transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg)",
            }}
            _after={{
              content: '""',
              position: "absolute",
              top: "3px",
              right: "-3px",
              bottom: "-3px",
              left: "3px",
              background: "rgba(189, 229, 76, 0.1)",
              filter: "blur(7px)",
              zIndex: -1,
            }}
          >
            <CardBody
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              flex="1"
            >
              <Stack
                textAlign="center"
                color="black"
                spacing={{ base: 3, lg: 4 }}
              >
                <Heading
                  size={{ base: "md", lg: "xl" }}
                  className="font-stint-ultra-expanded"
                >
                  {title}
                </Heading>
                {subtitle && (
                  <Heading
                    size={{ base: "sm", lg: "lg" }}
                    className="font-stint-ultra-expanded"
                  >
                    {subtitle}
                  </Heading>
                )}
              </Stack>
            </CardBody>
            <Button
              bg="#BDE54C"
              color="black"
              _hover={{ bg: "#BDE54C", opacity: 0.8 }}
              className="font-stint-ultra-expanded mt-4 lg:mt-6 relative overflow-hidden"
              borderRadius="0"
              fontSize={{ base: "sm", lg: "lg" }}
              px={{ base: 3, lg: 6 }}
              py={{ base: 1, lg: 3 }}
              sx={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
                  animation: "shimmer 3s infinite",
                },
                "@keyframes shimmer": {
                  "0%": { left: "-100%" },
                  "100%": { left: "100%" },
                },
              }}
            >
              Detalii serviciu
            </Button>
          </Card>
        </Box>

        <Box className="flex-[0.3] lg:flex-1 flex flex-col justify-center items-start p-4 lg:p-6">
          <Heading
            as="h2"
            size={{ base: "lg", lg: "2xl" }}
            className="font-stint-ultra-expanded mb-4 lg:mb-6"
            color="#BDE54C"
          >
            DESPRE SERVICIUL NOSTRU
          </Heading>
          <Text className="font-pontano-sans text-sm lg:text-xl text-white">
            {description}
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Pict;
