import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Radio, 
  Space, 
  Button, 
  Steps, 
  message, 
  Progress,
  Divider,
  Row,
  Col,
  Modal,
  Spin,
  Result
} from 'antd';
import { 
  QuestionCircleOutlined, 
  CheckCircleOutlined, 
  InfoCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const QuestionCard = styled(StyledCard)`
  margin-top: 24px;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const ProgressContainer = styled.div`
  margin: 24px 0;
`;

const ResultCard = styled(Card)`
  margin-top: 24px;
  text-align: center;
`;

// 量表题目数据
const questions = [
  { id: 1, content: '我不喜欢参加学校的课外活动。' },
  { id: 2, content: '我心情时好时坏。' },
  { id: 3, content: '做作业必须反复检查。' },
  { id: 4, content: '感到人们对我不友好，不喜欢我。' },
  { id: 5, content: '我感到苦闷。' },
  { id: 6, content: '我感到紧张或容易紧张。' },
  { id: 7, content: '我学习劲头时高时低。' },
  { id: 8, content: '我对现在的学校生活感到不适应。' },
  { id: 9, content: '我看不惯现在的社会风气。' },
  { id: 10, content: '为保证正确，做事必须做得很慢。' },
  { id: 11, content: '我的想法总与别人不一样。' },
  { id: 12, content: '总担心自己的衣服是否整齐。' },
  { id: 13, content: '容易哭泣。' },
  { id: 14, content: '我感到前途没有希望。' },
  { id: 15, content: '我感到坐立不安，心神不定。' },
  { id: 16, content: '经常责怪自己。' },
  { id: 17, content: '当别人看着我或谈论我时，感到不自在。' },
  { id: 18, content: '感到别人不理解我，不同情我。' },
  { id: 19, content: '我常发脾气，想控制但控制不住。' },
  { id: 20, content: '觉得别人想占我的便宜。' },
  { id: 21, content: '大叫或摔东西。' },
  { id: 22, content: '总在想一些不必要的事情。' },
  { id: 23, content: '必须反复洗手或反复数数。' },
  { id: 24, content: '总感到有人在背后谈论我。' },
  { id: 25, content: '时常与人争论、抬杠。' },
  { id: 26, content: '我觉得对大多数人都不可信任。' },
  { id: 27, content: '我对做作业的热情忽高忽低。' },
  { id: 28, content: '同学考试成绩比我高，我感到难过。' },
  { id: 29, content: '我不适应老师的教学方法。' },
  { id: 30, content: '老师对我不公平。' },
  { id: 31, content: '我感到学习负担很重。' },
  { id: 32, content: '我对同学忽冷忽热。' },
  { id: 33, content: '上课时，总担心老师会提问自己。' },
  { id: 34, content: '我无缘无故地突然感到害怕。' },
  { id: 35, content: '我对老师时而亲近，时而疏远。' },
  { id: 36, content: '一听说要考试，心里就感到紧张。' },
  { id: 37, content: '别的同学穿戴比我好，有钱，我感到不舒服。' },
  { id: 38, content: '我讨厌做作业。' },
  { id: 39, content: '家里环境干扰我的学习。' },
  { id: 40, content: '我讨厌上学。' },
  { id: 41, content: '我不喜欢班里的风气。' },
  { id: 42, content: '父母对我不公平。' },
  { id: 43, content: '感到心里烦躁。' },
  { id: 44, content: '我常常无精打采，提不起劲来。' },
  { id: 45, content: '我感情容易受到别人的伤害。' },
  { id: 46, content: '觉得心里不踏实。' },
  { id: 47, content: '别人对我的表现评价不恰当。' },
  { id: 48, content: '明知担心没有用，但总害怕考不好。' },
  { id: 49, content: '总觉得别人在跟我作对。' },
  { id: 50, content: '我容易激动和烦恼。' },
  { id: 51, content: '同异性在一起时，感到害羞不自在。' },
  { id: 52, content: '有想伤害他人或打人的冲动。' },
  { id: 53, content: '我对父母时而亲热，时而冷淡。' },
  { id: 54, content: '我对比我强的同学并不服气。' },
  { id: 55, content: '我讨厌考试。' },
  { id: 56, content: '心里总觉得有事。' },
  { id: 57, content: '经常有自杀的念头。' },
  { id: 58, content: '有想摔东西的冲动。' },
  { id: 59, content: '要求别人十全十美。' },
  { id: 60, content: '同学考试成绩比我高，但能力并不比我强。' }
];

// 量表因子维度
const dimensions = [
  { 
    id: 'obsessive', 
    name: '强迫症状', 
    questions: [3, 10, 12, 22, 23, 48],
    description: '该因子反映受试者做作业必须反复检查，反复数数，总在想一些不必要的事情，总害怕考试成绩不好等强迫症状。'
  },
  { 
    id: 'paranoid', 
    name: '偏执', 
    questions: [11, 20, 24, 26, 47, 49],
    description: '该因子反映受试者觉得别人占自己便宜，别人在背后议论自己，对多数人不信任，别人对自己评价不适当，别人跟自己作对等偏执问题。'
  },
  { 
    id: 'hostility', 
    name: '敌对', 
    questions: [19, 21, 25, 50, 52, 58],
    description: '该因子反映受试者控制不住自己脾气，经常与别人争论，容易激动，有摔东西的冲动等。'
  },
  { 
    id: 'interpersonal', 
    name: '人际关系紧张与敏感', 
    questions: [4, 17, 18, 45, 51, 59],
    description: '该因子反映受试者别人不理解自己，别人对自己不友好，感情容易受到别人伤害，对别人求全责备，同异性在一起感到不自在等问题。'
  },
  { 
    id: 'depression', 
    name: '抑郁', 
    questions: [5, 13, 14, 16, 44, 57],
    description: '该因子反映受试者感到生活单调，感到自己没有前途，容易哭泣，责备自己，无精打采等问题。'
  },
  { 
    id: 'anxiety', 
    name: '焦虑', 
    questions: [6, 15, 34, 43, 46, 56],
    description: '该因子反映受试者感到紧张，心神不定，无缘无故的害怕，心里烦躁，心里不踏实等问题。'
  },
  { 
    id: 'learning_pressure', 
    name: '学习压力', 
    questions: [31, 33, 36, 38, 40, 55],
    description: '该因子反映受试者感到学习负担重，怕老师提问，讨厌做作业，讨厌上学，害怕和讨厌考试等问题。'
  },
  { 
    id: 'maladaptation', 
    name: '适应不良', 
    questions: [1, 8, 9, 29, 39, 41],
    description: '该因子反映受试者对学校生活不适应，不愿参加课外活动，不适应老师教学方法，不适应家里学习环境等问题。'
  },
  { 
    id: 'emotional_instability', 
    name: '情绪不平衡', 
    questions: [2, 7, 27, 32, 35, 53],
    description: '该因子反映受试者情绪不稳定，对老师和同学以及父母，学习忽高忽低等问题。'
  },
  { 
    id: 'psychological_imbalance', 
    name: '心理不平衡', 
    questions: [28, 30, 37, 42, 54, 60],
    description: '该因子反映受试者感到老师和父母对自己不公平、对同学比自己成绩好难过和不服气等问题。'
  }
];

// 评级标准
const levelStandards = [
  { level: 'normal', min: 1, max: 1.99, name: '正常', color: '#52c41a' },
  { level: 'mild', min: 2, max: 2.99, name: '轻度', color: '#faad14' },
  { level: 'moderate', min: 3, max: 3.99, name: '中度', color: '#fa8c16' },
  { level: 'severe', min: 4, max: 4.99, name: '偏重', color: '#f5222d' },
  { level: 'very_severe', min: 5, max: 5, name: '严重', color: '#a8071a' }
];

const MSSmhsAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // 检查题目是否已回答
  const isQuestionAnswered = (questionId: number) => {
    return answers[questionId] !== undefined;
  };
  
  // 获取当前完成进度
  const getCompletionPercentage = () => {
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / questions.length) * 100);
  };
  
  // 处理选项变更
  const handleOptionChange = (value: number) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    });
  };
  
  // 前往上一题
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // 前往下一题
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // 跳转到指定题目
  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };
  
  // 完成测评
  const handleFinish = () => {
    if (Object.keys(answers).length < questions.length) {
      setIsModalVisible(true);
    } else {
      submitAssessment();
    }
  };
  
  // 强制提交
  const forceSubmit = () => {
    setIsModalVisible(false);
    submitAssessment();
  };
  
  // 计算结果并提交
  const submitAssessment = () => {
    setIsSubmitting(true);
    
    // 计算总分和各维度分数
    let totalScore = 0;
    const dimensionScores: {[key: string]: {score: number, average: number, level: string}} = {};
    
    // 计算各维度得分
    dimensions.forEach(dimension => {
      let dimensionScore = 0;
      
      dimension.questions.forEach(qId => {
        dimensionScore += answers[qId] || 1; // 默认为1分
      });
      
      const average = dimensionScore / dimension.questions.length;
      const level = getLevelFromScore(average);
      
      dimensionScores[dimension.id] = {
        score: dimensionScore,
        average,
        level
      };
    });
    
    // 计算总分
    Object.values(answers).forEach(score => {
      totalScore += score;
    });
    
    const totalAverage = totalScore / questions.length;
    const totalLevel = getLevelFromScore(totalAverage);
    
    // 构建结果对象
    const result = {
      totalScore,
      totalAverage,
      totalLevel,
      dimensionScores,
      answers,
      date: new Date().toISOString().split('T')[0],
      id: `mssmhs_${Date.now()}`
    };
    
    // 模拟提交到服务器
    setTimeout(() => {
      // 保存到本地存储
      const historyRecords = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      historyRecords.push({
        id: result.id,
        type: 'mssmhs',
        name: '中国中学生心理健康量表',
        date: result.date,
        totalScore: result.totalScore,
        totalAverage: result.totalAverage,
        totalLevel: result.totalLevel
      });
      localStorage.setItem('assessmentHistory', JSON.stringify(historyRecords));
      
      // 保存完整结果
      localStorage.setItem(`assessment_${result.id}`, JSON.stringify(result));
      
      // 显示结果
      setResults(result);
      setShowResult(true);
      setIsSubmitting(false);
    }, 1500);
  };
  
  // 获取级别评定
  const getLevelFromScore = (score: number) => {
    for (const standard of levelStandards) {
      if (score >= standard.min && score <= standard.max) {
        return standard.level;
      }
    }
    return 'unknown';
  };
  
  // 获取级别名称
  const getLevelName = (level: string) => {
    const standard = levelStandards.find(s => s.level === level);
    return standard ? standard.name : '未知';
  };
  
  // 获取级别颜色
  const getLevelColor = (level: string) => {
    const standard = levelStandards.find(s => s.level === level);
    return standard ? standard.color : '#000000';
  };
  
  // 返回测评列表
  const backToList = () => {
    navigate('/psychological');
  };
  
  // 查看详细结果
  const viewDetailedResult = () => {
    navigate(`/psychological/results/${results.id}`);
  };
  
  // 渲染结果摘要
  const renderResultSummary = () => {
    if (!results) return null;
    
    const totalLevelName = getLevelName(results.totalLevel);
    const totalLevelColor = getLevelColor(results.totalLevel);
    
    return (
      <ResultCard>
        <Result
          status={results.totalLevel === 'normal' ? 'success' : 'warning'}
          title={`测评完成`}
          subTitle={`您的心理健康总体水平: ${totalLevelName}`}
          extra={[
            <Button type="primary" key="details" onClick={viewDetailedResult}>
              查看详细报告
            </Button>,
            <Button key="back" onClick={backToList}>
              返回测评列表
            </Button>
          ]}
        >
          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '4px' }}>
            <Paragraph>
              <Text strong>测评总均分:</Text> <Text style={{ color: totalLevelColor }}>{results.totalAverage.toFixed(2)}</Text>
            </Paragraph>
            
            <Divider />
            
            <Paragraph>
              <Text strong>需要关注的维度:</Text>
            </Paragraph>
            
            <ul>
              {Object.entries(results.dimensionScores)
                .filter(([_, data]: [string, any]) => data.level !== 'normal')
                .sort((a: [string, any], b: [string, any]) => b[1].average - a[1].average)
                .slice(0, 3)
                .map(([dimId, data]: [string, any]) => {
                  const dimension = dimensions.find(d => d.id === dimId);
                  const levelName = getLevelName(data.level);
                  const levelColor = getLevelColor(data.level);
                  
                  return (
                    <li key={dimId}>
                      <Text>{dimension?.name}:</Text> <Text style={{ color: levelColor }}>{data.average.toFixed(2)} ({levelName})</Text>
                    </li>
                  );
                })}
            </ul>
            
            <Paragraph style={{ marginTop: 16 }}>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              <Text type="secondary">点击"查看详细报告"获取完整分析和建议</Text>
            </Paragraph>
          </div>
        </Result>
      </ResultCard>
    );
  };
  
  // 渲染题目导航
  const renderQuestionNavigation = () => {
    const items = [];
    
    // 每10题分为一组
    for (let i = 0; i < questions.length; i += 10) {
      const groupEnd = Math.min(i + 9, questions.length - 1);
      const title = `${i + 1}-${groupEnd + 1}`;
      
      items.push({
        title,
        description: (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {Array.from({ length: 10 }, (_, index) => {
              const questionIndex = i + index;
              if (questionIndex < questions.length) {
                const questionId = questions[questionIndex].id;
                const isAnswered = isQuestionAnswered(questionId);
                
                return (
                  <Button
                    key={questionIndex}
                    type={currentQuestion === questionIndex ? 'primary' : 'default'}
                    shape="circle"
                    size="small"
                    style={{
                      backgroundColor: isAnswered ? (currentQuestion === questionIndex ? undefined : '#f0f7ff') : undefined,
                      borderColor: isAnswered ? (currentQuestion === questionIndex ? undefined : '#91caff') : undefined
                    }}
                    onClick={() => goToQuestion(questionIndex)}
                  >
                    {questionIndex + 1}
                  </Button>
                );
              }
              return null;
            }).filter(Boolean)}
          </div>
        )
      });
    }
    
    return (
      <Steps
        direction="vertical"
        size="small"
        current={Math.floor(currentQuestion / 10)}
        items={items}
      />
    );
  };
  
  if (showResult) {
    return (
      <Container>
        <Title level={3}>中国中学生心理健康量表 (MSSMHS)</Title>
        {renderResultSummary()}
      </Container>
    );
  }
  
  return (
    <Container>
      <StyledCard>
        <Title level={3}>中国中学生心理健康量表 (MSSMHS)</Title>
        <Paragraph>
          本量表共包含60个题目，用于评估中学生的心理健康状况。请根据您的真实情况选择最符合的选项。
        </Paragraph>
        
        <Divider />
        
        <ProgressContainer>
          <Row align="middle" gutter={16}>
            <Col span={18}>
              <Progress 
                percent={getCompletionPercentage()} 
                status="active"
                strokeColor={{ 
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Text type="secondary">
                已完成 {Object.keys(answers).length}/{questions.length}
              </Text>
            </Col>
          </Row>
        </ProgressContainer>
      </StyledCard>
      
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <QuestionCard>
            <Title level={4}>
              {currentQuestion + 1}. {questions[currentQuestion].content}
            </Title>
            
            <Radio.Group 
              onChange={(e) => handleOptionChange(e.target.value)}
              value={answers[questions[currentQuestion].id]}
              style={{ width: '100%', marginTop: 16 }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value={1}>无 - 自觉该项目无问题</Radio>
                <Radio value={2}>轻度 - 自觉有该项目问题，轻度出现</Radio>
                <Radio value={3}>中度 - 自觉有该项目症状，其程度为中度</Radio>
                <Radio value={4}>偏重 - 自觉有该项目症状，其程度为中等严重</Radio>
                <Radio value={5}>严重 - 自觉有该项目症状，已达到非常严重程度</Radio>
              </Space>
            </Radio.Group>
            
            <NavigationButtons>
              <Button 
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                <ArrowLeftOutlined /> 上一题
              </Button>
              
              {currentQuestion < questions.length - 1 ? (
                <Button 
                  type="primary"
                  onClick={handleNextQuestion}
                  disabled={!isQuestionAnswered(questions[currentQuestion].id)}
                >
                  下一题 <ArrowRightOutlined />
                </Button>
              ) : (
                <Button 
                  type="primary"
                  onClick={handleFinish}
                >
                  完成测评 <CheckCircleOutlined />
                </Button>
              )}
            </NavigationButtons>
          </QuestionCard>
        </Col>
        
        <Col xs={24} md={8}>
          <StyledCard title="题目导航">
            {renderQuestionNavigation()}
          </StyledCard>
        </Col>
      </Row>
      
      <Modal
        title="确认提交"
        open={isModalVisible}
        onOk={forceSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="继续提交"
        cancelText="返回完成"
      >
        <Text>您有 {questions.length - Object.keys(answers).length} 题未回答，确定要提交吗？</Text>
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          未回答的题目将被默认为选择"无"。
        </Text>
      </Modal>
      
      <Modal
        title="提交中"
        open={isSubmitting}
        footer={null}
        closable={false}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16 }}>
            正在计算测评结果，请稍候...
          </Text>
        </div>
      </Modal>
    </Container>
  );
};

export default MSSmhsAssessment; 