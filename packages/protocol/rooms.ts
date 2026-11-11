export interface Room {
  code: string;
  createdAt: number;
}

export interface CreateRoomResponse {
  code: string;
  joinPath: string; // "/controller?room=ABCD"
}

export const ROOM_CODE_LENGTH = 4;
// No I, O, L, 0, 1: avoids visual confusion on screen
export const ROOM_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
