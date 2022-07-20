import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ChangeEvent, ReactElement, useState } from "react";

export type CreateMessageFormValue = {
  name: string;
  description: string;
};

type Props = {
  isLoading: boolean;
  onSubmit: (text: string) => void;
};

export const CreateMessageForm = ({
  isLoading,
  onSubmit,
}: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "CreateMessageForm" });

  const [text, setText] = useState("");

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleClick = () => {
    onSubmit(text);
  };

  return (
    <HStack gap={5}>
      <FormControl>
        <FormLabel htmlFor="text">{t("text")}</FormLabel>
        <Input id="text" onChange={handleTextChange} value={text} />
      </FormControl>
      <Button isLoading={isLoading} onClick={handleClick}>
        {t("submit")}
      </Button>
    </HStack>
  );
};
