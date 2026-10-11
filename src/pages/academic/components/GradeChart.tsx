import React from 'react';
import { Typography, Empty } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import styled from 'styled-components';

const { Text } = Typography;

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
`;

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
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} style={{ color: entry.color }}>
            <span>{entry.name}: </span>
            <Text strong>{entry.value.toFixed(1)}分</Text>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface SubjectData {
  subject: string;
  score: number;
  totalScore: number;
  rank: number;
  totalStudents: number;
  lastScore?: number;
  lastRank?: number;
  weakPoints?: string[];
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

interface GradeChartProps {
  data: ExamRecord[];
}

const GradeChart: React.FC<GradeChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Empty description="暂无考试数据" />;
  }

  // 为了图表展示，我们需要重新格式化数据
  const chartData = data
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()) // 按日期排序
    .map(record => {
      // 基础数据
      const result: any = {
        name: record.name,
        date: dayjs(record.date).format('YYYY-MM-DD'),
        totalScore: record.totalScore,
        averageScore: parseFloat(record.averageScore.toFixed(1)),
        rank: record.rank,
      };

      // 添加各科成绩
      record.subjects.forEach(subject => {
        result[`${subject.subject}`] = subject.score;
      });

      return result;
    });

  // 获取所有科目名称
  const subjectNames = new Set<string>();
  data.forEach(record => {
    record.subjects.forEach(subject => {
      subjectNames.add(subject.subject);
    });
  });

  // 为每个科目定义一个颜色
  const subjectColors: { [key: string]: string } = {
    '语文': '#f5222d',
    '数学': '#1890ff',
    '英语': '#52c41a',
    '物理': '#722ed1',
    '化学': '#faad14',
    '生物': '#13c2c2',
    '历史': '#eb2f96',
    '地理': '#fa8c16',
    '政治': '#a0d911',
  };

  // 默认颜色
  const defaultColors = [
    '#2f54eb', '#1890ff', '#13c2c2', '#52c41a', '#a0d911',
    '#faad14', '#fa541c', '#f5222d', '#eb2f96', '#722ed1'
  ];

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* 总分线 */}
          <Line
            type="monotone"
            dataKey="totalScore"
            name="总分"
            stroke="#000"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
          
          {/* 各科目成绩线 */}
          {Array.from(subjectNames).map((subject, index) => (
            <Line
              key={subject}
              type="monotone"
              dataKey={subject}
              name={subject}
              stroke={subjectColors[subject] || defaultColors[index % defaultColors.length]}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default GradeChart; 