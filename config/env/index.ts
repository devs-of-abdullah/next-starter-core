import { serverEnv } from "./server";
import { clientEnv } from "./client";

const isServer = typeof window === "undefined";

export const env = {...(isServer ? serverEnv : {}), ...clientEnv};
