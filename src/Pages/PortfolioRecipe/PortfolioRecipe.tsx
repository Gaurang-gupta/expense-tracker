import { Info, Pen } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle} from "@/components/ui/dialog"
import { getUserEmail } from "@/utils/authStorage";
import { useNavigate } from "react-router";

type fetchedData = {
  Equity: number,
  Real_estate: number,
  Debt: number,
  Gold: number,
  Crypto: number,
  International: number
};

function PortfolioRecipe() {
  const initialDataObject: fetchedData = {  Equity: 0, Real_estate: 0, Debt: 0,
    Gold: 0, Crypto: 0, International: 0}
  const [expectedReturns, setExpectedReturns] = useState(initialDataObject)
  const [longTermAllocation, setLongTermAllocation] = useState(initialDataObject)
  const [midTermAllocation, setMidTermAllocation] = useState(initialDataObject)
  const [smallTermAllocation, setSmallTermAllocation] = useState(initialDataObject)

  // Expected Returns attributes
  const [expectedOpen, setExpectedOpen] = useState(false)
  const [expectedEquity, setExpectedEquity] = useState(0)
  const [expectedRealEstate, setExpectedRealEstate] = useState(0)
  const [expectedDebt, setExpectedDebt] = useState(0)
  const [expectedGold, setExpectedGold] = useState(0)
  const [expectedCrypto, setExpectedCrypto] = useState(0)
  const [expectedInternational, setExpectedInternational] = useState(0)

  // long term attributes
  const [longTermOpen, setLongTermOpen] = useState(false)
  const [longTermEquity, setLongTermEquity] = useState(0)
  const [longTermRealEstate, setLongTermRealEstate] = useState(0)
  const [longTermDebt, setLongTermDebt] = useState(0)
  const [longTermGold, setLongTermGold] = useState(0)
  const [longTermCrypto, setLongTermCrypto] = useState(0)
  const [longTermInternational, setLongTermInternational] = useState(0)

  // medium term attributes
  const [midTermOpen, setMidTermOpen] = useState(false)
  const [midTermEquity, setMidTermEquity] = useState(0)
  const [midTermRealEstate, setMidTermRealEstate] = useState(0)
  const [midTermDebt, setMidTermDebt] = useState(0)
  const [midTermGold, setMidTermGold] = useState(0)
  const [midTermCrypto, setMidTermCrypto] = useState(0)
  const [midTermInternational, setMidTermInternational] = useState(0)

  // shortTerm
  const [shortTermOpen, setShortTermOpen] = useState(false)
  const [shortTermEquity, setShortTermEquity] = useState(0)
  const [shortTermRealEstate, setShortTermRealEstate] = useState(0)
  const [shortTermDebt, setShortTermDebt] = useState(0)
  const [shortTermGold, setShortTermGold] = useState(0)
  const [shortTermCrypto, setShortTermCrypto] = useState(0)
  const [shortTermInternational, setShortTermInternational] = useState(0)
  const user = getUserEmail()
  const navigate = useNavigate()

  const fetchData = async() => {
    try {
      const userDocRef = doc(db, 'users', user);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData) {
              setExpectedReturns(userData?.expected_returns);
              setLongTermAllocation(userData?.long_term);
              setMidTermAllocation(userData?.medium_term);
              setSmallTermAllocation(userData?.short_term);

              // expected return fields
              setExpectedEquity(userData?.expected_returns?.Equity)
              setExpectedRealEstate(userData?.expected_returns?.Real_estate)
              setExpectedDebt(userData?.expected_returns?.Debt)
              setExpectedGold(userData?.expected_returns?.Gold)
              setExpectedCrypto(userData?.expected_returns?.Crypto)
              setExpectedInternational(userData?.expected_returns?.International)

              // long term
              setLongTermEquity(userData?.long_term?.Equity)
              setLongTermRealEstate(userData?.long_term?.Real_estate)
              setLongTermDebt(userData?.long_term?.Debt)
              setLongTermGold(userData?.long_term?.Gold)
              setLongTermCrypto(userData?.long_term?.Crypto)
              setLongTermInternational(userData?.long_term?.International)

              // medium term
              setMidTermEquity(userData?.medium_term?.Equity)
              setMidTermRealEstate(userData?.medium_term?.Real_estate)
              setMidTermDebt(userData?.medium_term?.Debt)
              setMidTermGold(userData?.medium_term?.Gold)
              setMidTermCrypto(userData?.medium_term?.Crypto)
              setMidTermInternational(userData?.medium_term?.International)

              // short term
              setShortTermEquity(userData?.short_term?.Equity)
              setShortTermRealEstate(userData?.short_term?.Real_estate)
              setShortTermDebt(userData?.short_term?.Debt)
              setShortTermGold(userData?.short_term?.Gold)
              setShortTermCrypto(userData?.short_term?.Crypto)
              setShortTermInternational(userData?.short_term?.International)
          } else {
              console.log("No stocks found.");
          }
      } else {
          console.log("No such document!");
      }
    } catch (error) {
        console.error("Error fetching document: ", error);
    }
  }

  const calculateTotalReturns = (allocation: fetchedData) => {
    let total: number = expectedReturns?.Crypto * allocation?.Crypto + expectedReturns?.Debt * allocation?.Debt + expectedReturns?.Equity * allocation?.Equity + expectedReturns?.Gold * allocation?.Gold + expectedReturns?.International * allocation?.International + expectedReturns?.Real_estate * allocation?.Real_estate
    return (total / 100).toFixed(2)
  }

  const handleExpectedReturnsSubmit = async() => {
    if(expectedEquity === null || expectedRealEstate === null || expectedDebt === null || expectedGold === null || expectedCrypto === null || expectedInternational === null) {
        alert("Please fill all the fields")
    }
    else {
      try{
        const docRef = doc(db, "users", user);
        await updateDoc(docRef, {
          expected_returns: 
          {
            Equity: expectedEquity,
            Real_estate: expectedRealEstate,
            Debt: expectedDebt,
            Gold: expectedGold,
            Crypto: expectedCrypto,
            International: expectedInternational
          }
        });
      } catch (e: any){
        console.log(e)
      }
      fetchData()
      setExpectedOpen(false)
    }
  }

  const handleLongTermReturnSubmit = async() => {
    if(longTermEquity === null || longTermRealEstate === null || longTermDebt === null || longTermGold === null || longTermCrypto === null || longTermInternational === null) {
      alert("Please fill all the fields")
    }
    else if (
      Number(longTermEquity) + Number(longTermRealEstate) + Number(longTermDebt) + Number(longTermGold) + Number(longTermCrypto) + Number(longTermInternational) !== 100
    ) {
      alert("Make sure asset allocation is equal to 100%")
    }
    else {
      try{
        const docRef = doc(db, "users", user);
        await updateDoc(docRef, {
          long_term: 
          {
            Equity: longTermEquity,
            Real_estate: longTermRealEstate,
            Debt: longTermDebt,
            Gold: longTermGold,
            Crypto: longTermCrypto,
            International: longTermInternational
          }
        });
      } catch (e: any){
        console.log(e)
      }
      fetchData()
      setLongTermOpen(false)
    }
  }

  const handleMidTermReturnSubmit = async() => {
    if(midTermEquity === null || midTermRealEstate === null || midTermDebt === null || midTermGold === null || midTermCrypto === null || midTermInternational === null) {
      alert("Please fill all the fields")
    }
    else if (
      Number(midTermEquity) + Number(midTermRealEstate) + Number(midTermDebt) + Number(midTermGold) + Number(midTermCrypto) + Number(midTermInternational) !== 100
    ) {
      alert("Make sure asset allocation is equal to 100%")
    }
    else {
      try{
        const docRef = doc(db, "users", user);
        await updateDoc(docRef, {
          medium_term: 
          {
            Equity: midTermEquity,
            Real_estate: midTermRealEstate,
            Debt: midTermDebt,
            Gold: midTermGold,
            Crypto: midTermCrypto,
            International: midTermInternational
          }
        });
      } catch (e: any){
        console.log(e)
      }
      fetchData()
      setMidTermOpen(false)
    }
  }

  const handleShortTermReturnSubmit = async() => {
    if(shortTermEquity === null || shortTermRealEstate === null || shortTermDebt === null || shortTermGold === null || shortTermCrypto === null || shortTermInternational === null) {
      alert("Please fill all the fields")
    }
    else if (
      Number(shortTermEquity) + Number(shortTermRealEstate) + Number(shortTermDebt) + Number(shortTermGold) + Number(shortTermCrypto) + Number(shortTermInternational) !== 100
    ) {
      alert("Make sure asset allocation is equal to 100%")
    }
    else {
      try{
        const docRef = doc(db, "users", user);
        await updateDoc(docRef, {
          short_term: 
          {
            Equity: shortTermEquity,
            Real_estate: shortTermRealEstate,
            Debt: shortTermDebt,
            Gold: shortTermGold,
            Crypto: shortTermCrypto,
            International: shortTermInternational
          }
        });
      } catch (e: any){
        console.log(e)
      }
      fetchData()
      setShortTermOpen(false)
    }
  }
 
  useEffect(() => {
    if(user === null || user === "") navigate("/")
    fetchData()
  }, [user])

  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
      <h1 className="text-3xl font-semibold">Portfolio</h1>
      <h1 className="mt-8 text-2xl font-semibold flex items-center">
        Effective Returns: <TooltipForInfo/>
      </h1>
      <div className="flex bg-white xs:w-full lg:w-3/4 p-4 justify-between mt-4">
        {/* returns */}
        <div>
          <h2 className="xs:text-xl sm:text-2xl font-semibold text-gray-500">Long term </h2>
          <h3 className="xs:text-2xl sm:text-3xl font-bold text-green-400 pt-2">{calculateTotalReturns( longTermAllocation)}%</h3>
        </div>
        <div>
          <h2 className="xs:text-xl sm:text-2xl font-semibold text-gray-500">Medium term </h2>
          <h3 className="xs:text-2xl sm:text-3xl font-bold text-green-400 pt-2">{calculateTotalReturns( midTermAllocation)}%</h3>
        </div>
        <div>
          <h2 className="xs:text-xl sm:text-2xl font-semibold text-gray-500">Short term </h2>
          <h3 className="xs:text-2xl sm:text-3xl font-bold text-green-400 pt-2">{calculateTotalReturns( smallTermAllocation)}%</h3>
        </div>
      </div>

      {/* expected returns */}
      <div className="w-full bg-white mt-2 p-4">
        <h2 className="flex justify-between text-xl font-semibold pb-3">
          <div className="flex-[0.97]">Expected Returns</div>
          <div className="flex-[0.03]">
            <Helper open={expectedOpen}
              setOpen={setExpectedOpen}
              title="Expected Returns"
              equityValue={expectedEquity}
              setEquityValue={setExpectedEquity}
              realEstateValue={expectedRealEstate}
              setRealEstateValue={setExpectedRealEstate}
              debtValue={expectedDebt}
              setDebtValue={setExpectedDebt}
              goldValue={expectedGold}
              setGoldValue={setExpectedGold}
              cryptoValue={expectedCrypto}
              setCryptoValue={setExpectedCrypto}
              internationalValue={expectedInternational}
              setInternationalValue={setExpectedInternational}
              handleSubmit={handleExpectedReturnsSubmit}
            />
          </div>
        </h2>
        <ul className="ml-4">
          <li className="flex justify-between text-lg pb-2">
            <div>Equity</div>
            <div>{expectedReturns?.Equity}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Real Estate</div>
            <div>{expectedReturns?.Real_estate}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Debt</div>
            <div>{expectedReturns?.Debt}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Gold</div>
            <div>{expectedReturns?.Gold}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Crypto</div>
            <div>{expectedReturns?.Crypto}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>International</div>
            <div>{expectedReturns?.International}%</div>
          </li>
        </ul>
      </div>

      <h1 className="mt-8 text-2xl font-semibold flex items-center">Asset Class</h1>
      {/* long term returns */}
      <div className="w-full bg-white mt-2 p-4">
        <h2 className="flex justify-between text-xl font-semibold pb-3">
        <div className="flex-[0.97]">Long Term</div>
        <div className="flex-[0.03]">
          <Helper open={longTermOpen}
            setOpen={setLongTermOpen}
            title="Long Term Returns"
            equityValue={longTermEquity}
            setEquityValue={setLongTermEquity}
            realEstateValue={longTermRealEstate}
            setRealEstateValue={setLongTermRealEstate}
            debtValue={longTermDebt}
            setDebtValue={setLongTermDebt}
            goldValue={longTermGold}
            setGoldValue={setLongTermGold}
            cryptoValue={longTermCrypto}
            setCryptoValue={setLongTermCrypto}
            internationalValue={longTermInternational}
            setInternationalValue={setLongTermInternational}
            handleSubmit={handleLongTermReturnSubmit}
          />
        </div>
        </h2>
        <ul className="ml-4">
          <li className="flex justify-between text-lg pb-2">
            <div>Equity</div>
            <div>{longTermAllocation?.Equity}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Real Estate</div>
            <div>{longTermAllocation?.Real_estate}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Debt</div>
            <div>{longTermAllocation?.Debt}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Gold</div>
            <div>{longTermAllocation?.Gold}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Crypto</div>
            <div>{longTermAllocation?.Crypto}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>International</div>
            <div>{longTermAllocation?.International}%</div>
          </li>
        </ul>
      </div>

      {/* Mid term returns */}
      <div className="w-full bg-white mt-2 p-4">
        <h2 className="flex justify-between text-xl font-semibold pb-3">
          <div className="flex-[0.97]">Medium Term</div>
          <div className="flex-[0.03]">
            <Helper open={midTermOpen}
              setOpen={setMidTermOpen}
              title="Mid Term Returns"
              equityValue={midTermEquity}
              setEquityValue={setMidTermEquity}
              realEstateValue={midTermRealEstate}
              setRealEstateValue={setMidTermRealEstate}
              debtValue={midTermDebt}
              setDebtValue={setMidTermDebt}
              goldValue={midTermGold}
              setGoldValue={setMidTermGold}
              cryptoValue={midTermCrypto}
              setCryptoValue={setMidTermCrypto}
              internationalValue={midTermInternational}
              setInternationalValue={setMidTermInternational}
              handleSubmit={handleMidTermReturnSubmit}
            />
          </div>
        </h2>
        <ul className="ml-4">
          <li className="flex justify-between text-lg pb-2">
            <div>Equity</div>
            <div>{midTermAllocation?.Equity}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Real Estate</div>
            <div>{midTermAllocation?.Real_estate}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Debt</div>
            <div>{midTermAllocation?.Debt}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Gold</div>
            <div>{midTermAllocation?.Gold}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Crypto</div>
            <div>{midTermAllocation?.Crypto}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>International</div>
            <div>{longTermAllocation?.International}%</div>
          </li>
        </ul>
      </div>

      {/* short term */}
      <div className="w-full bg-white mt-2 p-4">
        <h2 className="flex justify-between text-xl font-semibold pb-3">
        <div className="flex-[0.97]">Short Term</div>
          <div className="flex-[0.03]">
            <Helper open={shortTermOpen}
              setOpen={setShortTermOpen}
              title="Short Term Returns"
              equityValue={shortTermEquity}
              setEquityValue={setShortTermEquity}
              realEstateValue={shortTermRealEstate}
              setRealEstateValue={setShortTermRealEstate}
              debtValue={shortTermDebt}
              setDebtValue={setShortTermDebt}
              goldValue={shortTermGold}
              setGoldValue={setShortTermGold}
              cryptoValue={shortTermCrypto}
              setCryptoValue={setShortTermCrypto}
              internationalValue={shortTermInternational}
              setInternationalValue={setShortTermInternational}
              handleSubmit={handleShortTermReturnSubmit}
            />
          </div>
        </h2>
        <ul className="ml-4">
          <li className="flex justify-between text-lg pb-2">
            <div>Equity</div>
            <div>{smallTermAllocation?.Equity}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Real Estate</div>
            <div>{smallTermAllocation?.Real_estate}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Debt</div>
            <div>{smallTermAllocation?.Debt}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Gold</div>
            <div>{smallTermAllocation?.Gold}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>Crypto</div>
            <div>{smallTermAllocation?.Crypto}%</div>
          </li>
          <li className="flex justify-between text-lg pb-2">
            <div>International</div>
            <div>{smallTermAllocation?.International}%</div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PortfolioRecipe

function TooltipForInfo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger><Info className="ml-3"/></TooltipTrigger>
        <TooltipContent>
          <p>Effective Returns are calculated by taking weighted average of your expected returns based on your asset allocation.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type boolFunction = (arg: boolean) => void;

function Helper({open, setOpen, title, equityValue, setEquityValue, realEstateValue, setRealEstateValue, debtValue, setDebtValue, goldValue, setGoldValue, cryptoValue, setCryptoValue, internationalValue, setInternationalValue, handleSubmit}: {open: boolean, setOpen: boolFunction, title: string, equityValue: number, setEquityValue: Function, realEstateValue: number, setRealEstateValue: Function, debtValue: number, setDebtValue: Function, goldValue: number, setGoldValue: Function, cryptoValue: number, setCryptoValue: Function, internationalValue: number, setInternationalValue: Function, handleSubmit: Function}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)}><Pen/></DialogTrigger>
      <DialogContent className="h-[450px] overflow-y-scroll">
        <DialogTitle className="w-full text-2xl">{title}</DialogTitle>
        <label htmlFor="Equity" className="text-lg font-semibold text-gray-500">Equity</label>
        <input 
          type="number" id="Equity" 
          className="outline-none border border-black p-3 rounded-xl" 
          required min={"0"} max={"100"} 
          value={equityValue} 
          onChange={(e) => setEquityValue(e?.target?.value)}
        />

        <label htmlFor="Real_estate" className="text-lg font-semibold text-gray-500">Real estate</label>
        <input 
          type="number" id="Real_estate" 
          className="outline-none border border-black p-3 rounded-xl" 
          required min={"0"} max={"100"} 
          value={realEstateValue} 
          onChange={(e) => setRealEstateValue(e?.target?.value)}
        />

        <label htmlFor="Debt" className="text-lg font-semibold text-gray-500">Debt</label>
        <input 
          type="number" id="Debt" 
          className="outline-none border border-black p-3 rounded-xl" 
          required min={"0"} max={"100"} 
          value={debtValue} 
          onChange={(e) => setDebtValue(e?.target?.value)}
        />
        
        <label htmlFor="Gold" className="text-lg font-semibold text-gray-500">Gold</label>
        <input 
          type="number" id="Gold" 
          className="outline-none border border-black p-3 rounded-xl" 
          required min={"0"} max={"100"} 
          value={goldValue} 
          onChange={(e) => setGoldValue(e?.target?.value)}
        />

        <label htmlFor="Crypto" className="text-lg font-semibold text-gray-500">Crypto</label>
        <input 
          type="number" id="Crypto" 
          className="outline-none border border-black p-3 rounded-xl" 
          required min={"0"} max={"100"} 
          value={cryptoValue} 
          onChange={(e) => setCryptoValue(e?.target?.value)}
        />

        <label htmlFor="International" className="text-lg font-semibold text-gray-500">International</label>
        <input 
          type="number" id="International" 
          className="outline-none border border-black p-3 rounded-xl" 
          required min={"0"} max={"100"} 
          value={internationalValue} 
          onChange={(e) => setInternationalValue(e?.target?.value)}
        />

        <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold" onClick={() => handleSubmit()}>Save</button>
      </DialogContent>
    </Dialog>
  )
}

// International: number