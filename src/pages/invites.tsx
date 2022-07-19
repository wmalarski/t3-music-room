import { Invites } from "@modules/Invites/Invites";
import { ProtectedLayout } from "@modules/ProtectedLayout/ProtectedLayout";
import { withAuthorization } from "@utils/wrappers/withAuthorization";
import { withTranslations } from "@utils/wrappers/withTranslations";
import type { GetServerSideProps, NextPage } from "next";

const InvitesPage: NextPage = () => {
  return (
    <ProtectedLayout>
      <Invites />
    </ProtectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthorization(
  withTranslations()
);

export default InvitesPage;
