import { Flex } from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ReactElement } from "react";
import { RoomSettingsModal } from "./RoomSettingsModal/RoomSettingsModal";

type Props = {
  roomId: string;
};

export const Room = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Room" });

  const query = trpc.useQuery(["members.selectMemberByRoomId", { id: roomId }]);

  return (
    <>
      <Head>
        {query.status === "success" && (
          <title>{t("title", { name: query.data.room.name })}</title>
        )}
      </Head>
      <Flex flexDirection="column">
        {query.status === "success" && query.data.role === "owner" && (
          <RoomSettingsModal room={query.data.room} />
        )}
        <pre>{JSON.stringify(query.data, null, 2)}</pre>
      </Flex>
    </>
  );
};
