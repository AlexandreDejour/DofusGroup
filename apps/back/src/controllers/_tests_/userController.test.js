import { describe, it, expect, vi, beforeEach } from 'vitest';

import { User } from '../../models/User.js';
import { userController } from '../../controllers/userController.js';

vi.mock('../../models/User.js', () => ({
  User: {
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  }
}));

describe('userController', () => {
  let res;
  let next;
  let req;

  beforeEach(() => {
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
      params: {},
    };
    req = {
      params: {},
      body: {},
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('getUserWithCharactersAndEvents', () => {
    it('should respond with user and relations if found', async () => {
      const mockUser = { id: 2, username: 'Lisa', characters: [], events: [] };
      res.params.id = 2;
      User.findByPk.mockResolvedValue(mockUser);

      await userController.getUserWithCharactersAndEvents({}, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(2, {
        include: [
          { association: 'characters' },
          { association: 'events' },
        ]
      });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should call next() if user not found', async () => {
      res.params.id = 404;
      User.findByPk.mockResolvedValue(null);

      await userController.getUserWithCharactersAndEvents({}, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('post', () => {
    it('should create and return a new user', async () => {
        const inputData = {
            username: 'Newbie',
            password: 'secure',
            mail: 'test@mail.com',
            avatar: 'url'
        };

        const mockCreatedUser = {
            id: 3,
            ...inputData
        };

        req.body = inputData;
        User.create.mockResolvedValue(mockCreatedUser);

        await userController.post(req, res);

        expect(User.create).toHaveBeenCalledWith(inputData); // ✅ appel avec body
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockCreatedUser); // ✅ retour complet avec id
        });
    });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      req.params.id = 5;
      req.body = {
        username: 'UpdatedUser',
        password: 'newpass',
        mail: 'new@mail.com',
        avatar: 'newavatar'
      };
      const mockUser = { id: 5, ...req.body };
      User.findByPk.mockResolvedValue(mockUser);
      User.update.mockResolvedValue(mockUser);

      await userController.update(req, res, next);

      expect(User.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should call next() if user not found', async () => {
      req.params.id = 12;
      User.findByPk.mockResolvedValue(null);

      await userController.update(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete user if found', async () => {
      req.params.id = 7;
      const mockUser = { id: 7 };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.delete(req, res, next);

      expect(User.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should call next() if user not found', async () => {
      req.params.id = 88;
      User.findByPk.mockResolvedValue(null);

      await userController.delete(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
