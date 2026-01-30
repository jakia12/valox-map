"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2>Get Matched With One of Our Certified Appraisers Today</h2>
        <p>
          Reach out to VeloX today and get matched with one of our certified
          appraisers for all your real estate valuation needs.
        </p>
        <button className="cta-button">
          <Link href="https://veloxval.com/order-an-appraisal/" target="_blank">
            Contact Us Today
          </Link>
        </button>
      </div>

      <style jsx>{`
        .cta-section {
          background: #ecf1f1;
          padding: 4rem 2rem 6rem 2rem;
          text-align: center;
          position: relative;
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-container h2 {
          font-size: 50px;
          font-weight: 600;
          color: #3a4a54;
          margin: 0 0 1rem 0;
          line-height: 1.3;
        }

        .cta-container p {
          font-size: 20px;
          color: #3a4a54;
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        .cta-button {
          background: linear-gradient(135deg, #f5a623 0%, #f7931e 100%);
          color: #36240c;
          border: none;
          padding: 0.875rem 60px;
          border-radius: 25px;
          font-size: 22px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
          background: linear-gradient(135deg, #f7931e 0%, #f5a623 100%);
        }

        .cta-button:active {
          transform: translateY(0);
        }

        /* Tablet */
        @media (max-width: 768px) {
          .cta-section {
            padding: 3rem 1.5rem;
          }

          .cta-container h2 {
            font-size: 1.75rem;
          }

          .cta-container p {
            font-size: 0.95rem;
          }

          .cta-button {
            padding: 0.75rem 2rem;
            font-size: 0.95rem;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .cta-section {
            padding: 2.5rem 1rem;
          }

          .cta-container h2 {
            font-size: 1.5rem;
          }

          .cta-container p {
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
          }
        }
      `}</style>
    </section>
  );
}
