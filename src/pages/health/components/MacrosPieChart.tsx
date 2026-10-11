import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Empty, Card, Typography } from 'antd';

const { Text } = Typography;

interface MacrosData {
  protein: number;
  fat: number;
  carbs: number;
}

interface MacrosPieChartProps {
  data: MacrosData;
}

const MacrosPieChart: React.FC<MacrosPieChartProps> = ({ data }) => {
  if (!data || (data.protein === 0 && data.fat === 0 && data.carbs === 0)) {
    return <Empty description="暂无宏量营养素数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  // 转换数据格式
  const chartData = [
    {
      name: '蛋白质',
      value: data.protein,
      calories: data.protein * 4,
      color: '#1890ff'
    },
    {
      name: '脂肪',
      value: data.fat,
      calories: data.fat * 9,
      color: '#faad14'
    },
    {
      name: '碳水化合物',
      value: data.carbs,
      calories: data.carbs * 4,
      color: '#52c41a'
    },
  ];

  // 计算总卡路里
  const totalCalories = chartData.reduce((sum, item) => sum + item.calories, 0);
  
  // 自定义工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <Card size="small" style={{ border: `1px solid ${item.color}`, padding: '8px' }}>
          <Text strong>{item.name}</Text>
          <div>{item.value}克</div>
          <div>{item.calories} 千卡</div>
        </Card>
      );
    }
    return null;
  };

  // 自定义标签
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height: 300, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div 
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <Text type="secondary">总热量</Text>
        <div>
          <Text strong style={{ fontSize: '16px' }}>{totalCalories} 千卡</Text>
        </div>
      </div>
    </div>
  );
};

export default MacrosPieChart; 