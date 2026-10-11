import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Empty } from 'antd';

interface CalorieChartProps {
  data: Array<{
    date: string;
    calories: number;
    target: number;
  }>;
}

const CalorieChart: React.FC<CalorieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Empty description="暂无热量数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  // 转换数据格式为柱状图所需格式
  const chartData = data.map(item => ({
    name: item.date,
    实际消耗: item.calories,
    目标消耗: item.target
  }));

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p style={{ margin: 0 }}><strong>{label}</strong></p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ margin: 0, color: item.color }}>
              {`${item.name}: ${item.value} 千卡`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: '热量 (千卡)', angle: -90, position: 'insideLeft' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="实际消耗" fill="#1890ff" radius={[4, 4, 0, 0]} />
        <Bar dataKey="目标消耗" fill="#faad14" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CalorieChart; 