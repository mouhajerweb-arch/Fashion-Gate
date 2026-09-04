import "server-only";

type ResendErrorResult = {
  data?: {
    id?: string;
  } | null;
  error?: {
    message?: string;
    name?: string;
  } | null;
};

export function assertResendResult(result: ResendErrorResult) {
  if (!result.error) return result.data?.id || "";

  const message = result.error.message || result.error.name || "Resend email failed";
  throw new Error(message);
}
