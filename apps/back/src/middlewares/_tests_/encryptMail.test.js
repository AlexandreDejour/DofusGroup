import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import * as cryptoModule from '../crypto.js';
import { encryptMail } from '../encryptMail.js';

describe('encryptMail middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        mail: 'test@example.com'
      }
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(() => res)
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should encrypt the email and call next()', () => {
    const fakeEncrypted = 'iv:tag:encrypted';
    vi.spyOn(cryptoModule, 'encrypt').mockReturnValue(fakeEncrypted);

    encryptMail(req, res, next);

    expect(req.body.mail).toBe(fakeEncrypted);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should do nothing if mail is not in request body', () => {
    req.body = {};

    encryptMail(req, res, next);

    expect(req.body.mail).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should handle errors in encryption and send 500 response', () => {
    vi.spyOn(cryptoModule, 'encrypt').mockImplementation(() => {
      throw new Error('Encryption failed');
    });

    encryptMail(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Encryption failed' });
    expect(next).not.toHaveBeenCalled();
  });
});
