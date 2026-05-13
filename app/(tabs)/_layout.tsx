import Navbar from "@/components/Navbar";
import { auth } from "@/services/firebase";
import { useMarketplaceStore } from "@/store/marketplaceStore";
import { Redirect, Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
export default function TabsLayout() {
  const user = useMarketplaceStore((s) => s.currentUser);
  const authChecked = useMarketplaceStore((s) => s.authChecked);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const { setCurrentUser, setAuthChecked } = useMarketplaceStore.getState();
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  if (!authChecked) return null;

  if (!user) {
    return <Redirect href="/(auth)/FormLogin" />;
  }

  return (
    <>
      <Navbar />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
