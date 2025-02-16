import Sidebar from "../SidebarApp/Sidebar"
import { useEffect } from "react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase"
import { useNavigate } from "react-router";
import { getUserEmail, getDisplayName, getPhotoUrl, clearUserEmail, clearPhotoUrl, clearDisplayName } from "../../utils/authStorage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

function Navbar() {
  const user = getUserEmail()
  const displayName = getDisplayName()
  const photoUrl = getPhotoUrl()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearUserEmail()
    clearPhotoUrl()
    clearDisplayName()
    navigate("/")
  }

  useEffect(() => {
    const checkAndCreateUserCollections = async (email: string) => {
      try{
        const userDocRef = doc(db, 'users', email);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, 
            {
              "long_term": {
                "Equity": 50,
                "Real_estate": 10,
                "Debt": 20,
                "Gold": 10,
                "Crypto": 5,
                "International": 5
              },
              "medium_term": {
                "Equity": 30,
                "Real_estate": 0,
                "Debt": 50,
                "Gold": 20,
                "Crypto": 0,
                "International": 0
              },
              "short_term": {
                "Equity": 0,
                "Real_estate": 0,
                "Debt": 100,
                "Gold": 0,
                "Crypto": 0,
                "International": 0
              },
              "expected_returns": {
                "Equity": 14,
                "Real_estate": 8,
                "Debt": 8,
                "Gold": 10,
                "Crypto": 20,
                "International": 10
              },
              "income": [],
              "expense": [],
              "indian_stocks": [],
              "Equity_MFs": [],
              "Real_estate": [],
              "international": [],
              "Insurance": [],
              "Debt": [],
              "Gold": [],
              "Crypto": [],
              "Liabilities": [],
              "all_expenses": [],
            }
          );
        }
      } catch (e: any) {
        console.log(e)
      }
    };

    checkAndCreateUserCollections(user)
  }, [user])

  return (
    <>
    <nav className="bg-gray-800 p-5 text-white flex justify-between items-center">
      {user ? <Sidebar/>: <h1 className="text-2xl font-bold flex-[0.5]">Expense Tracker</h1>}
      {user && (<h1 className="text-lg font-semibold">{displayName}'s Financial Report</h1>)}
      <div className="rounded-full hover:cursor-pointer" onClick={handleLogout}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><img className="rounded-full h-10 w-10" src={photoUrl === "" ? "./default.jpg" : photoUrl} alt="user's photo icon"/></TooltipTrigger>
            <TooltipContent>
              <p className="text-lg">Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </nav>
    </>
  )
}

export default Navbar