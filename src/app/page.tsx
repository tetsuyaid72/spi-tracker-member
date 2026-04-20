"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
    } else {
      const role = (session.user as any).role || "USER";
      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/map");
      }
    }
  }, [session, isPending, router]);

  return <div className="h-full flex items-center justify-center">Redirecting...</div>;
}
