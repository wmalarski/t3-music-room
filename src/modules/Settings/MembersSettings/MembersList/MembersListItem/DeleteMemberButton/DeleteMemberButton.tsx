import { Button, useToast } from "@chakra-ui/react";
import { Member, User } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  userMember: Member;
  member: Member & { user: User };
};

export const DeleteMemberButton = ({
  userMember,
  member,
}: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "DeleteMemberButton" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.members.deleteMember.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["members.selectRoomMembers"]);
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
    mutation.mutate({ id: member.id });
  };

  return (
    <Button
      isDisabled={userMember.role !== "owner" || userMember.id === member.id}
      isLoading={mutation.isLoading}
      onClick={handleRemoveClick}
    >
      {t("remove")}
    </Button>
  );
};
