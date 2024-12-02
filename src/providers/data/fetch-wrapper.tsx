/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLFormattedError } from "graphql";

type Error = {
  message: string;
  statusCode: string;
};
const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("access_token");

  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,
      ContenttttttType: "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

const getGraphyQLErrors = (
  body: Record<"errors", GraphQLFormattedError[]> | undefined
): Error | null => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }

  if ("errors" in body) {
    const errors = body?.errors;

    const messages = errors?.map((error) => error?.message)?.join("");

    const code = errors?.[0]?.extensions?.code as string;

    return {
      message: messages || JSON.stringify(errors),
      statusCode: code || "500",
    };
  }

  return null;
};

export async function fetchWrapper(url: string, options: RequestInit) {
  const res = await customFetch(url, options);

  const resClone = res.clone();
  const body = await resClone.json();

  const error = getGraphyQLErrors(body);

  if (error) {
    throw error;
  }

  return res;
}
