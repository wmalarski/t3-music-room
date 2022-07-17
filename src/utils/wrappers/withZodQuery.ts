import { paths } from "@utils/paths";
import type { GetServerSideProps } from "next";
import z from "zod";

export const withZodQuery = (
  next: GetServerSideProps,
  input: z.ZodObject<z.ZodRawShape>
): GetServerSideProps => {
  return async (context) => {
    const result = input.safeParse(context.query);

    if (!result.success) {
      return { redirect: { destination: paths.notFound(), permanent: true } };
    }

    const current = await next(context);

    return {
      ...current,
      props: {
        ...("props" in current ? current.props : {}),
        ...result.data,
      },
    };
  };
};
