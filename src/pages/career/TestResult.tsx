import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Space, 
  Divider, 
  Row, 
  Col, 
  Progress, 
  Tag, 
  List,
  Alert,
  Empty,
  Spin
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined,
  ToolOutlined,
  ExperimentOutlined,
  HeartOutlined,
  TeamOutlined,
  TrophyOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { HollandCode } from '../../types';

const { Title, Text, Paragraph } = Typography;

// 样式组件
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const ResultContainer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const CodeTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
  margin: 4px;
`;

const CareerList = styled(List<string>)`
  margin-top: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
`;

// 霍兰德职业兴趣类型说明
interface HollandTypeDescription {
  title: string;
  description: string;
  characteristics: string[];
  careers: string[];
  icon: React.ReactNode;
}

interface HollandTestResultData {
  id: string;
  scores: Record<HollandCode, number>;
  primaryCode: HollandCode;
  secondaryCode: HollandCode;
  combinationCode: string;
  suitableCareers: string[];
  date: string;
}

const hollandTypeDescriptions: Record<HollandCode, HollandTypeDescription> = {
  [HollandCode.R]: {
    title: '现实型 (Realistic)',
    description: '喜欢使用工具从事操作性工作，动手能力强，做事手脚灵活，动作协调。偏好于具体任务，不善言辞，做事保守，较为谦虚。缺乏社交能力，通常喜欢独立做事。',
    characteristics: ['踏实稳重', '诚实可靠', '谦逊', '喜欢动手', '有技术技能'],
    careers: ['技术工程师', '机械师', '电工', '农民', '园艺师', '厨师', '木匠', '测量员'],
    icon: <ToolOutlined />
  },
  [HollandCode.I]: {
    title: '研究型 (Investigative)',
    description: '思想家而非实干家，抽象思维能力强，求知欲强，肯动脑，善思考，不愿动手。喜欢独立的和富有创造性的工作，知识渊博，有学识才能，不善于领导他人。',
    characteristics: ['分析性强', '善于思考', '好奇心强', '独立', '理性'],
    careers: ['科学家', '工程师', '医生', '计算机程序员', '数学家', '分析师', '研究员'],
    icon: <ExperimentOutlined />
  },
  [HollandCode.A]: {
    title: '艺术型 (Artistic)',
    description: '有创造力，乐于创造新颖、与众不同的成果，渴望表现自己的个性，实现自身的价值。做事理想化，追求完美，不重实际。具有一定的艺术才能和个性。',
    characteristics: ['富有创造力', '直觉敏锐', '独立', '有想象力', '情感丰富'],
    careers: ['艺术家', '音乐家', '作家', '演员', '设计师', '建筑师', '摄影师', '舞者'],
    icon: <HeartOutlined />
  },
  [HollandCode.S]: {
    title: '社会型 (Social)',
    description: '喜欢与人交往、不断结交新的朋友、善言谈、愿意教导别人。关心社会问题、渴望发挥自己的社会作用。寻求广泛的人际关系，比较看重社会义务和社会道德。',
    characteristics: ['友好', '乐于助人', '善解人意', '合作', '慷慨'],
    careers: ['教师', '辅导员', '心理咨询师', '社会工作者', '护士', '医疗服务人员', '人力资源专家'],
    icon: <TeamOutlined />
  },
  [HollandCode.E]: {
    title: '企业型 (Enterprising)',
    description: '追求权力、权威和物质财富，具有领导才能。喜欢竞争、敢冒风险、有野心/抱负。为人务实，习惯以利益得失、权利、地位、金钱等来衡量做事的价值。',
    characteristics: ['自信', '有说服力', '冒险精神', '外向', '有野心'],
    careers: ['经理', '律师', '政治家', '销售人员', '企业家', '市场营销人员', '房地产经纪人'],
    icon: <TrophyOutlined />
  },
  [HollandCode.C]: {
    title: '传统型 (Conventional)',
    description: '尊重权威和规章制度，喜欢按计划办事，细心、有条理，习惯接受他人的指挥和领导，自己不谋求领导职务，喜欢关注实际和细节情况。',
    characteristics: ['细致', '有条理', '服从', '实际', '高效'],
    careers: ['会计师', '银行职员', '文秘', '行政助理', '财务分析师', '税务专家', '图书管理员'],
    icon: <ScheduleOutlined />
  }
};

// 霍兰德类型与图标和颜色映射
const typeColorMap: Record<HollandCode, { color: string; icon: React.ReactNode }> = {
  [HollandCode.R]: { color: '#1890ff', icon: <ToolOutlined /> },
  [HollandCode.I]: { color: '#722ed1', icon: <ExperimentOutlined /> },
  [HollandCode.A]: { color: '#eb2f96', icon: <HeartOutlined /> },
  [HollandCode.S]: { color: '#52c41a', icon: <TeamOutlined /> },
  [HollandCode.E]: { color: '#fa8c16', icon: <TrophyOutlined /> },
  [HollandCode.C]: { color: '#13c2c2', icon: <ScheduleOutlined /> },
};

const TestResult: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<HollandTestResultData | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    // 获取测试结果
    const resultData = localStorage.getItem(`holland_${id}`);
    if (resultData) {
      setResult(JSON.parse(resultData));
    }
    
    setLoading(false);
  }, [id]);
  
  // 返回历史页面
  const backToHistory = () => {
    navigate('/career/history');
  };
  
  // 返回职业规划主页
  const backToCareerPlanning = () => {
    navigate('/career');
  };
  
  // 重新测试
  const retakeTest = () => {
    navigate('/career/holland');
  };
  
  // 渲染分数条
  const renderScoreBar = (type: HollandCode, score: number, maxScore: number) => {
    const description = hollandTypeDescriptions[type];
    const percent = (score / maxScore) * 100;
    
    return (
      <div key={type} style={{ marginBottom: 16 }}>
        <Space align="center">
          <CodeTag 
            icon={typeColorMap[type].icon} 
            color={typeColorMap[type].color}
          >
            {description.title}
          </CodeTag>
          <Text strong>{score}/{maxScore}分</Text>
        </Space>
        <Progress 
          percent={percent} 
          strokeColor={typeColorMap[type].color}
          showInfo={false}
          status="normal"
        />
      </div>
    );
  };
  
  if (loading) {
    return (
      <Container style={{ textAlign: 'center', paddingTop: 100 }}>
        <Spin tip="加载中..." size="large" />
      </Container>
    );
  }
  
  if (!result) {
    return (
      <Container>
        <Empty 
          description="未找到测试结果" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Space>
            <Button onClick={backToHistory}>
              返回历史记录
            </Button>
            <Button type="primary" onClick={retakeTest}>
              开始新测试
            </Button>
          </Space>
        </Empty>
      </Container>
    );
  }
  
  const { scores, primaryCode, secondaryCode, combinationCode, suitableCareers, date } = result;
  const primaryDescription = hollandTypeDescriptions[primaryCode];
  const secondaryDescription = hollandTypeDescriptions[secondaryCode];
  
  // 计算各类型的最大可能分数
  const maxScores = {
    [HollandCode.R]: 10,
    [HollandCode.I]: 10,
    [HollandCode.A]: 10,
    [HollandCode.S]: 10,
    [HollandCode.E]: 10,
    [HollandCode.C]: 10
  };
  
  return (
    <Container>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={backToHistory}
          style={{ padding: 0 }}
        >
          返回测试历史
        </Button>
        
        <ResultContainer>
          <StyledCard>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
              <Title level={2}>霍兰德职业兴趣测试结果</Title>
              <Text type="secondary">测试日期: {date}</Text>
              <div style={{ margin: '16px 0' }}>
                <Space size="large" wrap>
                  <CodeTag color={typeColorMap[primaryCode].color} icon={typeColorMap[primaryCode].icon}>
                    {primaryDescription.title} (主要)
                  </CodeTag>
                  <CodeTag color={typeColorMap[secondaryCode].color} icon={typeColorMap[secondaryCode].icon}>
                    {secondaryDescription.title} (次要)
                  </CodeTag>
                  <Tag color="blue">组合类型: {combinationCode}</Tag>
                </Space>
              </div>
            </div>
            
            <div style={{ textAlign: 'left', maxWidth: 800, margin: '0 auto' }}>
              <Divider orientation="left">职业兴趣类型分析</Divider>
              
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Title level={4}>主要类型: {primaryDescription.title}</Title>
                  <Paragraph>{primaryDescription.description}</Paragraph>
                  <Paragraph strong>性格特点:</Paragraph>
                  <ul>
                    {primaryDescription.characteristics.map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </Col>
                <Col xs={24} md={12}>
                  <Title level={4}>次要类型: {secondaryDescription.title}</Title>
                  <Paragraph>{secondaryDescription.description}</Paragraph>
                  <Paragraph strong>性格特点:</Paragraph>
                  <ul>
                    {secondaryDescription.characteristics.map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
              
              <Divider orientation="left">详细得分</Divider>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  {renderScoreBar(HollandCode.R, scores[HollandCode.R], maxScores[HollandCode.R])}
                  {renderScoreBar(HollandCode.I, scores[HollandCode.I], maxScores[HollandCode.I])}
                  {renderScoreBar(HollandCode.A, scores[HollandCode.A], maxScores[HollandCode.A])}
                </Col>
                <Col xs={24} md={12}>
                  {renderScoreBar(HollandCode.S, scores[HollandCode.S], maxScores[HollandCode.S])}
                  {renderScoreBar(HollandCode.E, scores[HollandCode.E], maxScores[HollandCode.E])}
                  {renderScoreBar(HollandCode.C, scores[HollandCode.C], maxScores[HollandCode.C])}
                </Col>
              </Row>
              
              <Divider orientation="left">职业推荐</Divider>
              <Alert
                message="根据您的霍兰德代码组合，以下是适合您的职业推荐"
                description={`您的组合代码为 ${combinationCode}，表示您具有较强的${primaryDescription.title}和${secondaryDescription.title}特质。`}
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              
              <CareerList
                header={<Title level={5}>推荐职业清单</Title>}
                bordered
                dataSource={suitableCareers}
                renderItem={career => (
                  <List.Item>
                    <Text>{career}</Text>
                  </List.Item>
                )}
              />
              
              <Alert
                message="提示"
                description="职业兴趣测试结果仅作为职业选择的参考依据，建议结合自身能力、教育背景、就业市场需求等多方面因素进行职业规划。"
                type="warning"
                showIcon
                style={{ marginTop: 24 }}
              />
              
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Space size="middle">
                  <Button onClick={backToCareerPlanning}>
                    返回职业规划
                  </Button>
                  <Button type="primary" onClick={retakeTest}>
                    重新测试
                  </Button>
                </Space>
              </div>
            </div>
          </StyledCard>
        </ResultContainer>
      </Space>
    </Container>
  );
};

export default TestResult; 