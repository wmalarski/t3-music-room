import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

export const Login = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Login" });

  return (
    <div>
      <form>
        <span>{t("title")}</span>
        <input />
        <input />
      </form>
    </div>
  );
};
