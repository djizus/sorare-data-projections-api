export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
        <p>You must be a member of our Discord server to access this application.</p>
        <a 
          href="https://discord.gg/YOUR_INVITE_LINK"
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join our Discord Server
        </a>
      </div>
    </div>
  )
} 