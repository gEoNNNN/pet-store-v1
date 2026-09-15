import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ToolsLayout({ children }: LayoutProps<"/instrumente">) {
  return (
    <>
      <Navbar activeItem="tools" />
      {children}
      <Footer />
    </>
  );
}
