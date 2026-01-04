
import React from "react";
import bgImage from "../../assets/HF Main.jpg";

const Entry = () => {
  return (
    <div
      className="
        relative
        w-full
        min-h-screen
        flex
        items-center
        justify-center
        overflow-hidden
        px-8 sm:px-12 md:px-20
        py-16
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

      {/* Content */}
      <div className="relative z-10 flex justify-center w-full">
        <div
          className="
            bg-white/20
            backdrop-blur-xl
            border border-white/30
            rounded-3xl
            px-14 py-12
            shadow-2xl
            max-w-xl
            w-full
            text-center
          "
        >
          <span className="
            text-blue-400
            font-bold
            tracking-[0.3em]
            text-xl
            uppercase
            block
            mb-5
          ">
            Welcome To
          </span>

          <h1 className="
            text-white
            text-5xl md:text-6xl
            font-black
          ">
            HERO <span className="text-blue-500">SOFTWARE</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Entry;
