import { describe, expect, it } from "vitest";
import { initials, nowStamp, shortStamp } from "@/lib/format";

describe("format", () => {
  it("gera o carimbo no formato legado", () => {
    expect(nowStamp(new Date(2026, 10, 5, 9, 7))).toBe("05/11/2026-09:07");
  });
  it("mostra hora se for hoje e data caso contrário", () => {
    const today = new Date(2026, 10, 15);
    expect(shortStamp("15/11/2026-12:30", today)).toBe("12:30");
    expect(shortStamp("14/11/2026-12:30", today)).toBe("14/11");
    expect(shortStamp(undefined, today)).toBe("");
    expect(shortStamp("texto", today)).toBe("texto");
  });
  it("iniciais", () => {
    expect(initials("Pedro Lopes Silva")).toBe("PL");
    expect(initials("  ")).toBe("?");
  });
});
