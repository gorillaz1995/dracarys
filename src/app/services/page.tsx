"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicSrvs = dynamic(() => import("../components/Srvs"), { ssr: false });

const ServicesPage = () => {
  return (
    <>
      <DynamicSrvs />
    </>
  );
};

export default ServicesPage;
