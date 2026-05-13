import { client, uploadImageToSanity, uploadVideoToSanity } from "@/lib/sanity";
import { CreateListingInput, Listing, UserPlan } from "@/types/types";
import { create } from "zustand";

type MarketplaceStore = {
  listings: Listing[];
  currentUser: any | null;
  users: Record<string, UserPlan>;
  authChecked: boolean;

  setCurrentUser: (user: any) => void;
  setAuthChecked: (val: boolean) => void;
  fetchListings: () => Promise<void>;
  addListing: (listing: any) => Promise<any>;
  deleteListing: (id: string) => Promise<void>;
  updateListing: (id: string, updatedData: Partial<Listing>) => void;
  updateBalance: (amount: number) => void;
  purchasePlan: (
    userId: string,
    posts: number,
    planId: string,
    price: number,
  ) => void;
  fetchUserData: (uid: string) => Promise<void>;
  unlockPost: (listingId: string, price?: number) => void;
  updateProfileImage: (uri: string) => void;
};

export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
  listings: [],
  currentUser: null,
  users: {},
  authChecked: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthChecked: (val: boolean) => set({ authChecked: val }),

  fetchUserData: async (uid: string) => {
    try {
      const data = await client.fetch(`*[_type == "user" && _id == $uid][0]`, {
        uid,
      });
      if (data) {
        set((state) => ({
          users: {
            ...state.users,
            [uid]: data,
            planStart: data.planStart
              ? new Date(data.planStart).getTime()
              : undefined,
            planExpire: data.planExpire
              ? new Date(data.planExpire).getTime()
              : undefined,
          },
        }));
      }
    } catch (error) {
      console.error("Fetch user error:", error);
    }
  },

  fetchListings: async () => {
    try {
      const data = await client.fetch(`*[_type == "listing"]{
  _id,
  userId,
  title,
  price,
  category,
  condition,
  location,
  listingType,
  isBoosted,
  boostExpiresAt,

  media[]{
    _type,
    asset->{
      url
    }
  }
}`);
      const formatted = data.map((item: any) => {
        const images =
          item.media
            ?.filter((m: any) => m._type === "image")
            .map((img: any) => img.asset?.url)
            .filter(Boolean) || [];

        const videoObj = item.media?.find((m: any) => m._type === "file");

        return {
          ...item,
          images,
          video: videoObj?.asset?.url || null,
        };
      });

      set({ listings: formatted });
    } catch (e: any) {
      console.log(" ERROR:", e);
      throw new Error(e?.message || "Fetch error");
    }
  },

  addListing: async (listing: CreateListingInput) => {
    const { currentUser, users } = get();
    const uid = currentUser.uid;
    const user = users[uid];
    if (!user) throw new Error("User data not found");
    const userPlanlimit = await client.fetch(
      `*[_type == "user" && _id == $uid][0]`,
      { uid },
    );
    if (!userPlanlimit) throw new Error("User not found");
    if (userPlanlimit.postsUsed >= userPlanlimit.postsLimit) return;
    try {
      const uploadedMedia = await Promise.all(
        (listing.media || []).map(async (item: any) => {
          try {
            if (item._type === "image") {
              return await uploadImageToSanity(item.uri);
            }

            if (item._type === "file") {
              return await uploadVideoToSanity(item.uri);
            }

            return null;
          } catch (error) {
            console.log("Media upload failed:", error);
            return null;
          }
        }),
      );

      const cleanMedia = uploadedMedia.filter(Boolean);
      const cleanImages = uploadedMedia.filter((img): img is string =>
        Boolean(img),
      );
      const doc = {
        _type: "listing",
        ...listing,
        images: cleanMedia,
        userId: uid,
      };
      const result = await client.create(doc);
      await client
        .patch(uid)
        .setIfMissing({ postsUsed: 0 })
        .inc({ postsUsed: 1 })
        .commit();
      set((state) => ({
        listings: [
          {
            ...doc,
            _id: result._id,
            images: cleanImages,
          },
          ...state.listings,
        ],
        users: {
          ...state.users,
          [uid]: {
            ...user,
            postsUsed: (user.postsUsed || 0) + 1,
          },
        },
      }));
      await get().fetchListings();
      return result;
    } catch (error) {
      console.error("Sanity Add Error:", error);
      throw error;
    }
  },

  updateListing: async (id, updatedData) => {
    try {
      await client.patch(id).set(updatedData).commit();
      set((state) => ({
        listings: state.listings.map((l) =>
          l._id === id ? { ...l, ...updatedData } : l,
        ),
      }));
    } catch (error) {
      console.error("Sanity Update Error:", error);
      throw error;
    }
  },

  // ================= DELETE =================
  deleteListing: async (id) => {
    await client.delete(id);
    set((state) => ({
      listings: state.listings.filter((l) => l._id !== id),
    }));
  },

  // ================= WALLET (Sanity Fix) =================
  updateBalance: async (amount) => {
    const { currentUser, users } = get();
    const uid = currentUser?.uid;
    if (!uid) return;
    try {
      await client
        .patch(uid)
        .setIfMissing({ balance: 0 })
        .inc({ balance: amount })
        .commit();
      const user = users[uid] || { balance: 0, postsLimit: 0, postsUsed: 0 };
      set({
        users: {
          ...users,
          [uid]: { ...user, balance: user.balance + amount },
        },
      });
    } catch (err) {
      console.error("Wallet update failed:", err);
    }
  },

  purchasePlan: async (userId, posts, planId, price) => {
    const { users } = get();
    const user = users[userId];
    const now = new Date();
    const expire = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (!user || user.balance < price) {
      throw new Error("Insufficient balance.");
    }
    const updatedUser = {
      ...user,
      balance: user.balance - price,
      currentPlan: planId,
      postsLimit: posts,
      postsUsed: 0,
      planStart: now.toISOString(),
      planExpire: expire.toISOString(),
    };

    set((state) => ({
      users: { ...state.users, [userId]: updatedUser },
    }));
    try {
      await client
        .patch(userId)
        .set({
          currentPlan: planId,
          postsLimit: posts === Infinity ? 999999 : posts,
          postsUsed: 0,
          planStart: now.toISOString(),
          planExpire: expire.toISOString(),
        })
        .dec({ balance: price })
        .commit();
      get().fetchUserData(userId);
      return { success: true };
    } catch (error: any) {
      set((state) => ({
        users: { ...state.users, [userId]: user },
      }));
      throw new Error("Backend update failed, rolled back.", error);
    }
  },

  // ================= UNLOCK =================
  unlockPost: async (listingId: string, price: number = 5) => {
    const { currentUser, users } = get();
    const uid = currentUser?.uid;
    if (!uid) return;
    const user = users[uid];
    if (!user) throw new Error("User data not found");
    const freshUser = await client.fetch(
      `*[_type == "user" && _id == $uid][0]`,
      { uid },
    );
    if (freshUser?.unlockedPosts?.includes(listingId)) return;
    if (freshUser.balance < price) {
      throw new Error("Insufficient balance");
    }
    try {
      await client
        .patch(uid)
        .set({
          balance: freshUser.balance - price,
          unlockedPosts: [...(freshUser.unlockedPosts || []), listingId],
        })
        .commit();
      set({
        users: {
          ...users,
          [uid]: {
            ...user,
            balance: user.balance - price,
            unlockedPosts: [...(user.unlockedPosts || []), listingId],
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  updateProfileImage: async (uri) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const asset = await client.assets.upload("image", blob, {
        filename: "avatar.jpg",
        contentType: "image/jpeg",
      });
      await client.patch(currentUser.uid).set({ photoURL: asset.url }).commit();
      set((state) => ({
        users: {
          ...state.users,
          [currentUser.uid]: {
            ...state.users[currentUser.uid],
            photoURL: asset.url,
          },
        },
      }));
    } catch (err) {
      console.error("Profile image upload failed:", err);
    }
  },
}));
