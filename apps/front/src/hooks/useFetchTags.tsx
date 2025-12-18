import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Tag } from "../types/tag";

import { tagService, TagService } from "../services/api/tagService";

export default function useFetchTags(service: TagService = tagService) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tagsData = await service.getTags();

        setTags(tagsData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [service]);

  return { tags, isLoading, error };
}
