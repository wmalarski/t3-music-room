import { Button, Heading, VStack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

export const Login = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Login" });

  const handleClick = () => {
    signIn("google");
  };

  return (
    <VStack h="100vh" justifyContent="center" w="full">
      <Heading>{t("title")}</Heading>
      <Button onClick={handleClick}>{t("google")}</Button>
    </VStack>
  );
};
