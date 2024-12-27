import { Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Trash2, Pen } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

function International() {
  const internationalEquityOptions = ["Choose Category", "International", "RSU"]
  const [open, setOpen] = useState(false)
  const [stockName, setStockName] = useState("")
  const [stockType, setStockType] = useState("")
  const [stockQuantity, setStockQuantity] = useState(0)
  const [stockPrice, setStockPrice] = useState(0)
  const [stockData, setStockData] = useState([])
  const [stockTotalPrice, setStockTotalPrice] = useState(0)

  const { user } = useUser()

  const handleStockTotal = (stockData: Array<{
    title: string;
    classification: string;
    Price: number;
    Quantity: number;
  }>) => {
    let total = 0
    for(let i in stockData){
        total += stockData[i]?.Quantity * stockData[i]?.Price
    }
    setStockTotalPrice(total)
  }

  const fetchStocks = async () => {
    try {
        const userDocRef = await doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData) {
                setStockData(userData.international);
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
    fetchStocks()
  }, [user])
  
  useEffect(() => {
    handleStockTotal(stockData)
  }, [stockData])

  const addData = async(
    stockName: string, 
    stockType: string , 
    stockPrice: number, 
    stockQuantity: number
  ) => {
      try{
          const docRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!);
          await updateDoc(docRef, {
              international: arrayUnion(
                  {
                      title: stockName,
                      classification: stockType,
                      Quantity: stockQuantity,
                      Price: stockPrice
                  }
              )
          });
      } catch (e: any){
          console.log(e)
      }
  }

  const handleDeleteStock = async(index: number) => {
    const stockRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!)
    let newStockData: never[] = []
    for(let i in stockData){
        if(i !== String(index)){
            newStockData.push(stockData[i])
        }
    }
    await updateDoc(stockRef, {
        international: newStockData
    });
    fetchStocks()
  }

  const handleEditStock = async(index: number, title: string, classification: string, Price: number, Quantity: number) => {
    setOpen(true)
    handleDeleteStock(index)
    setStockName(title)
    setStockType(classification)
    setStockPrice(Price)
    setStockQuantity(Quantity)
  }

  const handleDataSubmit = () => {
    if(stockName === null || stockName === "" || 
        stockType === null || stockType === "" || stockType === "Choose Category" ||
        stockPrice === null || stockPrice === 0 ||
        stockQuantity === null || stockQuantity === 0
    ) {
        alert("Please fill all the fields")
    }
    else {
        addData(stockName, stockType, stockPrice, stockQuantity)
        fetchStocks()
        handleStockTotal(stockData)
        setStockName("")
        setStockType("")
        setStockQuantity(0)
        setStockPrice(0)
        setOpen(false)
    }
  }

  const handleStockType = (type: string) => {
    setStockType(type)
    if(type === "RSU") setStockQuantity(1)
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
            stockTotalPrice
            )}
          </div>
        </div>
        <div className="flex-[0.25]">
          <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger onClick={() => setOpen(true)} className="w-full py-4 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">+ Add</DialogTrigger>
          <DialogContent>
            <DialogTitle className="w-full text-2xl">Add International Stocks</DialogTitle>
            <label htmlFor="classification"
            className="text-lg font-semibold text-gray-500"
            >Classification</label>
            <select name="cars" id="classification" className="outline-none border border-black p-3 rounded-xl" required value={stockType} onChange={(e) => handleStockType(e?.target?.value)}>
              {internationalEquityOptions.map((intEq, key) => (
                <option key={key} value={intEq}>{intEq}</option>
              ))}
            </select>

            <label htmlFor="stock-name" className="text-lg font-semibold text-gray-500">Stock Name</label>
            <input type="text" id="stock-name" placeholder="Stock Name" className="outline-none border border-black p-3 rounded-xl" required value={stockName} onChange={(e) => setStockName(e?.target?.value)}/>

            { stockType === "RSU" ? <></> :
            <>
            <label htmlFor="quantity" className="text-lg font-semibold text-gray-500">Quantity</label>
            <input type="number" id="quantity" placeholder="Quantity" min="0" className="outline-none border border-black p-3 rounded-xl" required value={stockQuantity} onChange={(e) => setStockQuantity(Number(e?.target?.value))}/>
            </>
            }

            <label htmlFor="price" className="text-lg font-semibold text-gray-500">Price</label>
            <input type="number" id="price" placeholder="Price" min="0" className="outline-none border border-black p-3 rounded-xl" required value={stockPrice} onChange={(e) => setStockPrice(Number(e?.target?.value))}/>
            <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold"
              onClick={() => handleDataSubmit()}
            >Save</button>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="text-2xl pt-4 font-semibold">
        Current International Equity :
      </div>
      {/* Stock Cards */}
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {stockData?.map(({title, classification, Price, Quantity}: {title: string, classification:string, Price: number, Quantity: number}, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-xl flex flex-col justify-between">
        <div className={`text-xs bg-red-200 border-red-400 p-2 text-center border rounded-3xl w-[50%]`}>
          {classification}
        </div>
        <div className="text-xl font-semibold pt-2 pb-3">
          {title}
        </div>
        {
          classification === "RSU" ? <></> :
          <>
            <div className="text-lg flex justify-between items-center">
              <div>Quantity:</div>
              <div>{new Intl.NumberFormat('en-IN').format(Quantity)}</div>
            </div>
            <div className="text-lg flex justify-between items-center">
              <div>Share Price:</div>
              <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(Price)}</div>
            </div>
            
          </>
        }
        <div className="text-lg flex justify-between items-center">
          <div>Total Amount:</div>
          <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(Quantity*Price)}</div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <button className="text-red-400 hover:text-red-500 w-[40%] p-2 rounded-3xl border-red-400 hover:border-red-500 border" onClick={async () => await handleDeleteStock(index)}><Trash2 className="text-center w-full"/></button>
          <button className="text-blue-400 hover:text-blue-500 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-500 border" onClick={async() => await handleEditStock(index, title, classification, Price, Quantity)}
          >
            <Pen className="text-center w-full"/>
          </button>
        </div>
      </div>
      ))}
      </div>
    </div>
  )
}

export default International