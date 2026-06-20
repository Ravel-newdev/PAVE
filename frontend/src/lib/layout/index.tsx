import type { ReactNode } from 'react';
import { Footer } from "./components/footer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col text-black">
      <main className="wrapper">{children}</main>
      <Footer />
    </div>
  );
};