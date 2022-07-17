import { ProtectedLayout } from "@modules/ProtectedLayout/ProtectedLayout";
import { Room } from "@modules/Room/Room";
import { withAuthorization } from "@services/withAuthorization";
import { withTranslations } from "@services/withTranslations";
import { withZodQuery } from "@services/withZodQuery";
import type { GetServerSideProps, NextPage } from "next";
import { z } from "zod";

const Props = z.object({
  roomId: z.string(),
});

type Props = z.infer<typeof Props>;

const RoomPage: NextPage<Props> = ({ roomId }) => {
  return (
    <ProtectedLayout>
      <Room roomId={roomId} />
    </ProtectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withZodQuery(
  withAuthorization(withTranslations()),
  Props
);

export default RoomPage;
