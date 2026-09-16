"use client";
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
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
