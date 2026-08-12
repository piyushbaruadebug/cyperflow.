import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CATEGORY_COLORS } from '../lib/colors'
import { formatMoney } from '../lib/format'
import type { Category } from '../types'

export function CategoryPie({ data }: { data: { category: Category; total: number }[] }) {
  if (data.length === 0) {
    return <EmptyChart />
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="category" innerRadius={65} outerRadius={100} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} stroke="#ffffff" strokeWidth={3} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatMoney(Number(value), true)}
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e5e5e8',
            borderRadius: '12px',
            color: '#080809',
            boxShadow: '0 10px 25px -5px rgba(8,8,9,0.12)',
          }}
          itemStyle={{ color: '#0B25C4' }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#64748b', paddingTop: 10 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function MonthlyBar({ data }: { data: { label: string; total: number }[] }) {
  if (data.length === 0) {
    return <EmptyChart />
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
        <YAxis
          tickFormatter={(value: number) => formatMoney(value)}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke="#94a3b8"
        />
        <Tooltip
          formatter={(value) => formatMoney(Number(value), true)}
          cursor={{ fill: 'rgba(8, 8, 9, 0.04)' }}
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e5e5e8',
            borderRadius: '12px',
            color: '#080809',
            boxShadow: '0 10px 25px -5px rgba(8,8,9,0.12)',
          }}
          itemStyle={{ color: '#0B25C4' }}
        />
        <Bar dataKey="total" fill="#0B25C4" radius={[8, 8, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function EmptyChart() {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-slate-500">
      No expenses to chart yet
    </div>
  )
}
