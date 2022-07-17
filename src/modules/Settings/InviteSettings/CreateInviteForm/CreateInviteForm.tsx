import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ChangeEvent, ReactElement, useState } from "react";

export type RoomFormValue = {
  name: string;
  description: string;
};

type Props = {
  isLoading: boolean;
  onSubmit: (email: string) => void;
};

export const CreateInviteForm = ({
  isLoading,
  onSubmit,
}: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "CreateInviteForm" });

  const [email, setEmail] = useState("");

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleClick = () => {
    onSubmit(email);
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
      <Button isLoading={isLoading} onClick={handleClick}>
        {t("submit")}
      </Button>
    </Flex>
  );
};
