import { describe, expect, it } from "vitest";
import { suggestedContentDuration } from "./contentDuration";

describe("suggestedContentDuration", () => {
  it("suma la cola completa de noticias", () => {
    expect(
      suggestedContentDuration({
        kind: "noticias",
        entries: [
          { title: "Primera", displaySeconds: 12 },
          { title: "Video", kind: "video", duration: "1:30" },
        ],
      }),
    ).toBe(102);
  });

  it("reserva una hora para una transmisión en vivo", () => {
    expect(suggestedContentDuration({ kind: "evento_vivo", title: "Defensa" }))
      .toBe(3600);
  });
});
