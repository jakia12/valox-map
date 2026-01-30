"use client";

import Link from "next/link";
import { useState } from "react";

export default function ServiceAreasHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState(null);

  const navItems = [
    { label: "About Us", href: "/about" },
    {
      label: "Appraisals",
      href: "/appraisals",
      hasDropdown: true,
      dropdownItems: [
        { label: "Divorce Appraisals", href: "/appraisals/divorce" },
        { label: "Lending Appraisals", href: "/appraisals/lending" },
        { label: "Pre Listings", href: "/appraisals/pre-listings" },
        { label: "PMI Removal", href: "/appraisals/pmi-removal" },
        { label: "Estate and Trust", href: "/appraisals/estate-trust" },
        { label: "Tax Appeal", href: "/appraisals/tax-appeal" },
      ],
    },
    {
      label: "Industries/Clients",
      href: "/industries",
      hasDropdown: true,
      dropdownItems: [
        { label: "Bank Lending & Finance", href: "/industries/bank-lending" },
        { label: "Attorneys", href: "/industries/attorneys" },
        { label: "Real Estate", href: "/industries/real-estate" },
      ],
    },
    { label: "Service Areas", href: "/service-areas", active: true },
    {
      label: "Careers",
      href: "/careers",
      hasDropdown: true,
      dropdownItems: [
        { label: "Employment", href: "/careers/employment" },
        { label: "Franchise", href: "/careers/franchise" },
      ],
    },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleMobileDropdown = (index) => {
    setMobileExpandedItem(mobileExpandedItem === index ? null : index);
  };

  return (
    <div
      className="relative w-full h-[500px] md:h-[500px] sm:h-[350px] bg-cover bg-center bg-no-repeat overflow-visible"
      style={{ backgroundImage: "url(/heroBg.jpg)" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 z-1"></div>

      {/* Navigation */}
      <nav className="relative z-100 py-4">
        <div className="max-w-[1400px] mx-auto px-8 md:px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="shrink-0 relative z-101">
            <Link href="/">
              <img
                src="/hl.png"
                alt="VeloX Valuations"
                className="md:w-[265px] w-[180px]"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex list-none m-0 p-0 gap-8 items-center">
            {navItems.map((item, index) => (
              <li
                key={index}
                className={`relative text-[20px] ${item.active ? "active" : ""}`}
                onMouseEnter={() =>
                  item.hasDropdown && setActiveDropdown(index)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`text-white no-underline text-[20px] font-normal transition-colors duration-300 flex items-center gap-1 ${item.active ? "text-[#f9a12f] font-medium" : "hover:text-[#f9a12f]"}`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <span className="text-[10px] ml-0.5">▼</span>
                  )}
                </Link>

                {/* Desktop Dropdown */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded shadow-xl min-w-[240px] py-2 z-200">
                    {item.dropdownItems.map((dropItem, dropIndex) => (
                      <Link
                        key={dropIndex}
                        href={dropItem.href}
                        className="block px-6 py-3 text-[#3a4a54] hover:bg-gray-100 transition-colors text-[16px] no-underline"
                      >
                        {dropItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Login Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="bg-white text-[#1a1a1a] border-none px-6 py-2 rounded text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#f9a12f] hover:text-white hover:-translate-y-0.5 hover:shadow-lg">
              Login
            </button>
          </div>

          {/* Mobile Menu Toggle & Login */}
          <div className="lg:hidden flex items-center gap-3 relative z-101">
            {/* Mobile Login Button - Always visible */}
            <button className="bg-white/90 text-[#1a1a1a] border-none px-4 py-1.5 rounded text-sm font-medium">
              Login
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`flex flex-col gap-1 bg-none border-none cursor-pointer p-2 transition-all duration-300 ${mobileMenuOpen ? "bg-[#f9a12f] rounded" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                // X icon
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                // Hamburger icon
                <>
                  <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
                  <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
                  <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#546e7a] z-99 shadow-xl">
            {/* Menu Items */}
            <ul className="list-none m-0 p-0">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="border-b border-white/10 last:border-b-0"
                >
                  {item.hasDropdown ? (
                    // Dropdown item
                    <>
                      <button
                        onClick={() => toggleMobileDropdown(index)}
                        className={`w-full text-left px-6 py-4 text-white text-[18px] transition-all duration-300 flex items-center justify-between bg-transparent border-none cursor-pointer ${
                          item.active
                            ? "text-[#f9a12f] font-medium"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <span>{item.label}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className={`opacity-60 transition-transform duration-300 ${mobileExpandedItem === index ? "rotate-180" : ""}`}
                        >
                          <path d="M4.427 9.573l3.396-3.396a.25.25 0 01.354 0l3.396 3.396a.25.25 0 01-.177.427H4.604a.25.25 0 01-.177-.427z" />
                        </svg>
                      </button>
                      {/* Mobile Dropdown Items */}
                      {mobileExpandedItem === index && (
                        <ul className="list-none m-0 p-0 bg-[#3A4A54]">
                          {item.dropdownItems.map((dropItem, dropIndex) => (
                            <li key={dropIndex}>
                              <Link
                                href={dropItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-10 py-3 text-white/90 no-underline text-[16px] transition-all duration-300 hover:bg-white/5 hover:text-white"
                              >
                                {dropItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    // Regular item
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-6 py-4 text-white no-underline text-[18px] transition-all duration-300 ${
                        item.active
                          ? "text-[#f9a12f] font-medium"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Content */}
      <div className="relative z-5 flex items-center justify-center h-[calc(100%-80px)]">
        <h1
          className="text-white text-[4rem] md:text-[3rem] sm:text-[2.5rem] font-bold m-0 text-center px-4"
          style={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
            letterSpacing: "1px",
          }}
        >
          Service Areas
        </h1>
      </div>
    </div>
  );
}
