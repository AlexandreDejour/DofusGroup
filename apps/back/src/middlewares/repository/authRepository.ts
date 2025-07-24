import jwt from "jsonwebtoken";

import { Config } from "../../config/config.js";
import UserEntity from "../../database/models/User.js";
import { AuthUser, UserBodyData } from "../../types/user.js";

export class AuthRepository {
  private config = Config.getInstance();

  public async findOneByUsername(username: string): Promise<boolean> {
    try {
      const result: UserEntity | null = await UserEntity.findOne({
        where: { username: username },
      });

      if (result) {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  public async findOneByMail(mail: string): Promise<AuthUser | null> {
    try {
      const result: UserEntity | null = await UserEntity.findOne({
        where: { mail: mail },
      });

      if (!result) {
        return null;
      }

      const user: AuthUser = result.get({ plain: true });

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async register(userData: UserBodyData): Promise<AuthUser> {
    try {
      const result: UserEntity = await UserEntity.create(userData);

      const newUser = result.get({ plain: true });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  public async generateAccessToken(userId: string) {
    if (!this.config.jwtSecret) {
      throw new Error("JWT_SECRET is not set");
    }

    console.log(this.config.jwtSecret);

    return jwt.sign({ sub: userId }, this.config.jwtSecret, {
      expiresIn: "2h",
    });
  }
}
