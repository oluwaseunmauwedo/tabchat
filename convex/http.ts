import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { authComponent , createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

export default http;
