import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import Sidebar from "../SidebarApp/Sidebar"
import { useEffect } from "react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase"

function Navbar() {
  const {user} = useUser();
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

    checkAndCreateUserCollections(user?.emailAddresses[0]?.emailAddress!)
  }, [user])

  return (
    <nav className="bg-gray-800 p-5 text-white flex justify-between items-center">
      {user ? <Sidebar/>: <h1 className="text-2xl font-bold flex-[0.5]">Expense Tracker</h1>}
      {user && (<h1 className="text-lg font-semibold">{user?.firstName}'s Financial Report</h1>)}
      <div>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar