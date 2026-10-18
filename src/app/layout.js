//app/layout.js
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import LayoutWrapper from "@/app/components/LayoutWrapper";

const inter = Inter({
  variable: "--f-body",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--f-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--f-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aftab Alam | Full Stack & Mobile Developer",
  description:
    "Portfolio of Aftab Alam — full stack developer building React, Next.js, React Native and AI-powered products.",
};

// Set the theme attribute before paint so there's no flash of the wrong theme.
const themeInitScript = `
try {
  var t = localStorage.getItem('theme');
  document.documentElement.dataset.theme = (t === 'light' || t === 'dark') ? t : 'dark';
} catch (e) {
  document.documentElement.dataset.theme = 'dark';
}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
