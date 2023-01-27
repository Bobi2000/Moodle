import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Footer, Header } from "@/shared";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
