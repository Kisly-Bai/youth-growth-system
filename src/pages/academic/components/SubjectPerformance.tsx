import React, { useState } from 'react';
import { Select, Empty, Typography, Space, Tooltip } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const ChartContainer = styled.div`
  width: 100%;
  height: 350px;
`;

interface SubjectData {
  subject: string;
  score: number;
  totalScore: number;
  rank: number;
  totalStudents: number;
  lastScore?: number;
  lastRank?: number;
  weakPoints?: string[];
  averageScore?: number;
  variance?: number;
}

interface ExamRecord {
  id: string;
  name: string;
  date: string;
  subjects: SubjectData[];
  totalScore: number;
  totalPossibleScore: number;
  averageScore: number;
  rank: number;
  totalStudents: number;
}

interface SubjectPerformanceProps {
  data: ExamRecord[];
}

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
          <Text>分数: </Text>
          <Text strong style={{ color: payload[0].color }}>
            {payload[0].value.toFixed(1)}分
          </Text>
        </div>
        <div>
          <Text>排名: </Text>
          <Text strong style={{ color: '#722ed1' }}>
            {payload[1]?.value}
          </Text>
        </div>
      </div>
    );
  }
  return null;
};

const SubjectPerformance: React.FC<SubjectPerformanceProps> = ({ data }) => {
  // 获取所有科目
  const subjects = new Set<string>();
  data.forEach(record => {
    record.subjects.forEach(subject => {
      subjects.add(subject.subject);
    });
  });

  const subjectsList = Array.from(subjects);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    subjectsList.length > 0 ? subjectsList[0] : ''
  );

  if (!data || data.length === 0 || subjectsList.length === 0) {
    return <Empty description="暂无学科数据" />;
  }

  // 为选定学科准备数据
  const subjectData = data
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()) // 按日期排序
    .map(exam => {
      const subjectEntry = exam.subjects.find(
        s => s.subject === selectedSubject
      );
      
      return {
        name: exam.name,
        date: dayjs(exam.date).format('MM-DD'),
        score: subjectEntry ? subjectEntry.score : 0,
        rank: subjectEntry ? subjectEntry.rank : 0,
        totalStudents: subjectEntry ? subjectEntry.totalStudents : 0,
        averageScore: subjectEntry?.averageScore,
        variance: subjectEntry?.variance
      };
    });

  // 计算平均分和最高分
  const avgScore = subjectData.reduce((sum, item) => sum + item.score, 0) / subjectData.length;
  const maxScore = Math.max(...subjectData.map(item => item.score));
  const minScore = Math.min(...subjectData.map(item => item.score));
  
  // 最近一次考试
  const latestExam = subjectData[subjectData.length - 1];
  
  // 趋势计算 - 比较最近两次考试
  let trend = 0;
  if (subjectData.length >= 2) {
    const lastScore = subjectData[subjectData.length - 1].score;
    const prevScore = subjectData[subjectData.length - 2].score;
    trend = lastScore - prevScore;
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }} direction="vertical" size="small">
        <div>
          <Text>选择学科: </Text>
          <Select 
            value={selectedSubject} 
            onChange={setSelectedSubject}
            style={{ width: 120 }}
          >
            {subjectsList.map(subject => (
              <Option key={subject} value={subject}>
                {subject}
              </Option>
            ))}
          </Select>
        </div>
        
        <div>
          <Space>
            <Text>平均分: </Text>
            <Text strong style={{ color: '#1890ff' }}>{avgScore.toFixed(1)}</Text>
            <Text>最高分: </Text>
            <Text strong style={{ color: '#52c41a' }}>{maxScore}</Text>
            <Text>最低分: </Text>
            <Text strong style={{ color: '#f5222d' }}>{minScore}</Text>
          </Space>
        </div>
        
        <div>
          <Space>
            <Text>最近成绩: </Text>
            <Text strong style={{ color: '#1890ff' }}>{latestExam?.score || '-'}</Text>
            <Text>趋势: </Text>
            {trend > 0 ? (
              <Text strong style={{ color: '#52c41a' }}>上升 {trend.toFixed(1)} 分</Text>
            ) : trend < 0 ? (
              <Text strong style={{ color: '#f5222d' }}>下降 {Math.abs(trend).toFixed(1)} 分</Text>
            ) : (
              <Text strong>持平</Text>
            )}
          </Space>
        </div>
        
        {latestExam?.averageScore && (
          <div>
            <Space>
              <Text>班级平均分: </Text>
              <Text strong style={{ color: '#722ed1' }}>{latestExam.averageScore}</Text>
              {latestExam.score > (latestExam.averageScore || 0) ? (
                <Text type="success">高出班级平均 {(latestExam.score - (latestExam.averageScore || 0)).toFixed(1)} 分</Text>
              ) : latestExam.score < (latestExam.averageScore || 0) ? (
                <Text type="danger">低于班级平均 {((latestExam.averageScore || 0) - latestExam.score).toFixed(1)} 分</Text>
              ) : (
                <Text>与班级平均持平</Text>
              )}
            </Space>
          </div>
        )}
        
        {latestExam?.variance && (
          <div>
            <Space>
              <Text>班级分数方差: </Text>
              <Text strong style={{ color: '#eb2f96' }}>{latestExam.variance}</Text>
              <Tooltip title="方差越大表示班级成绩差异越大，方差越小表示成绩分布越集中">
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          </div>
        )}
      </Space>

      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={subjectData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" domain={[0, 100]} />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 'dataMax']} 
              // 反转排名轴，排名越小越好
              reversed={true}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="score"
              stroke="#1890ff"
              fill="#1890ff"
              fillOpacity={0.3}
              name="分数"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="rank"
              stroke="#722ed1"
              fill="#722ed1"
              fillOpacity={0.1}
              name="排名"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default SubjectPerformance; 