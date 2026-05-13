export const isBoostActive = (item: any) => {
  if (!item.isBoosted) return false;
  if (!item.boostExpireAt) return false;

  return new Date(item.boostExpireAt) > new Date();
};
