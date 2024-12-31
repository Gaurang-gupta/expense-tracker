import { Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle} from "@/components/ui/dialog"
import { useState, useEffect, ReactNode } from "react"
import { Trash2, Pen } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface insuranceCategoryEntries {
  title: string;
  amount: number;
  type: string;
  index: number;
}

type dataObject = {
  [key: string]: insuranceCategoryEntries[]
}

type fetchedData = {
  title: string;
  amount: number;
  type: string
};

function Insurance() {
  const insuranceOptions = ["Choose Category", "ULIPS", "Moneyback","Endowment", "Income Guarantee"]
  const initialDataObject: dataObject = {
    "ULIPS": [], 
    "Moneyback": [], 
    "Endowment": [], 
    "Income Guarantee": []
  }
  const initialFetchObjectsArray: fetchedData[] = []
  const [open, setOpen] = useState(false)
  const [insuranceType, setInsuranceType] = useState("")
  const [insuranceName, setInsuranceName] = useState("")
  const [insurancePrice, setInsurancePrice] = useState(0)
  const [fetchedInsuranceData, setFetchedInsuranceData] = useState(initialFetchObjectsArray)
  const [insuranceData, setInsuranceData] = useState(initialDataObject)
  const [insuranceTotalPrice, setInsuranceTotalPrice ] = useState(0)

  const { user } = useUser()

  const dataStructureChange = () => {
    const newStucturedData: dataObject = {
      "ULIPS": [], 
      "Moneyback": [], 
      "Endowment": [], 
      "Income Guarantee": []
    }

    const ulips = []
    const moneyback = []
    const endowment = []
    const income_guarantee = []
    for(let i in fetchedInsuranceData) {
      if(fetchedInsuranceData[i].type === "ULIPS"){
        ulips.push({index: Number(i), ...fetchedInsuranceData[i]})
      } else if(fetchedInsuranceData[i].type === "Moneyback") {
        moneyback.push({ index: Number(i), ...fetchedInsuranceData[i]})
      } else if(fetchedInsuranceData[i].type === "Endowment") {
        endowment.push({ index: Number(i), ...fetchedInsuranceData[i]})
      } else {
        income_guarantee.push({ index: Number(i), ...fetchedInsuranceData[i]})
      }
    }
    newStucturedData.ULIPS.push(...ulips)
    newStucturedData.Endowment.push(...endowment)
    newStucturedData.Moneyback.push(...moneyback)
    newStucturedData["Income Guarantee"].push(...income_guarantee)

    setInsuranceData(newStucturedData)
  }

  const fetchInsurances = async() => {
    try {
      const userDocRef = await doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData) {
          setFetchedInsuranceData(userData?.Insurance);
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
        Insurance: arrayUnion(
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

  const handleInsuranceTotal = (insuranceData: Array<{
    title: string;
    type: string;
    amount: number
  }>) => {
    let total = 0
    for(let i in insuranceData){
        total += insuranceData[i]?.amount
    }
    setInsuranceTotalPrice(total)
  }

  
  useEffect(() => {
    fetchInsurances()
    dataStructureChange()
  }, [user])

  useEffect(() => {
    handleInsuranceTotal(fetchedInsuranceData)
    dataStructureChange()
  }, [fetchedInsuranceData])

  const handleDataSubmit = () => {
    if(insuranceType === null || insuranceType === "" || insuranceName === null || insuranceName === "" || 
      insurancePrice === null || insurancePrice === 0 || insuranceType === "Choose Category") {
      alert("Please fill all the fields")
    }
    else {
      addData(insuranceType, insuranceName, insurancePrice)
      fetchInsurances()
      handleInsuranceTotal(fetchedInsuranceData)
      setInsuranceName("")
      setInsuranceType("")
      setInsurancePrice(0)
      setOpen(false)
    }
  }

  const handleDeleteInsurance = async(index: number) => {
    const debtRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!)
    let newInsuranceData: fetchedData[] = []
    for(let i in fetchedInsuranceData){
      if(i !== String(index)){
        newInsuranceData.push(fetchedInsuranceData[i])
      }
    }
    await updateDoc(debtRef, {
      Insurance: newInsuranceData
    });
    fetchInsurances()
  }

  const handleEditInsurance = (index:number, type:string, title:string, amount: number) => {
    setOpen(true)
    setInsuranceName(title)
    setInsuranceType(type)
    setInsurancePrice(amount)
    handleDeleteInsurance(index)
  }

  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Intenational Equity</h1>
      <div className="pt-7 flex justify-between items-center">
        <div className="flex-[0.75]">
          <div className="text-xl pb-2 text-gray-500 font-semibold">
            Total Value:
          </div>
          <div className="text-2xl font-semibold">
            {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
              insuranceTotalPrice
            )}
          </div>
        </div>

        <div className="flex-[0.25]">
          <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger onClick={() => setOpen(true)} className="w-full py-4 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">+ Add</DialogTrigger>
          <DialogContent>
            <DialogTitle className="w-full text-2xl">Add International insurances</DialogTitle>
            <label htmlFor="classification" className="text-lg font-semibold text-gray-500">Type</label>
            <select name="cars" id="classification" className="outline-none border border-black p-3 rounded-xl" required value={insuranceType} onChange={(e) => setInsuranceType(e?.target?.value)}>
              {insuranceOptions.map((insurance, key) => (
                <option key={key} value={insurance} disabled={insurance === "Choose Category"}>{insurance}</option>
              ))}
            </select>

            <label htmlFor="insurance-name" className="text-lg font-semibold text-gray-500">Name</label>
            <input type="text" id="insurance-name" placeholder="Insurance Name" className="outline-none border border-black p-3 rounded-xl" required value={insuranceName} onChange={(e) => setInsuranceName(e?.target?.value)}/>

            <label htmlFor="price" className="text-lg font-semibold text-gray-500">Price</label>
            <input type="number" id="price" placeholder="Price" min="0" className="outline-none border border-black p-3 rounded-xl" required value={insurancePrice} onChange={(e) => setInsurancePrice(Number(e?.target?.value))}/>
            <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold"
              onClick={() => handleDataSubmit()}
            >Save</button>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="text-2xl pt-4 font-semibold">
        Current Insurances :
      </div>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {["ULIPS", "Moneyback","Endowment", "Income Guarantee"].map((type, index) => (
          <InsuranceTableWrapper key={index} title={type}>
            {insuranceData[type].map((test, index) => (
              <InsuranceCard
                title={test?.title}
                index={test?.index}
                amount={test?.amount}
                type={test?.type}
                handleDeleteInsurance={handleDeleteInsurance}
                handleEditInsurance={handleEditInsurance}
                key={index}
              />
            ))}
          </InsuranceTableWrapper>
        ))}
      </div>
    </div>
  )
}

export default Insurance

function InsuranceTableWrapper({ children, title }: { children : ReactNode, title: string}) {
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

function InsuranceCard({ title, index, amount, type, handleDeleteInsurance, handleEditInsurance}: {
  title: string,
  index: number,
  amount: number,
  type: string,
  handleDeleteInsurance: Function,
  handleEditInsurance: Function
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
      onClick={async () => await handleDeleteInsurance(index)}
      ><Trash2 className="text-center w-full"/></button>
      <button className="text-blue-400 hover:text-blue-600 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-600 border-2" 
      onClick={async() => await handleEditInsurance(index, type, title, amount)}
      >
        <Pen className="text-center w-full"/>
      </button>
    </div>
  </div>
  )
}