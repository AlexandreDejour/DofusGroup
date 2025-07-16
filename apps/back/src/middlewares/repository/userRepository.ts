import UserEntity from "../../database/models/User.js";
import { User, UserBodyData, UserEnriched } from "../../types/user.js";

export class UserRepository {
  public async getAll(): Promise<User[]> {
    try {
      const result: UserEntity[] = await UserEntity.findAll();

      if (!result.length) {
        throw new Error("Any user found");
      }

      const users: User[] = result.map((user: UserEntity) =>
        user.get({ plain: true }),
      );

      return users;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEnriched(): Promise<UserEnriched[]> {
    try {
      const result: UserEntity[] = await UserEntity.findAll({
        include: ["characters", "events"],
      });

      if (!result.length) {
        throw new Error("Any user found");
      }

      const users: UserEnriched[] = result.map((user: UserEntity) =>
        user.get({ plain: true }),
      );

      return users;
    } catch (error) {
      throw error;
    }
  }

  public async getOne(userId: string): Promise<User | null> {
    try {
      const result: UserEntity | null = await UserEntity.findByPk(userId);

      if (!result) {
        return null;
      }

      const user: User = result.get({ plain: true });

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getOneEnriched(userId: string): Promise<UserEnriched | null> {
    try {
      const result: UserEntity | null = await UserEntity.findOne({
        where: { id: userId },
        include: ["characters", "events"],
      });

      if (!result) {
        return null;
      }

      const user: UserEnriched = result.get({ plain: true });

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findOneByUsername(username: string): Promise<boolean> {
    try {
      const result: User | null = await UserEntity.findOne({
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

  public async post(userData: UserBodyData): Promise<User> {
    try {
      const result: UserEntity = await UserEntity.create(userData);

      const newuser = result.get({ plain: true });

      return newuser;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    userId: string,
    userData: Partial<UserBodyData>,
  ): Promise<User | null> {
    try {
      const userToUpdate: UserEntity | null = await UserEntity.findByPk(userId);

      if (!userToUpdate) {
        return null;
      }

      const result: UserEntity = await userToUpdate.update(userData);

      const userUpdated = result.get({ plain: true });

      return userUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(userId: string): Promise<boolean> {
    try {
      const result: UserEntity | null = await UserEntity.findByPk(userId);

      if (!result) {
        return false;
      }

      result.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }
}
