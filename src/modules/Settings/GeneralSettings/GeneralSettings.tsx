import { VStack } from "@chakra-ui/react";
import { RoomForm, RoomFormValue } from "@modules/RoomForm/RoomForm";
import { Room } from "@prisma/client";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { RoomDeleteForm } from "./RoomDeleteForm/RoomDeleteForm";

type Props = {
  room: Room;
};

export const GeneralSettings = ({ room }: Props): ReactElement => {
  const router = useRouter();

  const client = trpc.useContext();

  const updateMutation = trpc.proxy.rooms.updateRoom.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["members.selectMyMembers"]);
      client.invalidateQueries([
        "members.selectMemberByRoomId",
        { roomId: room.id },
      ]);
    },
  });

  const deleteMutation = trpc.proxy.rooms.deleteRoom.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["members.selectMyMembers"]);
      router.replace(paths.index());
    },
  });

  const handleUpdateSubmit = (input: RoomFormValue) => {
    updateMutation.mutate({ ...input, id: room.id });
  };

  const handleDeleteSubmit = () => {
    deleteMutation.mutate({ id: room.id });
  };

  return (
    <VStack>
      <RoomForm
        initialValue={room}
        isLoading={updateMutation.isLoading}
        onSubmit={handleUpdateSubmit}
      />
      <RoomDeleteForm
        isLoading={deleteMutation.isLoading}
        onSubmit={handleDeleteSubmit}
      />
    </VStack>
  );
};
