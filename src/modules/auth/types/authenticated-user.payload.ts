// Disarankan diletakkan di file terpisah misal: src/modules/auth/types/authenticated-user.payload.ts
export type AuthenticatedUserPayload = {
  id: number;
  email: string;
  name?: string;
  // Tambahkan properti lain dari User jika memang dibutuhkan oleh req.user
};
