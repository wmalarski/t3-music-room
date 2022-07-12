import { prisma } from "@server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";

const examples = async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const examples = await prisma.example.findMany();
  res.status(200).json(examples);
};

export default examples;
