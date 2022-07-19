import { Heading, useToast, VStack } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { CreateInviteForm } from "./CreateInviteForm/CreateInviteForm";
import { InviteList } from "./InviteList/InviteList";

type Props = {
  room: Room;
};

export const InviteSettings = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "InviteSettings" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.invites.createInvite.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["invites.selectInvites"]);
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
    <VStack>
      <Heading as="h3">{t("heading")}</Heading>
      <CreateInviteForm
        isLoading={mutation.isLoading}
        onSubmit={handleSubmit}
      />
      <InviteList room={room} />
    </VStack>
  );
};
