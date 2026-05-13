//  Category type (enum style)
export enum CategoryEnum {
  SHOPS = "Shops",
  HOME = "Home",
  APARTMENTS = "Apartments",
  HOSTELS = "Hostels",
}

//  Condition type
export enum ConditionEnum {
  NEW = "New",
  LIKE_NEW = "Used - Like New",
  GOOD = "Used - Good",
  FAIR = "Used - Fair",
}

export const CATEGORIES = [
  { id: "1", name: CategoryEnum.SHOPS, icon: "business-outline" },
  { id: "2", name: CategoryEnum.HOME, icon: "home-outline" },
  { id: "3", name: CategoryEnum.APARTMENTS, icon: "business-outline" },
  { id: "4", name: CategoryEnum.HOSTELS, icon: "business-outline" },
] as const;

// Conditions list
export const CONDITIONS = [
  ConditionEnum.NEW,
  ConditionEnum.LIKE_NEW,
  ConditionEnum.GOOD,
  ConditionEnum.FAIR,
] as const;

export enum ListingTypeEnum {
  RENT = "rent",
  SALE = "sale",
}
