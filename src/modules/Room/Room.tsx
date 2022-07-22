import { Spinner, VStack } from "@chakra-ui/react";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { RoomNav } from "@modules/RoomNav/RoomNav";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ReactElement } from "react";
import { CreateMessage } from "./CreateMessage/CreateMessage";
import { CurrentMessage } from "./CurrentMessage/CurrentMessage";
import { MessageList } from "./MessageList/MessageList";

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
        <title>{t("title", { name: query.data.room.name })}</title>
      </Head>
      <VStack>
        <RoomNav room={query.data.room} />
        <MessageList room={query.data.room} />
        <CreateMessage room={query.data.room} />
        <CurrentMessage room={query.data.room} />
        <pre>{JSON.stringify(query.data, null, 2)}</pre>
      </VStack>
    </>
  );
};
