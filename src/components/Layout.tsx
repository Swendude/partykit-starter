import { Inter } from "next/font/google";

interface LayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }: LayoutProps) => {
  return (
    <main
      className={`${inter.className} grid place-content-center h-screen bg-stone-300`}
    >
      <section className="border border-black rounded p-10 shadow bg-stone-50">
        {children}
      </section>
    </main>
  );
};

export default Layout;
