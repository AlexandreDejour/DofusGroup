import "./Profile.scss";

import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/authContext";
import { useNotification } from "../../contexts/notificationContext";

import { UserEnriched } from "../../types/user";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { UserService } from "../../services/api/userService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const userService = new UserService(axios);

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useNotification();
  const [userEnriched, setUserEnriched] = useState<UserEnriched | null>(null);

  useEffect(() => {
    const fetchUserExtended = async () => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const response = await userService.getOneEnriched(user.id);

        setUserEnriched(response);
      } catch (error) {
        if (isAxiosError(error)) {
          showError("Erreur", error.message);
        } else if (error instanceof Error) {
          showError("Erreur", "Une erreur est survenue");
          console.error("General error:", error.message);
        }
      }
    };

    fetchUserExtended();
  }, [userEnriched]);

  return (
    <>
      {userEnriched ? (
        <main className="profile">
          <p>{userEnriched.username}</p>
        </main>
      ) : null}
    </>
  );
}
