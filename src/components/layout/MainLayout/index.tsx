"use client";
import "core-js/stable";
import "regenerator-runtime/runtime";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/src/context/authContext";
import { protectedRoutes, unprotectedRoutes } from "@/src/routes";
import SecuredPagesLayout from "@/src/components/layout/SecuredPagesLayout";
import UnsecuredPagesLayout from "@/src/components/layout/UnsecuredPagesLayout";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  meta?: {
    title?: string;
    description?: string;
    ignoreRouteCheck?: boolean;
  };
}

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPartOfProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isUnprotectedRoute = unprotectedRoutes.includes(pathname);

  console.log("pathname", pathname);
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {pathname == "/gateway" || pathname.includes("/gateway") ? (
          <section>{children}</section>
        ) : isProtectedRoute ? (
          <SecuredPagesLayout>{children}</SecuredPagesLayout>
        ) : isUnprotectedRoute ? (
          <UnsecuredPagesLayout>{children}</UnsecuredPagesLayout>
        ) : isPartOfProtectedRoute ? (
          <SecuredPagesLayout>{children}</SecuredPagesLayout>
        ) : (
          <section>{children}</section>
        )}
        <Toaster />
        {/* <ReactQueryDevtools/> */}
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default MainLayout;
