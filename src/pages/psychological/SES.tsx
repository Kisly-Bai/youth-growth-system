import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Radio, 
  Button, 
  Space, 
  Progress, 
  Divider, 
  Row, 
  Col,
  Result,
  Alert,
  Modal,
  Spin
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  HeartOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;

// 样式组件
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const QuestionCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
`;

const OptionButton = styled(Radio.Button)`
  height: auto;
  padding: 8px 16px;
  margin-bottom: 8px;
  white-space: normal;
  text-align: left;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 24px;
`;

const ResultContainer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

// SES量表题目
const questions = [
  { id: 1, content: '我感到我是一个有价值的人，至少与其他人在同一水平上。', isReverse: false },
  { id: 2, content: '我感到我有许多好的品质。', isReverse: false },
  { id: 3, content: '归根结底，我倾向于觉得自己是一个失败者。', isReverse: true },
  { id: 4, content: '我能像大多数人一样把事情做好。', isReverse: false },
  { id: 5, content: '我感到自己值得自豪的地方不多。', isReverse: true },
  { id: 6, content: '我对自己持肯定态度。', isReverse: false },
  { id: 7, content: '总的来说，我对自己是满意的。', isReverse: false },
  { id: 8, content: '我希望我能为自己赢得更多尊重。', isReverse: true },
  { id: 9, content: '我确实时常感到自己毫无用处。', isReverse: true },
  { id: 10, content: '我时常认为自己一无是处。', isReverse: true }
];

// 选项
const options = [
  { label: '非常符合', value: 4 },
  { label: '符合', value: 3 },
  { label: '不符合', value: 2 },
  { label: '很不符合', value: 1 }
];

// 结果解释
const resultExplanation = {
  low: {
    title: '较低自尊水平',
    description: '您的自尊水平较低，这表明您可能对自己的价值和能力评价不足。',
    suggestions: [
      '学习识别和挑战负面自我对话',
      '每天列出自己的三个优点或成就',
      '避免与过分批评您的人相处',
      '寻求专业心理咨询，学习建立自尊的技巧',
      '培养自我关爱和自我接纳的习惯'
    ]
  },
  medium: {
    title: '中等自尊水平',
    description: '您的自尊水平处于中等范围，有时您会对自己持有积极评价，有时则会自我怀疑。',
    suggestions: [
      '继续关注和发展您的优势和能力',
      '学习接受批评而不过分自责',
      '设定实际可行的目标并努力达成',
      '培养积极的自我对话习惯',
      '与支持您的人建立健康的关系'
    ]
  },
  high: {
    title: '较高自尊水平',
    description: '您的自尊水平较高，这表明您对自己持有积极的评价，相信自己的价值和能力。',
    suggestions: [
      '继续保持自信但同时保持谦虚',
      '帮助他人建立自尊',
      '在面对挑战时保持乐观态度',
      '继续发展您的技能和能力',
      '培养健康的自我批评能力，以促进个人成长'
    ]
  }
};

const SES: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    level: 'low' | 'medium' | 'high';
  } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 获取当前完成进度
  const getCompletionPercentage = () => {
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / questions.length) * 100);
  };
  
  // 处理选项变更
  const handleOptionChange = (value: number) => {
    const questionId = questions[currentQuestion].id;
    const isReverse = questions[currentQuestion].isReverse;
    
    // 计算实际分数（针对反向题目）
    const actualValue = isReverse ? 5 - value : value;
    
    setAnswers({
      ...answers,
      [questionId]: actualValue
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
    } else {
      // 最后一题，显示确认对话框
      setIsModalVisible(true);
    }
  };
  
  // 计算SES得分
  const calculateScore = () => {
    // 计算总分
    let totalScore = 0;
    questions.forEach(question => {
      if (answers[question.id]) {
        totalScore += answers[question.id];
      }
    });
    
    // 判断自尊水平
    let level: 'low' | 'medium' | 'high';
    if (totalScore < 20) {
      level = 'low';
    } else if (totalScore >= 20 && totalScore <= 30) {
      level = 'medium';
    } else {
      level = 'high';
    }
    
    return {
      score: totalScore,
      level
    };
  };
  
  // 提交测评
  const handleSubmit = () => {
    setIsModalVisible(false);
    setIsSubmitting(true);
    
    // 计算结果
    const result = calculateScore();
    
    // 模拟网络请求
    setTimeout(() => {
      // 保存到本地存储
      const historyRecords = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      const resultId = `ses_${Date.now()}`;
      
      historyRecords.push({
        id: resultId,
        type: 'ses',
        name: '自尊量表(SES)',
        date: new Date().toISOString().split('T')[0],
        score: result.score
      });
      
      localStorage.setItem('assessmentHistory', JSON.stringify(historyRecords));
      
      // 保存完整结果
      localStorage.setItem(`assessment_${resultId}`, JSON.stringify({
        id: resultId,
        type: 'ses',
        name: '自尊量表(SES)',
        date: new Date().toISOString().split('T')[0],
        answers,
        result
      }));
      
      setResult(result);
      setShowResult(true);
      setIsSubmitting(false);
    }, 1000);
  };
  
  // 返回测评列表
  const backToList = () => {
    navigate('/psychological');
  };
  
  // 渲染结果
  const renderResult = () => {
    if (!result) return null;
    
    const { score, level } = result;
    const explanation = resultExplanation[level];
    
    let statusColor = 'success';
    if (level === 'low') statusColor = 'warning';
    if (level === 'medium') statusColor = 'info';
    
    return (
      <ResultContainer>
        <Result
          status={level === 'high' ? 'success' : level === 'medium' ? 'info' : 'warning'}
          title={`自尊量表(SES)测评结果：${score}分`}
          subTitle={explanation.title}
          extra={[
            <Button 
              type="primary" 
              key="back" 
              onClick={backToList}
            >
              返回测评列表
            </Button>
          ]}
        >
          <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
            <Alert
              message={explanation.description}
              type={statusColor as any}
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Divider orientation="left">测评解释</Divider>
            <Paragraph>
              <ul>
                <li>10-19分：较低的自尊水平</li>
                <li>20-30分：中等的自尊水平</li>
                <li>31-40分：较高的自尊水平</li>
              </ul>
            </Paragraph>
            
            <Divider orientation="left">建议</Divider>
            <ul>
              {explanation.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
            
            <Alert
              message="提示"
              description="本测评结果仅供参考，不构成医疗诊断。如有需要，请咨询专业心理医生或咨询师。"
              type="info"
              showIcon
              style={{ marginTop: 24 }}
            />
          </div>
        </Result>
      </ResultContainer>
    );
  };
  
  // 当前问题展示值（针对反向题目）
  const getCurrentQuestionDisplayValue = () => {
    const questionId = questions[currentQuestion].id;
    const isReverse = questions[currentQuestion].isReverse;
    const answer = answers[questionId];
    
    if (answer === undefined) return undefined;
    
    // 展示值与实际存储值相反（针对反向题目）
    return isReverse ? 5 - answer : answer;
  };
  
  if (showResult) {
    return renderResult();
  }
  
  if (isSubmitting) {
    return (
      <Container style={{ textAlign: 'center', paddingTop: 100 }}>
        <Spin tip="正在计算测评结果..." size="large" />
      </Container>
    );
  }

  return (
    <Container>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={backToList}
          style={{ padding: 0 }}
        >
          返回测评列表
        </Button>
        
        <Title level={3}>
          <HeartOutlined style={{ marginRight: 8 }} />
          自尊量表(SES)
        </Title>
        
        <StyledAlert
          message="测评说明"
          description={
            <div>
              <p>这个量表用于了解您是怎样看待自己的。请仔细阅读每个问题，选择最符合您情况的选项。</p>
              <p>请注意，这里要回答的是您实际上认为您自己怎样，而不是回答您认为您应该怎样。答案无正确与错误或好与坏之分。</p>
            </div>
          }
          type="info"
          showIcon
        />
        
        <div>
          <Text>进度: {getCompletionPercentage()}%</Text>
          <Progress 
            percent={getCompletionPercentage()} 
            status="active" 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
        
        <QuestionCard>
          <Row>
            <Col span={24}>
              <Space style={{ marginBottom: 16 }}>
                <Text strong>{currentQuestion + 1}/{questions.length}</Text>
                {questions[currentQuestion].isReverse && (
                  <Text type="warning">(反向计分题)</Text>
                )}
              </Space>
              <Paragraph style={{ fontSize: 16 }}>
                {questions[currentQuestion].content}
              </Paragraph>
              
              <Divider />
              
              <Radio.Group 
                onChange={(e) => handleOptionChange(e.target.value)}
                value={getCurrentQuestionDisplayValue()}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {options.map(option => (
                    <OptionButton 
                      key={option.value} 
                      value={option.value}
                      style={{ width: '100%' }}
                    >
                      {option.label}
                    </OptionButton>
                  ))}
                </Space>
              </Radio.Group>
            </Col>
          </Row>
        </QuestionCard>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            上一题
          </Button>
          <Button 
            type="primary" 
            onClick={handleNextQuestion}
            disabled={answers[questions[currentQuestion].id] === undefined}
          >
            {currentQuestion < questions.length - 1 ? '下一题' : '完成测评'}
          </Button>
        </div>
      </Space>
      
      <Modal
        title="确认提交"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="确认提交"
        cancelText="继续检查"
      >
        <p>您已经完成所有问题，确认提交测评吗？</p>
        <p>提交后将无法修改答案。</p>
      </Modal>
    </Container>
  );
};

export default SES; 
