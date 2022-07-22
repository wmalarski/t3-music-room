import { useToast } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { CreateMessageForm } from "./CreateMessageForm/CreateMessageForm";

type Props = {
  room: Room;
};

export const CreateMessage = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "CreateMessage" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.messages.createMessage.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["messages.selectMessages"]);
      client.invalidateQueries(["messages.selectCurrentMessages"]);
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

  const handleSubmit = (text: string) => {
    mutation.mutate({ text, roomId: room.id });
  };

  return (
    <CreateMessageForm isLoading={mutation.isLoading} onSubmit={handleSubmit} />
  );
};
