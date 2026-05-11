import { useState, useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./app.css";
import TechLoader from "./components/TechLoader";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading") {
      setIsTransitioning(true);
    } else {
      // Small delay to make sure the loader is visible for a techy feel
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  // Also trigger on simple location changes if state doesn't stay 'loading'
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>วิทยาลัยเทคโนโลยีศรีราชา | Sriracha Technological College - มุ่งเน้นความเป็นเลิศทางนวัตกรรม</title>
        <meta name="description" content="วิทยาลัยเทคโนโลยีศรีราชา (Sriracha Technological College) เปิดรับสมัครนักศึกษาใหม่ ปวช. และ ปวส. ในสาขาช่างอุตสาหกรรม พาณิชยกรรม และเทคโนโลยีสารสนเทศ เรียนรู้งานจริงสู่มืออาชีพ" />
        <meta name="keywords" content="วิทยาลัยเทคโนโลยีศรีราชา, Sriracha Technological College, สมัครเรียนศรีราชา, ปวช, ปวส, เทคโนโลยีสารสนเทศ, ช่างยนต์" />
        <link rel="icon" type="image/png" href="/logo_sriracha.png" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased">
        <TechLoader isVisible={isTransitioning} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-4 focus:text-primary-600 focus:font-bold focus:shadow-xl focus:rounded-xl focus:m-4">
          ข้ามไปยังเนื้อหาหลัก
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <SmoothScroll>
      {!isAdmin && <Navbar />}
      <Outlet />
      {!isAdmin && <Footer />}
    </SmoothScroll>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
