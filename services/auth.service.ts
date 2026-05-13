import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { auth, database } from "../services/firebase";
export const signupUser = async (
  userName: string,
  email: string,
  password: string,
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;
  await updateProfile(user, {
    displayName: userName,
  });

  const uid = user.uid;
  await set(ref(database, `users/${uid}`), {
    uid,
    userName,
    email,
    createdAt: Date.now(),
  });

  return user;
};
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

export const getUserProfile = async (uid: string) => {
  const snapshot = await get(ref(database, `users/${uid}`));

  if (!snapshot.exists()) return null;

  return snapshot.val();
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};
