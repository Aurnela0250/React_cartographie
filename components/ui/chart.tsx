import type React from "react"
export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full">{children}</div>
}

export const ChartTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-lg font-semibold mb-2">{children}</h3>
}

export const ChartTooltip = () => {
  return null
}

export const ChartLegend = () => {
  return null
}

