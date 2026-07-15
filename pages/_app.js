import "../styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>News Portal</title>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
