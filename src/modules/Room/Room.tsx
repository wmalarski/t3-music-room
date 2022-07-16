import { Flex } from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ReactElement } from "react";

type Props = {
  roomId: string;
};

export const Room = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Room" });

  const query = trpc.useQuery(["rooms.selectMemberByRoomId", { id: roomId }]);

  return (
    <>
      <Head>
        {query.status === "success" && (
          <title>{t("title", { name: query.data.room.name })}</title>
        )}
      </Head>
      <Flex flexDirection="column">
        <pre>{JSON.stringify(query.data, null, 2)}</pre>
      </Flex>
    </>
  );
};
