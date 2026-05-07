import type { ReactNode } from "react";
import { PostLogoutApiReset } from "@/features/auth/components/PostLogoutApiReset";

/** Auth route group — luxury split layout for `/login`, `/signup`, etc. */
export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <PostLogoutApiReset />
      <div className="theme-app min-h-screen">{children}</div>
    </>
  );
}
