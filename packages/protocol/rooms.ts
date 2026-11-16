export interface Room {
  code: string;
  createdAt: number;
}

export interface CreateRoomResponse {
  code: string;
  joinPath: string; // "/controller?room=ABCD"
}

export const ROOM_CODE_LENGTH = 4;
// No I, O, L, 0, 1: avoids visual confusion on screen.
// 31 characters: 23 letters (A-Z minus I, O, L) + 8 digits (2-9).
export const ROOM_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";