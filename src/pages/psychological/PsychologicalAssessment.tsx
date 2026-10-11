import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Divider, 
  Tag, 
  Space, 
  List,
  Statistic,
  Empty 
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  HeartOutlined,
  RightOutlined,
  MehOutlined,
  AlertOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const Container = styled.div`
  padding: 0 4px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-5px);
  }
`;

const AssessmentCard = styled(StyledCard)`
  height: 100%;
`;

const TagWrapper = styled.div`
  margin-bottom: 12px;
`;

const CenteredEmpty = styled(Empty)`
  margin: 40px 0;
`;

// 定义测评项目的接口
interface AssessmentItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  time: string;
  icon: React.ReactNode;
  lastTaken: string | null;
  status: 'available' | 'completed' | 'in_progress';
}

const PsychologicalAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [, setLoading] = useState(true);
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [assessmentsList, setAssessmentsList] = useState<AssessmentItem[]>([]);
  
  // 修改测评列表，移除霍兰德职业兴趣测试，添加焦虑自评量表(SAS)和自尊量表(SES)
  const defaultAssessments: AssessmentItem[] = [
    {
      id: 'phq9',
      name: 'PHQ-9抑郁量表',
      description: '抑郁自评量表，9个问题帮助评估抑郁状态',
      tags: ['抑郁', '情绪', '心理健康'],
      time: '约5分钟',
      icon: <MehOutlined />,
      lastTaken: null,
      status: 'available'
    },
    {
      id: 'sas',
      name: '焦虑自评量表(SAS)',
      description: '焦虑自评量表，20个问题帮助评估焦虑程度',
      tags: ['焦虑', '情绪', '心理健康'],
      time: '约5分钟',
      icon: <AlertOutlined />,
      lastTaken: null,
      status: 'available'
    },
    {
      id: 'ses',
      name: '自尊量表(SES)',
      description: '自尊量表，10个问题帮助评估自我价值感和自我接纳程度',
      tags: ['自尊', '自我价值', '心理健康'],
      time: '约3分钟',
      icon: <HeartOutlined />,
      lastTaken: null,
      status: 'available'
    },
    {
      id: 'gad7',
      name: 'GAD-7焦虑量表',
      description: '广泛性焦虑自评量表，7个问题帮助评估焦虑症状',
      tags: ['焦虑', '情绪', '心理健康'],
      time: '约3分钟',
      icon: <AlertOutlined />,
      lastTaken: null,
      status: 'available'
    }
  ];
  
  useEffect(() => {
    // 从本地存储获取历史记录
    const loadData = () => {
      try {
        const localStorageHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
        
        // 按时间排序（最新的在前）
        const sortedHistory = localStorageHistory.sort((a: any, b: any) => {
          const dateA = a.createdAt || a.date;
          const dateB = b.createdAt || b.date;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        
        // 只显示最近5条
        const recentHistory = sortedHistory.slice(0, 5);
        setHistoryRecords(recentHistory);
        
        // 更新测评列表状态
        const updatedAssessments = [...defaultAssessments];
        
        // 查找每种测评的最新记录
        const testTypeMap: Record<string, any> = {};
        localStorageHistory.forEach((record: any) => {
          const type = record.type || record.assessmentType;
          const recordDate = record.createdAt || record.date;
          
          if (!testTypeMap[type] || new Date(recordDate) > new Date(testTypeMap[type].date)) {
            testTypeMap[type] = {
              date: recordDate,
              id: record.id
            };
          }
        });
        
        // 更新状态
        updatedAssessments.forEach(assessment => {
          if (testTypeMap[assessment.id]) {
            assessment.lastTaken = new Date(testTypeMap[assessment.id].date).toLocaleDateString();
            assessment.status = 'completed';
          }
        });
        
        setAssessmentsList(updatedAssessments);
        setLoading(false);
      } catch (error) {
        console.error('加载历史数据失败:', error);
        setAssessmentsList(defaultAssessments);
        setLoading(false);
      }
    };
    
    // 延时加载模拟真实API调用
    const timer = setTimeout(() => {
      loadData();
    }, 1000);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // 渲染测评卡片状态标签
  const renderStatusTag = (status: string, lastTaken: string | null) => {
    if (status === 'completed' && lastTaken) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          已完成 - 最近测评: {lastTaken}
        </Tag>
      );
    } else if (status === 'in_progress') {
      return (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          进行中
        </Tag>
      );
    } else {
      return (
        <Tag icon={<RightOutlined />} color="default">
          可开始
        </Tag>
      );
    }
  };
  
  // 渲染测评历史记录状态标签
  const renderHistoryStatusTag = (level: string) => {
    if (level.includes('正常') || level.includes('无')) {
      return <Tag color="success">正常</Tag>;
    } else if (level.includes('轻微') || level.includes('轻度')) {
      return <Tag color="warning">轻度</Tag>;
    } else if (level.includes('中度')) {
      return <Tag color="orange">中度</Tag>;
    } else if (level.includes('重度') || level.includes('严重')) {
      return <Tag color="error">严重</Tag>;
    } else {
      return <Tag color="default">{level}</Tag>;
    }
  };
  
  // 开始测评
  const startAssessment = (assessmentId: string) => {
    navigate(`/psychological/assessment/${assessmentId}`, { replace: false });
  };
  
  // 查看测评结果
  const viewResult = (recordId: string) => {
    navigate(`/psychological/results/${recordId}`, { replace: false });
  };
  
  // 前往历史记录
  const goToHistory = () => {
    navigate('/psychological/history', { replace: false });
  };
  
  return (
    <Container>
      <Title level={3}>心理测评中心</Title>
      <Paragraph>
        通过专业的心理测评量表了解自己的心理健康状况和职业倾向，获取个性化的成长建议。
      </Paragraph>
      
      <Row>
        <Col>
          <Button 
            type="primary" 
            icon={<HistoryOutlined />}
            onClick={goToHistory}
          >
            查看历史评估记录
          </Button>
        </Col>
      </Row>
      
      <Divider orientation="left">可用测评</Divider>
      <Row gutter={[16, 16]}>
        {assessmentsList.map(assessment => (
          <Col xs={24} sm={12} md={12} lg={8} key={assessment.id}>
            <AssessmentCard
              title={
                <Space>
                  {assessment.name}
                </Space>
              }
              extra={
                <TagWrapper>
                  <Tag color="blue">{assessment.tags.join(', ')}</Tag>
                </TagWrapper>
              }
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => startAssessment(assessment.id)}
                  block
                >
                  开始测评
                </Button>
              ]}
            >
              <Paragraph>{assessment.description}</Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  完成时间: {assessment.time}
                </Text>
                {renderStatusTag(assessment.status, assessment.lastTaken)}
              </Space>
            </AssessmentCard>
          </Col>
        ))}
      </Row>
      
      <Divider orientation="left">测评历史</Divider>
      {historyRecords.length > 0 ? (
        <StyledCard>
          <List
            dataSource={historyRecords}
            renderItem={record => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    onClick={() => viewResult(record.id)}
                  >
                    查看详情
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={record.name || record.assessmentName}
                  description={
                    <Space>
                      <Text type="secondary">测评日期: {new Date(record.date || record.createdAt).toLocaleDateString()}</Text>
                      {renderHistoryStatusTag(record.level)}
                    </Space>
                  }
                />
                <div>
                  <Statistic 
                    title="得分" 
                    value={record.score || record.totalScore} 
                    valueStyle={{ fontSize: '16px' }}
                  />
                </div>
              </List.Item>
            )}
          />
        </StyledCard>
      ) : (
        <CenteredEmpty description="暂无测评记录" />
      )}
      
      <Divider orientation="left">心理健康贴士</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <StyledCard title="心理健康自我提升">
            <ul>
              <li>保持规律作息，确保充足睡眠</li>
              <li>坚持锻炼，每天至少30分钟</li>
              <li>学会放松技巧，如冥想和深呼吸</li>
              <li>培养积极的自我对话习惯</li>
            </ul>
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StyledCard title="情绪管理技巧">
            <ul>
              <li>识别并命名你的情绪</li>
              <li>找到健康的情绪宣泄方式</li>
              <li>与信任的人分享你的感受</li>
              <li>学习认知重构技巧</li>
            </ul>
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StyledCard title="压力应对策略">
            <ul>
              <li>合理规划时间，避免拖延</li>
              <li>设定现实的期望和目标</li>
              <li>培养积极的应对机制</li>
              <li>寻求社会支持和专业帮助</li>
            </ul>
          </StyledCard>
        </Col>
      </Row>
    </Container>
  );
};

export default PsychologicalAssessment; 