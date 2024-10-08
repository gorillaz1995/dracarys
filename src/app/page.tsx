"use client";

import React from "react";
import dynamic from "next/dynamic";

const Three = dynamic(() => import("./Three"), { ssr: false });

const Page = () => {
  return (
    <div className="overflow-hidden">
      <Three />
    </div>
  );
};

export default Page;
