import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";

import { User } from "../../types/user";
import { EventEnriched } from "../../types/event";
import { CharacterEnriched } from "../../types/character";
import useFetchUserCharactersEnriched from "../useFetchUserCharactersEnriched";

// Helpers
function setupHook(user: User, event: EventEnriched, service: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchUserCharactersEnriched(user, event, service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchUserCharactersEnriched hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch enriched characters successfully and filter by event server", async () => {
    const user: User = { id: "user1", username: "toto" };
    const event: EventEnriched = {
      id: "event1",
      title: "Test Event",
      server: { id: "srv1", name: "srv1", mono_account: false },
      characters: [
        {
          id: "char1",
          name: "char1",
          sex: "M",
          level: 50,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1QVjw",
          server_id: "srv1",
          user: {
            id: "user1",
            username: "toto",
          },
          breed: {
            id: "brd1",
            name: "Xélor",
          },
          server: {
            id: "srv1",
            name: "srv1",
            mono_account: false,
          },
        },
      ],
      date: new Date(),
      duration: 60,
      area: undefined,
      sub_area: undefined,
      donjon_name: undefined,
      description: "",
      max_players: 5,
      status: "public",
      tag: { id: "tag1", name: "tag1", color: "#f0f" },
      comments: [],
      user: { id: "user1", username: "toto" },
    };

    const enrichedCharacters: CharacterEnriched[] = [
      {
        id: "char1",
        name: "char1",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv1",
        user: {
          id: "user1",
          username: "toto",
        },
        breed: {
          id: "brd1",
          name: "Xélor",
        },
        server: {
          id: "srv1",
          name: "srv1",
          mono_account: false,
        },
      },
      {
        id: "char2",
        name: "char2",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv2",
        user: {
          id: "user1",
          username: "toto",
        },
        breed: {
          id: "brd1",
          name: "Xélor",
        },
        server: {
          id: "srv2",
          name: "srv2",
          mono_account: false,
        },
      },
    ];

    const mockService = {
      getAllEnrichedByUserId: vi.fn().mockResolvedValue(enrichedCharacters),
    };

    const result = setupHook(user, event, mockService);

    // initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.characters).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.characters).toEqual([
      {
        id: "char1",
        name: "char1",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv1",
        user: {
          id: "user1",
          username: "toto",
        },
        breed: {
          id: "brd1",
          name: "Xélor",
        },
        server: {
          id: "srv1",
          name: "srv1",
          mono_account: false,
        },
      },
    ]);

    expect(mockService.getAllEnrichedByUserId).toHaveBeenCalledTimes(1);
    expect(mockService.getAllEnrichedByUserId).toHaveBeenCalledWith("user1");
  });

  it("should set error when axios error occurs", async () => {
    const user: User = { id: "user1", username: "toto" };
    const event: EventEnriched = {
      id: "event1",
      title: "Test Event",
      server: { id: "server1", name: "Server1", mono_account: false },
      characters: [
        {
          id: "char1",
          name: "char1",
          sex: "M",
          level: 50,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1QVjw",
          server_id: "srv1",
          user: {
            id: "user1",
            username: "toto",
          },
          breed: {
            id: "brd1",
            name: "Xélor",
          },
          server: {
            id: "srv1",
            name: "Rafal",
            mono_account: false,
          },
        },
      ],
      date: new Date(),
      duration: 60,
      area: undefined,
      sub_area: undefined,
      donjon_name: undefined,
      description: "",
      max_players: 5,
      status: "public",
      tag: { id: "tag1", name: "tag1", color: "#f0f" },
      comments: [],
      user: { id: "user1", username: "toto" },
    };

    const axiosError = new AxiosError("Axios error");

    const mockService = {
      getAllEnrichedByUserId: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(user, event, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.characters).toEqual([]);
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const user: User = { id: "user1", username: "toto" };
    const event: EventEnriched = {
      id: "event1",
      title: "Test Event",
      server: { id: "server1", name: "Server1", mono_account: false },
      characters: [
        {
          id: "char1",
          name: "char1",
          sex: "M",
          level: 50,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1QVjw",
          server_id: "srv1",
          user: {
            id: "user1",
            username: "toto",
          },
          breed: {
            id: "brd1",
            name: "Xélor",
          },
          server: {
            id: "srv1",
            name: "Rafal",
            mono_account: false,
          },
        },
      ],
      date: new Date(),
      duration: 60,
      area: undefined,
      sub_area: undefined,
      donjon_name: undefined,
      description: "",
      max_players: 5,
      status: "public",
      tag: { id: "tag1", name: "tag1", color: "#f0f" },
      comments: [],
      user: { id: "user1", username: "toto" },
    };

    const error = new Error("Standard error");

    const mockService = {
      getAllEnrichedByUserId: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(user, event, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.characters).toEqual([]);
    expect(result.current.error).toBe("Standard error");
  });
});
