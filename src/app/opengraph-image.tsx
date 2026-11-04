import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Imaginea OG implicită pentru întregul site (1200x630 — format
// summary_large_image pentru Twitter/X, Facebook, LinkedIn și Google).
export const alt = `${site.name} — Produse veterinare și sănătate animală`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${site.colors.primaryDark} 0%, ${site.colors.primary} 55%, ${site.colors.secondary} 100%)`,
          color: "#ffffff",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: site.colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>
            {site.name.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, lineHeight: 1.15, fontWeight: 700 }}>
            Produse veterinare si sanatate animala
          </div>
          <div style={{ fontSize: 34, opacity: 0.9 }}>
            Antiparazitare · Vitamine si suplimente · Hrana Brit si Carnilove · Accesorii
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.85 }}>
          <div>Petricani 198, Chisinau, Moldova</div>
          <div>www.farmavet.md</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
