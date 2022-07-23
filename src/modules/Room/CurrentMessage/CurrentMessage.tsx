import { Skeleton, Spinner, VStack } from "@chakra-ui/react";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { ReactElement } from "react";
import { MessagePlayer } from "./MessagePlayer/MessagePlayer";

type Props = {
  room: Room;
};

export const CurrentMessage = ({ room }: Props): ReactElement => {
  const query = trpc.proxy.messages.selectCurrentMessages.useQuery({
    roomId: room.id,
  });

  if (query.status === "loading" || query.status === "idle") {
    return <Spinner />;
  }

  if (query.status === "error") {
    return <ResultMessage message={query.error.message} variant="error" />;
  }

  if (!query.data) {
    return <Skeleton />;
  }

  return (
    <VStack>
      <MessagePlayer message={query.data} />
    </VStack>
  );
};
