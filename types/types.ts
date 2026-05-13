export type Listing = {
  _id?: string;
  userId: string;
  title: string;
  price: string;
  category: string;
  condition: string;
  media: any[];
  description?: string;
  location: string;
  listingType: "sale" | "rent" | any;
};

export type UserPlan = {
  userName: string;
  currentPlan: string | null;
  postsLimit: number;
  postsUsed: number;
  balance: number;
  unlockedPosts: string[];
  photoURL?: string;
  planStart?: string;
  planExpire?: string;
};
export type CreateListingInput = Omit<Listing, "_id">;
