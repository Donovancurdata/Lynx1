import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { IntelligentAgentPage } from './pages/IntelligentAgentPage'
import { TraditionalAnalysisPage } from './pages/TraditionalAnalysisPage'
import { TaxCalculationsPage } from './pages/TaxCalculationsPage'
import { DocumentationPage } from './pages/DocumentationPage'
import { AboutPage } from './pages/AboutPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/intelligent-agent" element={<IntelligentAgentPage />} />
        <Route path="/traditional-analysis" element={<TraditionalAnalysisPage />} />
        <Route path="/tax-calculations" element={<TaxCalculationsPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
