import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-slate-200 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                 <div className="flex lg:flex-1">
           <Link to="/" className="-m-1.5 p-1.5 group">
            <span className="sr-only">LYNX</span>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-lg transition-all duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="ml-3 text-2xl font-bold text-gradient">LYNX</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
                 <div className="hidden lg:flex lg:gap-x-8">
           <Link to="/intelligent-agent" className="text-sm font-semibold leading-6 text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
             Intelligent Agent
           </Link>
           <Link to="/traditional-analysis" className="text-sm font-semibold leading-6 text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
             Analysis
           </Link>
           <Link to="/tax-calculations" className="text-sm font-semibold leading-6 text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
             Tax Calculator
           </Link>
           <Link to="/documentation" className="text-sm font-semibold leading-6 text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
             Documentation
           </Link>
           <Link to="/about" className="text-sm font-semibold leading-6 text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
             About
           </Link>
         </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="btn-outline text-sm">
            Log in <span aria-hidden="true" className="ml-1">→</span>
          </a>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white/95 backdrop-blur-sm px-6 py-6 sm:max-w-sm shadow-2xl">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">LYNX</span>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-medium">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-2xl font-bold text-gradient">LYNX</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-slate-200">
                                 <div className="space-y-2 py-6">
                   <Link
                     to="/intelligent-agent"
                     className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-slate-600 hover:bg-slate-50 transition-colors"
                   >
                     Intelligent Agent
                   </Link>
                   <Link
                     to="/traditional-analysis"
                     className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-slate-600 hover:bg-slate-50 transition-colors"
                   >
                     Analysis
                   </Link>
                   <Link
                     to="/tax-calculations"
                     className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-slate-600 hover:bg-slate-50 transition-colors"
                   >
                     Tax Calculator
                   </Link>
                   <Link
                     to="/documentation"
                     className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-slate-600 hover:bg-slate-50 transition-colors"
                   >
                     Documentation
                   </Link>
                   <Link
                     to="/about"
                     className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-slate-600 hover:bg-slate-50 transition-colors"
                   >
                     About
                   </Link>
                 </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="btn-outline block text-center"
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