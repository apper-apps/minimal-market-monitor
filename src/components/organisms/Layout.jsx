import { cn } from "@/utils/cn";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import CartSidebar from "@/components/organisms/CartSidebar";

const Layout = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Layout;