import { Heading, HStack, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ReactElement } from "react";
import { InviteList } from "./InvitesList/InvitesList";

export const Invites = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Invites" });

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <VStack>
        <HStack justifyContent="flex-start" p={2} w="full">
          <Heading size="lg">{t("title")}</Heading>
        </HStack>
        <InviteList />
      </VStack>
    </>
  );
};
