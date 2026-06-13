import type { IRoom, IRoomPublicView } from "@/types/room.types";
import { useQueryBase } from "../useQueryBase";
import { APIEndpoints } from "../../endpoints";

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useGetRoomsQuery = useQueryBase<{ rooms: (IRoom | IRoomPublicView)[] }>(APIEndpoints.GET_ALL_ROOMS, true, true);

export const useRooms = () => {
    const { data } = useGetRoomsQuery({ queryKey: ['rooms'] });
    return data?.data?.rooms || [];
}