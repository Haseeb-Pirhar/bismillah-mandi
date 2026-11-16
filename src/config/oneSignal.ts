// OneSignal Push Notification Service
import axios from "axios";

import { LOGUI } from "@/constants";
import { ONESIGNAL } from "@/constants/env";
import { Settings } from "@/modules/setting/settings";

const getOneSignalConfig = async () => {
  const config = await Settings.findOne();
  return {
    apiKey: config?.oneSignal?.oneSignalApiKey || ONESIGNAL.API_KEY,
    appId: config?.oneSignal?.oneSignalAppId || ONESIGNAL.APP_ID,
  };
};

export const checkPlayerSubscription = async (playerId: string) => {
  const { apiKey, appId } = await getOneSignalConfig();
  if (!apiKey || !appId) {
    console.log(LOGUI.FgRed, "OneSignal API key or App ID is not configured");
    return false;
  }

  try {
    console.log("Checking player:", playerId);
    const response = await axios.get(
      `https://onesignal.com/api/v1/players/${playerId}?app_id=${appId}`,
      {
        headers: {
          Authorization: `Basic ${apiKey}`,
        },
      },
    );
    console.log("Player data:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(LOGUI.FgRed, "OneSignal API Error:", {
        status: error.response.status,
        data: error.response.data,
        playerId,
      });
    } else {
      console.log(LOGUI.FgRed, "Network Error:", error.message);
    }
    return false;
  }
};

export const sendNotification = async ({
  title = "New Notification",
  message = "New Notification Message",
  data = {},
  playerIds = [],
}: {
  title?: string;
  message?: string;
  data?: Record<string, any>;
  playerIds: string[];
}) => {
  const { apiKey, appId } = await getOneSignalConfig();
  if (!apiKey || !appId) {
    console.log(LOGUI.FgRed, "OneSignal API key or App ID is not configured.");
    return;
  }
  if (!playerIds.length) {
    console.log(LOGUI.FgRed, "No playerIds provided for notification.");
    return;
  }

  const body = {
    app_id: appId,
    include_player_ids: playerIds,
    headings: { en: title },
    contents: { en: message },
    data,
  };

  try {
    console.log(apiKey, "ONESIGNAL.API_KEY");
    console.log(appId, "ONESIGNAL.APP_ID");
    console.log(playerIds, "validPlayerIds");
    console.log(title, "title");
    console.log(message, "message");
    console.log(data, "data");
    const response = await axios.post("https://onesignal.com/api/v1/notifications", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
    });
    return {
      success: true,
      result: response.data,
      playerIds,
      title,
      notification: message,
      data,
    };
  } catch (error: any) {
    console.log(
      LOGUI.FgRed,
      error.response?.data?.errors || error.message || "Failed to send OneSignal notification",
    );
  }
};
