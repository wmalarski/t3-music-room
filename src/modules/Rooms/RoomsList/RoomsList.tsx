import {
  Box,
  Center,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Pagination } from "@components/Pagination/Pagination";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { ReactElement, useState } from "react";

export const RoomsList = (): ReactElement => {
  const { i18n } = useTranslation("common", { keyPrefix: "RoomsList" });

  const [page, setPage] = useState(0);
  const take = 100;

  const client = trpc.useContext();

  const query = trpc.proxy.members.selectMyMembers.useQuery(
    { skip: page * take, take },
    {
      onSuccess: ([data]) => {
        data.forEach((member) => {
          client.setQueryData(
            ["members.selectMemberByRoomId", { roomId: member.room.id }],
            member
          );
        });
      },
    }
  );

  if (query.status === "loading" || query.status === "idle") {
    return <Spinner />;
  }

  if (query.status === "error") {
    return <ResultMessage message={query.error.message} variant="error" />;
  }

  const [members, maxSize] = query.data;

  if (members.length <= 0) {
    return <ResultMessage variant="empty" />;
  }

  return (
    <VStack w="full">
      {members.map((member) => (
        <LinkBox
          as="article"
          backgroundColor="white"
          key={member.room.id}
          p="5"
          rounded="md"
          w="full"
        >
          <HStack>
            <Heading my="2" size="md">
              <Link href={paths.room(member.room.id)} passHref>
                <LinkOverlay>{member.room.name}</LinkOverlay>
              </Link>
            </Heading>
            <Box as="time" dateTime={member.createdAt.toISOString()}>
              {new Intl.DateTimeFormat(i18n.language).format(member.createdAt)}
            </Box>
          </HStack>
          <Text>{member.room.description}</Text>
        </LinkBox>
      ))}
      <Center backgroundColor="white" padding={2} w="full">
        <Pagination
          current={page}
          maxPage={Math.ceil(maxSize / take)}
          onChange={setPage}
        />
      </Center>
    </VStack>
  );
};
