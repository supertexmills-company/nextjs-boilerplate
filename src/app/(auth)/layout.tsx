import type { ReactNode } from "react";
import { PostLogoutApiReset } from "@/features/auth/components/PostLogoutApiReset";

/** Auth route group — light editorial split layout for `/login`, `/signup`, etc. */
export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <PostLogoutApiReset />
      <div className="min-h-screen">{children}</div>
    </>
  );
}
