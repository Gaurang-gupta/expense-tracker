import { Bar,Cell, BarChart, CartesianGrid, XAxis } from "recharts"
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
type stringFunction = (arg: string) => void;
type boolFunction = (arg: boolean) => void;

function Tracker() {
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState("")
    const [open, setOpen] = useState(false)
    const [data, setData] = useState([])
    const [years, setYears] = useState([])
    const [year, setYear] = useState("")
    const [total, setTotal] = useState(0)
    const { user } = useUser()

    const getYears = (data: Array<{title: string, amount: number, date: string}>) => {
      const temp: any = []
      for(let i in data){
        temp.push(data[i].date.substring(0, 4))
      }
      const toAdd: any = [...new Set(temp)]
      setYears(toAdd)
      console.log(toAdd)
    }

    const sumByMonth = (year: string, data: Array<{title: string, amount: number, date: string}>) => {
      const temp = [
        {month: "Jan", Amount: 0},
        {month: "Feb", Amount: 0},
        {month: "Mar", Amount: 0},
        {month: "Apr", Amount: 0},
        {month: "May", Amount: 0},
        {month: "Jun", Amount: 0},
        {month: "Jul", Amount: 0},
        {month: "Aug", Amount: 0},
        {month: "Sep", Amount: 0},
        {month: "Oct", Amount: 0},
        {month: "Nov", Amount: 0},
        {month: "Dec", Amount: 0},
      ];
      for(let i in data){
        if(data[i].date.substring(0, 4) === year){
          const month = data[i].date.substring(5, 7);
          if(month === "01") { temp[0].Amount += data[i].amount }
          if(month === "02") { temp[1].Amount += data[i].amount }
          if(month === "03") { temp[2].Amount += data[i].amount }
          if(month === "04") { temp[3].Amount += data[i].amount }
          if(month === "05") { temp[4].Amount += data[i].amount }
          if(month === "06") { temp[5].Amount += data[i].amount }
          if(month === "07") { temp[6].Amount += data[i].amount }
          if(month === "08") { temp[7].Amount += data[i].amount }
          if(month === "09") { temp[8].Amount += data[i].amount }
          if(month === "10") { temp[9].Amount += data[i].amount }
          if(month === "11") { temp[10].Amount += data[i].amount }
          if(month === "12") { temp[11].Amount += data[i].amount }
        }
      }
      return temp
    }

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

    function compare( a: {title: string, amount: number, date: string}, 
      b:{title: string, amount: number, date: string} ) {
      if ( a.date < b.date ){
        return 1;
      }
      if ( a.date > b.date ){
        return -1;
      }
      return 0;
    }
    const fetchData = async() => {
        try {
            const userDocRef = doc(db, 'users', user?.emailAddresses[0]?.emailAddress!);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData) {
                  setData(userData?.all_expenses?.sort( compare ));
                  getYears(userData?.all_expenses);
                  let total = 0
                  for(let i in userData?.expense){
                      total += userData?.expense[i]?.amount
                  }
                  setTotal(total)
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
            <TrackerChart total={total} years={years} year={year} setYear={setYear} chartData={sumByMonth(year, data)}/>
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
                            <TableCell className="text-right">{new Intl.NumberFormat('en-IN', {currencyDisplay: "symbol", style: 'currency', currency: 'INR'}).format(dat?.amount)}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

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

function TrackerChart({years, year, setYear, chartData, total}: {years: any[], year: string, setYear: stringFunction, chartData: any[], total: number}) {
  const updatedChartData = chartData.map(obj => ({
    ...obj, 
    color: obj.Amount <= total ? "hsl(147, 50%, 47%)" : "hsl(0, 100%, 50%)"
  }))
  const chartConfig = {
    Amount: {
      label: "Amount",
    }
  } satisfies ChartConfig
  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>January - December {year}</CardDescription>
        </div>
        <div>
            <DropdownMenuTracker years={years} year={year} setYear={setYear}/>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={updatedChartData!}>
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
            <Bar dataKey="Amount" radius={4}>
              {updatedChartData.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex text-center gap-2 font-semibold">
        <p className="w-full">Expenses per month</p>
      </CardFooter>
    </Card>
  )
}
 
function DropdownMenuTracker({years, year, setYear}: {years: any[], year: string, setYear: stringFunction}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{year === "" ? "year": year}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-15">
        <DropdownMenuLabel>Year</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={year} onValueChange={setYear}>
          {years.map((y, index) => (
            <DropdownMenuRadioItem key={index} value={y}>{y}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export default Tracker