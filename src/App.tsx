import { ReactNode } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
// import { useUser } from '@clerk/clerk-react'
import Home from './Pages/Home/Home'
import { getUserEmail } from "./utils/authStorage";

function App({ children }: { children: ReactNode}) {
  const user = getUserEmail()
  return (
    user ?
    <div>
      <Navbar/>
      <main className="min-h-screen bg-[#f1f1f0]">
        {children}
      </main>
    </div>
    :
    <Home/>
  )
}

export default App
