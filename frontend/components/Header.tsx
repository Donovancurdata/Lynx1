'use client'

import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">LYNX</span>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gradient">LYNX</span>
            </div>
          </a>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-secondary-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-sm font-semibold leading-6 text-secondary-900">
            Dashboard
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-secondary-600 hover:text-secondary-900">
            Documentation
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-secondary-600 hover:text-secondary-900">
            API
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-secondary-600 hover:text-secondary-900">
            About
          </a>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-secondary-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-secondary-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">LYNX</span>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">L</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gradient">LYNX</span>
                </div>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-secondary-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-secondary-500/10">
                <div className="space-y-2 py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-secondary-900 hover:bg-secondary-50"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-secondary-600 hover:bg-secondary-50"
                  >
                    Documentation
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-secondary-600 hover:bg-secondary-50"
                  >
                    API
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-secondary-600 hover:bg-secondary-50"
                  >
                    About
                  </a>
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-secondary-900 hover:bg-secondary-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 