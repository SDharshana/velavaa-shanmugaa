function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-[#f7f1e3]"
    >
      {/* Decorative background */}
      <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#d7b45d]/10 blur-3xl" />

      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#c69b3c]/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">

        {/* LEFT */}
        <div className="max-w-2xl">

          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-12 bg-[#b58a2b]" />

            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9a711b]">
              Authentic • Traditional • Pure
            </span>
          </div>

          <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[#211b13] sm:text-6xl lg:text-7xl">
            The fragrance
            <br />
            of{" "}
            <span className="italic text-[#a87918]">
              tradition.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#6b604e] sm:text-lg">
            Discover the timeless aroma of authentic Cup Sambrani,
            carefully crafted to bring purity, warmth and devotion
            into every space.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">

            <a
              href="#collections"
              className="rounded-full bg-[#1c1812] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#a87918]"
            >
              Explore Collection
            </a>

            <a
              href="#about"
              className="rounded-full border border-[#cbb98e] bg-white/50 px-8 py-4 text-sm font-semibold text-[#30291f] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#a87918]"
            >
              Discover Our Story
            </a>

          </div>

          {/* Trust points */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#d8c9aa] pt-7">

            <div>
              <p className="text-lg font-semibold text-[#2b2419]">
                Authentic
              </p>
              <p className="text-xs text-[#817563]">
                Traditional Sambrani
              </p>
            </div>

            <div className="h-10 w-px bg-[#d8c9aa]" />

            <div>
              <p className="text-lg font-semibold text-[#2b2419]">
                Premium
              </p>
              <p className="text-xs text-[#817563]">
                Quality Fragrance
              </p>
            </div>

            <div className="h-10 w-px bg-[#d8c9aa]" />

            <div>
              <p className="text-lg font-semibold text-[#2b2419]">
                Crafted
              </p>
              <p className="text-xs text-[#817563]">
                With Tradition
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex min-h-[500px] items-center justify-center">

          {/* Decorative circle */}
          <div className="absolute h-[390px] w-[390px] rounded-full border border-[#c7a354]/30 sm:h-[480px] sm:w-[480px]" />

          <div className="absolute h-[330px] w-[330px] rounded-full bg-[#d8b45e]/15 blur-2xl sm:h-[400px] sm:w-[400px]" />

          {/* Brand logo */}
          <div className="relative flex h-[380px] w-[380px] items-center justify-center rounded-full bg-gradient-to-br from-[#f9f1d9] to-[#e9d39a] p-12 shadow-[0_30px_80px_rgba(91,65,20,0.15)] sm:h-[460px] sm:w-[460px]">

            <div className="absolute inset-5 rounded-full border border-[#b99138]/30" />

            <img
              src="/src/assets/logo.png"
              alt="Velavaa Shanmugaa"
              className="relative z-10 w-[78%] object-contain drop-shadow-xl"
            />

          </div>

          {/* Floating label */}
          <div className="absolute bottom-3 right-0 rounded-2xl border border-[#d9c69c] bg-[#fffdf7]/90 px-5 py-4 shadow-xl backdrop-blur-md sm:right-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b751e]">
              Velavaa Shanmugaa
            </p>

            <p className="mt-1 text-sm font-semibold text-[#2a2319]">
              Since Tradition
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;