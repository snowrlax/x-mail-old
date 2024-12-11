import { google } from "googleapis";

export const getGmailClient = (accessToken: string) => {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: "v1", auth: oAuth2Client });
};
