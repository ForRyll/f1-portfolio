import { ImageResponse } from "next/og";

export const alt = "ZRIL — Creative Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          color: "#FFFFFF",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(255,128,0,0.28) 0%, rgba(10,10,10,0) 55%)",
        }}
      >
        {/* Bar atas */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: 6,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <div style={{ display: "flex", color: "#FFFFFF", fontWeight: 900, fontSize: 40 }}>
            ZRIL<span style={{ color: "#FF8000" }}>.</span>
          </div>
          <div style={{ display: "flex" }}>PORTFOLIO 2026</div>
        </div>

        {/* Judul */}
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.95 }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 900 }}>CREATIVE</div>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 900, color: "#FF8000" }}>
            DEVELOPER
          </div>
        </div>

        {/* Bar bawah */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: 4,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            NAZRIL IRFANI  ·  INFORMATICS  ·  FRONT-END
          </div>
          <div style={{ display: "flex", width: "100%", height: 8, background: "#FF8000" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}