import { generateReply } from "../replyGenerationService.js";

const FORBIDDEN_ENDPOINTS = new Set([
  "/airbnb/auto-post",
  "/airbnb/send-reply",
  "/airbnb/post-reply"
]);

export function handleRepliesRequest(path, payload) {
  if (FORBIDDEN_ENDPOINTS.has(path)) {
    throw new Error("Compliance violation: automated posting endpoints are forbidden");
  }

  return generateReply(payload);
}
