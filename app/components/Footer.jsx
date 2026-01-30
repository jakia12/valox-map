"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-8 sm:px-4 border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-10 lg:gap-12">
        {/* Logo */}
        <div className="mb-6 lg:col-span-3">
          <img
            src="/fl.png"
            className="w-[217px]"
            alt="VeloX Valuations Logo"
          />
        </div>

        {/* Column 1: Quick Links */}
        <div className="flex flex-col">
          <h3 className="text-[#f9a12f] text-[22px] font-semibold mb-4 capitalize">
            Quick Links
          </h3>
          <ul className="list-none m-0 p-0 space-y-3">
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/about"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                About Us
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/service-areas"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Service Areas
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/careers"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Careers
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/blog"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Blog
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/contact"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Appraisals */}
        <div className="flex flex-col">
          <h3 className="text-[#f9a12f] text-[22px] font-semibold mb-4 capitalize">
            Appraisals
          </h3>
          <ul className="list-none m-0 p-0 space-y-3">
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/appraisals/lending"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Lending Appraisals
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/appraisals/estate-trust"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Estate and Trust
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/appraisals/pre-listings"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Pre-Listings
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/appraisals/tax-appeal"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Tax Appeal
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/appraisals/divorce"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Divorce Appraisals
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/appraisals/ppm-removal"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                PPI Removal
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Industries/Clients */}
        <div className="flex flex-col md:col-span-2 lg:col-span-1 md:max-w-[400px] md:mx-auto lg:max-w-full lg:mx-0">
          <h3 className="text-[#f9a12f] text-[22px] font-semibold mb-4 capitalize">
            Industries/Clients
          </h3>
          <ul className="list-none m-0 p-0 space-y-3">
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/industries/attorneys"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Attorneys
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/industries/real-estate"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Real Estate
              </Link>
            </li>
            <li className="text-[#3a4a54] text-[19px] hover:text-[#f9a12f] transition-colors">
              <Link
                href="/industries/bank-lending"
                className="text-[#3a4a54] no-underline text-base hover:text-[#f9a12f] transition-colors"
              >
                Bank Lending/Financial Services
              </Link>
            </li>
          </ul>

          {/* Social & Badge */}
          <div className="flex items-center gap-20 mt-6">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#0077b5] hover:text-[#005885] transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <div>
              <img
                src="/fdoc.png"
                alt="Certification Badge"
                className="w-[100px] h-[100px] sm:w-20 sm:h-20 object-contain rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
