import { Button, HStack, Text, useToast } from "@chakra-ui/react";
import { Invite } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  invite: Invite;
};

export const InviteListItem = ({ invite }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "InviteListItem" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.invites.deleteInvite.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["invites.selectInvites"]);
      toast({
        title: t("removeSuccess"),
        status: "success",
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: t("removeError"),
        status: "error",
        description: error.message,
        isClosable: true,
      });
    },
  });

  const handleRemoveClick = () => {
    mutation.mutate({ id: invite.id });
  };

  return (
    <HStack>
      <Text>{invite.email}</Text>
      <Button isLoading={mutation.isLoading} onClick={handleRemoveClick}>
        {t("remove")}
      </Button>
    </HStack>
  );
};
