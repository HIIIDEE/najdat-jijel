import type { Metadata } from "next";
import { Suspense } from "react";
import { HeartHandshake } from "lucide-react";
import { siteConfig } from "@/config/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "دخول فرق التنسيق",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-algeria-green text-algeria-green-foreground">
            <HeartHandshake className="size-6" />
          </span>
          <p className="text-xl font-bold">{siteConfig.shortName}</p>
          <p className="text-sm text-muted-foreground">دخول فرق التنسيق والإدارة</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
