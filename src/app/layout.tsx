import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("RootLayout");

  return (
    <html lang="en">
      <body>
        {children}

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            background: "green",
            color: "white",
            zIndex: 99999,
          }}
        >
          BEFORE TOASTER
        </div>

        <Toaster richColors position="top-right" />

        <div
          style={{
            position: "fixed",
            top: 30,
            left: 0,
            background: "blue",
            color: "white",
            zIndex: 99999,
          }}
        >
          AFTER TOASTER
        </div>
      </body>
    </html>
  );
}