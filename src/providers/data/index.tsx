import dataProvider, {
  GraphQLClient,
  liveProvider as graphyqlLiveProvider,
} from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

const API_URL = "https://api.crm.refine.dev";
const API_BASE_URL = "https://api.crm.refine.dev";
const WS_URL = `wss://api.crm.refine.dev/graphyql`;

export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

export const graphyqlDataProvider = dataProvider(client);
export const liveProvider = wsClient
  ? graphyqlLiveProvider(wsClient)
  : undefined;
