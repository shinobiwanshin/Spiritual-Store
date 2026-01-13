import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1b1a18] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-primary">
            ASTRA SPIRITUAL
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            India&apos;s most trusted destination for authentic Vedic products.
            Lab-certified gemstones, genuine Rudraksha, and sacred spiritual
            items since 2010.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined">share</span>
            </a>
            <a
              href="#"
              className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined">mail</span>
            </a>
            <a
              href="#"
              className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined">call</span>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
            Quick Links
          </h4>
          <ul className="text-gray-400 text-sm space-y-3">
            <li>
              <Link
                href="/shop"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/rashi"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Rashi Finder
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Book Puja
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Astrology Consultation
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
            Support
          </h4>
          <ul className="text-gray-400 text-sm space-y-3">
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Shipping Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Returns & Refunds
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Track Order
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
            Trust & Safety
          </h4>
          <ul className="text-gray-400 text-sm space-y-3">
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Lab Certification
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Authenticity Check
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          © 2024 AstraSpiritual. All sacred items are ethically sourced and lab
          certified.
        </p>
        <div className="flex items-center gap-4">
          <img
            src="https://www.svgrepo.com/show/508748/visa.svg"
            alt="Visa"
            className="h-8 opacity-50"
          />
          <img
            src="https://www.svgrepo.com/show/508701/mastercard-full.svg"
            alt="Mastercard"
            className="h-8 opacity-50"
          />
          <img
            src="https://www.svgrepo.com/show/508425/upi.svg"
            alt="UPI"
            className="h-8 opacity-50"
          />
        </div>
      </div>
    </footer>
  );
}
