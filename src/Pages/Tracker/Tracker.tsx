import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from "react"
import {
  Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,ChartContainer,ChartTooltip,ChartTooltipContent,
} from "@/components/ui/chart"
import { Dialog, DialogContent, DialogTrigger, DialogTitle} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,DropdownMenuContent,DropdownMenuLabel,
  DropdownMenuRadioGroup,DropdownMenuRadioItem,DropdownMenuSeparator,DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
} from "@/components/ui/table"
import { useUser } from "@clerk/clerk-react"
import { arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
function Tracker() {
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState("")
    const [open, setOpen] = useState(false)
    const [data, setData] = useState([])
    const { user } = useUser()

    useEffect(() => {
        fetchData()
    }, [user])

    const addData = async(title: string, amount: number, date: string) => {
        try{
            const docRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress!);
            await updateDoc(docRef, {
                all_expenses: arrayUnion(
                    {
                        title: title,
                        amount: amount,
                        date: date
                    }
                )
            });
        } catch (e: any){
            console.log(e)
        }
    }

    const fetchData = async() => {
        try {
            const userDocRef = doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData) {
                    
                    setData(userData?.all_expenses);
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

    const handleSubmit = () => {
        if(title===null || title === "" || amount===null || amount===0 || date === null){
            alert("Please fill all the fields")
        } else {
            addData(title, amount, date)
            fetchData()
            setTitle("")
            setAmount(0)
            setDate("")
            setOpen(false)
        }
    }
  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
        {/* charts */}
        <h1 className="text-3xl font-semibold">Tracker</h1>
        <div className="mt-5 mb-9">
            <TrackerChart/>
        </div>

        {/* Add expenses */}
        <div className="flex justify-between items-center">
            <div className="flex-[0.75]">
                <h1 className="text-2xl font-semibold">All Expenses</h1>
            </div>
            <div className="flex-[0.25]">
                <TrackerDialog 
                title={title} 
                setTitle={setTitle}
                amount={amount}
                setAmount={setAmount}
                date={date}
                setDate={setDate}
                handleSubmit={handleSubmit}
                open={open}
                setOpen={setOpen}
                />
            </div>
        </div>

        {/* table */}
        <TrackerTable data={data}/>
    </div>
  )
}

function TrackerTable({ data }: { data: Array<{title: string, amount: number, date: string}>}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length>0 &&
                    data?.map((dat, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{dat?.date}</TableCell>
                            <TableCell>{dat?.title}</TableCell>
                            <TableCell className="text-right">{dat?.amount}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

type boolFunction = (arg: boolean) => void;
function TrackerDialog({open, setOpen, title, setTitle, amount, setAmount, date, setDate, handleSubmit}: { title: string, setTitle: Function, amount: number, setAmount: Function, date: string, setDate: Function, handleSubmit: Function, open: boolean, setOpen: boolFunction}) {
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} className="w-full py-4 bg-[#f5edca] rounded-xl text-lg hover:bg-[#f5edab] border border-[#fff492] font-semibold">
            + Add
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="w-full text-2xl">Add Expenses</DialogTitle>
                <label htmlFor="title-name" className="text-lg font-semibold text-gray-500">Title</label>
                <input type="text" id="title-name" placeholder="Title" className="outline-none border border-black p-3 rounded-xl" required value={title} onChange={(e) => setTitle(e?.target?.value)}/>

                <label htmlFor="Amount" className="text-lg font-semibold text-gray-500">Amount</label>
                <input type="number" id="Amount" placeholder="Amount" min="0" className="outline-none border border-black p-3 rounded-xl" required value={amount} onChange={(e) => setAmount(Number(e?.target?.value))}/>

                <label htmlFor="Date" className="text-lg font-semibold text-gray-500">Date</label>
                <input type="date" id="Date" placeholder="Date" className="outline-none border border-black p-3 rounded-xl" required value={date} onChange={(e) => setDate(e?.target?.value)}/>

                <button className="bg-[#f5edca] w-full rounded-xl text-lg hover:bg-[#f5edab] py-4 border border-[#fff492] font-semibold" onClick={() => handleSubmit()}>Save</button>
            </DialogContent>
        </Dialog>
    )
}

function TrackerChart() {
    const chartData = [
        { month: "January", Amount: 186},
        { month: "February", Amount: 305 },
        { month: "March", Amount: 237 },
        { month: "April", Amount: 73 },
        { month: "May", Amount: 209 },
        { month: "June", Amount: 214 },
        { month: "January", Amount: 186},
        { month: "February", Amount: 305 },
        { month: "March", Amount: 237 },
        { month: "April", Amount: 73 },
        { month: "May", Amount: 209 },
        { month: "June", Amount: 214 },
      ]
      const chartConfig = {
        Amount: {
          label: "Amount",
          color: "hsl(var(--chart-1))",
        }
      } satisfies ChartConfig
  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>January - December 2024</CardDescription>
        </div>
        <div>
            <DropdownMenuTracker/>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="Amount" fill="var(--color-Amount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex text-center gap-2 font-semibold">
        <p className="w-full">Expenses per month</p>
      </CardFooter>
    </Card>
  )
}
 
function DropdownMenuTracker() {
  const [year, setYear] = useState("2001")
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-15">
        <DropdownMenuLabel>Year</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={year} onValueChange={setYear}>
          <DropdownMenuRadioItem value="2023">2023</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="2024">2024</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="2025">2025</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export default Tracker