import { treaty } from "@elysiajs/eden";
import type { Api } from "@/app/api/[[...slugs]]/route";

const baseUrl = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const apiClient = treaty<Api>(baseUrl);
