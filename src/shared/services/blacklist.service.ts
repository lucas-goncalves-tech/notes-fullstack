import redisClient from "../redis/client";

export class BlackListService {
  addToBlackList(token: string, expiresIn: number) {
    redisClient.set(token, "blockedlist", {
      EX: expiresIn,
    });
  }
}
