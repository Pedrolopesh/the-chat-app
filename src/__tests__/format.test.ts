import { describe, expect, it } from "vitest";
import { dayLabel, initials, nowStamp, shortStamp, timeOf } from "@/lib/format";

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
  it("hora e rótulo do dia", () => {
    const today = new Date(2026, 10, 15);
    expect(timeOf("15/11/2026-12:30")).toBe("12:30");
    expect(timeOf(undefined)).toBe("");
    expect(dayLabel("15/11/2026-12:30", today)).toBe("Hoje");
    expect(dayLabel("14/11/2026-08:00", today)).toBe("Ontem");
    expect(dayLabel("01/10/2026-08:00", today)).toBe("01/10/2026");
    expect(dayLabel(undefined, today)).toBe("");
  });
  it("iniciais", () => {
    expect(initials("Pedro Lopes Silva")).toBe("PL");
    expect(initials("  ")).toBe("?");
  });
});
