import { ChakraProvider } from "@chakra-ui/react";
import "@styles/globals.css";
import { trpc } from "@utils/trpc";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppType } from "next/dist/shared/lib/utils";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default trpc.withTRPC(appWithTranslation(MyApp as any));
