import { useToast } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { CreateInviteForm } from "../CreateInviteForm/CreateInviteForm";

type Props = {
  room: Room;
};

export const CreateInvite = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "CreateInvite" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.invites.createInvite.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["invites.selectRoomInvites"]);
      toast({
        title: t("createSuccess"),
        status: "success",
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: t("createError"),
        status: "error",
        description: error.message,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (email: string) => {
    mutation.mutate({ email, roomId: room.id });
  };

  return (
    <CreateInviteForm isLoading={mutation.isLoading} onSubmit={handleSubmit} />
  );
};
