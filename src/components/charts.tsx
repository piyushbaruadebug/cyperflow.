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
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} stroke="#0b1329" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatMoney(Number(value), true)}
          contentStyle={{
            backgroundColor: '#0f1a38',
            borderColor: '#1e293b',
            borderRadius: '12px',
            color: '#f8fafc',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
          }}
          itemStyle={{ color: '#38bdf8' }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 10 }} />
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
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
        <YAxis
          tickFormatter={(value: number) => formatMoney(value)}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke="#64748b"
        />
        <Tooltip
          formatter={(value) => formatMoney(Number(value), true)}
          cursor={{ fill: 'rgba(30, 41, 59, 0.4)' }}
          contentStyle={{
            backgroundColor: '#0f1a38',
            borderColor: '#1e293b',
            borderRadius: '12px',
            color: '#f8fafc',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
          }}
          itemStyle={{ color: '#38bdf8' }}
        />
        <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function EmptyChart() {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">
      No expenses to chart yet
    </div>
  )
}
