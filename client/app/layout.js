import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "FlashFund",
  description: "FlashFund is a platform for creating and funding campaigns.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Header />
        <Toaster position="bottom-right" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
