import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { ReactQueryProvider } from './lib/react-query'
import { router } from './router'

// Initialize MSW in development
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ReactQueryProvider>
        <Suspense
          fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
        >
          <RouterProvider router={router} />
        </Suspense>
      </ReactQueryProvider>
    </StrictMode>
  )
})
