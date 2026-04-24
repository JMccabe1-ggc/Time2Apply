import supabase from "@/lib/supabase";

type AuthHeaders = Record<string, string>;

export async function getAuthHeaders(headers: AuthHeaders = {}): Promise<AuthHeaders> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  };
}
