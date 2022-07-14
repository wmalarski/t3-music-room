import type { GetServerSideProps } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../pages/api/auth/[...nextauth]";

export const withAuthorization = (
  next: GetServerSideProps = () => Promise.resolve({ props: {} })
): GetServerSideProps => {
  return async (context) => {
    const session = await getServerSession(
      context.req,
      context.res,
      nextAuthOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: "signIn",
          permanent: true,
        },
      };
    }

    return next(context);
  };
};
