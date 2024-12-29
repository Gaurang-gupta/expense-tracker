import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

function ChartHelper({ equityTotal, 
    realEstateTotal, internationalTotal, insuranceTotal, debtTotal, goldTotal, cryptoTotal }: 
    { equityTotal: number, realEstateTotal: number, internationalTotal: number, 
        insuranceTotal: number, debtTotal: number, goldTotal: number, cryptoTotal: number}
) {
    const chartData = [
        { asset: "equity", value: equityTotal, fill: "var(--color-equity)" },
        { asset: "real_estate", value: realEstateTotal, fill: "var(--color-real-estate)" },
        { asset: "international", value: internationalTotal, fill: "var(--color-international)" },
        { asset: "debt", value: debtTotal, fill: "var(--color-debt)" },
        { asset: "insurance", value: insuranceTotal, fill: "var(--color-insurance)" },
        { asset: "crypto", value: cryptoTotal, fill: "var(--color-crypto)" },
        { asset: "gold", value: goldTotal, fill: "var(--color-gold)" },
    ];
      
      // Updated chart configuration
    const chartConfig = {
        equity: {
          label: "Equity",
          color: "hsl(var(--chart-equity))",
        },
        real_estate: {
          label: "Real Estate",
          color: "hsl(var(--chart-real-estate))",
        },
        international: {
          label: "International",
          color: "hsl(var(--chart-international))",
        },
        debt: {
          label: "Debt",
          color: "hsl(var(--chart-debt))",
        },
        insurance: {
          label: "Insurance",
          color: "hsl(var(--chart-insurance))",
        },
        crypto: {
          label: "Crypto",
          color: "hsl(var(--chart-crypto))",
        },
        gold: {
          label: "Gold",
          color: "hsl(var(--chart-gold))",
        },
    } satisfies ChartConfig;
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Asset Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[450px] px-0"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.visitors}
                  </text>
                )
              }}
              nameKey="asset"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="text-sm grid grid-cols-5"> */}
      <div className="text-sm w-[90%] mx-auto mb-5 flex flex-col items-center">
        <div className="flex justify-around w-full">
            <div className="flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#4caf50]"/>
                <div className="ml-1">Equity</div>
            </div>
            <div className="flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#2196f3]"/>
                <div className="ml-1">Real Estate</div>
            </div>

            <div className="flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#ff9800]"/>
                <div className="ml-1">International</div>
            </div>

            <div className="flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#f44336]"/>
                <div className="ml-1">Debt</div>
            </div>

            
        </div>

        <div className="flex justify-around w-full">
            <div className="flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#9c27b0]"/>
                <div className="ml-1">Insurance</div>
            </div>
            <div className="flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#00bcd4]"/>
                <div className="ml-1">Crypto</div>
            </div>

            <div className="flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#ffeb3b]"/>
                <div className="ml-1">Gold</div>
            </div>
        </div>
    </div>
      {/* </CardFooter> */}
    </Card>
  )
}

export default ChartHelper