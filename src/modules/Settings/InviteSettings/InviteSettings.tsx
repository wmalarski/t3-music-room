import { VStack } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { ReactElement } from "react";
import { CreateInviteForm } from "./CreateInviteForm/CreateInviteForm";

type Props = {
  room: Room;
};

export const InviteSettings = ({ room }: Props): ReactElement => {
  const mutation = trpc.proxy.invites.createInvite.useMutation();

  const handleSubmit = (email: string) => {
    mutation.mutate({ email, roomId: room.id });
  };

  return (
    <VStack>
      <CreateInviteForm
        isLoading={mutation.isLoading}
        onSubmit={handleSubmit}
      />
    </VStack>
  );
};
