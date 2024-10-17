"use client";

import React from "react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen w-full bg-black">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-rufina font-bold text-white mb-8">
          About Us
        </h1>
        <p className="text-lg md:text-xl font-oxygen text-white mb-6">
          We are a passionate team dedicated to delivering innovative solutions
          and exceptional experiences.
        </p>
        <p className="text-lg md:text-xl font-oxygen text-white">
          Our mission is to empower businesses and individuals through
          cutting-edge technology and creative design.
        </p>
      </div>
    </div>
  );
}
