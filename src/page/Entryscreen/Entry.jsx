import bgImage from "../../assets/HF Main.jpg";

const Entry = () => {
  return (
    <div
      className="h-full w-full bg-cover bg-center flex items-center justify-center relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>

      {/* Hero Card */}
      <div className="relative z-10 text-center px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 
                        rounded-3xl p-12 shadow-2xl max-w-lg w-full 
                        transform hover:scale-[1.02] transition-transform duration-500">
          
          <span className="text-blue-400 font-bold tracking-[0.3em] text-2xl uppercase mb-4 block">
            Welcome To
          </span>

          <h1 className="text-white text-5xl md:text-6xl font-black tracking-tighter mb-6">
            HERO <span className="text-blue-500">SOFTWARE</span>
          </h1>
          
        </div>
      </div>
    </div>
  );
};

export default Entry;