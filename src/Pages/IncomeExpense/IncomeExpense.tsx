function IncomeExpense() {
  return (
    <div className="max-w-6xl mx-auto p-5 pt-10">
        <h1 className="text-3xl font-semibold">Income Expense</h1>
        <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-6 pt-7">
            {/* Monthly Income */}
            <div className="">
                <h1 className="text-2xl font-semibold">Income</h1>
                <div className="flex-1 border-black border mt-3 bg-white">
                    <div className="p-5">
                        <div className="text-xl">
                            <h1>Total Monthly Income</h1>
                        </div>
                        <div>
                            <button className="bg-[#f5edca] w-full py-4 rounded-xl mt-5 text-lg hover:bg-[#f5edab]">
                                +  Add
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
            
            {/* Monthly Expenses */}
            <div className="">
                <h1 className="text-2xl font-semibold">Expense</h1>
                <div className="flex-1 border-black border mt-3 bg-white">
                    <div className="p-5">
                        <div className="text-xl">
                            <h1>Total Monthly Expenses</h1>
                        </div>
                        <div>
                            <button className="bg-[#f5edca] w-full py-4 rounded-xl mt-5 text-lg hover:bg-[#f5edab]">
                                +  Add
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default IncomeExpense