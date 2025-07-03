/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import * as Sentry from "@sentry/react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import { NotFound } from "../components/NotFound";
import appCss from "../styles/app.css?url";
import { seo } from "../utils/seo";
import { getSupabaseServerClient } from "../utils/supabase";
import { StickyHeader } from "~/components/StickyHeader";
import { Footer } from "~/components/Footer";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE
    ? parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE)
    : 1.0,
  environment: import.meta.env.VITE_ENVIRONMENT,
  sendDefaultPii: true,
  tracePropagationTargets: import.meta.env.VITE_SENTRY_TRACE_PROPAGATION_TARGETS
    ? import.meta.env.VITE_SENTRY_TRACE_PROPAGATION_TARGETS.split(",")
    : ["localhost", "movie-thresh-server.vercel.app"],
});

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (!authData.user?.email) {
    return null;
  }

  // Fetch user profile data
  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    // Return basic auth data if profile fetch fails
    return {
      id: authData.user.id,
      email: authData.user.email,
      full_name: null,
      avatar_url: null,
      preferences: {},
      created_at: authData.user.created_at,
      updated_at: authData.user.updated_at,
    };
  }

  return {
    id: profileData.id,
    email: profileData.email,
    full_name: profileData.full_name,
    avatar_url: profileData.avatar_url,
    preferences: profileData.preferences || {},
    created_at: profileData.created_at,
    updated_at: profileData.updated_at,
  };
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "view-transition",
        content: "same-origin",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: [
      {
        src: "https://accounts.google.com/gsi/client",
        async: true,
      },
      {
        src: "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js",
      },
    ],
  }),
  beforeLoad: async () => {
    const user = await fetchUser();

    return {
      user,
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            refetchOnWindowFocus: true,
            refetchOnReconnect: "always",
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen flex flex-col">
        <StickyHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
