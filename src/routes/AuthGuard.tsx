import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { protectedRoutes } from "../routes";
import { useAuthState } from "../context/authContext";
import Redirecting from "../components/common/loader/redirecting";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthState();
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = useMemo(() => {
    return protectedRoutes.some((protectedRoute) =>
      pathname.startsWith(protectedRoute)
    );
  }, [pathname]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set a flag indicating the component has mounted
    setIsClient(true);

    if (!token && isProtectedRoute) {
      router.push("/signin");
    }
  }, [token, isProtectedRoute, router]);

  // Ensure the component matches on both server and client
  if (!isClient) {
    return null; // Or a loading indicator
  }

  if (!token && isProtectedRoute) {
    return <Redirecting />;
  }

  return <>{children}</>;
};

export default AuthGuard;
