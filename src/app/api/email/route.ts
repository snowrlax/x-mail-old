import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { authenticate } from "@google-cloud/local-auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log(session, " : session");
  console.log(session.accessToken, " : session access token");

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gmail = google.gmail({ version: "v1", auth: session.accessToken });

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 2,
    });

    const messages = response.data.messages || [];
    console.log(messages, " Messages from nextAuth");
    const emailDetailsPromises = messages.map(async (message) => {
      const emailResponse = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });
      return emailResponse?.data;
    });

    const emails = await Promise.all(emailDetailsPromises);

    return NextResponse.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

// async function loadSavedCredentialsIfExist(data: any) {
//   try {
//     const content =
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }

// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }

// export async function GET(request: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.accessToken) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   console.log(session, " : sessions");

//   const gmail = google.gmail({ version: "v1", auth: session.accessToken });

//   const client = await authenticate({
//     scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
//     keyfilePath: session.accessToken,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }

//   try {
//     const response = await gmail.users.messages.list({
//       userId: "me",
//       maxResults: 2,
//     });
//     console.log(response, " : responsee");
//     const messages = response.data.messages || [];
//     console.log(messages, " : response");

//     const emailDetailsPromises = messages.map(async (message) => {
//       const emailResponse = await gmail.users.messages.get({
//         userId: "me",
//         id: message.id,
//         format: "full",
//       });
//       return emailResponse?.data;
//     });

//     const emails = await Promise.all(emailDetailsPromises);
//     return new Response(JSON.stringify(emails), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching emails:", error.response?.data || error);
//     return new Response("Failed to fetch emails", { status: 500 });
//   }
// }
