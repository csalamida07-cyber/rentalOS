export function generateReply({ prompt, actorId, conversationId, mode = "generated_only" }) {
  if (mode !== "generated_only") {
    throw new Error("Compliance violation: posted mode is not supported");
  }

  const draft = `Draft reply: ${prompt}`;
  const auditLog = {
    action: "generated_only",
    actorId,
    conversationId,
    timestampUtc: new Date().toISOString()
  };

  return { draft, auditLog };
}
