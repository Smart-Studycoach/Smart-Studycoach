"use client";

import { AuthProtected } from "@/components/AuthProtected";

export default function RecommenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProtected>{children}</AuthProtected>;
}
