import { Server, Socket } from "socket.io";
import logger from "../../utils/logger";

export interface RoomJoinInfo {
  roomId: string;
  userId: string;
  username: string;
}

export const setupRoomHandlers = (io: Server, socket: Socket): void => {
  // 방 참가
  socket.on("joinRoom", ({ roomId, userId, username }: RoomJoinInfo) => {
    socket.join(roomId);

    logger.info(`사용자 ${username}(${userId})가 ${roomId} 방에 참가함`);

    // 방에 있는 다른 사용자들에게 새 사용자 참가 알림
    socket.to(roomId).emit("userJoined", {
      userId,
      username,
      timestamp: Date.now(),
    });

    // 현재 방에 있는 사용자 수 업데이트
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit("roomInfo", {
      roomId,
      userCount: roomSize,
      timestamp: Date.now(),
    });
  });

  // 방 나가기
  socket.on("leaveRoom", ({ roomId, userId, username }: RoomJoinInfo) => {
    socket.leave(roomId);

    logger.info(`사용자 ${username}(${userId})가 ${roomId} 방에서 나감`);

    // 방에 있는 다른 사용자들에게 사용자 퇴장 알림
    socket.to(roomId).emit("userLeft", {
      userId,
      username,
      timestamp: Date.now(),
    });

    // 현재 방에 있는 사용자 수 업데이트
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit("roomInfo", {
      roomId,
      userCount: roomSize,
      timestamp: Date.now(),
    });
  });
};
