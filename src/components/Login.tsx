import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { useMutation } from '../hooks/useMutation'
import { loginFn, googleAuthFn } from '../routes/_authed'
import { signupFn } from '../routes/signup'
import { Auth } from './Auth'
import { initializeGoogleSignIn, renderGoogleSignInButton } from '../utils/google-auth'

export function Login() {
  const router = useRouter()
  const [googleError, setGoogleError] = useState<string | null>(null)

  const loginMutation = useMutation({
    fn: loginFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        await router.invalidate()
        router.navigate({ to: '/' })
        return
      }
    },
  })

  const googleAuthMutation = useMutation({
    fn: googleAuthFn,
    onSuccess: async (ctx) => {
      debugger;
      if (!ctx.data?.error) {
        await router.invalidate()
        router.navigate({ to: '/' })
        return
      } else {
        setGoogleError(ctx.data.message || 'Authentication failed')
      }
    },
  })

  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  })

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    // Wait for Google script to load
    const checkGoogleLoaded = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        initializeGoogleSignIn(
          googleAuthMutation,
          (user) => {
            console.log('Google Sign-In successful:', user)
          },
          (error) => {
            console.error('Google Sign-In error:', error)
            setGoogleError(error)
          }
        )
        renderGoogleSignInButton('google-signin-button')
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100)
      }
    }
    
    checkGoogleLoaded()
  }, [googleAuthMutation])

  return (
    <div className="space-y-6">
      <Auth
        actionText="Login"
        status={loginMutation.status}
        onSubmit={(e) => {
          const formData = new FormData(e.target as HTMLFormElement)

          loginMutation.mutate({
            data: {
              email: formData.get('email') as string,
              password: formData.get('password') as string,
            },
          })
        }}
        afterSubmit={
          loginMutation.data ? (
            <>
              <div className="text-red-400">{loginMutation.data.message}</div>
              {loginMutation.data.error &&
              loginMutation.data.message === 'Invalid login credentials' ? (
                <div>
                  <button
                    className="text-blue-500"
                    onClick={(e) => {
                      const formData = new FormData(
                        (e.target as HTMLButtonElement).form!,
                      )

                      signupMutation.mutate({
                        data: {
                          email: formData.get('email') as string,
                          password: formData.get('password') as string,
                        },
                      })
                    }}
                    type="button"
                  >
                    Sign up instead?
                  </button>
                </div>
              ) : null}
            </>
          ) : null
        }
      />
      
      {/* Google Sign-In Section */}
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div id="google-signin-button"></div>
        {googleError && (
          <div className="text-red-400 text-sm">{googleError}</div>
        )}
        {googleAuthMutation.status === 'pending' && (
          <div className="text-blue-400 text-sm">Signing in...</div>
        )}
      </div>
    </div>
  )
}
