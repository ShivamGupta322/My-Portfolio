/** Shared (client-safe) types for the contact form and its Server Action. */

export type ContactField = "name" | "email" | "message";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "unavailable"; mailto: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
      values?: Record<ContactField, string>;
      mailto?: string;
    };

export const INITIAL_CONTACT_STATE: ContactState = { status: "idle" };
