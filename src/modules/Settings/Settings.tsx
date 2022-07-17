import {
  Heading,
  Link as ChakraLink,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
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

  return (
    <>
      <Head>
        {query.status === "success" && (
          <title>{t("title", { name: query.data.room.name })}</title>
        )}
      </Head>
      {query.status === "success" && (
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
      )}
    </>
  );
};
