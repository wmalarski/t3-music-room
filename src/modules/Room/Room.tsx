import { Flex, Link as ChakraLink, Spinner } from "@chakra-ui/react";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Link from "next/link";
import { ReactElement } from "react";

type Props = {
  roomId: string;
};

export const Room = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Room" });

  const query = trpc.proxy.members.selectMemberByRoomId.useQuery({ roomId });

  if (query.status === "loading" || query.status === "idle") {
    return <Spinner />;
  }

  if (query.status === "error") {
    return <ResultMessage message={query.error.message} variant="error" />;
  }

  return (
    <>
      <Head>
        {query.status === "success" && (
          <title>{t("title", { name: query.data.room.name })}</title>
        )}
      </Head>
      {query.status === "success" && (
        <Flex flexDirection="column">
          <Link href={paths.settings(roomId)}>
            <ChakraLink>{t("settings")}</ChakraLink>
          </Link>
          <pre>{JSON.stringify(query.data, null, 2)}</pre>
        </Flex>
      )}
    </>
  );
};
