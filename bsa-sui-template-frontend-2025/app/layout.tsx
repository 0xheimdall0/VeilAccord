import "@mysten/dapp-kit/dist/index.css";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
  <link rel="icon" type="image/png" href="veilaccord_logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VeilAccord</title>
      </head>
        <link rel="icon" type="image/png" href="veilaccord_logo.png" />
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
