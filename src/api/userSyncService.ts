import {userApiCalls} from "./calls/userApiCalls.ts";
import axios from "axios";

export const userSyncService = {
  getOrCreate: async (auth0User: any) => {
    try {
      return await userApiCalls.getByIdentityId();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404 && auth0User) {
        return await userApiCalls.create({
          identityId: auth0User.sub!,
          email: auth0User.email!,
          firstName: auth0User.given_name || auth0User.name || "User",
        });
      }
      throw err;
    }
  }
};
