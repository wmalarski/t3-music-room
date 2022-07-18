import {
  Heading,
  Link as ChakraLink,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Link from "next/link";
import { ReactElement } from "react";
import { GeneralSettings } from "./GeneralSettings/GeneralSettings";
import { InviteSettings } from "./InviteSettings/InviteSettings";
import { MembersSettings } from "./MembersSettings/MembersSettings";

type Props = {
  roomId: string;
};

export const Settings = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Settings" });

  const query = trpc.proxy.members.selectMemberByRoomId.useQuery({ roomId });

  if (query.status === "loading" || query.status === "idle") {
    return <Spinner />;
  }

  if (query.status === "error") {
    return <ResultMessage message={query.error.message} variant="error" />;
  }

  return (
    <>
      <Head>
        <title>{t("title", { name: query.data.room.name })}</title>
      </Head>
      <VStack>
        <Link href={paths.room(roomId)} passHref>
          <ChakraLink>
            <Heading as="h2">{query.data.room.name}</Heading>
          </ChakraLink>
        </Link>
        <Tabs>
          <TabList>
            <Tab>{t("general")}</Tab>
            <Tab>{t("members")}</Tab>
            <Tab>{t("invites")}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <GeneralSettings room={query.data.room} />
            </TabPanel>
            <TabPanel>
              <MembersSettings room={query.data.room} />
            </TabPanel>
            <TabPanel>
              <InviteSettings room={query.data.room} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </>
  );
};
