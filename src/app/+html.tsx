import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// Web-only document. NativeWind's platformSelect() (used for font-serif in
// tailwind.config.js) resolves on iOS/Android but not in web CSS, so the web stacks live here.
const webFonts = `
.font-serif { font-family: Georgia, Cambria, 'Times New Roman', Times, serif !important; }
body { background-color: #ffffff; color: #000000; -webkit-tap-highlight-color: transparent; }
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <title>Dr Apple Kano | Certified Apple Store & iPhone Swap Hub</title>
        <meta
          name="description"
          content="Kano's Premier Certified Apple Store for Brand New & UK Used iPhones, iPads, MacBooks & instant Swap Financing."
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: webFonts }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
