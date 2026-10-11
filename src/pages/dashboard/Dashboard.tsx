import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Divider, List, Tag, Button, Empty } from 'antd';
import { 
  ArrowUpOutlined, 
  HeartOutlined,
  BookOutlined,
  LineChartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 0 4px;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  border-radius: 8px;
  height: 100%;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-5px);
  }
`;

const ActionCard = styled(StyledCard)`
  cursor: pointer;
  background: linear-gradient(135deg, #1E90FF 0%, #48D1CC 100%);
  color: white;
  
  .ant-card-head-title {
    color: white;
  }
  
  .ant-card-body {
    color: white;
  }
`;

const StatisticContainer = styled.div`
  margin-bottom: 16px;
`;

const TagContainer = styled.div`
  margin-top: 8px;
`;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // 模拟数据加载效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 模拟数据
  const mockData = {
    psychological: {
      status: '正常',
      lastTestDate: '2023-05-20',
      testsDone: 8,
      improvement: 12
    },
    health: {
      sleepHours: 7.5,
      exerciseMinutes: 45,
      waterCups: 5,
      moodScore: 4
    },
    academic: {
      averageScore: 85,
      ranking: 15,
      totalStudents: 120,
      recentChange: 5
    },
    upcomingTasks: [
      { id: '1', title: '数学测试', dueDate: '2023-06-01', priority: 'high' },
      { id: '2', title: '英语作业', dueDate: '2023-05-28', priority: 'medium' },
      { id: '3', title: '物理实验报告', dueDate: '2023-06-05', priority: 'medium' },
    ],
    recentAssessments: [
      { id: '1', type: 'PHQ-9', date: '2023-05-20', score: 4, level: '正常' },
      { id: '2', type: 'GAD-7', date: '2023-05-10', score: 3, level: '正常' },
    ]
  };
  
  const renderPriorityTag = (priority: string) => {
    const colorMap: Record<string, string> = {
      high: 'red',
      medium: 'orange',
      low: 'green'
    };
    
    return <Tag color={colorMap[priority]}>{priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}</Tag>;
  };
  
  // 根据用户角色显示不同内容
  const renderRoleSpecificContent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case UserRole.STUDENT:
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <StyledCard title="心理状态" loading={loading}>
                <StatisticContainer>
                  <Statistic 
                    title="综合评估" 
                    value={mockData.psychological.status} 
                    valueStyle={{ color: '#52c41a' }}
                  />
                </StatisticContainer>
                <Text type="secondary">上次测评: {mockData.psychological.lastTestDate}</Text>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic 
                      title="已完成测评" 
                      value={mockData.psychological.testsDone} 
                      suffix="次"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="情绪改善" 
                      value={mockData.psychological.improvement} 
                      suffix="%" 
                      prefix={<ArrowUpOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                </Row>
              </StyledCard>
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={6}>
              <StyledCard title="健康数据" loading={loading}>
                <StatisticContainer>
                  <Statistic 
                    title="睡眠时长" 
                    value={mockData.health.sleepHours} 
                    suffix="小时" 
                    precision={1}
                  />
                </StatisticContainer>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic 
                      title="运动" 
                      value={mockData.health.exerciseMinutes} 
                      suffix="分钟"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="饮水" 
                      value={mockData.health.waterCups} 
                      suffix="杯"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="心情" 
                      value={mockData.health.moodScore} 
                      suffix="/5"
                    />
                  </Col>
                </Row>
              </StyledCard>
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={6}>
              <StyledCard title="学业情况" loading={loading}>
                <StatisticContainer>
                  <Statistic 
                    title="平均分" 
                    value={mockData.academic.averageScore} 
                    suffix="/100" 
                  />
                </StatisticContainer>
                <Text type="secondary">
                  班级排名: {mockData.academic.ranking}/{mockData.academic.totalStudents}
                </Text>
                <Divider style={{ margin: '12px 0' }} />
                <Statistic 
                  title="近期变化" 
                  value={mockData.academic.recentChange} 
                  prefix={<ArrowUpOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="名"
                />
              </StyledCard>
            </Col>
            
            <Col xs={24} sm={12} md={12} lg={6}>
              <ActionCard title="快速检测" loading={loading}>
                <Text>进行快速心理健康检测，只需5分钟</Text>
                <Button type="primary" ghost style={{ marginTop: 16 }}>
                  开始检测
                </Button>
              </ActionCard>
            </Col>
            
            <Col span={24}>
              <Divider orientation="left">待办任务</Divider>
              <StyledCard loading={loading}>
                {mockData.upcomingTasks.length > 0 ? (
                  <List
                    dataSource={mockData.upcomingTasks}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button type="link" size="small">完成</Button>,
                          <Button type="link" size="small">详情</Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={
                            <>
                              <Text type="secondary">截止日期: {item.dueDate}</Text>
                              <TagContainer>
                                {renderPriorityTag(item.priority)}
                              </TagContainer>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="暂无待办任务" />
                )}
              </StyledCard>
            </Col>
            
            <Col span={24}>
              <Divider orientation="left">最近测评结果</Divider>
              <StyledCard loading={loading}>
                {mockData.recentAssessments.length > 0 ? (
                  <List
                    dataSource={mockData.recentAssessments}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button type="link" size="small">查看详情</Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={`${item.type} 测评结果`}
                          description={
                            <>
                              <Text type="secondary">测评日期: {item.date}</Text>
                              <div>
                                <Text>得分: {item.score}, 评级: </Text>
                                <Tag color={item.level === '正常' ? 'green' : 'orange'}>
                                  {item.level}
                                </Tag>
                              </div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="暂无测评记录" />
                )}
              </StyledCard>
            </Col>
          </Row>
        );
        
      case UserRole.PARENT:
        return (
          <div>家长仪表盘内容</div>
        );
        
      case UserRole.TEACHER:
        return (
          <div>教师仪表盘内容</div>
        );
        
      default:
        return (
          <Empty description="无可用数据" />
        );
    }
  };
  
  return (
    <Container>
      <Title level={3}>欢迎回来，{user?.name || user?.username}！</Title>
      <Title level={5} type="secondary" style={{ marginTop: -4, marginBottom: 24 }}>
        这是您的个人成长仪表盘，一目了然地查看您的近况和进展。
      </Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StyledCard>
            <Statistic 
              title="心理测评模块"
              value={5}
              suffix="项"
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#1E90FF' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StyledCard>
            <Statistic 
              title="健康数据记录"
              value={30}
              suffix="天"
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StyledCard>
            <Statistic 
              title="学科分析"
              value={6}
              suffix="门"
              prefix={<BookOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StyledCard>
            <Statistic 
              title="本周专注时间"
              value={12.5}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
              precision={1}
            />
          </StyledCard>
        </Col>
      </Row>
      
      {renderRoleSpecificContent()}
    </Container>
  );
};

export default Dashboard; 