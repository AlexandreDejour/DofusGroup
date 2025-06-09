import { describe, it, expect, vi, beforeEach } from 'vitest';

import sanitizeHtml from 'sanitize-html';

import { htmlSanitizer } from '../htmlSanitizer.js';

vi.mock('sanitize-html', () => ({
  default: vi.fn()
}));

describe('htmlSanitizer middleware', () => {
    let req;
    let res
    let next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {};
        next = vi.fn();
    });

    it('should sanitize HTML tags in string fields', () => {
        req.body = {
            name: 'John <script>alert("xss")</script>',
            comment: '<b>Hello</b>'
        };

        htmlSanitizer(req, res, next);

        expect(req.body.name).toBe(sanitizeHtml('John <script>alert("xss")</script>'));
        expect(req.body.comment).toBe(sanitizeHtml('<b>Hello</b>'));
        expect(next).toHaveBeenCalled();
    });

    it('should not modify non-string fields', () => {
        req.body = {
            age: 30,
            subscribed: true,
            preferences: { theme: 'dark' }
        };

        const originalBody = structuredClone(req.body); // Safe deep copy

        htmlSanitizer(req, res, next);

        expect(req.body).toEqual(originalBody);
        expect(next).toHaveBeenCalled();
    });

    it('should handle empty body', () => {
        req.body = {};

        htmlSanitizer(req, res, next);

        expect(req.body).toEqual({});
        expect(next).toHaveBeenCalled();
    });

    it('should call next with error if sanitizeHtml throws', () => {
    req.body = {
      name: '<script>alert("xss")</script>'
    };

    const error = new Error('Sanitization failed');
    sanitizeHtml.mockImplementation(() => {
      throw error;
    });

    htmlSanitizer(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe('Internal server error during HTML sanitizing.');
  });
});
