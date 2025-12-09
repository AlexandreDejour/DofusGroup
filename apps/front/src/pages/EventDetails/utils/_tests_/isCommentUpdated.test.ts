import { describe, it, expect } from "vitest";

import { Comment } from "../../../../types/comment";

import isCommentUpdated from "../isCommentUpdated";

describe("isCommentUpdated", () => {
  it("Should return false if createdAt and updatedAt are equal", () => {
    const comment: Comment = {
      id: "1",
      content: "Hello",
      createdAt: "2025-12-09T10:40:10.517Z",
      updatedAt: "2025-12-09T10:40:10.517Z",
    };

    expect(isCommentUpdated(comment)).toBe(false);
  });

  it("Should return true if updatedAt and createdAt not equal", () => {
    const comment: Comment = {
      id: "2",
      content: "Updated comment",
      createdAt: "2025-12-09T10:40:10.517Z",
      updatedAt: "2025-12-09T11:00:00.000Z",
    };

    expect(isCommentUpdated(comment)).toBe(true);
  });

  it("Should return false if createdAt is unvalid", () => {
    const comment: Comment = {
      id: "3",
      content: "Invalid createdAt",
      createdAt: "invalid-date",
      updatedAt: "2025-12-09T11:00:00.000Z",
    };

    expect(isCommentUpdated(comment)).toBe(false);
  });

  it("Should return false if updatedAt is unvalid", () => {
    const comment: Comment = {
      id: "4",
      content: "Invalid updatedAt",
      createdAt: "2025-12-09T10:40:10.517Z",
      updatedAt: "not-a-date",
    };

    expect(isCommentUpdated(comment)).toBe(false);
  });

  it("Should return false if two dates are unvalid", () => {
    const comment: Comment = {
      id: "5",
      content: "Both invalid",
      createdAt: "foo",
      updatedAt: "bar",
    };

    expect(isCommentUpdated(comment)).toBe(false);
  });
});
