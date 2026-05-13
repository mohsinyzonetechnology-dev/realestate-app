import { client } from "@/lib/sanity";
import { create } from "zustand";

type BoostState = {
  loading: boolean;
  selectedItem: any | null;

  setSelectedItem: (item: any) => void;
  openBoost: (item: any) => void;
  closeBoost: () => void;
  confirmBoost: (
    currentUser: any,
    users: any,
    fetchListings: any,
  ) => Promise<void>;
};

export const useBoostStore = create<BoostState>((set, get) => ({
  loading: false,
  selectedItem: null,

  setSelectedItem: (item) => set({ selectedItem: item }),

  openBoost: (item) => {
    set({ selectedItem: item });
  },

  closeBoost: () => {
    set({ selectedItem: null });
  },

  confirmBoost: async (currentUser, users, fetchListings) => {
    const item = get().selectedItem;
    if (!item) return;

    const uid = currentUser?.uid;
    const userBalance = users?.[uid]?.balance ?? 0;

    try {
      set({ loading: true });

      if (userBalance < 1000) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      const expire = new Date();
      expire.setDate(expire.getDate() + 30);

      await client
        .patch(item._id)
        .set({
          isBoosted: true,
          boostExpiresAt: expire.toISOString(),
        })
        .commit();
      await fetchListings();

      const userId = users?.[uid]?._id;
      await client.patch(userId).dec({ balance: 1000 }).commit();

      await fetchListings();

      set({ selectedItem: null });
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
