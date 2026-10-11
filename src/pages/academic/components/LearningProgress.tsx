import React, { useState } from 'react';
import { 
  Typography, 
  Progress, 
  Tabs, 
  Row, 
  Col, 
  Card,
  Tag, 
  Space, 
  Select
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  BookOutlined,
  SyncOutlined,
  FlagOutlined
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ProgressCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ProgressTitle = styled(Text)`
  font-size: 15px;
  font-weight: 500;
`;

// 教材进度数据
const textbookProgress = [
  { subject: '语文', unit: '第五单元', progress: 85, textbook: '高中语文必修三' },
  { subject: '数学', unit: '函数与导数', progress: 60, textbook: '高中数学必修四' },
  { subject: '英语', unit: 'Unit 4', progress: 92, textbook: '高中英语必修二' },
  { subject: '物理', unit: '电磁学', progress: 75, textbook: '高中物理选修三' },
  { subject: '化学', unit: '有机化学基础', progress: 45, textbook: '高中化学选修四' },
  { subject: '生物', unit: '遗传与进化', progress: 88, textbook: '高中生物必修二' },
];

const homeworkProgress = [
  { subject: '语文', completed: 12, total: 15, lastWeek: 8 },
  { subject: '数学', completed: 18, total: 20, lastWeek: 15 },
  { subject: '英语', completed: 10, total: 10, lastWeek: 7 },
  { subject: '物理', completed: 8, total: 12, lastWeek: 5 },
  { subject: '化学', completed: 5, total: 8, lastWeek: 3 },
  { subject: '生物', completed: 7, total: 10, lastWeek: 8 },
];

const weeklyStudyHours = [
  { day: '周一', hours: 3.5 },
  { day: '周二', hours: 2.8 },
  { day: '周三', hours: 4.2 },
  { day: '周四', hours: 3.0 },
  { day: '周五', hours: 2.5 },
  { day: '周六', hours: 5.5 },
  { day: '周日', hours: 4.8 },
];

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
        <Text strong>{label}</Text>
        <div>
          <Text>学习时长: </Text>
          <Text strong style={{ color: payload[0].color }}>
            {payload[0].value} 小时
          </Text>
        </div>
      </div>
    );
  }
  return null;
};

const LearningProgress: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('thisWeek');

  return (
    <div>
      <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Text>时间范围:</Text>
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
        </Col>
        <Col>
          <Space>
            <Text>总体学习进度:</Text>
            <Progress 
              percent={75} 
              size="small" 
              style={{ width: 180 }} 
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            />
          </Space>
        </Col>
      </Row>

      <Tabs defaultActiveKey="textbook">
        <TabPane 
          tab={<span><BookOutlined />教材进度</span>} 
          key="textbook"
        >
          <Row gutter={[16, 16]}>
            {textbookProgress.map((item, index) => (
              <Col xs={24} sm={12} md={8} key={item.subject}>
                <ProgressCard>
                  <div style={{ marginBottom: 12 }}>
                    <Space>
                      <Tag color="blue">{item.subject}</Tag>
                      <ProgressTitle>{item.textbook}</ProgressTitle>
                    </Space>
                  </div>
                  <Paragraph>
                    <Text type="secondary">当前单元: </Text>
                    <Text strong>{item.unit}</Text>
                  </Paragraph>
                  <Progress
                    percent={item.progress}
                    status={item.progress === 100 ? 'success' : 'active'}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                  <div style={{ marginTop: 8, textAlign: 'right' }}>
                    <Text type="secondary">
                      {item.progress < 100 ? (
                        <span><SyncOutlined /> 进行中</span>
                      ) : (
                        <span><CheckCircleOutlined /> 已完成</span>
                      )}
                    </Text>
                  </div>
                </ProgressCard>
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane 
          tab={<span><ClockCircleOutlined />作业完成情况</span>} 
          key="homework"
        >
          <Row gutter={[16, 16]}>
            {homeworkProgress.map((item, index) => (
              <Col xs={24} sm={12} md={8} key={item.subject}>
                <ProgressCard>
                  <Space align="center" style={{ marginBottom: 12 }}>
                    <Tag color="blue">{item.subject}</Tag>
                    <ProgressTitle>作业进度</ProgressTitle>
                    {item.completed === item.total && (
                      <Tag color="success" icon={<CheckCircleOutlined />}>已全部完成</Tag>
                    )}
                  </Space>
                  <Row gutter={16} align="middle">
                    <Col span={16}>
                      <Progress
                        percent={Math.round((item.completed / item.total) * 100)}
                        status={item.completed === item.total ? 'success' : 'active'}
                      />
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Text strong>{item.completed}</Text>
                      <Text> / {item.total}</Text>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Space>
                      <Text type="secondary">上周完成:</Text>
                      <Text>{item.lastWeek} 项</Text>
                      {item.completed > item.lastWeek ? (
                        <Text type="success">+{item.completed - item.lastWeek} 项</Text>
                      ) : item.completed < item.lastWeek ? (
                        <Text type="danger">-{item.lastWeek - item.completed} 项</Text>
                      ) : (
                        <Text>持平</Text>
                      )}
                    </Space>
                  </div>
                </ProgressCard>
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane 
          tab={<span><FlagOutlined />每日学习时长</span>} 
          key="studyTime"
        >
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyStudyHours}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis
                  label={{ value: '学习时长 (小时)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="hours" name="学习时长" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Row justify="center" style={{ marginTop: 16 }}>
            <Col>
              <Card size="small">
                <Space direction="vertical" size="small">
                  <div>
                    <Text>本周总学习时长: </Text>
                    <Text strong style={{ fontSize: 16 }}>
                      {weeklyStudyHours.reduce((sum, day) => sum + day.hours, 0).toFixed(1)} 小时
                    </Text>
                  </div>
                  <div>
                    <Text>日均学习时长: </Text>
                    <Text strong style={{ fontSize: 16 }}>
                      {(weeklyStudyHours.reduce((sum, day) => sum + day.hours, 0) / 7).toFixed(1)} 小时
                    </Text>
                  </div>
                  <div>
                    <Text>最长学习日: </Text>
                    <Text strong>
                      {weeklyStudyHours.reduce((max, day) => day.hours > max.hours ? day : max, weeklyStudyHours[0]).day}
                      ({weeklyStudyHours.reduce((max, day) => day.hours > max.hours ? day : max, weeklyStudyHours[0]).hours} 小时)
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default LearningProgress; 