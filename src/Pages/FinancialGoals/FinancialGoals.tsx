import { ChevronRight } from "lucide-react"
import {Dialog,DialogContent,DialogTrigger,DialogTitle} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
function FinancialGoals() {
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const [incomeTotal, setIncomeTotal] = useState(0)
  const [incomeData, setIncomeData] = useState([])

  const handleIncomeTotal = (incomeData: Array<{
    title: string;
    amount: number;
  }>) => {
    let total = 0
    for(let i in incomeData){
        total += incomeData[i]?.amount
    }
    setIncomeTotal(total)
}

const fetchIncomes = async() => {
    try {
      const userDocRef = await doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData) {
          setIncomeData(userData?.income);
          handleIncomeTotal(userData?.income)
        } else {
          console.log("No debts found.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  }

  useEffect(() => {
    fetchIncomes()
    console.log(incomeData)
  },[user])

  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Financial Goals</h1>

      <div className="mt-5 mb-9">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger onClick={() => setOpen(true)} className="w-full py-2 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">+ Add</DialogTrigger>
          <DialogContent>
            <DialogTitle className="w-full text-2xl">Add Goal</DialogTitle>

            <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold" onClick={() => {}}>Save</button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Current Details</h1>
          <h2 className="flex items-center italic underline hover:cursor-pointer">Sip Asset Allocation <ChevronRight/></h2>
        </div>
        <div className="rounded-xl bg-white py-1 px-4 text-lg">

          <div className="flex justify-between py-3">
            <h1>Amount available to invest:</h1>
            <h2>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
                    incomeTotal
                    )}</h2>
          </div>

          <div className="flex justify-between py-3 border-y-2">
            <h1>Total Monthly SIP:</h1>
            <h2>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
                    55000
                    )}</h2>
          </div>

          <div className="flex justify-between py-3">
            <h1>Amount Left:</h1>
            <h2>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
                    55000
                    )}</h2>
          </div>
        </div> 

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Your Goals:</h1>
            <h2 className="flex items-center italic underline hover:cursor-pointer">View Planned Goal Path <ChevronRight/></h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialGoals