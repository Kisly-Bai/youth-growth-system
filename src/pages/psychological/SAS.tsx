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
  Spin,
  Tag
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  AlertOutlined
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

// SAS量表题目
const questions = [
  { id: 1, content: '我感到比往常更加神经过敏和焦虑', isReverse: false },
  { id: 2, content: '我无缘无故感到担心', isReverse: false },
  { id: 3, content: '我容易心烦意乱或感到恐慌', isReverse: false },
  { id: 4, content: '我感到我的身体好像被分成几块，支离破碎', isReverse: false },
  { id: 5, content: '我感到事事都很顺利，不会有倒霉的事情发生', isReverse: true },
  { id: 6, content: '我的四肢抖动和震颤', isReverse: false },
  { id: 7, content: '我因头痛、颈痛、背痛而烦恼', isReverse: false },
  { id: 8, content: '我感到无力且容易疲劳', isReverse: false },
  { id: 9, content: '我感到很平静，能安静坐下来', isReverse: true },
  { id: 10, content: '我感到我的心跳较快', isReverse: false },
  { id: 11, content: '我因阵阵的眩晕而不舒服', isReverse: false },
  { id: 12, content: '我有阵阵要昏倒的感觉', isReverse: false },
  { id: 13, content: '我呼吸时进气和出气都不费力', isReverse: true },
  { id: 14, content: '我的手指和脚趾感到麻木和刺痛', isReverse: false },
  { id: 15, content: '我因胃痛和消化不良而苦恼', isReverse: false },
  { id: 16, content: '我必须时常排尿', isReverse: false },
  { id: 17, content: '我的手总是很温暖而干燥', isReverse: true },
  { id: 18, content: '我觉得脸发烧发红', isReverse: false },
  { id: 19, content: '我容易入睡，晚上休息很好', isReverse: true },
  { id: 20, content: '我做恶梦', isReverse: false }
];

// 选项
const options = [
  { label: '没有或很少有', value: 1 },
  { label: '有时有', value: 2 },
  { label: '大部分时间有', value: 3 },
  { label: '绝大多数时间有', value: 4 }
];

// 结果解释
const resultExplanation = {
  normal: {
    title: '正常范围',
    description: '您的焦虑程度在正常范围内，请继续保持良好的心理状态。',
    suggestions: [
      '继续保持积极的生活态度',
      '定期进行适度的体育锻炼',
      '保持健康的社交关系',
      '培养良好的休息和睡眠习惯'
    ]
  },
  mild: {
    title: '轻度焦虑',
    description: '您表现出轻度焦虑的症状，建议关注自己的心理健康状态。',
    suggestions: [
      '学习基础的放松技巧，如深呼吸和渐进性肌肉放松',
      '保持规律的生活作息',
      '适当减少压力源',
      '增加愉快的活动和休闲时间',
      '如症状持续，考虑咨询心理专业人士'
    ]
  },
  moderate: {
    title: '中度焦虑',
    description: '您表现出中度焦虑的症状，建议积极寻求帮助和支持。',
    suggestions: [
      '考虑寻求专业心理咨询或治疗',
      '学习并实践焦虑管理技巧',
      '与信任的朋友或家人分享您的感受',
      '保持规律的生活节奏和健康的生活方式',
      '减少咖啡因和酒精的摄入'
    ]
  },
  severe: {
    title: '重度焦虑',
    description: '您表现出重度焦虑的症状，强烈建议尽快寻求专业帮助。',
    suggestions: [
      '尽快咨询心理医生或精神科医生',
      '遵循专业人士的建议和治疗方案',
      '告知家人或朋友您的状况，获取支持',
      '学习并应用应对焦虑的技巧',
      '避免做重大决定，直到焦虑症状得到缓解'
    ]
  }
};

const SAS: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    standardScore: number;
    level: 'normal' | 'mild' | 'moderate' | 'severe';
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
  
  // 计算SAS得分
  const calculateScore = () => {
    // 计算原始分数
    let totalScore = 0;
    questions.forEach(question => {
      if (answers[question.id]) {
        totalScore += answers[question.id];
      }
    });
    
    // 标准分 = 原始分 × 1.25（四舍五入取整数）
    const standardScore = Math.round(totalScore * 1.25);
    
    // 判断焦虑程度
    let level: 'normal' | 'mild' | 'moderate' | 'severe';
    if (standardScore < 50) {
      level = 'normal';
    } else if (standardScore >= 50 && standardScore <= 59) {
      level = 'mild';
    } else if (standardScore >= 60 && standardScore <= 69) {
      level = 'moderate';
    } else {
      level = 'severe';
    }
    
    return {
      score: totalScore,
      standardScore,
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
      const resultId = `sas_${Date.now()}`;
      
      historyRecords.push({
        id: resultId,
        type: 'sas',
        name: '焦虑自评量表(SAS)',
        date: new Date().toISOString().split('T')[0],
        score: result.standardScore
      });
      
      localStorage.setItem('assessmentHistory', JSON.stringify(historyRecords));
      
      // 保存完整结果
      localStorage.setItem(`assessment_${resultId}`, JSON.stringify({
        id: resultId,
        type: 'sas',
        name: '焦虑自评量表(SAS)',
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
    
    const { standardScore, level } = result;
    const explanation = resultExplanation[level];
    
    let statusColor = 'success';
    if (level === 'mild') statusColor = 'warning';
    if (level === 'moderate') statusColor = 'warning';
    if (level === 'severe') statusColor = 'error';
    
    return (
      <ResultContainer>
        <Result
          status={level === 'normal' ? 'success' : 'warning'}
          title={`焦虑自评量表(SAS)测评结果：${standardScore}分`}
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
                <li>标准分低于50分：心理健康</li>
                <li>标准分50-59分：轻度焦虑</li>
                <li>标准分60-69分：中度焦虑</li>
                <li>标准分70分及以上：重度焦虑</li>
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
              description="本测评结果仅供参考，不构成医疗诊断。如有持续的不适感，请咨询专业心理医生或精神科医生。"
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
          <AlertOutlined style={{ marginRight: 8 }} />
          焦虑自评量表(SAS)
        </Title>
        
        <StyledAlert
          message="测评说明"
          description={
            <div>
              <p>下面有20条文字，请根据您最近一周的实际感觉，选择与您的情况相符的选项。</p>
              <p>每道题不要花费太久思考，凭第一印象回答即可。</p>
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
                  <Tag color="orange">反向计分题</Tag>
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

export default SAS; 