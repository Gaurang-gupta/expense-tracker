import { ReactNode, useState, useEffect } from "react"
import { Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle} from "@/components/ui/dialog"
import { Trash2, Pen } from "lucide-react"
import { db } from "../../firebase"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { getUserEmail } from "@/utils/authStorage";

interface goldCategoryEntries {
  title: string;
  amount: number;
  type: string;
  index: number;
}

type dataObject = {
  [key: string]: goldCategoryEntries[]
}

type fetchedData = {
  title: string;
  amount: number;
  type: string
};

function Gold() {
  const goldTypes = ["Choose Category", "SGB", "Physical", "MF/ETF"]
  const initialDataObject: dataObject = {
    "SGB": [], 
    "Physical": [], 
    "MF/ETF": []
  }
  const initialFetchObjectsArray: fetchedData[] = []
  const [open, setOpen] = useState(false)
  const [goldTotalPrice, setGoldTotalPrice] = useState(0)
  const [goldType, setGoldType] = useState("")
  const [goldName, setGoldName] = useState("")
  const [goldValue, setGoldValue] = useState(0)
  const [fetchedGoldData, setFetchedGoldData] = useState(initialFetchObjectsArray)
  const [goldData, setGoldData] = useState(initialDataObject)
  const user = getUserEmail()

  const dataStructureChange = () => {
    const newStucturedData: dataObject = {
      "SGB": [], 
      "Physical": [], 
      "MF/ETF": []
    }

    const sgb = []
    const physical = []
    const mf_etf = []
    for(let i in fetchedGoldData) {
      if(fetchedGoldData[i].type === "SGB"){
        sgb.push({index: Number(i), ...fetchedGoldData[i]})
      } else if(fetchedGoldData[i].type === "Physical") {
        physical.push({ index: Number(i), ...fetchedGoldData[i]})
      } else {
        mf_etf.push({ index: Number(i), ...fetchedGoldData[i]})
      }
    }
    newStucturedData["MF/ETF"].push(...mf_etf)
    newStucturedData.SGB.push(...sgb)
    newStucturedData.Physical.push(...physical)

    setGoldData(newStucturedData)
  }

  const handleGoldTotal = (goldData: Array<{
    title: string;
    type: string;
    amount: number
  }>) => {
    let total = 0
    for(let i in goldData){
        total += goldData[i]?.amount
    }
    setGoldTotalPrice(total)
  }

  const fetchGolds = async() => {
    try {
      const userDocRef = doc(db, 'users', user);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData && userData.Gold !== null) {
          setFetchedGoldData(userData?.Gold);
        } else {
          console.log("No golds found.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
    dataStructureChange()
  }

  const addData = async(type: string, name: string, value: number) => {
    try{
      const docRef = doc(db, "users", user);
      await updateDoc(docRef, {
        Gold: arrayUnion(
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
    fetchGolds()
    dataStructureChange()
  }, [user])
  
  useEffect(() => {
    handleGoldTotal(fetchedGoldData)
    dataStructureChange()
  }, [fetchedGoldData])

  const handleDataSubmit = async () => {
    if(goldType === null || goldType === "" || goldName === null || goldName === "" || 
      goldValue === null || goldValue === 0 || goldType === "Choose Category") {
      alert("Please fill all the fields")
    }
    else {
      addData(goldType, goldName, goldValue)
      fetchGolds()
      dataStructureChange()
      handleGoldTotal(fetchedGoldData)
      setGoldName("")
      setGoldType("")
      setGoldValue(0)
      setOpen(false)
    }
  }

  const handleDeleteGold = async (index: number) => {
    const debtRef = doc(db, "users", user)
    let newGoldData: fetchedData[] = []
    for(let i in fetchedGoldData){
      if(i !== String(index)){
        newGoldData.push(fetchedGoldData[i])
      }
    }
    await updateDoc(debtRef, {
      Gold: newGoldData
    });
    fetchGolds()
  }

  const handleEditGold = (index:number, type:string, title:string, amount: number) => {
    setOpen(true)
    setGoldName(title)
    setGoldType(type)
    setGoldValue(amount)
    handleDeleteGold(index)
  }

  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Gold</h1>
      <div className="pt-7 flex justify-between items-center">
        <div className="flex-[0.75]">
          <div className="text-xl pb-2 text-gray-500 font-semibold">
            Total Value:
          </div>
          <div className="text-2xl font-semibold">
            {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(goldTotalPrice)}
          </div>
        </div>
        <div className="flex-[0.25]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} className="w-full py-4 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">+ Add</DialogTrigger>
            <DialogContent>
              <DialogTitle className="w-full text-2xl">Add Gold</DialogTitle>
              <label htmlFor="classification" className="text-lg font-semibold text-gray-500">Classification</label>
              <select name="golds" id="classification" className="outline-none border border-black p-3 rounded-xl" required value={goldType} onChange={(e) => setGoldType(e?.target?.value)}>
                {goldTypes.map((gold, key) => (
                  <option key={key} value={gold} disabled={gold === "Choose Category"}>{gold}</option>
                ))}
              </select>

              <label htmlFor="gold-name" className="text-lg font-semibold text-gray-500">Gold Name</label>
              <input type="text" id="gold-name" placeholder="Gold Name" className="outline-none border border-black p-3 rounded-xl" required value={goldName} onChange={(e) => setGoldName(e?.target?.value)}/>

              <label htmlFor="price" className="text-lg font-semibold text-gray-500">Price</label>
              <input type="number" id="price" placeholder="Price" min="0" className="outline-none border border-black p-3 rounded-xl" required value={goldValue} onChange={(e) => setGoldValue(Number(e?.target?.value))}/>

              <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold" onClick={() => handleDataSubmit()}>
                Save
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="text-2xl pt-4 font-semibold">
        Current Gold :
      </div>
      {/* Gold Table */}
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {["SGB", "Physical", "MF/ETF"].map((type, index) => (
          <GoldTableWrapper key={index} title={type}>
            {goldData[type]?.map((test, index) => (
              <GoldCard
                key={index}
                title={test?.title}
                index={test?.index}
                amount={test?.amount}
                type={test?.type}
                handleDeleteGold={handleDeleteGold}
                handleEditGold={handleEditGold}
              />
            ))}
          </GoldTableWrapper>
        ))}
      </div>
    </div>
  )
}

export default Gold

function GoldTableWrapper({ children, title }: { children : ReactNode, title: string}) {
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

function GoldCard({ title, index, amount, type, handleDeleteGold, handleEditGold}: {
  title: string,
  index: number,
  amount: number,
  type: string,
  handleDeleteGold: Function,
  handleEditGold: Function
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
      onClick={async () => await handleDeleteGold(index)}
      ><Trash2 className="text-center w-full"/></button>
      <button className="text-blue-400 hover:text-blue-600 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-600 border-2" 
      onClick={async() => await handleEditGold(index, type, title, amount)}
      >
        <Pen className="text-center w-full"/>
      </button>
    </div>
  </div>
  )
}