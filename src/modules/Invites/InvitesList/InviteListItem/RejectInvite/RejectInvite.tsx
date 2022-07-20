import { Button, useToast } from "@chakra-ui/react";
import { Invite } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  invite: Invite;
};

export const RejectInvite = ({ invite }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RejectInvite" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.invites.rejectInvite.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["invites.selectUserInvites"]);
      client.invalidateQueries(["invites.selectRoomInvites"]);
      toast({
        title: t("rejectSuccess"),
        status: "success",
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: t("rejectError"),
        status: "error",
        description: error.message,
        isClosable: true,
      });
    },
  });

  const handleRejectClick = () => {
    mutation.mutate({ id: invite.id });
  };

  return (
    <Button isLoading={mutation.isLoading} onClick={handleRejectClick}>
      {t("reject")}
    </Button>
  );
};
