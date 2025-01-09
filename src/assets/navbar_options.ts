import { 
    Percent, 
    ChartPie,
    BadgeDollarSign,
    Target,
    ChartCandlestick,
    ChartBar,
    Factory,
    DollarSign,
    Shield,
    IndianRupee,
    Cuboid,
    Bitcoin,
    BriefcaseBusiness,
    ChartLine
} from 'lucide-react';
export const data : {
    Dashboard: Array<
    {
        title: string, 
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
        path: string,
    }>, 
    Assets_and_Liabilities: Array<
    {
        title: string, 
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
        path: string,
    }>} = {
    Dashboard: [
        {
            title: "Home",
            icon: Percent,
            path: "/"
        },
        {
            title: "Portfolio Recipe",
            icon: ChartPie,
            path: "/portfolio-recipe"
        },
        {
            title: "Income & Expense",
            icon: BadgeDollarSign,
            path: "/income-expense"
        },
        {
            title: "Financial Goals",
            icon: Target,
            path: "/financial-goals"
        },
        {
            title: "Tracker",
            icon: ChartBar,
            path: "/tracker"
        }
    ],
    Assets_and_Liabilities: [
        {
            title: "Indian Stocks",
            icon: ChartCandlestick,
            path: "/indian-stocks"
        },
        {
            title: "Equity MFs",
            icon: ChartLine,
            path: "/equity-mfs"
        },
        {
            title: "Real Estate",
            icon: Factory,
            path: "/real-estate"
        },
        {
            title: "International",
            icon: DollarSign,
            path: "/international"
        },
        {
            title: "Insurance",
            icon: Shield,
            path: "/insurance"
        },
        {
            title: "Debt",
            icon: IndianRupee,
            path: "/debt"
        },
        {
            title: "Gold",
            icon: Cuboid,
            path: "/gold"
        },
        {
            title: "Crypto",
            icon: Bitcoin,
            path: "/crypto"
        },
        {
            title: "Liabilities",
            icon: BriefcaseBusiness,
            path: "/liabilities"
        }
    ]
}