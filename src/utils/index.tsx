import axios from "axios";
import httpClient from "../../classes/httpClient";
import { unauthorizedInstance } from "../main/network";

export const uploadFileV2 = async (
  type: "image" | "video" | "other",
  file: Uint8Array,
  file_name: string,
  token: string,
  fingerprint: string,
  isPdf = false
): Promise<{ name: string; url: string } | null> => {
  try {
    const { key, url } = await httpClient.presignedURL();
    await unauthorizedInstance.put(url, file);
    const sendPDF = await httpClient.SendSignedPDF(key, token, fingerprint);
    return sendPDF;
  } catch (err) {
    console.log(err, "err");
    return null;
  }
};
