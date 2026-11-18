import { randomBytes } from "node:crypto";
import { ROOM_CODE_LENGTH, ROOM_CODE_ALPHABET } from "@byoc/protocol";

/**
 * Generate a short room code from a cryptographically secure source.
 * Uses rejection sampling to avoid modulo bias.
 */
export function generateCode(length = ROOM_CODE_LENGTH): string {
  const alphabet = ROOM_CODE_ALPHABET;
  // 256 % 31 = 8, so accept bytes 0..247, reject 248..255 (3.1% rejection).
  const max = 256 - (256 % alphabet.length);
  let code = "";
  while (code.length < length) {
    const bytes = randomBytes(length - code.length);
    for (const b of bytes) {
      if (b < max) {
        code += alphabet[b % alphabet.length];
        if (code.length === length) break;
      }
    }
  }
  return code;
}