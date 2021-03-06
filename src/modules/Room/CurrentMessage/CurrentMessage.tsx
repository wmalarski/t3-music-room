import { Skeleton, Spinner, VStack } from "@chakra-ui/react";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { ReactElement } from "react";
import { MessageActions } from "./MessageActions/MessageActions";
import { MessagePlayer } from "./MessagePlayer/MessagePlayer";

type Props = {
  room: Room;
};

export const CurrentMessage = ({ room }: Props): ReactElement => {
  const query = trpc.proxy.messages.selectCurrentMessage.useQuery({
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
    <VStack bgColor="white" p="5" rounded="md" w="full">
      <MessagePlayer message={query.data} />
      <MessageActions message={query.data} />
      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
    </VStack>
  );
};
