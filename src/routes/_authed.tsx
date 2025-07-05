import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Login } from "../components/Login";
import { getSupabaseServerClient } from "../utils/supabase";

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  });

export const googleAuthFn = createServerFn({ method: "POST" })
  .validator((d: { access_token: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { data: authData, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: data.access_token,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    return {
      error: false,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        created_at: authData.user.created_at,
        updated_at: authData.user.updated_at,
      },
    };
  });

export const getSessionTokenFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    if (!session?.access_token) {
      return {
        error: true,
        message: "No session found",
      };
    }

    return {
      error: false,
      token: session.access_token,
    };
  },
);

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      return <Login />;
    }

    throw error;
  },
});
