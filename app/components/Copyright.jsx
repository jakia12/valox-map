"use client";

export default function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="copyright">
      <div className="copyright-container">
        <p>
          Copyright © {currentYear} VeloX Valuations LLC. All Rights Reserved
        </p>
      </div>

      <style jsx>{`
        .copyright {
          background: #ebf0f0;
          padding: 2.5rem 2rem;
          border-top: 1px solid #e0e0e0;
        }

        .copyright-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .copyright-container p {
          margin: 0;
          color: #3a4a54;
          font-size: 18px;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .copyright {
            padding: 1.25rem 1rem;
          }

          .copyright-container p {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
