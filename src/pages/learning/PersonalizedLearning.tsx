import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Tabs, 
  Row, 
  Col, 
  Button, 
  Progress, 
  Space, 
  Tag, 
  List, 
  Statistic, 
  Skeleton,
  Input,
  Divider,
  Badge,
  Modal
} from 'antd';
import {
  RobotOutlined,
  BookOutlined,
  RocketOutlined,
  BarChartOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  BulbOutlined,
  StarOutlined,
  ExperimentOutlined,
  MessageOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  SendOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Meta } = Card;

// 样式组件
const Container = styled.div`
  padding: 0 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
`;

const WelcomeCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
  height: 200px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const WelcomeContent = styled.div`
  z-index: 2;
  padding: 0 24px;
`;

const CircleDecoration = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  right: -100px;
  top: -100px;
  z-index: 1;
`;

const SmallCircle = styled(CircleDecoration)`
  width: 150px;
  height: 150px;
  right: 50px;
  top: 100px;
  background: rgba(255, 255, 255, 0.15);
`;

const ResourceCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-cover img {
    height: 160px;
    object-fit: cover;
  }
  
  .ant-card-meta-title {
    margin-bottom: 8px !important;
  }
`;

const ChatContainer = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: ${props => props.isUser ? '12px 12px 0 12px' : '12px 12px 12px 0'};
  background: ${props => props.isUser ? '#1890ff' : 'white'};
  color: ${props => props.isUser ? 'white' : 'rgba(0, 0, 0, 0.85)'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ToolCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

// 模拟数据
const mockLearningPaths = [
  {
    id: 'path1',
    title: '高中数学提高训练',
    description: '针对高中数学各章节的系统化训练，帮助掌握核心知识点',
    progress: 35,
    level: '高中',
    subject: '数学',
    totalHours: 24,
    completedHours: 8.4,
    tags: ['函数', '三角', '概率'],
    recommendReason: '基于你的最近考试成绩分析，提升函数与几何部分'
  },
  {
    id: 'path2',
    title: '英语听力强化训练',
    description: '通过循序渐进的听力训练，提高英语听力理解能力和反应速度',
    progress: 68,
    level: '高中',
    subject: '英语',
    totalHours: 18,
    completedHours: 12.2,
    tags: ['听力', '口语', '词汇'],
    recommendReason: '听力部分是你的英语弱项，需要针对性训练'
  },
  {
    id: 'path3',
    title: '物理实验技能提升',
    description: '通过虚拟实验和操作指导，提高物理实验操作技能',
    progress: 12,
    level: '高中',
    subject: '物理',
    totalHours: 15,
    completedHours: 1.8,
    tags: ['实验', '力学', '电学'],
    recommendReason: '根据你的学习记录，实验技能需要加强'
  }
];

const mockResources = [
  {
    id: 'resource1',
    title: '函数与导数综合讲解',
    type: '视频',
    subject: '数学',
    coverImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
    duration: '45分钟',
    level: '高中',
    views: 2458,
    rating: 4.8,
    author: '李明教授'
  },
  {
    id: 'resource2',
    title: '英语四级听力真题解析',
    type: '音频',
    subject: '英语',
    coverImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
    duration: '60分钟',
    level: '高中',
    views: 1890,
    rating: 4.6,
    author: '英语教研组'
  },
  {
    id: 'resource3',
    title: '物理实验操作指南',
    type: '文档',
    subject: '物理',
    coverImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
    duration: '30页',
    level: '高中',
    views: 3245,
    rating: 4.9,
    author: '张教授'
  },
  {
    id: 'resource4',
    title: '化学方程式大全',
    type: '文档',
    subject: '化学',
    coverImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
    duration: '45页',
    level: '高中',
    views: 2156,
    rating: 4.7,
    author: '王老师'
  }
];

const mockTools = [
  {
    id: 'tool1',
    title: '智能公式计算器',
    description: '输入数学公式，自动计算结果并给出步骤详解',
    icon: <ExperimentOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    color: '#e6f7ff'
  },
  {
    id: 'tool2',
    title: '单词记忆助手',
    description: '通过科学记忆方法，快速记忆英语单词',
    icon: <BulbOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    color: '#f6ffed'
  },
  {
    id: 'tool3',
    title: '物理实验模拟器',
    description: '虚拟实验室，动手操作各种物理实验',
    icon: <ExperimentOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    color: '#f9f0ff'
  },
  {
    id: 'tool4',
    title: '知识图谱生成器',
    description: '将学习内容自动生成知识图谱，促进理解和记忆',
    icon: <RocketOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
    color: '#fff7e6'
  }
];

const mockMessages = [
  { id: 1, content: '你好！我是你的AI学习助手。有什么我可以帮助你的吗？', isUser: false },
  { id: 2, content: '我需要帮助理解三角函数的基本概念', isUser: true },
  { id: 3, content: '好的！三角函数是描述直角三角形中角度和边的比值关系的函数。最基本的三角函数有正弦(sin)、余弦(cos)和正切(tan)。我可以为你详细解释每一个概念，你想从哪个开始？', isUser: false },
];

// 个性化学习主组件
const PersonalizedLearning: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('paths');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(mockMessages);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // 发送消息到AI助手
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // 添加用户消息
    const newUserMessage = {
      id: chatMessages.length + 1,
      content: message,
      isUser: true
    };
    
    setChatMessages([...chatMessages, newUserMessage]);
    setMessage('');
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        content: generateAIResponse(message),
        isUser: false
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // 模拟AI响应生成
  const generateAIResponse = (question: string) => {
    // 简单的关键词匹配响应
    if (question.includes('三角函数')) {
      return '三角函数是描述直角三角形中角度和边的比值关系的函数。核心概念包括：\n1. 正弦(sin) = 对边/斜边\n2. 余弦(cos) = 邻边/斜边\n3. 正切(tan) = 对边/邻边\n\n我可以为你制作一个详细的学习计划来掌握三角函数，需要我继续详细解释吗？';
    } else if (question.includes('方程')) {
      return '方程是含有未知数的等式。解方程就是找出未知数的值，使等式成立。根据方程的类型，解法也不同：\n- 一元一次方程：ax + b = 0\n- 一元二次方程：ax² + bx + c = 0\n- 方程组等\n\n你想了解哪种类型的方程？';
    } else if (question.includes('英语') || question.includes('单词')) {
      return '提高英语水平需要系统学习：\n1. 词汇积累：每天学习10-20个新单词\n2. 听力训练：每天听15-30分钟英语材料\n3. 阅读实践：从简单文章开始，逐渐提高难度\n4. 口语练习：大声朗读或找伙伴对话\n\n我可以根据你的英语水平，制定个性化的学习计划。';
    } else {
      return '这是个很好的问题！我可以帮你详细解析这个知识点，并推荐一些练习题和学习资源。你想要深入了解这个话题的哪些方面呢？';
    }
  };

  // 渲染学习路径卡片
  const renderLearningPathCard = (path: any) => (
    <StyledCard key={path.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space>
              <Title level={4} style={{ margin: 0 }}>{path.title}</Title>
              <Tag color="#108ee9">{path.level}</Tag>
              <Tag color="#87d068">{path.subject}</Tag>
            </Space>
            
            <Paragraph style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
              {path.description}
            </Paragraph>
            
            <Space wrap>
              {path.tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
            
            <Paragraph style={{ margin: '8px 0' }}>
              <Text type="secondary">推荐理由：</Text>
              <Text>{path.recommendReason}</Text>
            </Paragraph>
            
            <Progress 
              percent={path.progress} 
              status="active"
              format={percent => `${percent}%`}
              style={{ marginBottom: 4 }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Text type="secondary">已完成 {path.completedHours}/{path.totalHours} 小时</Text>
              <Space>
                <Button type="primary" icon={<RocketOutlined />}>
                  继续学习
                </Button>
                <Button icon={<BarChartOutlined />}>
                  学习报告
                </Button>
              </Space>
            </div>
          </Space>
        </div>
      </div>
    </StyledCard>
  );

  // 渲染学习资源卡片
  const renderResourceCard = (resource: any) => (
    <Col xs={24} sm={12} md={8} lg={6} key={resource.id}>
      <ResourceCard
        hoverable
        cover={
          <div style={{ position: 'relative' }}>
            <img alt={resource.title} src={resource.coverImage} />
            <Tag style={{ position: 'absolute', top: 10, right: 10 }} color="#108ee9">
              {resource.type}
            </Tag>
          </div>
        }
        actions={[
          <Space>
            <StarOutlined key="rating" />
            <span>{resource.rating}</span>
          </Space>,
          <Space>
            <MessageOutlined key="comment" />
            <span>{resource.views}</span>
          </Space>,
          <Button type="link" icon={<PlayCircleOutlined />}>开始学习</Button>
        ]}
      >
        <Meta
          title={resource.title}
          description={
            <Space direction="vertical" size={0} style={{ width: '100%' }}>
              <Space>
                <Tag color="#87d068">{resource.subject}</Tag>
                <Tag color="#2db7f5">{resource.level}</Tag>
              </Space>
              <Space style={{ marginTop: 8 }}>
                <ClockCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                <Text type="secondary">{resource.duration}</Text>
                <Divider type="vertical" />
                <Text type="secondary">{resource.author}</Text>
              </Space>
            </Space>
          }
        />
      </ResourceCard>
    </Col>
  );

  // 渲染工具卡片
  const renderToolCard = (tool: any) => (
    <Col xs={24} sm={12} md={6} key={tool.id}>
      <ToolCard hoverable>
        <div style={{ 
          padding: '24px', 
          textAlign: 'center', 
          backgroundColor: tool.color
        }}>
          {tool.icon}
        </div>
        <div style={{ padding: '16px' }}>
          <Title level={4} style={{ marginTop: 0 }}>{tool.title}</Title>
          <Paragraph style={{ color: 'rgba(0, 0, 0, 0.65)', height: 60 }}>
            {tool.description}
          </Paragraph>
          <Button type="primary" block>
            启动工具
          </Button>
        </div>
      </ToolCard>
    </Col>
  );

  // 渲染AI对话
  const renderChatMessage = (message: any) => (
    <MessageBubble key={message.id} isUser={message.isUser}>
      {message.content}
    </MessageBubble>
  );

  if (loading) {
    return (
      <Container>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Col>
          <Col span={24}>
            <Skeleton active paragraph={{ rows: 10 }} />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      {/* 欢迎卡片 */}
      <WelcomeCard>
        <CircleDecoration />
        <SmallCircle />
        <WelcomeContent>
          <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
            你好，{user?.name || '同学'}
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16, marginBottom: 24 }}>
            基于你的学习情况，我们为你推荐了个性化学习内容。
          </Paragraph>
          <Space>
            <Statistic 
              title={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>学习时长</span>} 
              value={28.5} 
              suffix="小时"
              valueStyle={{ color: 'white' }}
            />
            <Divider type="vertical" style={{ height: 50, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
            <Statistic 
              title={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>完成课程</span>} 
              value={5} 
              suffix="个"
              valueStyle={{ color: 'white' }}
            />
            <Divider type="vertical" style={{ height: 50, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
            <Statistic 
              title={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>连续学习</span>} 
              value={7} 
              suffix="天"
              valueStyle={{ color: 'white' }}
            />
          </Space>
        </WelcomeContent>
      </WelcomeCard>

      {/* AI助手浮动按钮 */}
      <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
        <Badge dot>
          <Button 
            type="primary" 
            shape="circle" 
            icon={<RobotOutlined />} 
            size="large"
            onClick={() => setShowAIAssistant(true)}
            style={{ width: 60, height: 60, fontSize: 24, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          />
        </Badge>
      </div>

      {/* AI助手对话框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RobotOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <span>AI学习助手</span>
          </div>
        }
        open={showAIAssistant}
        onCancel={() => setShowAIAssistant(false)}
        footer={null}
        width={500}
      >
        <ChatContainer>
          {chatMessages.map(renderChatMessage)}
        </ChatContainer>
        <div style={{ display: 'flex', marginTop: 16 }}>
          <Input 
            placeholder="输入你的问题..." 
            value={message}
            onChange={e => setMessage(e.target.value)}
            onPressEnter={handleSendMessage}
            suffix={
              <SendOutlined 
                style={{ color: '#1890ff', cursor: 'pointer' }} 
                onClick={handleSendMessage}
              />
            }
          />
        </div>
      </Modal>

      {/* 主要内容区域 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane 
          tab={<span><RocketOutlined />学习路径</span>} 
          key="paths"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Paragraph style={{ fontSize: 16 }}>
                基于你的学习历史和能力评估，我们推荐以下学习路径：
              </Paragraph>
            </Col>
            
            <Col span={24}>
              {mockLearningPaths.map(renderLearningPathCard)}
            </Col>
            
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button icon={<PlusOutlined />} size="large">
                查看更多学习路径
              </Button>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><BookOutlined />学习资源库</span>} 
          key="resources"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Search 
                placeholder="搜索学习资源..." 
                enterButton="搜索" 
                size="large" 
                style={{ maxWidth: 500, marginBottom: 24 }}
              />
            </Col>
            
            <Col span={24}>
              <Tabs defaultActiveKey="all">
                <TabPane tab="全部" key="all" />
                <TabPane tab="数学" key="math" />
                <TabPane tab="英语" key="english" />
                <TabPane tab="物理" key="physics" />
                <TabPane tab="化学" key="chemistry" />
                <TabPane tab="生物" key="biology" />
                <TabPane tab="历史" key="history" />
                <TabPane tab="地理" key="geography" />
              </Tabs>
            </Col>
            
            <Col span={24}>
              <Row gutter={[24, 24]}>
                {mockResources.map(renderResourceCard)}
              </Row>
            </Col>
            
            <Col span={24} style={{ textAlign: 'center', marginTop: 16 }}>
              <Button icon={<PlusOutlined />} size="large">
                浏览更多学习资源
              </Button>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><BulbOutlined />智能学习工具</span>} 
          key="tools"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Paragraph style={{ fontSize: 16 }}>
                这些专业工具可以帮助你提高学习效率，解决学习难题：
              </Paragraph>
            </Col>
            
            <Col span={24}>
              <Row gutter={[24, 24]}>
                {mockTools.map(renderToolCard)}
              </Row>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><RobotOutlined />AI辅导</span>} 
          key="ai"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <StyledCard title="AI答疑解惑">
                <Paragraph style={{ fontSize: 16 }}>
                  向AI提出你的学习问题，获取即时解答和个性化辅导：
                </Paragraph>
                
                <ChatContainer>
                  {chatMessages.map(renderChatMessage)}
                </ChatContainer>
                
                <div style={{ display: 'flex', marginTop: 16 }}>
                  <Input 
                    placeholder="输入你的问题..." 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onPressEnter={handleSendMessage}
                    suffix={
                      <SendOutlined 
                        style={{ color: '#1890ff', cursor: 'pointer' }} 
                        onClick={handleSendMessage} 
                      />
                    }
                  />
                </div>
              </StyledCard>
            </Col>
            
            <Col xs={24} md={8}>
              <StyledCard title="热门问题">
                <List
                  dataSource={[
                    '如何解决二次方程？',
                    '英语四级考试备考建议',
                    '牛顿三大定律的应用',
                    '化学方程式配平技巧',
                    '如何提高阅读理解能力'
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <Button type="link" style={{ padding: 0, textAlign: 'left' }}>
                        {item}
                      </Button>
                    </List.Item>
                  )}
                />
              </StyledCard>
              
              <StyledCard title="AI功能" style={{ marginTop: 24 }}>
                <List
                  dataSource={[
                    { title: '作业批改', icon: <FileTextOutlined style={{ color: '#1890ff' }} /> },
                    { title: '知识点讲解', icon: <BulbOutlined style={{ color: '#52c41a' }} /> },
                    { title: '错题分析', icon: <ExperimentOutlined style={{ color: '#fa8c16' }} /> },
                    { title: '学习计划制定', icon: <RocketOutlined style={{ color: '#722ed1' }} /> }
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                        <span style={{ marginLeft: 8 }}>{item.title}</span>
                      </div>
                      <Button size="small">使用</Button>
                    </List.Item>
                  )}
                />
              </StyledCard>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Container>
  );
};

export default PersonalizedLearning; 