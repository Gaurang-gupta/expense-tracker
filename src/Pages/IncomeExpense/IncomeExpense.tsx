import { Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Trash2, Pen } from "lucide-react"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getUserEmail } from "@/utils/authStorage";
function IncomeExpense() {
  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
        <h1 className="text-3xl font-semibold">Income Expense</h1>
        <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-6 pt-7">
            <Income key={0}/>
            <Expenses key={1}/>
        </div>
    </div>
  )
}

export default IncomeExpense

type boolFunction = (arg: boolean) => void;

const Expenses = () => {
    const expensesOptions = ["Choose Category", "Monthly Expenses", "Loan EMIs", "Insurance Premiums", "Others"]
    const [openExpense, setOpenExpense] = useState(false)
    const [expenseType, setExpenseType] = useState("")
    const [expensePrice, setExpensePrice] = useState(0)
    const [expenseTotal, setExpenseTotal] = useState(0)
    const [expenseData, setExpenseData] = useState([])
    const user = getUserEmail()
    const handleExpensesTotal = (expenseData: Array<{
        title: string;
        amount: number;
      }>) => {
        let total = 0
        for(let i in expenseData){
            total += expenseData[i]?.amount
        }
        setExpenseTotal(total)
    }

    const fetchExpenses = async() => {
        try {
            const userDocRef = doc(db, 'users', user);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData) {
                setExpenseData(userData?.expense);
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
    const addData = async(expenseType: string, expensePrice: number) => {
        try{
            const docRef = doc(db, "users", user);
            await updateDoc(docRef, {
                expense: arrayUnion(
                    {
                        title: expenseType,
                        amount: expensePrice,
                    }
                )
            });
        } catch (e: any){
            console.log(e)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [user])

    useEffect(() => {
        handleExpensesTotal(expenseData)
    }, [expenseData])

    const handleExpenseSubmit = () => {
        if(expenseType === null || expenseType === "" || expensePrice === null || expensePrice === 0 || expenseType === "Choose Category") {
            alert("Please fill all the fields")
        }
        else {
            addData(expenseType, expensePrice)
            fetchExpenses()
            handleExpensesTotal(expenseData)
            setExpensePrice(0)
            setExpenseType("")
            setOpenExpense(false)
        }
    }

    const handleDeleteExpense = async(index: number) => {
        const expenseRef = doc(db, "users", user)
        let newExpenseData: never[] = []
        for(let i in expenseData){
            if(i !== String(index)){
                newExpenseData.push(expenseData[i])
            }
        }
        await updateDoc(expenseRef, {
            expense: newExpenseData
        });
        fetchExpenses()
    }

    const handleEditExpense = async(index: number, title: string, price: number) => {
        setOpenExpense(true)
        setExpenseType(title)
        setExpensePrice(price)
        handleDeleteExpense(index)
    }

    return (
    <div className="">
        <h1 className="text-2xl font-semibold">Expense</h1>
        <div className="border-black border mt-3 bg-white">
            <div className="flex-1">
                <div className="p-5">
                    <div className="text-xl flex justify-between">
                        <h1>Total Monthly Expenses</h1>
                        <h1>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(expenseTotal)}</h1>
                    </div>
                    <div className="mt-5">
                        <DialogBox
                            open={openExpense}
                            setOpen={setOpenExpense}
                            title="Expenses"
                            options={expensesOptions}
                            type={expenseType}
                            setType={setExpenseType}
                            price={expensePrice}
                            setPrice={setExpensePrice}
                            handleSubmit={handleExpenseSubmit}
                        />
                    </div>
                </div>
            </div>

            <div className="px-5 grid grid-cols-1 gap-5 pb-5">
                {expenseData?.map(({title, amount}: {title: string, amount: number}, index: number) => (
                    <HelperCard
                        title={title}
                        index={index}
                        amount={amount}
                        handleDelete={handleDeleteExpense}
                        handleEdit={handleEditExpense}
                        key={index}
                    />
                ))}
            </div>
        </div>
    </div>
    )
}

const Income = () => {
    const incomeOptions = ["Choose Category", "Post Tax Salary", "Business Income", "Rental Income", "Others"]
    const [openIncome, setOpenIncome] = useState(false)
    const [incomeType, setIncomeType] = useState("")
    const [incomePrice, setIncomePrice] = useState(0)
    const [incomeTotal, setIncomeTotal] = useState(0)
    const [incomeData, setIncomeData] = useState([])
    const user = getUserEmail()

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
          const userDocRef = await doc(db, 'users', user);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData) {
              setIncomeData(userData?.income);
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

    const addData = async(incomeType: string, incomePrice: number) => {
        try{
            const docRef = doc(db, "users", user);
            await updateDoc(docRef, {
                income: arrayUnion(
                    {
                        title: incomeType,
                        amount: incomePrice,
                    }
                )
            });
        } catch (e: any){
            console.log(e)
        }
    }

    useEffect(() => {
        fetchIncomes()
    }, [user])
    
    useEffect(() => {
        handleIncomeTotal(incomeData)
    }, [incomeData])

    const handleIncomeSubmit = () => {
        if(incomeType === null || incomeType === "" || incomePrice === null || incomePrice === 0 || incomeType === "Choose Category") {
            alert("Please fill all the fields")
        }
        else {
            addData(incomeType, incomePrice)
            fetchIncomes()
            handleIncomeTotal(incomeData)
            setIncomePrice(0)
            setIncomeType("")
            setOpenIncome(false)
        }
    }

    const handleDeleteIncome = async(index: number) => {
        const stockRef = doc(db, "users", user)
        let newIncomeData: never[] = []
        for(let i in incomeData){
            if(i !== String(index)){
                newIncomeData.push(incomeData[i])
            }
        }
        await updateDoc(stockRef, {
            income: newIncomeData
        });
        fetchIncomes()
    }

    const handleEditIncome = (index: number, title: string, amount: number) => {
        setOpenIncome(true)
        setIncomeType(title)
        setIncomePrice(amount)
        handleDeleteIncome(index)
    }
    return (
        <div>
            <h1 className="text-2xl font-semibold">Income</h1>
            <div className="border-black border bg-white mt-3">
                <div className="flex-1">
                    <div className="p-5">
                        <div className="text-xl flex justify-between">
                            <h1>Total Monthly Income</h1>
                            <h1>{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(incomeTotal)}</h1>
                        </div>
                        <div className="mt-5">
                            <DialogBox
                                open={openIncome}
                                setOpen={setOpenIncome}
                                title="Income"
                                options={incomeOptions}
                                type={incomeType}
                                setType={setIncomeType}
                                price={incomePrice}
                                setPrice={setIncomePrice}
                                handleSubmit={handleIncomeSubmit}
                            />
                        </div>
                    </div>
                </div>  

                <div className="px-5 grid grid-cols-1 gap-5 pb-5">
                    {incomeData?.map(({title, amount}: {title: string, amount: number}, index: number) => (
                    <HelperCard
                        title={title}
                        index={index}
                        amount={amount}
                        handleDelete={handleDeleteIncome}
                        handleEdit={handleEditIncome}
                        key={index}
                    />
                    ))}
                </div>
            </div>
        </div>
    )
}

const DialogBox = (
    { open, setOpen, title, options, type, setType, price, setPrice, handleSubmit }: 
    { open: boolean, 
        setOpen: boolFunction, 
        title: string,
        options: string[],
        type: string,
        setType: Function,
        price: number,
        setPrice: Function,
        handleSubmit: Function,
    }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} className="w-full py-4 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">+ Add</DialogTrigger>
            <DialogContent>
                <DialogTitle className="w-full text-2xl">Add {title}</DialogTitle>
                <label htmlFor="classification" className="text-lg font-semibold text-gray-500">Type</label>
                <select name={title} id="classification" className="outline-none border border-black p-3 rounded-xl" required value={type} onChange={(e) => setType(e?.target?.value)}>
                {options.map((option, key) => (
                    <option key={key} value={option}>{option}</option>
                ))}
                </select>

                <label htmlFor="price" className="text-lg font-semibold text-gray-500">Price</label>
                <input type="number" id="price" placeholder="Price" min="0" className="outline-none border border-black p-3 rounded-xl" required value={price} onChange={(e) => setPrice(Number(e?.target?.value))}/>
                <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold" onClick={() => handleSubmit()}>Save</button>
            </DialogContent>
        </Dialog>
    )
}

function HelperCard({ title, index, amount, handleDelete, handleEdit}: {
    title: string,
    index: number,
    amount: number,
    handleDelete: Function,
    handleEdit: Function
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
        onClick={async () => await handleDelete(index)}
        ><Trash2 className="text-center w-full"/></button>
        <button className="text-blue-400 hover:text-blue-600 w-[40%] p-2 rounded-3xl border-blue-400 hover:border-blue-600 border-2" 
        onClick={async() => await handleEdit(index, title, amount)}
        >
          <Pen className="text-center w-full"/>
        </button>
      </div>
    </div>
    )
}