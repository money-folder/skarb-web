'use client';

import { WhistoryComposed } from '@/types/wallets-history';
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
  width: number;
  height: number;
  data: WhistoryComposed[];
}

const WhistoryComposedChangesChart = ({ width, height, data }: Props) => {
  return (
    <BarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        padding={{ left: 20, right: 20 }}
        style={{ fontSize: '12px' }}
        dataKey="date"
        tickFormatter={(ts) => new Date(ts).toLocaleString().split(',')[0]}
      />

      <YAxis
        padding={{ top: 20, bottom: 20 }}
        style={{ fontSize: '12px' }}
        tickMargin={5}
        dataKey="changesAbs"
      />

      <Tooltip
        contentStyle={{ fontSize: '12px' }}
        labelFormatter={(ts) => new Date(ts).toLocaleString().split(',')[0]}
        formatter={(value) => [value, 'Changes']}
      />

      <Bar dataKey="changesAbs" fill="#8884d8" isAnimationActive={false}>
        {data.map((item) => (
          <Cell
            key={`${item.date.valueOf()}`}
            fill={item.changes && item.changes < 0 ? '#ef4444' : '#16a34a'}
          />
        ))}
      </Bar>
    </BarChart>
  );
};

export default WhistoryComposedChangesChart;
