"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "./ui/button";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="text-sm text-gray-500">{error.message}</p>
            <Button onClick={resetErrorBoundary}>Reset</Button>
          </div>
        )}
      >
        {children}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
