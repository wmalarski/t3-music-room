import { Button, useToast } from "@chakra-ui/react";
import { Invite } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  invite: Invite;
};

export const AcceptInvite = ({ invite }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "AcceptInvite" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.invites.acceptInvite.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["invites.selectUserInvites"]);
      client.invalidateQueries(["invites.selectRoomInvites"]);
      toast({
        title: t("acceptSuccess"),
        status: "success",
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: t("acceptError"),
        status: "error",
        description: error.message,
        isClosable: true,
      });
    },
  });

  const handleAcceptClick = () => {
    mutation.mutate({ id: invite.id });
  };

  return (
    <Button isLoading={mutation.isLoading} onClick={handleAcceptClick}>
      {t("accept")}
    </Button>
  );
};
