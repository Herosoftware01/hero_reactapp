
import React from "react";
import bgImage from "../../assets/HF Main.jpg";

const Entry = () => {
  return (
    <div
      className="
        relative
        -mx-4 -mb-20
        w-[calc(100%+32px)]
        min-h-[calc(100vh-56px)]
        flex items-center justify-center
        overflow-hidden
      "
    >
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Hero Software Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Card */}
      <div className="relative z-10 px-10">
        <div
          className="
            bg-white/20
            backdrop-blur-xl
            border border-white/30
            rounded-3xl
            px-10 py-10
            shadow-2xl
            max-w-xl
            text-center
          "
        >
          <span className="block text-blue-400 tracking-[0.3em] text-xl font-bold uppercase mb-4">
            Welcome To
          </span>

          <h1 className="text-white text-5xl md:text-6xl font-black">
            HERO <span className="text-blue-500">SOFTWARE</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Entry;
