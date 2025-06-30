// Google Auth configuration and utilities
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Google Sign-In configuration
export const createGoogleSignInConfig = (googleAuthMutation: any, onSuccess?: (user: any) => void, onError?: (error: string) => void) => ({
  client_id: GOOGLE_CLIENT_ID,
  callback: async (response: any) => {
    console.log('Google Sign-In response:', response)
    
    // Use the mutation to call the server function
    googleAuthMutation.mutate({
      data: {
        access_token: response.credential,
      },
    })
  },
  auto_select: false,
  cancel_on_tap_outside: true,
})

// Initialize Google Sign-In
export const initializeGoogleSignIn = (googleAuthMutation: any, onSuccess?: (user: any) => void, onError?: (error: string) => void) => {
  if (typeof window !== 'undefined' && window.google?.accounts?.id) {
    const config = createGoogleSignInConfig(googleAuthMutation, onSuccess, onError)
    window.google.accounts.id.initialize(config)
  }
}

// Render Google Sign-In button
export const renderGoogleSignInButton = (elementId: string) => {
  if (typeof window !== 'undefined' && window.google?.accounts?.id) {
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      }
    )
  }
}

// Prompt for Google Sign-In
export const promptGoogleSignIn = () => {
  if (typeof window !== 'undefined' && window.google?.accounts?.id) {
    window.google.accounts.id.prompt()
  }
}

// Sign out from Google
export const signOutGoogle = () => {
  if (typeof window !== 'undefined' && window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect()
  }
}

// Type definitions for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement | null, options: any) => void
          prompt: () => void
          disableAutoSelect: () => void
        }
      }
    }
  }
} 