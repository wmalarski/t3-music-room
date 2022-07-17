import { ProtectedLayout } from "@modules/ProtectedLayout/ProtectedLayout";
import { Rooms } from "@modules/Rooms/Rooms";
import { withAuthorization } from "@utils/wrappers/withAuthorization";
import { withTranslations } from "@utils/wrappers/withTranslations";
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
