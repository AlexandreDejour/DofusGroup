import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Tag } from '../../models/Tag.js';
import { tagController } from '../tagController.js';

vi.mock('../../models/Tag.js', () => ({
  Tag: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
  }
}));

describe('tagController', () => {

  let res; 
  let next;

  beforeEach(() => {
    res = {
      json: vi.fn(),
      params: {},
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should respond with all tags', async () => {
      const mockServers = [{ id: 1, name: 'Donjon' }, { id: 2, name: 'Drop' }];
      Tag.findAll.mockResolvedValue(mockServers);

      await tagController.getAll({}, res, next);

      expect(Tag.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockServers);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if no tags are found', async () => {
      Tag.findAll.mockResolvedValue(null);

      await tagController.getAll({}, res, next);

      expect(Tag.findAll).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should respond with one tag if found', async () => {
      const mockServer = { id: 1, name: 'Donjon' };
      res.params.id = 1;
      Tag.findByPk.mockResolvedValue(mockServer);

      await tagController.getOne({}, res, next);

      expect(Tag.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockServer);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if tag is not found', async () => {
      res.params.id = 42;
      Tag.findByPk.mockResolvedValue(null);

      await tagController.getOne({}, res, next);

      expect(Tag.findByPk).toHaveBeenCalledWith(42);
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

});
