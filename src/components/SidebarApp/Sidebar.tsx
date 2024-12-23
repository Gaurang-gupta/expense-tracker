import { MenuIcon } from "lucide-react"
import { data } from "../../assets/navbar_options"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Link } from "react-router"
  
function SidebarApp() {
  return (
    <Sheet>
        <SheetTrigger>
            <MenuIcon className="h-9 w-9"/>
        </SheetTrigger>
        <SheetContent className="p-0" side={"left"}>
            <div className="h-full w-full overflow-y-scroll scrollbar-thin p-8">
            <h1 className="text-xl pb-3 uppercase tracking-widest">Dashboard</h1>
            {
                data.Dashboard.map((dash, index) => (
                    <Link to={dash.path} key={index} className="flex w-full hover:bg-gray-200 p-3 rounded-3xl cursor-pointer items-center">
                        {<dash.icon className="bg-gray-200 h-10 w-10 p-2 rounded-lg mr-2"/>}
                        {dash.title}
                    </Link>
                ))
            }
            <h1 className="text-xl pb-3 pt-6 uppercase tracking-widest">Assets & Liabilities</h1>
            {
                data.Assets_and_Liabilities.map((a, index) => (
                <Link to={a.path} key={index} className="flex w-full hover:bg-gray-200 p-3 rounded-3xl cursor-pointer items-center">
                    {<a.icon className="bg-gray-200 h-10 w-10 p-2 rounded-lg mr-2"/>}
                    {a.title}
                </Link>
                ))
            }
            </div>
        </SheetContent>
    </Sheet>
  )
}

export default SidebarApp