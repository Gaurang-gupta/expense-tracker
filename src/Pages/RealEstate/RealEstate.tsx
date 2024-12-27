import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useUser } from "@clerk/clerk-react"
import { Pen, Trash2 } from "lucide-react"
function RealEstate() {
  const realEstateTypes = ["Choose Category", "Commercial Real Estate", "REITS", "Fractional Ownership"]
  const [open, setOpen] = useState(false)
  const [realEstateType, setRealEstateType] = useState("")
  const [realEstateTitle, setRealEstateTitle] = useState("")
  const [realEstateValue, setRealEstateValue] = useState(0)

  const [realEstateData, setRealEstateData] = useState([])
  const [realEstateTotalPrice, setRealEstateTotalPrice] = useState(0)
  const { user } = useUser()

  const handleRealEstateTotal = (realEstateData: Array<{
    type: string;
    title: string;
    value: number;
  }>) => {
    let total = 0
    for(let i in realEstateData){
      total += Number(realEstateData[i]?.value)
    }
    setRealEstateTotalPrice(total)
  }

  const fetchRealEstate = async () => {
    try {
      const userDocRef = await doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData) {
          setRealEstateData(userData.Real_estate);
        } else {
          console.log("No real estate found.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  const addData = async(
    realEstateType: string,
    realEstateTitle: string,
    realEstateValue: number
  ) => {
    try{
      const docRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!);
      await updateDoc(docRef, {
          Real_estate: arrayUnion(
              {
                  type: realEstateType,
                  title: realEstateTitle,
                  value: realEstateValue
              }
          )
      });
    } catch (e: any){
        console.log(e)
    }
  }

  const handleDataSubmit = () => {
    if(realEstateType === null || realEstateType === "" || realEstateType === realEstateTypes[0] || realEstateTitle === null || realEstateTitle === "" || realEstateValue === null || realEstateValue === 0){
      alert("Please fill all the fields")
      return;
    }
    addData(realEstateType, realEstateTitle, realEstateValue)
    fetchRealEstate()
    handleRealEstateTotal(realEstateData)
    setRealEstateTitle("")
    setRealEstateType("")
    setRealEstateValue(0)
    setOpen(false)
  }

  useEffect(() => {
    fetchRealEstate()
  }, [user])

  useEffect(() => {
    handleRealEstateTotal(realEstateData)
  }, [realEstateData])

  const handleRealEstateCategoryTotal = (realEstateData: Array<{
    type: string;
    title: string;
    value: number;
  }>,category: string) => {
    let total = 0
    for(let i in realEstateData){
      if(realEstateData[i]?.type === category) total += realEstateData[i]?.value
    }
    return total
  }

  const handleDeleteRealEstate = async(index: number) => {
    const realEstateRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!)
    let newRealEstateData: never[] = []
    for(let i in realEstateData){
        if(i !== String(index)){
          newRealEstateData.push(realEstateData[i])
        }
    }
    await updateDoc(realEstateRef, {
      Real_estate: newRealEstateData
    });

    fetchRealEstate()
  }

  const handleEditRealEstate = async(index: number, type: string, title: string, value:number) => {
    setOpen(true)
    setRealEstateTitle(title)
    setRealEstateType(type)
    setRealEstateValue(value)
    handleDeleteRealEstate(index)
  }

  return (
    <main className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Real Estate</h1>
      <div className="pt-7 flex justify-between items-center">
        <div className="flex-[0.75]">
          <div className="text-xl pb-2 text-gray-500 font-semibold">Total Value:</div>
          <div className="text-2xl font-semibold">
          {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
            realEstateTotalPrice
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
              <DialogTitle className="w-full text-2xl">Add Real Estate</DialogTitle>
              <div className="h-[325px] flex flex-col">
                <label htmlFor="classification" className="text-lg font-semibold text-gray-500 w-[95%]">Classification</label>
                <select name="cars" id="classification" className="outline-none border border-black p-3 rounded-xl mt-4" required value={realEstateType} onChange={(e) => setRealEstateType(e?.target?.value)}>
                  {realEstateTypes.map((realEstate, key) => (
                    <option key={key} value={realEstate}>{realEstate}</option>
                  ))}
                </select>
                <label 
                  htmlFor="real_estate_name" 
                  className="text-lg font-semibold text-gray-500 mt-4">
                  Title
                </label>
                <input 
                  type="text" 
                  id="real_estate_name" 
                  placeholder="Title" 
                  className="outline-none border border-black p-3 rounded-xl mt-4" 
                  required 
                  value={realEstateTitle} 
                  onChange={(e) => setRealEstateTitle(e?.target?.value)}
                />

                <label 
                  htmlFor="real_estate_value" 
                  className="text-lg font-semibold text-gray-500 mt-4 ">
                  Value
                </label>
                <input 
                  type="number" 
                  id="real_estate_value" 
                  placeholder="amount" 
                  className="outline-none border border-black p-3 rounded-xl mt-4" 
                  required 
                  value={realEstateValue} 
                  onChange={(e) => setRealEstateValue(Number(e?.target?.value))}
                />
              </div>
              
              <button className="bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold mb-3" onClick={() => handleDataSubmit()}>
                Save
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="text-2xl pt-4 font-semibold">
        Current Real Estate : 
      </div>

      {/* real estate cards */}
      <Accordion type="single" collapsible className="w-full grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg">{realEstateTypes[1]}</AccordionTrigger>
            <AccordionContent className="bg-gray-50 p-4 rounded-2xl">
              <div className="text-lg mb-2">Value: {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(handleRealEstateCategoryTotal(realEstateData, realEstateTypes[1]))}</div>
              <div className="grid grid-cols-1 gap-4">
                {realEstateData.map(({type, title, value}: {type: string, title: string, value: number}, index) => (
                  type === realEstateTypes[1] &&
                  <div className="bg-gray-50 p-4 rounded-xl border border-black flex flex-col justify-between" key={index}>
                    <div className="text-xl font-semibold pt-2 pb-3">
                      {title}
                    </div>
                    <div className="text-xl font-semibold pt-2 pb-3">
                      <div className="text-gray-600 text-sm">Amount</div>
                      <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(value)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <button className="text-red-400 hover:text-red-600 w-[40%] p-2 rounded-3xl border-red-400 hover:border-red-600 border-2" 
                      onClick={async () => await handleDeleteRealEstate(index)}><Trash2 className="text-center w-full"/></button>
                      <button 
                        className="text-blue-400 hover:text-blue-600 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-600 border-2"
                        onClick={async() => await handleEditRealEstate(index, type, title, value)}
                      >
                        <Pen className="text-center w-full"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
        <div>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg">{realEstateTypes[2]}</AccordionTrigger>
            <AccordionContent className="bg-gray-50 p-4 rounded-2xl">
              <div className="text-lg mb-2">Value: {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(handleRealEstateCategoryTotal(realEstateData, realEstateTypes[2]))}</div>
              <div className="grid grid-cols-1 gap-4">
                {realEstateData.map(({type, title, value}: {type: string, title: string, value: number}, index) => (
                  type === realEstateTypes[2] &&
                  <div className="bg-gray-50 p-4 rounded-xl border border-black flex flex-col justify-between" key={index}>
                    <div className="text-xl font-semibold pt-2 pb-3">
                      {title}
                    </div>
                    <div className="text-xl font-semibold pt-2 pb-3">
                      <div className="text-gray-600 text-sm">Amount</div>
                      <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(value)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <button className="text-red-400 hover:text-red-600 w-[40%] p-2 rounded-3xl border-red-400 hover:border-red-600 border-2" 
                      onClick={async () => await handleDeleteRealEstate(index)}><Trash2 className="text-center w-full"/></button>
                      <button 
                        className="text-blue-400 hover:text-blue-600 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-600 border-2"
                        onClick={async() => await handleEditRealEstate(index, type, title, value)}
                      >
                        <Pen className="text-center w-full"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
        <div>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg">{realEstateTypes[3]}</AccordionTrigger>
            <AccordionContent className="bg-gray-50 p-4 rounded-2xl">
              <div className="text-lg mb-2">Value: {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(handleRealEstateCategoryTotal(realEstateData, realEstateTypes[3]))}</div>
              <div className="grid grid-cols-1 gap-4">
                {realEstateData.map(({type, title, value}: {type: string, title: string, value: number}, index) => (
                  type === realEstateTypes[3] &&
                  <div className="bg-gray-50 p-4 rounded-xl border border-black flex flex-col justify-between" key={index}>
                    <div className="text-xl font-semibold pt-2 pb-3 w-full">
                      {title}
                    </div>
                    <div className="text-xl font-semibold pt-2 pb-3">
                      <div className="text-gray-600 text-sm">Amount</div>
                      <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(value)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <button className="text-red-400 hover:text-red-600 w-[40%] p-2 rounded-3xl border-red-400 hover:border-red-600 border-2" 
                      onClick={async () => await handleDeleteRealEstate(index)}><Trash2 className="text-center w-full"/></button>
                      <button 
                        className="text-blue-400 hover:text-blue-600 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-600 border-2"
                        onClick={async() => await handleEditRealEstate(index, type, title, value)}
                      >
                        <Pen className="text-center w-full"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>
    </main>
  )
}

export default RealEstate