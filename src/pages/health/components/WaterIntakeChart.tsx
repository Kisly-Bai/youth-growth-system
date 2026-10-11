import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Empty } from 'antd';

interface WaterIntakeChartProps {
  data: number[];
}

const WaterIntakeChart: React.FC<WaterIntakeChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Empty description="暂无水分摄入数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  // 转换数据格式
  const chartData = data.map((value, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (data.length - 1 - index));
    return {
      date: date.toLocaleDateString(),
      水分摄入: value
    };
  });

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p style={{ margin: 0 }}><strong>{label}</strong></p>
          <p style={{ margin: 0, color: '#2f54eb' }}>
            {`水分摄入: ${payload[0].value} 毫升`}
          </p>
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
        <XAxis dataKey="date" />
        <YAxis
          label={{ value: '水分 (毫升)', angle: -90, position: 'insideLeft' }}
          domain={[0, Math.max(...data) * 1.2]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="水分摄入"
          fill="#2f54eb"
          radius={[20, 20, 0, 0]}
          background={{ fill: '#eee' }}
        />
        <ReferenceLine 
          y={2000} 
          label={{ value: '推荐2000毫升', position: 'right' }} 
          stroke="#1890ff" 
          strokeDasharray="3 3"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WaterIntakeChart; 