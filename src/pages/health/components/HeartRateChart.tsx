import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Empty } from 'antd';

interface HeartRateChartProps {
  data: {
    avg: number[];
    min: number[];
    max: number[];
  };
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  if (!data || !data.avg || data.avg.length === 0) {
    return <Empty description="暂无心率数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  // 转换数据格式
  const chartData = data.avg.map((avg, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (data.avg.length - 1 - index));
    const dateStr = date.toLocaleDateString();
    
    return {
      date: dateStr,
      avg: avg,
      min: data.min && data.min[index] !== undefined ? data.min[index] : null,
      max: data.max && data.max[index] !== undefined ? data.max[index] : null,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
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
        <YAxis domain={[40, 'auto']} label={{ value: '心率 (bpm)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => [`${value} bpm`, '']} />
        <Legend />
        <Line
          name="平均心率"
          type="monotone"
          dataKey="avg"
          stroke="#1890ff"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line 
          name="最低心率" 
          type="monotone" 
          dataKey="min" 
          stroke="#52c41a" 
          strokeWidth={2}
        />
        <Line 
          name="最高心率" 
          type="monotone" 
          dataKey="max" 
          stroke="#faad14" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HeartRateChart; 