import { describe, it, expect, vi, beforeEach } from "vitest";

import { validateSchema } from "../validateSchema.js";
import { createSchema, updateSchema } from "../character.js";

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('validateSchema - character schema unit tests', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {} };
    res = mockResponse();
    next = vi.fn();
  });

  it('should call next() with valid createSchema data', async () => {
    req.body = {
      user_id: 1,
      name: 'Warrior',
      sex: 'male',
      level: 100,
      server_id: 2,
      alignment: 'Brakmar',
      breed_id: 5,
      stuff: 'https://dofusbook.net/stuff/123',
      default_character: true,
    };

    const middleware = validateSchema(createSchema);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing', async () => {
    const middleware = validateSchema(createSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const errorDetails = res.json.mock.calls[0][0].details;
    expect(errorDetails.length).toBeGreaterThan(1);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if fields have invalid values', async () => {
    req.body = {
      user_id: -1,
      name: '###$$$', // not alphanum
      sex: 'other',
      level: 300,
      server_id: -1,
      alignment: 'Neutral',
      breed_id: -10,
      stuff: 'not-a-url',
    };

    const middleware = validateSchema(createSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const messages = res.json.mock.calls[0][0].details;
    expect(messages.length).toBeGreaterThan(2);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() with valid partial data for updateSchema', async () => {
    req.body = {
      name: 'UpdatedName',
      sex: 'female',
      level: 199,
    };

    const middleware = validateSchema(updateSchema);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if updateSchema has invalid values', async () => {
    req.body = {
      name: '@@@@',
      level: 0,
      sex: 'alien',
      stuff: 'invalid-link'
    };

    const middleware = validateSchema(updateSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const details = res.json.mock.calls[0][0].details;
    expect(details.length).toBeGreaterThan(1);
    expect(next).not.toHaveBeenCalled();
  });
});
