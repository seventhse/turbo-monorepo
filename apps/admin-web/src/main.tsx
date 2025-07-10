import { Button } from '@vi-space/common-ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="max-w-screen min-h-screen max-h-screen overflow-hidden bg-gray-300">
      <div className="m-10">
        <Button variant="default">Button</Button>
      </div>
    </div>
  </StrictMode>,
)
