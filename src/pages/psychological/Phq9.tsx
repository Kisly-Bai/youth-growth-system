import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Radio, 
  Space, 
  Button, 
  Steps, 
  Progress,
  Divider,
  Row,
  Col,
  Modal,
  Spin,
  Tag
} from 'antd';
import { 
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

// PHQ-9量表题目数据
const questions = [
  { id: 1, content: '做什么事都感到没有兴趣或乐趣' },
  { id: 2, content: '感到心情低落' },
  { id: 3, content: '入睡困难、很难熟睡或睡太多' },
  { id: 4, content: '感到疲劳或无精打采' },
  { id: 5, content: '胃口不好或吃太多' },
  { id: 6, content: '觉得自己很糟，或很失败，或让自己或家人失望' },
  { id: 7, content: '注意力很难集中，例如阅读报纸或看电视' },
  { id: 8, content: '动作或说话速度缓慢到别人可察觉的程度，或正好相反—您烦躁或坐立不安，动来动去的情况比平常更严重' },
  { id: 9, content: '有不如死掉或用某种方式伤害自己的念头' }
];

// 难度评估问题
const difficultyQuestion = {
  content: '以上这些问题在您工作、处理家庭事务，或与他人相处上造成了多大的困难？',
  options: [
    { value: 0, label: '毫无困难' },
    { value: 1, label: '有点困难' },
    { value: 2, label: '非常困难' },
    { value: 3, label: '极度困难' }
  ]
};

// 评级标准
const levelStandards = [
  { level: 'none', min: 0, max: 4, name: '无抑郁症状', color: '#52c41a' },
  { level: 'mild', min: 5, max: 9, name: '轻度抑郁', color: '#faad14' },
  { level: 'moderate', min: 10, max: 14, name: '中度抑郁', color: '#fa8c16' },
  { level: 'severe', min: 15, max: 27, name: '重度抑郁', color: '#f5222d' }
];

const Phq9Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [difficultyAnswer, setDifficultyAnswer] = useState<number | null>(null);
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
  
  // 处理困难度选项变更
  const handleDifficultyChange = (value: number) => {
    setDifficultyAnswer(value);
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
    } else if (currentQuestion === questions.length - 1) {
      // 最后一题结束后，展示困难评估问题
      setCurrentQuestion(questions.length);
    }
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
    
    // 计算总分
    let totalScore = 0;
    Object.values(answers).forEach(score => {
      totalScore += score;
    });
    
    // 确定抑郁级别
    let level = '';
    for (const standard of levelStandards) {
      if (totalScore >= standard.min && totalScore <= standard.max) {
        level = standard.level;
        break;
      }
    }
    
    // 构建完整结果对象
    const resultId = `phq9_${Date.now()}`;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const detailedResult = {
      id: resultId,
      type: 'phq9',
      assessmentType: 'phq9',
      name: '抑郁症筛查量表 (PHQ-9)',
      date: formattedDate,
      createdAt: currentDate.toISOString(),
      totalScore: totalScore,
      score: totalScore,
      level: level,
      difficulty: difficultyAnswer,
      answers: Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        selectedValue: value
      })),
      feedback: level !== 'none' ? 
        '您有抑郁症状，建议关注自己的情绪变化并咨询专业人士。' : 
        '您没有明显抑郁症状，请继续保持良好的心理状态。'
    };
    
    // 构建简化历史记录对象
    const historyRecord = {
      id: resultId,
      type: 'phq9',
      assessmentType: 'phq9',
      name: '抑郁症筛查量表 (PHQ-9)',
      date: formattedDate,
      createdAt: currentDate.toISOString(),
      totalScore: totalScore,
      score: totalScore,
      level: level
    };
    
    // 模拟提交到服务器
    setTimeout(() => {
      // 保存到本地存储
      const historyRecords = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      historyRecords.push(historyRecord);
      localStorage.setItem('assessmentHistory', JSON.stringify(historyRecords));
      
      // 保存完整结果
      localStorage.setItem(`assessment_${resultId}`, JSON.stringify(detailedResult));
      
      // 显示结果
      setResults(detailedResult);
      setShowResult(true);
      setIsSubmitting(false);
    }, 1500);
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
    
    const levelName = getLevelName(results.level);
    const levelColor = getLevelColor(results.level);
    
    return (
      <ResultCard>
        <div style={{ padding: '20px' }}>
          <Title level={4}>测评完成</Title>
          <Paragraph>
            您的抑郁症状评估结果: <Text strong style={{ color: levelColor }}>{levelName}</Text>
          </Paragraph>
          
          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '4px', marginTop: '16px' }}>
            <Paragraph>
              <Text strong>总分:</Text> <Text style={{ color: levelColor }}>{results.totalScore} 分</Text>
            </Paragraph>
            
            <Divider />
            
            <Paragraph>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              <Text>PHQ-9得分范围为0-27分</Text>
            </Paragraph>
            <Paragraph>
              <Text>0-4分: 无抑郁症状</Text>
            </Paragraph>
            <Paragraph>
              <Text>5-9分: 轻度抑郁</Text>
            </Paragraph>
            <Paragraph>
              <Text>10-14分: 中度抑郁</Text>
            </Paragraph>
            <Paragraph>
              <Text>15分以上: 重度抑郁</Text>
            </Paragraph>
            
            <Paragraph style={{ marginTop: 16 }}>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              <Text type="secondary">
                {results.level !== 'none' ? 
                  '如果您的得分显示有抑郁症状，建议咨询专业心理医生进行进一步评估。' : 
                  '恭喜您！评估结果显示您没有明显抑郁症状。'}
              </Text>
            </Paragraph>
          </div>
          
          <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={viewDetailedResult} style={{ marginRight: 12 }}>
              查看详细报告
            </Button>
            <Button onClick={backToList}>
              返回测评列表
            </Button>
          </div>
        </div>
      </ResultCard>
    );
  };
  
  // 渲染题目导航
  const renderQuestionNavigation = () => {
    return (
      <>
        <Steps 
          direction="vertical" 
          size="small" 
          current={currentQuestion > questions.length ? questions.length : currentQuestion}
        >
          {questions.map((question, index) => {
            const isAnswered = isQuestionAnswered(question.id);
            
            return (
              <Step
                key={index}
                title={`问题 ${index + 1}`}
                description={
                  <Space>
                    <Text ellipsis style={{ maxWidth: 200 }}>{question.content}</Text>
                    {isAnswered && <Tag color="success">已回答</Tag>}
                  </Space>
                }
                onClick={() => setCurrentQuestion(index)}
                style={{ cursor: 'pointer' }}
              />
            );
          })}
          <Step
            title="功能评估"
            description="评估症状对日常生活的影响"
            onClick={() => {
              if (Object.keys(answers).length === questions.length) {
                setCurrentQuestion(questions.length);
              }
            }}
            style={{ cursor: 'pointer' }}
          />
        </Steps>
      </>
    );
  };
  
  if (showResult) {
    return (
      <Container>
        <Title level={3}>抑郁症筛查量表 (PHQ-9)</Title>
        {renderResultSummary()}
      </Container>
    );
  }
  
  return (
    <Container>
      <StyledCard>
        <Title level={3}>抑郁症筛查量表 (PHQ-9)</Title>
        <Paragraph>
          请根据过去两周内的感受，回答下列问题。每个问题有4个选项，从"完全不会"到"几乎每天"。
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
            {currentQuestion < questions.length ? (
              // 渲染PHQ-9问题
              <>
                <Title level={4}>
                  在过去两个星期，有多少时间您被以下问题所困扰?
                </Title>
                <Paragraph>
                  {currentQuestion + 1}. {questions[currentQuestion].content}
                </Paragraph>
                
                <Radio.Group 
                  onChange={(e) => handleOptionChange(e.target.value)}
                  value={answers[questions[currentQuestion].id]}
                  style={{ width: '100%', marginTop: 16 }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value={0}>完全不会 (0分)</Radio>
                    <Radio value={1}>几天 (1分)</Radio>
                    <Radio value={2}>一半以上的日子 (2分)</Radio>
                    <Radio value={3}>几乎每天 (3分)</Radio>
                  </Space>
                </Radio.Group>
              </>
            ) : (
              // 渲染困难度评估问题
              <>
                <Title level={4}>功能影响评估</Title>
                <Paragraph>
                  {difficultyQuestion.content}
                </Paragraph>
                
                <Radio.Group 
                  onChange={(e) => handleDifficultyChange(e.target.value)}
                  value={difficultyAnswer}
                  style={{ width: '100%', marginTop: 16 }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {difficultyQuestion.options.map(option => (
                      <Radio key={option.value} value={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </>
            )}
            
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
              ) : currentQuestion === questions.length - 1 ? (
                <Button 
                  type="primary"
                  onClick={handleNextQuestion}
                  disabled={!isQuestionAnswered(questions[currentQuestion].id)}
                >
                  下一步 <ArrowRightOutlined />
                </Button>
              ) : (
                <Button 
                  type="primary"
                  onClick={handleFinish}
                  disabled={difficultyAnswer === null}
                >
                  完成测评 <CheckCircleOutlined />
                </Button>
              )}
            </NavigationButtons>
          </QuestionCard>
        </Col>
        
        <Col xs={24} md={8}>
          <StyledCard title="测评进度">
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
          未回答的题目将被默认为选择"完全不会"。
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

export default Phq9Assessment; 