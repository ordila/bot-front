import "./globals.css";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastContainer position="bottom-left" autoClose={3000} />
        {children}
      </body>
    </html>
  );
}
