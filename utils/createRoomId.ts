export const createRoomId = (userA: string, userB: string) => {
  return [userA, userB].sort().join("_");
};
