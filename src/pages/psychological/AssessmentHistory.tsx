import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Tabs,
  Empty,
  Tooltip,
  Row,
  Col,
  Badge,
  Statistic,
  Progress
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  HistoryOutlined, 
  FileTextOutlined, 
  EyeOutlined,
  ArrowLeftOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { AssessmentType, AssessmentResult } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 样式组件
const Container = styled.div`
  padding: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const StatisticCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
`;

const TypeTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
  margin: 4px;
`;

interface AssessmentTypeInfo {
  name: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

type AssessmentTypeMap = {
  [key in AssessmentType]: AssessmentTypeInfo;
};

// 测评类型映射
const assessmentTypeMap: AssessmentTypeMap = {
  'phq9': { 
    name: '抑郁症筛查 (PHQ-9)', 
    color: '#ff4d4f', 
    icon: <MedicineBoxOutlined />,
    description: '用于筛查抑郁症状，评估抑郁症状的严重程度'
  },
  'gad7': { 
    name: '广泛性焦虑障碍筛查 (GAD-7)', 
    color: '#faad14', 
    icon: <ThunderboltOutlined />,
    description: '用于筛查广泛性焦虑障碍，评估焦虑症状的严重程度'
  },
  'sas': { 
    name: '焦虑自评量表 (SAS)', 
    color: '#faad14', 
    icon: <ThunderboltOutlined />,
    description: '评估个体焦虑状态的严重程度'
  },
  'ses': { 
    name: '自尊量表 (SES)', 
    color: '#52c41a', 
    icon: <HeartOutlined />,
    description: '评估个体自尊水平'
  }
};

// 模拟心理测评历史数据
const mockPsychologicalHistory: AssessmentResult[] = [
  {
    id: 'phq9-001',
    userId: 'user-001',
    assessmentId: 'phq9',
    assessmentType: 'phq9',
    score: 7,
    answers: [
      { questionId: 'q1', selectedValue: 1 },
      { questionId: 'q2', selectedValue: 2 },
      { questionId: 'q3', selectedValue: 1 },
      { questionId: 'q4', selectedValue: 1 },
      { questionId: 'q5', selectedValue: 0 },
      { questionId: 'q6', selectedValue: 1 },
      { questionId: 'q7', selectedValue: 0 },
      { questionId: 'q8', selectedValue: 0 },
      { questionId: 'q9', selectedValue: 1 }
    ],
    level: '轻度抑郁',
    feedback: '您有轻度抑郁症状，建议关注自己的情绪变化。',
    createdAt: '2023-04-01T08:00:00Z'
  },
  {
    id: 'phq9-002',
    userId: 'user-001',
    assessmentId: 'phq9',
    assessmentType: 'phq9',
    score: 5,
    answers: [
      { questionId: 'q1', selectedValue: 1 },
      { questionId: 'q2', selectedValue: 1 },
      { questionId: 'q3', selectedValue: 1 },
      { questionId: 'q4', selectedValue: 1 },
      { questionId: 'q5', selectedValue: 0 },
      { questionId: 'q6', selectedValue: 0 },
      { questionId: 'q7', selectedValue: 0 },
      { questionId: 'q8', selectedValue: 0 },
      { questionId: 'q9', selectedValue: 1 }
    ],
    level: '轻微抑郁',
    feedback: '您有轻微抑郁症状，情况有所改善。',
    createdAt: '2023-05-01T08:00:00Z'
  },
  {
    id: 'gad7-001',
    userId: 'user-001',
    assessmentId: 'gad7',
    assessmentType: 'gad7',
    score: 8,
    answers: [
      { questionId: 'q1', selectedValue: 1 },
      { questionId: 'q2', selectedValue: 1 },
      { questionId: 'q3', selectedValue: 2 },
      { questionId: 'q4', selectedValue: 1 },
      { questionId: 'q5', selectedValue: 1 },
      { questionId: 'q6', selectedValue: 1 },
      { questionId: 'q7', selectedValue: 1 }
    ],
    level: '轻度焦虑',
    feedback: '您有轻度焦虑症状，建议适当放松。',
    createdAt: '2023-04-10T10:00:00Z'
  },
  {
    id: 'sas-001',
    userId: 'user-001',
    assessmentId: 'sas',
    assessmentType: 'sas',
    score: 42,
    answers: [],
    level: '正常范围',
    feedback: '您的焦虑水平在正常范围内。',
    createdAt: '2023-04-15T09:00:00Z'
  },
  {
    id: 'ses-001',
    userId: 'user-001',
    assessmentId: 'ses',
    assessmentType: 'ses',
    score: 28,
    answers: [],
    level: '中等自尊',
    feedback: '您的自尊水平处于中等水平。',
    createdAt: '2023-04-20T14:00:00Z'
  }
];

// 获取评估结果等级对应的标签颜色
const getLevelColor = (level: string, type: AssessmentType) => {
  if (type === 'phq9' || type === 'gad7' || type === 'sas') {
    if (level.includes('正常') || level.includes('无')) return 'success';
    if (level.includes('轻微')) return 'processing';
    if (level.includes('轻度')) return 'warning';
    if (level.includes('中度')) return 'error';
    if (level.includes('重度')) return 'error';
    return 'default';
  }
  
  if (type === 'ses') {
    if (level.includes('高')) return 'success';
    if (level.includes('中等')) return 'processing';
    if (level.includes('低')) return 'warning';
    return 'default';
  }
  
  return 'default';
};

const AssessmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  useEffect(() => {
    // 从本地存储获取历史记录
    const localStorageHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    
    // 将本地存储数据转换为 AssessmentResult 格式
    const formattedLocalHistory: AssessmentResult[] = localStorageHistory.map((item: any) => {
      // 尝试加载详细结果数据
      const detailedResult = JSON.parse(localStorage.getItem(`assessment_${item.id}`) || 'null');
      
      return {
        id: item.id,
        userId: 'current-user',
        assessmentId: item.type,
        assessmentType: item.type as AssessmentType,
        score: item.totalScore || item.score,
        answers: detailedResult?.answers || [],
        level: item.level || detailedResult?.level || '未知',
        feedback: detailedResult?.feedback || '',
        createdAt: item.date ? new Date(item.date).toISOString() : new Date().toISOString()
      };
    });
    
    // 合并模拟数据和本地存储数据，确保没有重复
    const combinedHistory = [...mockPsychologicalHistory];
    
    formattedLocalHistory.forEach(localItem => {
      // 检查是否已经存在相同ID的记录
      const existingIndex = combinedHistory.findIndex(item => item.id === localItem.id);
      if (existingIndex === -1) {
        // 如果不存在，添加到合并列表
        combinedHistory.push(localItem);
      }
    });
    
    // 按时间排序（最新的在前）
    const sortedHistory = combinedHistory.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setAssessmentHistory(sortedHistory);
  }, []);
  
  // 返回心理评估主页
  const backToAssessment = () => {
    navigate('/psychological', { replace: false });
  };
  
  // 查看测试结果详情
  const viewTestResult = (resultId: string, type: AssessmentType) => {
    navigate(`/psychological/results/${resultId}`, { replace: false });
  };
  
  // 开始新的测试
  const startNewTest = (type: AssessmentType) => {
    navigate(`/psychological/${type}`, { replace: false });
  };
  
  // 计算趋势变化（分数差值和百分比）
  const calculateTrend = (type: AssessmentType) => {
    const filteredResults = assessmentHistory
      .filter(result => result.assessmentType === type)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    if (filteredResults.length < 2) return { diff: 0, percent: 0, isPositive: true };
    
    const oldest = filteredResults[0];
    const latest = filteredResults[filteredResults.length - 1];
    
    const diff = latest.score - oldest.score;
    const percent = Math.abs(Math.round((diff / oldest.score) * 100));
    
    // 对于PHQ-9、GAD-7和SAS，分数下降是积极的；对于SES，分数上升是积极的
    const isPositive = type === 'ses' ? diff > 0 : diff < 0;
    
    return { diff: Math.abs(diff), percent, isPositive };
  };
  
  // 获取指定类型测试的次数
  const getTestCount = (type: AssessmentType) => {
    return assessmentHistory.filter(result => result.assessmentType === type).length;
  };
  
  // 获取最近一次测试结果
  const getLatestResult = (type: AssessmentType) => {
    const filtered = assessmentHistory
      .filter(result => result.assessmentType === type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return filtered.length > 0 ? filtered[0] : null;
  };
  
  // 筛选当前活动标签的历史记录
  const getFilteredHistory = () => {
    if (activeTab === 'all') return assessmentHistory;
    return assessmentHistory.filter(record => record.assessmentType === activeTab);
  };
  
  // 渲染统计卡片
  const renderStatisticCards = () => {
    const typeKeys = Object.keys(assessmentTypeMap) as AssessmentType[];
    
    return (
      <Row gutter={[16, 16]}>
        {typeKeys.map(type => {
          const testCount = getTestCount(type);
          const latestResult = getLatestResult(type);
          const trend = calculateTrend(type);
          const typeInfo = assessmentTypeMap[type];
          
          return (
            <Col xs={24} sm={12} md={6} key={type}>
              <StatisticCard>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Badge.Ribbon 
                    text={`${testCount}次测试`} 
                    color={typeInfo.color}>
                    <Statistic
                      title={<span style={{ fontSize: 16 }}>{typeInfo.name}</span>}
                      value={latestResult ? latestResult.score : '未测试'}
                      valueStyle={{ color: typeInfo.color }}
                      prefix={typeInfo.icon}
                      suffix={latestResult ? 
                        <Tooltip title={trend.isPositive ? '改善' : '恶化'}>
                          <Tag color={trend.isPositive ? 'success' : 'error'}>
                            {trend.diff > 0 ? (trend.isPositive ? '↓' : '↑') : '-'} {trend.percent}%
                          </Tag>
                        </Tooltip> : null
                      }
                    />
                    {latestResult && (
                      <div style={{ marginTop: 8 }}>
                        <Tag color={getLevelColor(latestResult.level, type)}>
                          {latestResult.level}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(latestResult.createdAt).toLocaleDateString()}
                        </Text>
                      </div>
                    )}
                    <Button 
                      type="link" 
                      style={{ marginTop: 8 }} 
                      onClick={() => startNewTest(type)}
                    >
                      开始测试
                    </Button>
                  </Badge.Ribbon>
                </Space>
              </StatisticCard>
            </Col>
          );
        })}
      </Row>
    );
  };
  
  // 表格列定义
  const columns = [
    {
      title: '测试日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: (a: AssessmentResult, b: AssessmentResult) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    },
    {
      title: '测评类型',
      dataIndex: 'assessmentType',
      key: 'assessmentType',
      render: (type: AssessmentType) => (
        <TypeTag 
          color={assessmentTypeMap[type]?.color || '#d9d9d9'}
          icon={assessmentTypeMap[type]?.icon}
        >
          {assessmentTypeMap[type]?.name || type}
        </TypeTag>
      ),
      filters: Object.entries(assessmentTypeMap).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      onFilter: (value: any, record: AssessmentResult) => 
        record.assessmentType === value,
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: AssessmentResult, b: AssessmentResult) => a.score - b.score,
    },
    {
      title: '评估结果',
      dataIndex: 'level',
      key: 'level',
      render: (text: string, record: AssessmentResult) => (
        <Tag color={getLevelColor(text, record.assessmentType)}>{text}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AssessmentResult) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />}
          onClick={() => viewTestResult(record.id, record.assessmentType)}
        >
          查看
        </Button>
      ),
    },
  ];
  
  // 渲染趋势分析
  const renderTrendAnalysis = () => {
    const typeKeys = Object.keys(assessmentTypeMap) as AssessmentType[];
    const hasData = typeKeys.some(type => getTestCount(type) > 1);
    
    if (!hasData) {
      return (
        <Empty 
          description="需要至少两次测试才能生成趋势分析" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }
    
    return (
      <Row gutter={[16, 16]}>
        {typeKeys.map(type => {
          const results = assessmentHistory
            .filter(result => result.assessmentType === type)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          
          if (results.length < 2) return null;
          
          const typeInfo = assessmentTypeMap[type];
          const trend = calculateTrend(type);
          
          // 计算进度条颜色
          let statusColor = type === 'ses' ? '#52c41a' : '#ff4d4f';
          if (trend.isPositive) {
            statusColor = type === 'ses' ? '#52c41a' : '#52c41a';
          } else {
            statusColor = type === 'ses' ? '#ff4d4f' : '#ff4d4f';
          }
          
          return (
            <Col xs={24} sm={12} key={type}>
              <StyledCard 
                title={
                  <Space>
                    {typeInfo.icon}
                    <span>{typeInfo.name}趋势分析</span>
                  </Space>
                }
              >
                <Paragraph>{typeInfo.description}</Paragraph>
                
                <div style={{ marginBottom: 16 }}>
                  <Text strong>变化情况: </Text>
                  <Tag color={trend.isPositive ? 'success' : 'error'}>
                    {trend.isPositive ? '改善' : '恶化'} {trend.percent}%
                  </Tag>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <Text strong>测试次数: </Text>
                  <Tag>{results.length}次</Tag>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <Text strong>最早测试 ({new Date(results[0].createdAt).toLocaleDateString()}): </Text>
                  <Tag>{results[0].score}分 - {results[0].level}</Tag>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <Text strong>最近测试 ({new Date(results[results.length-1].createdAt).toLocaleDateString()}): </Text>
                  <Tag>{results[results.length-1].score}分 - {results[results.length-1].level}</Tag>
                </div>
                
                <div>
                  <Text strong>变化趋势:</Text>
                  <Progress 
                    percent={trend.percent} 
                    status={trend.isPositive ? 'success' : 'exception'} 
                    strokeColor={statusColor}
                  />
                </div>
              </StyledCard>
            </Col>
          );
        })}
      </Row>
    );
  };
  
  return (
    <Container>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={backToAssessment}
          style={{ padding: 0 }}
        >
          返回心理评估
        </Button>
        
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>
              <HistoryOutlined style={{ marginRight: 8 }} />
              心理评估历史记录
            </Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<FileTextOutlined />}
              onClick={() => navigate('/psychological', { replace: false })}
            >
              开始新评估
            </Button>
          </Col>
        </Row>
        
        <Paragraph>
          查看您过往的所有心理评估结果，追踪心理健康状态的变化与发展。
        </Paragraph>
        
        {renderStatisticCards()}
        
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition="top"
        >
          <TabPane 
            tab={
              <span>
                <PieChartOutlined />
                所有评估
              </span>
            } 
            key="all"
          >
            <StyledCard>
              {assessmentHistory.length > 0 ? (
                <Table 
                  columns={columns} 
                  dataSource={getFilteredHistory().map(item => ({ ...item, key: item.id }))} 
                  pagination={{ pageSize: 10 }}
                  rowKey="id"
                />
              ) : (
                <Empty 
                  description="暂无评估记录" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button 
                    type="primary" 
                    onClick={() => navigate('/psychological')}
                  >
                    开始评估
                  </Button>
                </Empty>
              )}
            </StyledCard>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <LineChartOutlined />
                趋势分析
              </span>
            } 
            key="trend"
          >
            <StyledCard>
              {renderTrendAnalysis()}
            </StyledCard>
          </TabPane>
          
          {Object.entries(assessmentTypeMap).map(([key, value]) => (
            <TabPane 
              tab={
                <span>
                  {value.icon}
                  {value.name}
                </span>
              } 
              key={key}
              forceRender
            >
              <StyledCard>
                {assessmentHistory.filter(record => record.assessmentType === key as AssessmentType).length > 0 ? (
                  <Table 
                    columns={columns} 
                    dataSource={getFilteredHistory().map(item => ({ ...item, key: item.id }))} 
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                  />
                ) : (
                  <Empty 
                    description={`暂无${value.name}评估记录`} 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button 
                      type="primary" 
                      onClick={() => startNewTest(key as AssessmentType)}
                    >
                      开始{value.name}
                    </Button>
                  </Empty>
                )}
              </StyledCard>
            </TabPane>
          ))}
        </Tabs>
      </Space>
    </Container>
  );
};

export default AssessmentHistory; 