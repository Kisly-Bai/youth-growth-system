import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Empty } from 'antd';

interface NutritionData {
  name: string;
  value: number;
  target: number;
}

interface NutritionBarChartProps {
  data: NutritionData[];
}

const NutritionBarChart: React.FC<NutritionBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Empty description="暂无营养素数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  // 转换数据格式
  const chartData = data.map(item => ({
    nutrient: item.name,
    摄入量: item.value,
    目标量: item.target
  }));

  // 根据营养素名称获取单位
  const getUnit = (nutrient: string) => {
    if (nutrient.includes('蛋白质') || nutrient.includes('脂肪') || nutrient.includes('碳水')) {
      return ' 克';
    } else if (nutrient.includes('维生素') || nutrient.includes('矿物质')) {
      return ' 毫克';
    }
    return '';
  };

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const unit = getUnit(label);
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p style={{ margin: 0 }}><strong>{label}</strong></p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ margin: 0, color: item.color }}>
              {`${item.name}: ${item.value}${unit}`}
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
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="nutrient" type="category" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="摄入量" fill="#1890ff" name="摄入量" barSize={20} />
        <Bar dataKey="目标量" fill="#faad14" name="目标量" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NutritionBarChart; 