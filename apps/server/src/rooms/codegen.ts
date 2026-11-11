import { randomBytes } from "node:crypto";
import { ROOM_CODE_LENGTH, ROOM_CODE_ALPHABET } from "@byoc/protocol";

/**
 * Generate a short room code from a cryptographically secure source.
 * Uses rejection sampling to avoid modulo bias.
 */
export function generateCode(length = ROOM_CODE_LENGTH): string {
  const alphabet = ROOM_CODE_ALPHABET;
  const max = 256 - (256 % alphabet.length); // 256 - 0 = 256, alphabet length 32
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
