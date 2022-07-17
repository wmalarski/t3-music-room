import { Flex } from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ReactElement } from "react";
import { RoomInvitesModal } from "./RoomInvitesModal/RoomInvitesModal";
import { RoomMembersModal } from "./RoomMembersModal/RoomMembersModal";
import { RoomSettingsModal } from "./RoomSettingsModal/RoomSettingsModal";

type Props = {
  roomId: string;
};

export const Room = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Room" });

  const query = trpc.useQuery(["members.selectMemberByRoomId", { roomId }]);

  return (
    <>
      <Head>
        {query.status === "success" && (
          <title>{t("title", { name: query.data.room.name })}</title>
        )}
      </Head>
      {query.status === "success" && (
        <Flex flexDirection="column">
          <RoomMembersModal room={query.data.room} />
          <RoomInvitesModal room={query.data.room} />
          {query.data.role === "owner" && (
            <RoomSettingsModal room={query.data.room} />
          )}
        </Flex>
      )}
    </>
  );
};
