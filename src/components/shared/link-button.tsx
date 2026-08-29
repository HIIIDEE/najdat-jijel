import Link from "next/link";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

// Base UI's Button لا يدعم asChild لأسباب تتعلق بالوصولية (role="button" يطغى على دلالة الرابط).
// هذا المكوّن يطبّق أنماط الزر مباشرة على Link بالطريقة الموصى بها من توثيق shadcn.
export function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
