import { ProtectedLayout } from "@modules/ProtectedLayout/ProtectedLayout";
import { Rooms } from "@modules/Rooms/Rooms";
import { withAuthorization } from "@services/withAuthorization";
import { withTranslations } from "@services/withTranslations";
import type { GetServerSideProps, NextPage } from "next";

const Home: NextPage = () => {
  return (
    <ProtectedLayout>
      <Rooms />
    </ProtectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthorization(
  withTranslations()
);

export default Home;
