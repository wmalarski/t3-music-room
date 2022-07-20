import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { InferMutationInput, InferQueryOutput } from "@server/types";
import { useTranslation } from "next-i18next";
import { ChangeEvent, ReactElement, useState } from "react";

export type ProfileFormValue = InferMutationInput<"user.updateUser">;

type Props = {
  isLoading: boolean;
  onSubmit: (input: ProfileFormValue) => void;
  user: InferQueryOutput<"user.selectUser">;
};

export const ProfileForm = ({
  isLoading,
  onSubmit,
  user,
}: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "ProfileForm" });

  const [value, setValue] = useState<ProfileFormValue>({
    image: user.image || undefined,
    name: user.name || undefined,
  });

  const handleClick = () => {
    onSubmit(value);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((current) => ({ ...current, name: event.target.value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((current) => ({ ...current, image: event.target.value }));
  };

  return (
    <VStack gap={5}>
      <FormControl>
        <FormLabel htmlFor="name">{t("name")}</FormLabel>
        <Input id="name" onChange={handleNameChange} value={value.name} />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="image">{t("image")}</FormLabel>
        <Input id="image" onChange={handleImageChange} value={value.image} />
      </FormControl>
      <Button isLoading={isLoading} onClick={handleClick}>
        {t("submit")}
      </Button>
    </VStack>
  );
};
