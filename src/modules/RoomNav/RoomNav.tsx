import { Heading, HStack, Link as ChakraLink } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { paths } from "@utils/paths";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Link from "next/link";
import { ReactElement } from "react";

type Props = {
  room: Room;
};

export const RoomNav = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomNav" });

  return (
    <>
      <Head>
        <title>{t("title", { name: room.name })}</title>
      </Head>
      <HStack>
        <Link href={paths.room(room.id)} passHref>
          <ChakraLink>
            <Heading as="h2">{room.name}</Heading>
          </ChakraLink>
        </Link>
        <Link href={paths.settings(room.id)} passHref>
          <ChakraLink>
            <Heading as="h2">{t("settings")}</Heading>
          </ChakraLink>
        </Link>
      </HStack>
    </>
  );
};
