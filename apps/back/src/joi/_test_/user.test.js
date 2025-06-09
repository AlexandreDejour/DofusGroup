import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateSchema } from "../validateSchema.js"
import { createSchema, updateSchema } from "../user.js"

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('validateSchema - user schema tests', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {} };
    res = mockResponse();
    next = vi.fn();
  });

  it('should validate correct user creation data', async () => {
    req.body = {
      username: 'JohnDoe',
      password: 'StrongP@ss1',
      confirm_password: 'StrongP@ss1',
      mail: 'john@example.com',
      avatar: 'https://example.com/avatar.png'
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
    const details = res.json.mock.calls[0][0].details;
    expect(details.length).toBeGreaterThan(1);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject weak password', async () => {
    req.body = {
      username: 'JohnDoe',
      password: 'weakpass',
      confirm_password: 'weakpass',
      mail: 'john@example.com'
    };

    const middleware = validateSchema(createSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const [error] = res.json.mock.calls[0][0].details;
    expect(error).toMatch(/Invalid password/);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject if confirm_password does not match', async () => {
    req.body = {
      username: 'JohnDoe',
      password: 'StrongP@ss1',
      confirm_password: 'DifferentP@ss1',
      mail: 'john@example.com'
    };

    const middleware = validateSchema(createSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const details = res.json.mock.calls[0][0].details;
    expect(details.some(msg => msg.includes("Passwords don't match"))).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  it('should validate partial update with matching password/confirm_password', async () => {
    req.body = {
      password: 'NewP@ssword2',
      confirm_password: 'NewP@ssword2',
      avatar: 'https://example.com/new-avatar.png'
    };

    const middleware = validateSchema(updateSchema);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should reject update if password is given without confirm_password', async () => {
    req.body = {
      password: 'NewP@ssword2'
    };

    const middleware = validateSchema(updateSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const details = res.json.mock.calls[0][0].details;
    expect(details.some(msg => msg.includes('Confirm password is required when password is provided.'))).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject invalid email or avatar URL', async () => {
    req.body = {
      mail: 'not-an-email',
      avatar: 'not-a-url'
    };

    const middleware = validateSchema(updateSchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const details = res.json.mock.calls[0][0].details;
    expect(details.length).toBeGreaterThan(1);
    expect(next).not.toHaveBeenCalled();
  });
});
