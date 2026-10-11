import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Empty } from 'antd';

interface StepChartProps {
  data: number[];
}

const StepChart: React.FC<StepChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Empty description="暂无步数数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const chartData = data.map((steps, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (data.length - 1 - index));
    return {
      date: date.toLocaleDateString(),
      steps: steps,
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
        <YAxis label={{ value: '步数', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value: number) => [value.toLocaleString(), '步数']} />
        <Legend />
        <Bar 
          name="步数"
          dataKey="steps" 
          fill="#1890ff" 
          radius={[4, 4, 0, 0]}
          fillOpacity={0.8}
          label={{ 
            position: 'top', 
            formatter: (value: any) => value >= 1000 ? `${Math.floor(value/1000)}k` : value 
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StepChart; 