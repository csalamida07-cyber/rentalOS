/**
 * Compliance guard: outbound behavior is only permitted on explicit user action.
 */
export function assertUserInitiatedOutbound(event, intent) {
  if (!event || event.isTrusted !== true) {
    throw new Error("Blocked outbound operation: non-user initiated event");
  }

  if (intent !== "user_requested_generation") {
    throw new Error("Blocked outbound operation: unsupported intent");
  }

  return true;
}

/**
 * Safety helper for UI wiring.
 */
export function withUserInitiation(event, intent, callback) {
  assertUserInitiatedOutbound(event, intent);
  return callback();
}
