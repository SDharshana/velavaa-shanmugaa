import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#17140f] text-white"
    >
      {/* Contact */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">

          {/* Left */}
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#c9a85a]" />

              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a85a]">
                Get In Touch
              </span>
            </div>

            <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
              Bring the warmth of{" "}
              <span className="italic text-[#c9a85a]">
                tradition
              </span>{" "}
              home.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#aaa293]">
              Have a question about our Cup Sambrani products?
              We would love to hear from you. Get in touch with
              Velavaa Shanmugaa.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="tel:9976794184"
                className="flex items-center gap-3 rounded-full bg-[#c9a85a] px-6 py-3 text-sm font-semibold text-[#17140f] transition hover:bg-[#e0c77d]"
              >
                <Phone size={16} />
                Call Us
              </a>

              <a
                href="mailto:velavaashanmugaa@gmail.com"
                className="flex items-center gap-3 rounded-full border border-[#514a3d] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#c9a85a] hover:text-[#c9a85a]"
              >
                <Mail size={16} />
                Email Us
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-[28px] border border-[#393329] bg-[#1e1a14] p-7 sm:p-9">

            <h3 className="font-serif text-2xl">
              Contact Information
            </h3>

            <div className="mt-8 space-y-7">

              {/* Phone */}
              <a
                href="tel:9976794184"
                className="group flex gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#30291f] text-[#c9a85a]">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#817a6d]">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-white transition group-hover:text-[#c9a85a]">
                    9976794184
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:velavaashanmugaa@gmail.com"
                className="group flex gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#30291f] text-[#c9a85a]">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#817a6d]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-white transition group-hover:text-[#c9a85a]">
                    velavaashanmugaa@gmail.com
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#30291f] text-[#c9a85a]">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#817a6d]">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white">
                    150-B/5, Sri Raja Mouna Guru Swamy Nagar,
                    MVM College Back Side,
                    Meenachinayakkan Patti (PO),
                    Dindigul - 624 002.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#393329]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-10">

          <div>
            <p className="text-sm font-semibold tracking-wide">
              VELAVAA SHANMUGAA
            </p>

            <p className="mt-1 text-xs text-[#817a6d]">
              A brand by SPAD ENTERPRISES
            </p>
          </div>

          <p className="text-xs text-[#817a6d]">
            © {new Date().getFullYear()} Velavaa Shanmugaa.
            All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;