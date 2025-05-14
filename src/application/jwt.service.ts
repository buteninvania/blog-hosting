import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { UsersViewModel } from "../features/users/models/UsersViewModel";
import { SETTINGS } from "../settings";

export const jwtService = {
  createJWT(user: UsersViewModel) {
    const token = jwt.sign({ userId: user.id }, SETTINGS.JWT_SECRET, { expiresIn: "1h" });
    return token;
  },
  getUserIdByToken(token: string) {
    try {
      const result = jwt.decode(token) as null | { userId: string };
      if (!result) return null;
      return new ObjectId(result.userId);
    } catch (e) {
      return null;
    }
  },
};
