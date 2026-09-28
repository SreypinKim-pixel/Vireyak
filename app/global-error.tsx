"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <head>
        {/* Global errors replace the root layout, so they load their own font. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body
        style={{
          margin: 0,
          background: "#FBF9F6",
          color: "#182346",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeContent: "center",
            textAlign: "center",
            padding: 24,
          }}
        >
          <p style={{ color: "#D4AF37", fontSize: 28, fontWeight: 700 }}>
            Vireyak.
          </p>
          <h1>A little pause in the journey.</h1>
          <p>Something went wrong. Please try again.</p>
          <button
            onClick={() => reset()}
            style={{
              margin: "20px auto",
              border: 0,
              borderRadius: 8,
              padding: "14px 26px",
              background: "#182346",
              color: "#FBF9F6",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Try again
          </button>
          <a href="/" style={{ color: "#182346" }}>
            Back to home
          </a>
        </main>
      </body>
    </html>
  );
}
