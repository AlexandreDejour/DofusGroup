import { describe, it, expect, vi } from 'vitest';
import { notFound, errorHandler } from '../errorHandler.js';

describe('Error handling middleware', () => {

  it('notFound middleware should call next with 404 error', () => {
    const req = {};
    const res = {};
    const next = vi.fn();

    notFound(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Not found');
    expect(error.status).toBe(404);
  });

  it('errorHandler middleware should send response with error status and message', () => {
    const error = new Error('Test error');
    error.statusCode = 400;

    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: true, message: 'Test error' });
  });

  it('errorHandler should default to status 500 if no statusCode on error', () => {
    const error = new Error('Unknown error');
    // undefined statusCode

    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: true, message: 'Unknown error' });
  });

});
