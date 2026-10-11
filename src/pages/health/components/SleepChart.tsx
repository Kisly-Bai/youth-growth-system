import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Empty } from 'antd';

interface SleepChartProps {
  data: number[];
}

const SleepChart: React.FC<SleepChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Empty description="暂无睡眠数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const chartData = data.map((hours, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (data.length - 1 - index));
    return {
      date: date.toLocaleDateString(),
      hours: hours,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 12]} label={{ value: '睡眠时长 (小时)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value: number) => [`${value.toFixed(1)} 小时`, '睡眠时长']} />
        <Legend />
        <Bar 
          name="睡眠时长"
          dataKey="hours" 
          fill="#722ed1" 
          radius={[4, 4, 0, 0]}
          fillOpacity={0.8}
          label={{ 
            position: 'top', 
            formatter: (value: any) => value.toFixed(1) 
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SleepChart; 