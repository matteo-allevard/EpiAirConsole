import { describe, it, expect } from "vitest";
import { generateCode } from "./codegen";
import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH } from "@byoc/protocol";

describe("generateCode", () => {
  it("returns a code of the expected length", () => {
    expect(generateCode()).toHaveLength(ROOM_CODE_LENGTH);
  });

  it("only uses the allowed alphabet", () => {
    for (let i = 0; i < 500; i++) {
      for (const ch of generateCode()) {
        expect(ROOM_CODE_ALPHABET).toContain(ch);
      }
    }
  });

  it("produces distinct codes", () => {
    const set = new Set<string>();
    for (let i = 0; i < 200; i++) set.add(generateCode());
    // Collisions of 4 chars from 32 alphabet are rare; 200 draws is fine
    expect(set.size).toBeGreaterThan(195);
  });
});
