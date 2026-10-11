import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  Select,
  Row,
  Col,
  Tag,
  Divider,
  Tabs,
} from 'antd';
import {
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TimeBlock, FocusSession } from '../../../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 样式组件
const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 350px;
  margin: 16px 0;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

// 图表颜色
const COLORS = ['#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#eb2f96', '#13c2c2', '#fadb14', '#a0d911'];

// 日期范围选项
const timeRangeOptions = [
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'year', label: '今年' },
  { value: 'all', label: '全部' },
];

interface TimeStatisticsProps {
  timeBlocks: TimeBlock[];
  focusSessions: FocusSession[];
  categories: any[];
}

const TimeStatistics: React.FC<TimeStatisticsProps> = ({
  timeBlocks,
  focusSessions,
  categories,
}) => {
  const [timeRange, setTimeRange] = useState<string>('week');
  const [activeTab, setActiveTab] = useState<string>('category');

  // 过滤时间块根据选择的日期范围
  const getFilteredTimeBlocks = () => {
    const now = dayjs();
    
    return timeBlocks.filter((block) => {
      const startTime = dayjs(block.startTime);
      
      switch (timeRange) {
        case 'today':
          return startTime.isSame(now, 'day');
        case 'yesterday':
          return startTime.isSame(now.subtract(1, 'day'), 'day');
        case 'week':
          return startTime.isAfter(now.startOf('week')) && startTime.isBefore(now.endOf('week'));
        case 'month':
          return startTime.isAfter(now.startOf('month')) && startTime.isBefore(now.endOf('month'));
        case 'year':
          return startTime.isAfter(now.startOf('year')) && startTime.isBefore(now.endOf('year'));
        case 'all':
        default:
          return true;
      }
    });
  };

  // 获取按类别统计的时间块数据
  const getCategoryData = () => {
    const filteredBlocks = getFilteredTimeBlocks();
    const categoryData: Record<string, number> = {};
    
    filteredBlocks.forEach((block) => {
      const startTime = dayjs(block.startTime);
      const endTime = dayjs(block.endTime);
      const durationHours = endTime.diff(startTime, 'minute') / 60;
      
      if (!categoryData[block.category]) {
        categoryData[block.category] = 0;
      }
      
      categoryData[block.category] += durationHours;
    });
    
    return Object.entries(categoryData).map(([category, hours]) => {
      const cat = categories.find(c => c.value === category);
      return {
        name: cat ? cat.label : category,
        value: parseFloat(hours.toFixed(1)),
        color: cat ? cat.color : '#bfbfbf',
      };
    });
  };

  // 获取按天统计的时间块数据
  const getDailyData = () => {
    const filteredBlocks = getFilteredTimeBlocks();
    const dailyData: Record<string, number> = {};
    
    filteredBlocks.forEach((block) => {
      const day = dayjs(block.startTime).format('YYYY-MM-DD');
      const startTime = dayjs(block.startTime);
      const endTime = dayjs(block.endTime);
      const durationHours = endTime.diff(startTime, 'minute') / 60;
      
      if (!dailyData[day]) {
        dailyData[day] = 0;
      }
      
      dailyData[day] += durationHours;
    });
    
    return Object.entries(dailyData)
      .sort(([dayA], [dayB]) => dayjs(dayA).diff(dayjs(dayB)))
      .map(([day, hours]) => ({
        name: dayjs(day).format('MM-DD'),
        hours: parseFloat(hours.toFixed(1)),
      }));
  };

  // 获取专注会话数据
  const getFocusSessionData = () => {
    const now = dayjs();
    
    // 过滤专注会话
    const filteredSessions = focusSessions.filter((session) => {
      const startTime = dayjs(session.startTime);
      
      switch (timeRange) {
        case 'today':
          return startTime.isSame(now, 'day');
        case 'yesterday':
          return startTime.isSame(now.subtract(1, 'day'), 'day');
        case 'week':
          return startTime.isAfter(now.startOf('week')) && startTime.isBefore(now.endOf('week'));
        case 'month':
          return startTime.isAfter(now.startOf('month')) && startTime.isBefore(now.endOf('month'));
        case 'year':
          return startTime.isAfter(now.startOf('year')) && startTime.isBefore(now.endOf('year'));
        case 'all':
        default:
          return true;
      }
    });
    
    // 按天统计专注时长
    const dailyFocusData: Record<string, { duration: number, sessions: number }> = {};
    
    filteredSessions.forEach((session) => {
      const day = dayjs(session.startTime).format('YYYY-MM-DD');
      const duration = session.completedDuration;
      
      if (!dailyFocusData[day]) {
        dailyFocusData[day] = { duration: 0, sessions: 0 };
      }
      
      dailyFocusData[day].duration += duration;
      dailyFocusData[day].sessions += 1;
    });
    
    return Object.entries(dailyFocusData)
      .sort(([dayA], [dayB]) => dayjs(dayA).diff(dayjs(dayB)))
      .map(([day, data]) => ({
        name: dayjs(day).format('MM-DD'),
        duration: parseFloat((data.duration / 60).toFixed(1)), // 转换为小时
        sessions: data.sessions,
      }));
  };

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
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
          <Text strong>{label || payload[0].name}</Text>
          {payload.map((entry: any, index: number) => (
            <div key={index}>
              <Space>
                <ColorBox color={entry.color || entry.stroke} />
                <Text>{entry.name}: </Text>
                <Text strong style={{ color: entry.color || entry.stroke }}>
                  {entry.value} {entry.name === 'hours' || entry.name === 'duration' ? '小时' : '次'}
                </Text>
              </Space>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // 渲染类别分布图表
  const renderCategoryChart = () => {
    const data = getCategoryData();
    
    if (data.length === 0) {
      return <div style={{ textAlign: 'center', margin: '30px 0' }}>没有数据</div>;
    }
    
    return (
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  // 渲染每日时间分布图表
  const renderDailyChart = () => {
    const data = getDailyData();
    
    if (data.length === 0) {
      return <div style={{ textAlign: 'center', margin: '30px 0' }}>没有数据</div>;
    }
    
    return (
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar name="小时" dataKey="hours" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  // 渲染专注会话统计图表
  const renderFocusChart = () => {
    const data = getFocusSessionData();
    
    if (data.length === 0) {
      return <div style={{ textAlign: 'center', margin: '30px 0' }}>没有数据</div>;
    }
    
    return (
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              name="专注时长(小时)"
              dataKey="duration"
              stroke="#1890ff"
              activeDot={{ r: 8 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              name="专注次数" 
              dataKey="sessions" 
              stroke="#52c41a" 
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  return (
    <StyledCard>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>时间统计分析</Title>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            {timeRangeOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </div>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={<span><PieChartOutlined />类别分布</span>} 
            key="category"
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Space>
                <Text>按类别统计总时间</Text>
                <Tag color="blue">
                  <Space>
                    <FieldTimeOutlined />
                    <Text>总计: </Text>
                    <Text strong>
                      {getCategoryData().reduce((sum, item) => sum + item.value, 0).toFixed(1)} 小时
                    </Text>
                  </Space>
                </Tag>
              </Space>
            </div>
            {renderCategoryChart()}
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              {getCategoryData().map((item, index) => (
                <Col key={index} xs={12} sm={8} md={6}>
                  <Card size="small">
                    <Space>
                      <ColorBox color={item.color} />
                      <Text>{item.name}: </Text>
                      <Text strong>{item.value} 小时</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
          
          <TabPane 
            tab={<span><BarChartOutlined />每日分布</span>} 
            key="daily"
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Space>
                <Text>按日期统计总时间</Text>
                <Tag color="blue">
                  <Space>
                    <CalendarOutlined />
                    <Text>总计: </Text>
                    <Text strong>
                      {getDailyData().reduce((sum, item) => sum + item.hours, 0).toFixed(1)} 小时
                    </Text>
                  </Space>
                </Tag>
              </Space>
            </div>
            {renderDailyChart()}
          </TabPane>
          
          <TabPane 
            tab={<span><LineChartOutlined />专注数据</span>} 
            key="focus"
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Space>
                <Text>专注会话统计</Text>
                <Tag color="blue">
                  <Space>
                    <ClockCircleOutlined />
                    <Text>总计: </Text>
                    <Text strong>
                      {getFocusSessionData().reduce((sum, item) => sum + item.duration, 0).toFixed(1)} 小时
                    </Text>
                  </Space>
                </Tag>
              </Space>
            </div>
            {renderFocusChart()}
          </TabPane>
        </Tabs>
      </Space>
    </StyledCard>
  );
};

export default TimeStatistics; 