import {
  Leaf,
  Flame,
  Sparkles,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Traditional Craft",
    description:
      "Inspired by the timeless tradition of Sambrani and crafted with care.",
  },
  {
    icon: Flame,
    title: "Authentic Cup Sambrani",
    description:
      "Made for the familiar aromatic experience of traditional Cup Sambrani.",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description:
      "Thoughtfully presented products designed for everyday and devotional moments.",
  },
  {
    icon: Heart,
    title: "Made With Care",
    description:
      "Every product reflects our commitment to quality, tradition and trust.",
  },
];

function BrandStory() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#f4eee1] px-6 py-24 lg:px-10"
    >
      {/* Decorative elements */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#c59b43]/10 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#8d6b2e]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#b58a2b]" />

            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
              Why Velavaa Shanmugaa
            </span>

            <span className="h-px w-10 bg-[#b58a2b]" />
          </div>

          <h2 className="font-serif text-4xl leading-tight text-[#211b14] sm:text-5xl">
            Tradition in every
            <span className="italic text-[#a87918]"> fragrance.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#756b5b] sm:text-base">
            At Velavaa Shanmugaa, we bring the warmth of traditional
            Sambrani into modern homes while staying connected to the
            values and rituals that make it special.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-[28px] border border-[#dfd1b4] bg-[#fffdf8]/70 p-7 transition duration-500 hover:-translate-y-2 hover:bg-[#fffdf8] hover:shadow-[0_25px_60px_rgba(69,48,14,0.10)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee2c8] text-[#9c721b] transition duration-500 group-hover:bg-[#1d1913] group-hover:text-white">
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <h3 className="mt-6 font-serif text-2xl text-[#292218]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#756b5b]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Brand statement */}
        <div className="mt-16 overflow-hidden rounded-[32px] bg-[#1d1913]">
          <div className="grid lg:grid-cols-2">

            <div className="p-8 sm:p-12 lg:p-16">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a85a]">
                Our Philosophy
              </span>

              <h3 className="mt-5 max-w-xl font-serif text-3xl leading-tight text-white sm:text-4xl">
                A familiar fragrance.
                <br />
                A timeless tradition.
              </h3>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#c8c0b1]">
                From everyday moments to special occasions, our
                Sambrani is created to become part of the spaces,
                memories and traditions that matter to you.
              </p>
            </div>

            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#2b251b]">
              <div className="absolute h-64 w-64 rounded-full border border-[#c9a85a]/20" />
              <div className="absolute h-48 w-48 rounded-full border border-[#c9a85a]/20" />
              <div className="absolute h-32 w-32 rounded-full bg-[#c9a85a]/10 blur-2xl" />

              <div className="relative text-center">
                <p className="font-serif text-5xl text-[#d6b76a]">
                  VS
                </p>

                <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-[#bdb3a1]">
                  Velavaa Shanmugaa
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default BrandStory;