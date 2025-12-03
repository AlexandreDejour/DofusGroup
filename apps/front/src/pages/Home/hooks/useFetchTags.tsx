import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Tag } from "../../../types/tag";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { TagService } from "../../../services/api/tagService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const tagService = new TagService(axios);

export default function useFetchTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tagsData = await tagService.getTags();

        setTags(tagsData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, isLoading, error };
}
