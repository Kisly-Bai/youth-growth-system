import React, { useState } from 'react';
import { Select, Typography, Radio, Space, Divider, Tag } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ChartContainer = styled.div`
  width: 100%;
  height: 350px;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

// 模拟数据 - 学科学习时间分布
const subjectTimeData = [
  { name: '语文', value: 8, percent: 20 },
  { name: '数学', value: 12, percent: 30 },
  { name: '英语', value: 10, percent: 25 },
  { name: '物理', value: 4, percent: 10 },
  { name: '化学', value: 3, percent: 7.5 },
  { name: '生物', value: 3, percent: 7.5 },
];

// 模拟数据 - 学习方式时间分布
const methodTimeData = [
  { name: '课堂学习', value: 20, percent: 50 },
  { name: '自主学习', value: 12, percent: 30 },
  { name: '小组讨论', value: 4, percent: 10 },
  { name: '辅导班', value: 4, percent: 10 },
];

// 模拟数据 - 时段学习时间分布
const timeSlotData = [
  { name: '早晨 (6:00-8:00)', value: 5, percent: 12.5 },
  { name: '上午 (8:00-12:00)', value: 15, percent: 37.5 },
  { name: '下午 (12:00-18:00)', value: 12, percent: 30 },
  { name: '晚上 (18:00-22:00)', value: 8, percent: 20 },
  { name: '深夜 (22:00-6:00)', value: 0, percent: 0 },
];

// 颜色配置
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// 自定义工具提示
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Text strong>{payload[0].name}</Text>
        <div>
          <Text>学习时间: </Text>
          <Text strong style={{ color: payload[0].color }}>
            {payload[0].value} 小时
          </Text>
        </div>
        <div>
          <Text>占比: </Text>
          <Text strong style={{ color: payload[0].color }}>
            {payload[0].payload.percent}%
          </Text>
        </div>
      </div>
    );
  }
  return null;
};

type ChartType = 'subject' | 'method' | 'timeSlot';

const StudyTimeDistribution: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>('subject');
  const [timeRange, setTimeRange] = useState<string>('thisWeek');
  
  // 根据选择的图表类型获取数据
  const getChartData = () => {
    switch (chartType) {
      case 'subject':
        return subjectTimeData;
      case 'method':
        return methodTimeData;
      case 'timeSlot':
        return timeSlotData;
      default:
        return subjectTimeData;
    }
  };
  
  const chartData = getChartData();
  
  // 获取图表标题
  const getChartTitle = () => {
    switch (chartType) {
      case 'subject':
        return '各学科学习时间分布';
      case 'method':
        return '学习方式时间分布';
      case 'timeSlot':
        return '时段学习时间分布';
      default:
        return '学习时间分布';
    }
  };
  
  // 获取总时间
  const getTotalHours = () => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Radio.Group value={chartType} onChange={e => setChartType(e.target.value)}>
          <Radio.Button value="subject">按学科</Radio.Button>
          <Radio.Button value="method">按学习方式</Radio.Button>
          <Radio.Button value="timeSlot">按时段</Radio.Button>
        </Radio.Group>
        
        <Select 
          value={timeRange} 
          onChange={setTimeRange}
          style={{ width: 120 }}
        >
          <Option value="thisWeek">本周</Option>
          <Option value="lastWeek">上周</Option>
          <Option value="thisMonth">本月</Option>
          <Option value="lastMonth">上月</Option>
          <Option value="thisSemester">本学期</Option>
        </Select>
      </Space>
      
      <div style={{ textAlign: 'center' }}>
        <Title level={5}>{getChartTitle()}</Title>
        <Paragraph>
          <Space>
            <Text>总学习时间:</Text>
            <Text strong>{getTotalHours()} 小时</Text>
          </Space>
        </Paragraph>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div style={{ flex: '1 1 200px', padding: '20px', minWidth: '200px' }}>
          <Divider orientation="left">详细数据</Divider>
          {chartData.map((entry, index) => (
            <div key={index} style={{ marginBottom: 8 }}>
              <Space>
                <ColorBox color={COLORS[index % COLORS.length]} />
                <Text>{entry.name}:</Text>
                <Text strong>{entry.value} 小时</Text>
                <Text type="secondary">({entry.percent}%)</Text>
              </Space>
            </div>
          ))}
          
          <Divider />
          
          <div>
            <Text type="secondary">总计: </Text>
            <Text strong>{getTotalHours()} 小时</Text>
          </div>
          
          {chartType === 'subject' && (
            <>
              <Divider orientation="left">效果评估</Divider>
              <Space direction="vertical">
                <div>
                  <Tag color="blue">数学</Tag>
                  <Tag color="green">效率较高</Tag>
                </div>
                <div>
                  <Tag color="blue">语文</Tag>
                  <Tag color="orange">时间不足</Tag>
                </div>
                <div>
                  <Tag color="blue">物理</Tag>
                  <Tag color="red">建议增加时间</Tag>
                </div>
              </Space>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTimeDistribution; 