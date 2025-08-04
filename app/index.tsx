import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, 0); // Delay to let RootLayout finish mounting

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
