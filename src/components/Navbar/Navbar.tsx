import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import Sidebar from "../SidebarApp/Sidebar"
import { useEffect } from "react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase"
import { Link } from "react-router";
import { Button } from "../ui/button";

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
              "portfolio_recipe": {
                "long_term": {
                  "Equity": "",
                  "Real_estate": "",
                  "Debt": "",
                  "Gold": "",
                  "Crypto": "",
                  "International": ""
                },
                "medium_term": {
                  "Equity": "",
                  "Real_estate": "",
                  "Debt": "",
                  "Gold": "",
                  "Crypto": "",
                  "International": ""
                },
                "short_term": {
                  "Equity": "",
                  "Real_estate": "",
                  "Debt": "",
                  "Gold": "",
                  "Crypto": "",
                  "International": ""
                }
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
              "Liabilities": []
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
      {/* <div> */}
        {user &&
        (<h1 className="text-lg font-semibold">{user?.firstName}'s Financial Report</h1>)}
      {/* </div> */}
    {
      user ? 
      <div>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
      :
      <div className="flex-[0.5] flex justify-end">
        <Button className="text-center mr-4 bg-white text-gray-800 hover:bg-black hover:text-white">
          <Link
            to="/sign-in"
            className="uppercase"
          >
            Sign In
          </Link>
        </Button>
          
        <Button className="text-center bg-white text-gray-800 hover:bg-black hover:text-white">
          <Link
            to="/sign-up"
            className="uppercase"
          >
            Sign Up
          </Link>
        </Button>
      </div>
    }
    </nav>
  )
}

export default Navbar