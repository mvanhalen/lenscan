import type { definitions } from "@/types/generated-types";

import { PostgrestClient } from "@supabase/postgrest-js";

// Create a single postgrest client for interacting with database
// const postgrest = new PostgrestClient<definitions>("https://api.lenscan.io");
const postgrest = new PostgrestClient<definitions>("http://localhost:3000");

export const db = {
  Events: (start: number, end: number) =>
    postgrest
      .from("Event")
      .select("*", { count: "planned" })
      .order("id", { ascending: false })
      .range(start, end),

  Event: (id: number) =>
    postgrest.from("Event").select("*").eq("id", id).single(),

  EventsByProfileId: (profileId: string, start: number, end: number) =>
    postgrest
      .from("Event")
      .select("*", { count: "planned" })
      .eq("data->>ProfileId", profileId)
      .order("id", { ascending: false })
      .range(start, end),

  Publications: (start: number, end: number) =>
    postgrest
      .from("Event")
      .select("*", { count: "planned" })
      .in("type", ["PostCreated", "CommentCreated", "MirrorCreated"])
      .order("id", { ascending: false })
      .range(start, end),
};

export default postgrest;