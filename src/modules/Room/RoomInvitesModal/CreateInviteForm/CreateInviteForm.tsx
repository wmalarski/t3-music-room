import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ChangeEvent, ReactElement, useState } from "react";

export type RoomFormValue = {
  name: string;
  description: string;
};

type Props = {
  room: Room;
};

export const CreateInviteForm = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomForm" });

  const [email, setEmail] = useState("");

  const mutation = trpc.useMutation(["invites.createInvite"]);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleClick = () => {
    mutation.mutate({ email, roomId: room.id });
  };

  return (
    <Flex flexDirection="row" gap={5}>
      <FormControl>
        <FormLabel htmlFor="email">{t("email")}</FormLabel>
        <Input
          id="email"
          onChange={handleEmailChange}
          type="email"
          value={email}
        />
      </FormControl>
      <Button isLoading={mutation.isLoading} onClick={handleClick}>
        {t("submit")}
      </Button>
    </Flex>
  );
};
