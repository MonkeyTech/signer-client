import axios from "axios";
import httpClient from "../../classes/httpClient";
import { unauthorizedInstance } from "../main/network";

export const uploadFileV2 = async (
  type: "image" | "video" | "other",
  file: Uint8Array,
  file_name: string,
  isPdf = false
): Promise<{ name: string; url: string } | null> => {
  const dto = { type, file_name };
  try {
    const { key, url } = await httpClient.presignedURL();
    await unauthorizedInstance.put(url, file);

    let name = file_name;
    const indexOfDot = file_name.lastIndexOf(".");
    if (indexOfDot) {
      name = file_name.slice(0, indexOfDot);
    }

    return key;
  } catch {
    return null;
  }
};
