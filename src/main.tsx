import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'

declare global {
  interface Window {
    fbAsyncInit?: () => void
    FB?: any
  }
}

type FbUser = {
  id: string
  name: string
  email?: string
  picture?: {
    data?: {
      url?: string
    }
  }
}

const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID
const GRAPH_VERSION = import.meta.env.VITE_FACEBOOK_GRAPH_VERSION || 'v19.0'

function loadFacebookSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FB) return resolve()

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: APP_ID,
        cookie: true,
        xfbml: false,
        version: GRAPH_VERSION,
      })
      resolve()
    }

    const existedScript = document.getElementById('facebook-jssdk')
    if (existedScript) return

    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('Cannot load Facebook SDK'))
    document.body.appendChild(script)
  })
}

function App() {
  const [ready, setReady] = React.useState(false)
  const [user, setUser] = React.useState<FbUser | null>(null)
  const [accessToken, setAccessToken] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const [raw, setRaw] = React.useState<any>(null)

  React.useEffect(() => {
    loadFacebookSdk()
      .then(() => setReady(true))
      .catch((err) => setError(err.message))
  }, [])

  const loginWithFacebook = () => {
    setError('')

    if (!window.FB) {
      setError('Facebook SDK chưa sẵn sàng')
      return
    }

    window.FB.login(
      (response: any) => {
        setRaw(response)

        if (response.status !== 'connected') {
          setError('Login bị huỷ hoặc chưa cấp quyền')
          return
        }

        const token = response.authResponse.accessToken
        setAccessToken(token)

        window.FB.api(
          '/me',
          { fields: 'id,name,email,picture.width(200).height(200)' },
          (profile: FbUser & { error?: any }) => {
            if (profile.error) {
              setError(profile.error.message || 'Không lấy được profile')
              return
            }
            setUser(profile)
          }
        )
      },
      { scope: 'public_profile,email', return_scopes: true }
    )
  }

  const logout = () => {
    if (!window.FB) return
    window.FB.logout(() => {
      setUser(null)
      setAccessToken('')
      setRaw(null)
    })
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Facebook Login React Test</h1>
        <p className="muted">App ID: {APP_ID}</p>

        {!user ? (
          <button disabled={!ready} onClick={loginWithFacebook}>
            {ready ? 'Login with Facebook' : 'Loading Facebook SDK...'}
          </button>
        ) : (
          <button className="secondary" onClick={logout}>Logout</button>
        )}

        {error && <p className="error">{error}</p>}

        {user && (
          <div className="profile">
            {user.picture?.data?.url && <img src={user.picture.data.url} alt={user.name} />}
            <div>
              <h2>{user.name}</h2>
              <p>ID: {user.id}</p>
              <p>Email: {user.email || 'Không có email / chưa cấp quyền email'}</p>
            </div>
          </div>
        )}

        {accessToken && (
          <div className="box">
            <strong>Access Token</strong>
            <textarea readOnly value={accessToken} />
          </div>
        )}

        {raw && (
          <div className="box">
            <strong>Raw Login Response</strong>
            <pre>{JSON.stringify(raw, null, 2)}</pre>
          </div>
        )}
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
