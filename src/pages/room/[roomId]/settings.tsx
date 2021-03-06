import { ProtectedLayout } from "@modules/ProtectedLayout/ProtectedLayout";
import { Settings } from "@modules/Settings/Settings";
import { withAuthorization } from "@utils/wrappers/withAuthorization";
import { withTranslations } from "@utils/wrappers/withTranslations";
import { withZodQuery } from "@utils/wrappers/withZodQuery";
import type { GetServerSideProps, NextPage } from "next";
import { z } from "zod";

const Props = z.object({
  roomId: z.string(),
});

type Props = z.infer<typeof Props>;

const SettingsPage: NextPage<Props> = ({ roomId }) => {
  return (
    <ProtectedLayout>
      <Settings roomId={roomId} />
    </ProtectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withZodQuery(
  withAuthorization(withTranslations()),
  Props
);

export default SettingsPage;
