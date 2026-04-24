import assert from "node:assert/strict";
import { generateReply } from "../../src/replyGenerationService.js";
import { handleRepliesRequest } from "../../src/routes/replies.js";

function shouldRejectPostedMode() {
  assert.throws(
    () => generateReply({ prompt: "Hi", actorId: "u1", conversationId: "c1", mode: "posted" }),
    /posted mode is not supported/
  );
}

function shouldLogGeneratedOnly() {
  const result = generateReply({ prompt: "Hi", actorId: "u1", conversationId: "c1" });
  assert.equal(result.auditLog.action, "generated_only");
  assert.ok(result.auditLog.timestampUtc);
}

function shouldRejectAutomatedEndpoint() {
  assert.throws(
    () => handleRepliesRequest("/airbnb/auto-post", { prompt: "Hi", actorId: "u1", conversationId: "c1" }),
    /automated posting endpoints are forbidden/
  );
}

shouldRejectPostedMode();
shouldLogGeneratedOnly();
shouldRejectAutomatedEndpoint();

console.log("compliance tests passed");
