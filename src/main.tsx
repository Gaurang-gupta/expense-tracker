import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import IncomeExpense from './Pages/IncomeExpense/IncomeExpense.tsx'
import IndianStocks from './Pages/IndianStocks/IndianStocks.tsx'
import Home from './Pages/Home/Home.tsx'
import PortfolioRecipe from './Pages/PortfolioRecipe/PortfolioRecipe.tsx'
import EquityMFs from './Pages/EquityMFs/EquityMFs.tsx'
import RealEstate from './Pages/RealEstate/RealEstate.tsx'
import International from './Pages/International/International.tsx'
import Insurance from './Pages/Insurance/Insurance.tsx'
import Debt from './Pages/Debt/Debt.tsx'
import Gold from './Pages/Gold/Gold.tsx'
import Crypto from './Pages/Crypto/Crypto.tsx'
import Liabilities from './Pages/Liabilities/Liabilities.tsx'
import SignInPage from './Pages/SignInPage/SignInPage.tsx'
import SignUpPage from './Pages/SignUpPage/SignUpPage.tsx'
import ErrorPage from './Pages/ErrorPage/ErrorPage.tsx'
import Tracker from './Pages/Tracker/Tracker.tsx'
import ChatAI from './Pages/ChatAI/ChatAI.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
        <Routes>
          <Route
            path='/sign-in'
            element={
              <SignInPage/>
            }
          />
          <Route
            path='/sign-up'
            element={
              <SignUpPage/>
            }
          />
          <Route 
            path='/' 
            element={<App children={<Home/>}/>}
          />
          <Route
            path='/portfolio-recipe'
            element={<App children={<PortfolioRecipe/>}/>}
          />
          <Route 
            path="/income-expense" 
            element={<App children={<IncomeExpense/>}/>}
          />
          <Route
            path="/tracker"
            element={<App children={<Tracker/>}/>}
          />
          <Route
            path='/chat_with_ai'
            element={<App children={<ChatAI/>}/>}
          />
          <Route
            path='/indian-stocks'
            element={<App children={<IndianStocks/>}/>}
          />
          <Route
            path='/equity-mfs'
            element={<App children={<EquityMFs/>}/>}
          />
          <Route
            path='/real-estate'
            element={<App children={<RealEstate/>}/>}
          />
          <Route
            path='/international'
            element={<App children={<International/>}/>}
          />
          <Route
            path='/insurance'
            element={<App children={<Insurance/>}/>}
          />
          <Route
            path='/debt'
            element={<App children={<Debt/>}/>}
          />
          <Route
            path='/gold'
            element={<App children={<Gold/>}/>}
          />
          <Route
            path='/crypto'
            element={<App children={<Crypto/>}/>}
          />
          <Route
            path='/liabilities'
            element={<App children={<Liabilities/>}/>}
          />
          <Route 
            path='*' 
            element={<ErrorPage/>}
          />
        </Routes>
    </StrictMode>
  </BrowserRouter>
)
