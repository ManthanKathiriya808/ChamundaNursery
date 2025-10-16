import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import EnhancedHeader from './components/EnhancedHeader'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import PageTransition, { LayoutTransition } from './components/transitions/PageTransition'
import { ClerkLoadingSpinner } from './providers/ClerkProvider'

function App() {
  return (
    <LayoutTransition className="min-h-screen flex flex-col overflow-x-hidden">
      <EnhancedHeader />
      <CartDrawer />
      <main className="flex-grow overflow-x-hidden pt-[120px]"> {/* Add padding-top for fixed header */}
        <Suspense fallback={<ClerkLoadingSpinner />}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>
      <Footer />
    </LayoutTransition>
  )
}

export default App