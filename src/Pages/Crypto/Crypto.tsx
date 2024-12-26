import { useState, useEffect } from "react"
import {Dialog,DialogContent,DialogTrigger,DialogTitle} from "@/components/ui/dialog"
import { Pen, Trash2 } from "lucide-react"
import { db } from "../../firebase"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react"

function Crypto() {
  const [open, setOpen] = useState(false)
  const [cryptoTotalPrice, setCryptoTotalPrice] = useState(0)
  const [cryptoName, setCryptoName] = useState("")
  const [cryptoPrice, setCryptoPrice] = useState(0)
  const [cryptoData, setCryptoData] = useState([])

  const { user } = useUser()

  const handleCryptoTotal = (cryptoData: Array<{
    title: string;
    price: number;
  }>) => {
    let total = 0
    for(let i in cryptoData){
        total += cryptoData[i]?.price
    }
    setCryptoTotalPrice(total)
  }

  const fetchCrypto = async () => {
    try {
      const userDocRef = await doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData) {
          setCryptoData(userData.Crypto);
        } else {
          console.log("No crypto found.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  useEffect(() => {
    fetchCrypto()
  }, [user])
  
  useEffect(() => {
    handleCryptoTotal(cryptoData)
  }, [cryptoData])

  const addData = async(
    cryptoName: string,
    cryptoPrice: number, 
  ) => {
    try{
      const docRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!);
      await updateDoc(docRef, {
        Crypto: arrayUnion(
        {
          title: cryptoName,
          price: cryptoPrice
        }
        )
      });
    } catch (e: any){
      console.log(e)
    }
  }

  const handleDataSubmit = () => {
    if(cryptoName === null || cryptoName === "" ||
      cryptoPrice === null || cryptoPrice === 0 
    ) {
        alert("Please fill all the fields")
    }
    else {
        addData(cryptoName, cryptoPrice)
        fetchCrypto()
        handleCryptoTotal(cryptoData)
        setCryptoName("")
        setCryptoPrice(0)
        setOpen(false)
    }
  }

  const handleDeleteCrypto = async(index: number) => {
    const stockRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!)
    let newCryptoData: never[] = []
    for(let i in cryptoData){
        if(i !== String(index)){
            newCryptoData.push(cryptoData[i])
        }
    }
    await updateDoc(stockRef, {
        Crypto: newCryptoData
    });
    fetchCrypto()
  }

  const handleEditCrypto = async(index: number, title: string, price: number) => {
    setOpen(true)
    setCryptoName(title)
    setCryptoPrice(price)
    handleDeleteCrypto(index)
  }

  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Crypto</h1>
      <div className="pt-7 flex justify-between items-center">
        <div className="flex-[0.75]">
          <div className="text-xl pb-2 text-gray-500 font-semibold">
            Total Value:
          </div>
          <div className="text-2xl font-semibold">
            {new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(
              cryptoTotalPrice
            )}
          </div>
        </div>

        <div className="flex-[0.25]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} className="w-full py-4 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">+ Add</DialogTrigger>
            <DialogContent>
              <DialogTitle className="w-full text-2xl">Add Crypto</DialogTitle>
              <label htmlFor="crypto-name" className="text-lg font-semibold text-gray-500">Title</label>
              <input type="text" id="crypto-name" placeholder="crypto Name" className="outline-none border border-black p-3 rounded-xl" required value={cryptoName} onChange={(e) => setCryptoName(e?.target?.value)}/>

              <label htmlFor="price" className="text-lg font-semibold text-gray-500">Price</label>
              <input type="number" id="price" placeholder="Price" min="0" className="outline-none border border-black p-3 rounded-xl" required value={cryptoPrice} onChange={(e) => setCryptoPrice(Number(e?.target?.value))}/>
              <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold"
                onClick={() => handleDataSubmit()}
              >Save</button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* crypto Cards */}
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {cryptoData?.map(({title, price}: {title: string, price: number}, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-xl flex flex-col justify-between">
            <div className="text-xl font-semibold pt-2 pb-3">{title}</div>
            <div className="text-lg flex justify-between items-center">
              <div>Amount:</div>
              <div>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(price)}</div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <button className="text-red-400 hover:text-red-500 w-[40%] p-2 rounded-3xl border-red-400 hover:border-red-500 border" onClick={async () => await handleDeleteCrypto(index)}><Trash2 className="text-center w-full"/></button>
              <button className="text-blue-400 hover:text-blue-500 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-500 border" onClick={async() => await handleEditCrypto(index, title, price)}><Pen className="text-center w-full"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Crypto