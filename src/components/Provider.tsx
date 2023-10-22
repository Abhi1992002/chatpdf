"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type ProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const Provider = ({ children }: ProviderProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};
