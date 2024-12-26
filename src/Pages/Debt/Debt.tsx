import { Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle} from "@/components/ui/dialog"
import { ReactNode, useEffect, useState } from "react"
import { Pen, Trash2 } from "lucide-react"
import { db } from "../../firebase"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";

interface debtCategoryEntries {
  title: string;
  amount: number;
  type: string;
  index: number;
}

type dataObject = {
  [key: string]: debtCategoryEntries[]
}

type fetchedData = {
  title: string;
  amount: number;
  type: string
};

function Debt() {
  const debtTypes = ["Choose Category", "Debt MFs", "Bonds", "FD", "Government Securities", "Savings Acc Balance"]
  const initialDataObject: dataObject = {
    "Debt MFs": [], 
    "Bonds": [], 
    "FD": [], 
    "Government Securities": [], 
    "Savings Acc Balance": []
  }
  const initialFetchObjectsArray: fetchedData[] = []
  const [open, setOpen] = useState(false)
  const [debtName, setDebtName] = useState("")
  const [debtType, setDebtType] = useState("")
  const [debtValue, setDebtValue] = useState(0)
  const [fetchedDebtData, setFetchedDebtData] = useState(initialFetchObjectsArray)
  const [debtData, setDebtData] = useState(initialDataObject)
  const [debtTotalPrice, setDebtTotalPrice] = useState(0)
  const { user } = useUser()

  const dataStructureChange = () => {
    const newStucturedData: dataObject = {
      "Debt MFs": [], 
      "Bonds": [], 
      "FD": [], 
      "Government Securities": [], 
      "Savings Acc Balance": []
    }

    const debt_mfs = []
    const bonds = []
    const fds = []
    const gsecs = []
    const saving = []
    for(let i in fetchedDebtData) {
      if(fetchedDebtData[i].type === "Debt MFs"){
        debt_mfs.push({index: Number(i), ...fetchedDebtData[i]})
      } else if(fetchedDebtData[i].type === "Bonds") {
        bonds.push({ index: Number(i), ...fetchedDebtData[i]})
      } else if(fetchedDebtData[i].type === "FD") {
        fds.push({ index: Number(i), ...fetchedDebtData[i]})
      } else if(fetchedDebtData[i].type === "Government Securities") {
        gsecs.push({ index: Number(i), ...fetchedDebtData[i]})
      } else {
        saving.push({ index: Number(i), ...fetchedDebtData[i]})
      }
    }
    newStucturedData["Debt MFs"].push(...debt_mfs)
    newStucturedData.Bonds.push(...bonds)
    newStucturedData.FD.push(...fds)
    newStucturedData["Government Securities"].push(...gsecs)
    newStucturedData["Savings Acc Balance"].push(...saving)

    setDebtData(newStucturedData)
  }

  const handleDebtTotal = (debtData: Array<{
    title: string;
    type: string;
    amount: number
  }>) => {
    let total = 0
    for(let i in debtData){
        total += debtData[i]?.amount
    }
    setDebtTotalPrice(total)
  }

  const fetchDebts = async() => {
    try {
      const userDocRef = await doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData) {
          setFetchedDebtData(userData?.Debt);
          dataStructureChange()
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

  const addData = async(type: string, name: string, value: number) => {
    try{
      const docRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!);
      await updateDoc(docRef, {
        Debt: arrayUnion(
          {
            title: name,
            amount: value,
            type: type
          }
        )
      });
    } catch (e: any){
        console.log(e)
    }
  }

  useEffect(() => {
    fetchDebts()
    dataStructureChange()
  }, [user])

  useEffect(() => {
    handleDebtTotal(fetchedDebtData)
    dataStructureChange()
  }, [fetchedDebtData])

  const handleDataSubmit = () => {
    if(debtType === null || debtType === "" || debtName === null || debtName === "" || 
      debtValue === null || debtValue === 0 || debtType === "Choose Category") {
      alert("Please fill all the fields")
    }
    else {
      addData(debtType, debtName, debtValue)
      fetchDebts()
      handleDebtTotal(fetchedDebtData)
      setDebtName("")
      setDebtType("")
      setDebtValue(0)
      setOpen(false)
    }
  }

  const handleDeleteDebt = async (index: number) => {
    const debtRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!)
    let newdebtData: fetchedData[] = []
    for(let i in fetchedDebtData){
      if(i !== String(index)){
        newdebtData.push(fetchedDebtData[i])
      }
    }
    await updateDoc(debtRef, {
      Debt: newdebtData
    });
    fetchDebts()
  }

  const handleEditDebt = (index:number, type:string, title:string, amount: number) => {
    setOpen(true)
    setDebtName(title)
    setDebtType(type)
    setDebtValue(amount)
    handleDeleteDebt(index)
  }

  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Debt</h1>
      <div className="pt-7 flex justify-between items-center">
        <div className="flex-[0.75]">
          <div className="text-xl pb-2 text-gray-500 font-semibold">
            Total Value:
          </div>
          <div className="text-2xl font-semibold">
            {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(debtTotalPrice)}
          </div>
        </div>
        <div className="flex-[0.25]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} className="w-full py-4 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">+ Add</DialogTrigger>
            <DialogContent>
              <DialogTitle className="w-full text-2xl">Add Debt</DialogTitle>
              <label htmlFor="classification" className="text-lg font-semibold text-gray-500">Classification</label>
              <select name="debts" id="classification" className="outline-none border border-black p-3 rounded-xl" required value={debtType} onChange={(e) => setDebtType(e?.target?.value)}>
                {debtTypes.map((debt, key) => (
                  <option key={key} value={debt}>{debt}</option>
                ))}
              </select>

              <label htmlFor="debt-name" className="text-lg font-semibold text-gray-500">Debt Name</label>
              <input type="text" id="debt-name" placeholder="Debt Name" className="outline-none border border-black p-3 rounded-xl" required value={debtName} onChange={(e) => setDebtName(e?.target?.value)}/>

              <label htmlFor="price" className="text-lg font-semibold text-gray-500">Price</label>
              <input type="number" id="price" placeholder="Price" min="0" className="outline-none border border-black p-3 rounded-xl" required value={debtValue} onChange={(e) => setDebtValue(Number(e?.target?.value))}/>

              <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold" onClick={() => handleDataSubmit()}>
                Save
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* debt table */}
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {
        ["Debt MFs", "Bonds", "FD", "Government Securities", "Savings Acc Balance"].map((type, index) => (
          <DebtTableWrapper key={index} title={type}>
            {debtData[type].map((test, index) => (
              <DebtCard 
                key={index} 
                title={test?.title} 
                index={test?.index} 
                amount={test?.amount}
                type={test?.type} 
                handleDeleteDebt={handleDeleteDebt}
                handleEditDebt={handleEditDebt}
              />
            ))}
          </DebtTableWrapper>
        ))
        }
      </div>
    </div>
  )
}

export default Debt

function DebtTableWrapper({ children, title }: { children : ReactNode, title: string}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl h-[275px] overflow-y-scroll scrollbar-thin">
      <h1 className="text-xl font-semibold">
        { title }
      </h1>
      <div className="grid grid-cols-1 gap-3 mt-2">
        { children }
      </div>
    </div>
  )
}

function DebtCard({ title, index, amount, type, handleDeleteDebt, handleEditDebt}: {
  title: string,
  index: number,
  amount: number,
  type: string,
  handleDeleteDebt: Function,
  handleEditDebt: Function
}) {
  return(
  <div className="bg-gray-50 p-4 rounded-xl border border-black flex flex-col justify-between">
    <div className="text-xl font-semibold pt-2 pb-3 w-full">{title}</div>
    <div className="text-xl font-semibold pt-2 pb-3">
      <div className="text-gray-600 text-sm">Amount</div>
      <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(amount)}</div>
    </div>
    <div className="flex justify-between items-center mt-3">
      <button className="text-red-400 hover:text-red-600 w-[40%] p-2 rounded-3xl border-red-400 hover:border-red-600 border-2" 
      onClick={async () => await handleDeleteDebt(index)}
      ><Trash2 className="text-center w-full"/></button>
      <button className="text-blue-400 hover:text-blue-600 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-600 border-2" 
      onClick={async() => await handleEditDebt(index, type, title, amount)}
      >
        <Pen className="text-center w-full"/>
      </button>
    </div>
  </div>
  )
}