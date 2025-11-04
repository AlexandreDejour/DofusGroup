import UserEntity from "../../database/models/User.js";
import { AuthUser, UserBodyData } from "../../types/user.js";

export class AuthRepository {
  public async findOneById(id: string): Promise<AuthUser | null> {
    try {
      const result: UserEntity | null = await UserEntity.findOne({
        where: { id: id },
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

  public async findOneByUsername(username: string): Promise<AuthUser | null> {
    try {
      const result: UserEntity | null = await UserEntity.findOne({
        where: { username: username },
      });

      if (!result) {
        return null;
      }

      const user = result.get({ plain: true });

      return user;
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

      const user = result.get({ plain: true });

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
}
