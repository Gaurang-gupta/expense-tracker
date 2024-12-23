import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { Pen, Trash2 } from "lucide-react"
function EquityMFs() {
  const [open, setOpen] = useState(false)
  const [mfTitle, setMFTitle] = useState("")
  const [mfNav, setMFNav] = useState(0)
  const [mfQuantity, setMFQuantity] = useState(0)
  const [mfSmallCapPercentage, setMFSmallCapPercentage] = useState(0)
  const [mfMidCapPercentage, setMFMidCapPercentage] = useState(0)
  const [mfLargeCapPercentage, setMFLargeCapPercentage] = useState(0)
  const [mfCashPercentage, setMFCashPercentage] = useState(0)

  const [mutualFundData, setMutualFundData] = useState([])
  const [mutualFundTotal, setMutualFundTotal] = useState(0)

  const { user } = useUser()

  const handleMutualFundTotal = (mutualFundData: Array<{
    title: string;
    nav: number; 
    Quantity: number; 
    Small_cap: number; 
    Mid_cap: number; 
    Large_cap: number; 
    Cash: number;
  }>) => {
    let total = 0
    for(let i in mutualFundData){
      total += (mutualFundData[i]?.Quantity * mutualFundData[i]?.nav)
    }
    setMutualFundTotal(total)
  }

  useEffect(() => {
    handleMutualFundTotal(mutualFundData)
  }, [mutualFundData])

  const fetchMutualFunds = async () => {
    try {
      const userDocRef = await doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData) {
          setMutualFundData(userData.Equity_MFs);
        } else {
          console.log("No stocks found.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  useEffect(() => {
    fetchMutualFunds()
  }, [user])

  const addData = async(
    mfTitle: string, 
    mfNav: number, 
    mfQuantity: number, 
    mfSmallCapPercentage: number, 
    mfMidCapPercentage: number, 
    mfLargeCapPercentage: number, 
    mfCashPercentage: number
  ) => {
      try{
          const docRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!);
          await updateDoc(docRef, {
            Equity_MFs: arrayUnion(
              {
                title: mfTitle,
                nav: mfNav,
                Quantity: mfQuantity,
                Small_cap: mfSmallCapPercentage,
                Mid_cap: mfMidCapPercentage,
                Large_cap: mfLargeCapPercentage,
                Cash: mfCashPercentage
              }
            )
          });
      } catch (e: any){
          console.log(e)
      }
  }

  const handleDeleteMutualFund = async(index: number) => {
    const stockRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!)
    let newMutualFundData: never[] = []
    for(let i in mutualFundData){
        if(i !== String(index)){
            newMutualFundData.push(mutualFundData[i])
        }
    }
    await updateDoc(stockRef, {
      Equity_MFs: newMutualFundData
    });

    fetchMutualFunds()
  }

  const handleMutualDataSubmit = () => {
    if(
      mfTitle === null || 
      mfTitle === "" || 
      mfNav === null || 
      mfNav === 0 || 
      mfQuantity === null || 
      mfQuantity === 0 || 
      mfSmallCapPercentage === null || 
      mfMidCapPercentage === null || 
      mfLargeCapPercentage === null ||
      mfCashPercentage === null
    ){
      alert('Please fill all the fields')
      return;
    }
    if(mfSmallCapPercentage + mfMidCapPercentage + mfCashPercentage + mfLargeCapPercentage !== 100) {
      alert("Make sure the percentages add upto 100")
      return;
    }

    addData(mfTitle, mfNav, mfQuantity, mfSmallCapPercentage, mfMidCapPercentage, mfLargeCapPercentage, mfCashPercentage)
    fetchMutualFunds()
    handleMutualFundTotal(mutualFundData)
    setMFTitle("")
    setMFNav(0)
    setMFQuantity(0)
    setMFSmallCapPercentage(0)
    setMFMidCapPercentage(0)
    setMFLargeCapPercentage(0)
    setMFCashPercentage(0)
    setOpen(false)
  }

  const handleEditMutualFund = async(index: number, title: string, nav: number, Quantity: number, Small_cap: number, Mid_cap: number, Large_cap: number, Cash: number) => {
    setOpen(true)
    setMFTitle(title)
    setMFNav(nav)
    setMFQuantity(Quantity)
    setMFSmallCapPercentage(Small_cap)
    setMFMidCapPercentage(Mid_cap)
    setMFLargeCapPercentage(Large_cap)
    setMFCashPercentage(Cash)
    handleDeleteMutualFund(index)
  }


  return (
    <main className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Equity MFs</h1>
      <div className="pt-7 flex justify-between items-center">
        <div className="flex-[0.75]">
          <div className="text-xl pb-2 text-gray-500 font-semibold">Total Value:</div>
          <div className="text-2xl font-semibold">
          {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
            mutualFundTotal
          )}
          </div>
        </div>
        <div className="flex-[0.25]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger 
            onClick={() => setOpen(true)} 
            className="w-full py-4 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">
              + Add
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="w-full text-2xl">Add EquityMFs</DialogTitle>
              <div className="h-[400px] flex flex-col overflow-y-scroll">
                <label 
                  htmlFor="mf-name" 
                  className="text-lg font-semibold text-gray-500 w-[95%]">
                  Mutual Fund Name
                </label>
                <input 
                  type="text" 
                  id="mf-name" 
                  placeholder="Mutual Fund Name" 
                  className="outline-none border border-black p-3 rounded-xl mt-4 w-[95%]" 
                  required 
                  value={mfTitle} 
                  onChange={(e) => setMFTitle(e?.target?.value)}
                />

                <label 
                  htmlFor="mf-nav" 
                  className="text-lg font-semibold text-gray-500 mt-4 w-[95%]">
                  Nav
                </label>
                <input 
                  type="number" 
                  id="mf-nav" 
                  placeholder="Nav" 
                  className="outline-none border border-black p-3 rounded-xl mt-4 w-[95%]" 
                  required 
                  value={mfNav} 
                  onChange={(e) => setMFNav(Number(e?.target?.value))}
                  min={0}
                />

                <label 
                  htmlFor="mf-quantity" 
                  className="text-lg font-semibold text-gray-500 mt-4 w-[95%]">
                  Quantity
                </label>
                <input 
                  type="number" 
                  id="mf-quantity" 
                  placeholder="Quantity" 
                  className="outline-none border border-black p-3 rounded-xl mt-4 w-[95%]" 
                  required 
                  value={mfQuantity} 
                  onChange={(e) => setMFQuantity(Number(e?.target?.value))}
                  min={0}
                />

                <label 
                  htmlFor="mf-smallcap" 
                  className="text-lg font-semibold text-gray-500 mt-4 w-[95%]">
                  Small Cap (%)
                </label>
                <input 
                  type="number" 
                  id="mf-smallcap" 
                  placeholder="Small Cap (%)" 
                  className="outline-none border border-black p-3 rounded-xl mt-4 w-[95%]" 
                  required 
                  value={mfSmallCapPercentage} 
                  onChange={(e) => setMFSmallCapPercentage(Number(e?.target?.value))}
                  min={0}
                  max={100}
                />

                <label 
                  htmlFor="mf-midcap" 
                  className="text-lg font-semibold text-gray-500 mt-4 w-[95%]">
                  Mid Cap (%)
                </label>
                <input 
                  type="number" 
                  id="mf-midcap" 
                  placeholder="Mid Cap (%)" 
                  className="outline-none border border-black p-3 rounded-xl mt-4 w-[95%]" 
                  required 
                  value={mfMidCapPercentage} 
                  onChange={(e) => setMFMidCapPercentage(Number(e?.target?.value))}
                  min={0}
                  max={100}
                />

                <label 
                  htmlFor="mf-largecap" 
                  className="text-lg font-semibold text-gray-500 mt-4 w-[95%]">
                  Large Cap (%)
                </label>
                <input 
                  type="number" 
                  id="mf-largecap" 
                  placeholder="Large Cap (%)" 
                  className="outline-none border border-black p-3 rounded-xl mt-4 w-[95%]" 
                  required 
                  value={mfLargeCapPercentage} 
                  onChange={(e) => setMFLargeCapPercentage(Number(e?.target?.value))}
                  min={0}
                  max={100}
                />

                <label 
                  htmlFor="mf-cash" 
                  className="text-lg font-semibold text-gray-500 mt-4 w-[95%]">
                  Cash (%)
                </label>
                <input 
                  type="number" 
                  id="mf-cash" 
                  placeholder="Cash (%)" 
                  className="outline-none border border-black p-3 rounded-xl mt-4 w-[95%]" 
                  required 
                  value={mfCashPercentage} 
                  onChange={(e) => setMFCashPercentage(Number(e?.target?.value))}
                  min={0}
                  max={100}
                />

              </div>

              <div className="text-red-500 italic">
                Sum of all % should be equal to 100%
                <div className={`text-black ${(mfSmallCapPercentage + mfMidCapPercentage + mfLargeCapPercentage + mfCashPercentage) > 100 && "text-underline"}`}>
                  Sum: {mfSmallCapPercentage + mfMidCapPercentage + mfLargeCapPercentage + mfCashPercentage}%
                </div>
              </div>
              
              <button className="bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold mb-3" onClick={() => handleMutualDataSubmit()}>
                Save
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mutual Fund cards */}
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {mutualFundData?.map(({title, nav, Quantity, Small_cap, Mid_cap, Large_cap, Cash}: {title: string;
    nav: number, Quantity: number, Small_cap: number, Mid_cap: number,Large_cap: number,Cash: number}, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-xl flex flex-col justify-between">
            <div className="text-xl font-semibold pt-2 pb-3">
              {title}
            </div>
            <div className="text-lg flex justify-between items-center">
              <div>Quantity:</div>
              <div>{new Intl.NumberFormat('en-IN').format(Quantity)}</div>
            </div>
            <div className="text-lg flex justify-between items-center">
              <div>Share Price:</div>
              <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(nav)}</div>
            </div>
            <div className="text-lg flex justify-between items-center">
              <div>Total Amount:</div>
              <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(Quantity*nav)}</div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <button className="text-red-400 hover:text-red-500 w-[40%] p-2 rounded-3xl border-red-400 hover:border-red-500 border" 
              onClick={async () => await handleDeleteMutualFund(index)}><Trash2 className="text-center w-full"/></button>
              <button 
                className="text-blue-400 hover:text-blue-500 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-500 border"
                onClick={async() => await handleEditMutualFund(index, title, nav, Quantity, Small_cap, Mid_cap, Large_cap, Cash)}
              >
                <Pen className="text-center w-full"/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default EquityMFs