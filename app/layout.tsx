import "@/styles/globals.css";

export const metadata = {
  title: "Image to Text",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <main className="container mx-auto p-8 text-center relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
