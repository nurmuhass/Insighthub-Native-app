import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Ensure navigation happens only after the component is mounted
    setTimeout(() => {
      router.replace("/(tabs)/Dashboard"); // Navigate to the Dashboard
    }, 100);
  }, []);

  return null;
}
