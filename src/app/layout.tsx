"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import MainNav from "@/components/main-nav";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <QueryClientProvider client={queryClient}>
        <ClerkProvider>
          <NextUIProvider>
            <body className={inter.className}>
              <MainNav />
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </body>
          </NextUIProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </html>
  );
}
