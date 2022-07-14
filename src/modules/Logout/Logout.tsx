import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

export const Logout = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Logout" });

  const handleClick = () => {
    signOut();
  };

  return <Button onClick={handleClick}>{t("google")}</Button>;
};
