import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateSchema } from "../validateSchema.js"
import { createSchema, updateSchema } from "../event.js";

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('validateSchema - middleware unit tests', () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = { body: {} };
    res = mockResponse();
    next = vi.fn();
  });

  it('should call next() if data is valid (createSchema)', async () => {
    req.body = {
      user_id: 1,
      title: 'Raid',
      tag_id: 5,
      date: new Date().toISOString(),
      duration: 4,
      area: 'Desert',
      subarea: 'South',
      donjon_name: 'Temple',
      max_players: 5,
      description: 'A1Description',
      status: 'private',
      server_id: 9,
    };

    const middleware = validateSchema(createSchema);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing (createSchema)', async () => {
    req.body = {}; // nothing sent

    const middleware = validateSchema(createSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    const jsonCall = res.json.mock.calls[0][0];
    expect(jsonCall.error).toBe(true);
    expect(jsonCall.details.length).toBeGreaterThan(0);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if some fields are invalid (createSchema)', async () => {
    req.body = {
      user_id: -1,
      title: '',
      tag_id: 'wrong',
      date: 'not-a-date',
      duration: 20,
      max_players: 1,
      description: '@@!!', // non-alphanumeric
      status: 'invalid',
      server_id: -5,
    };

    const middleware = validateSchema(createSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0].details.length).toBeGreaterThan(1);
    expect(next).not.toHaveBeenCalled();
  });

  it('should validate partial data for updateSchema (valid case)', async () => {
    req.body = {
      title: 'Optional update',
      max_players: 6,
    };

    const middleware = validateSchema(updateSchema);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 if updateSchema data is invalid', async () => {
    req.body = {
      max_players: 20, // too high
    };

    const middleware = validateSchema(updateSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
