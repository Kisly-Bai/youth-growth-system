import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Radio, 
  Button, 
  Progress, 
  Space, 
  Divider,
  Steps
} from 'antd';
import { HollandCode } from '../../../types';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;

interface HollandTestProps {
  onComplete: (results: {
    scores: Record<HollandCode, number>;
    primaryCode: HollandCode;
    secondaryCode: HollandCode;
  }) => void;
}

interface Question {
  id: number;
  text: string;
  type: HollandCode;
}

const StepContainer = styled.div`
  margin-bottom: 24px;
`;

const QuestionCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
`;

const ProgressContainer = styled.div`
  margin: 20px 0;
`;

// 模拟霍兰德兴趣测试的问题
const testQuestions: Question[] = [
  // 实用型(R)问题
  { id: 1, text: "我喜欢使用工具和机械设备", type: HollandCode.R },
  { id: 2, text: "我擅长修理电器或机械设备", type: HollandCode.R },
  { id: 3, text: "我喜欢户外活动和体力工作", type: HollandCode.R },
  { id: 4, text: "我喜欢通过动手操作来解决问题", type: HollandCode.R },
  { id: 5, text: "我对建造或制作物品很感兴趣", type: HollandCode.R },
  
  // 研究型(I)问题
  { id: 6, text: "我喜欢分析信息和解决复杂问题", type: HollandCode.I },
  { id: 7, text: "我对科学研究和实验很感兴趣", type: HollandCode.I },
  { id: 8, text: "我喜欢思考抽象概念", type: HollandCode.I },
  { id: 9, text: "我喜欢探索未知领域和发现新知识", type: HollandCode.I },
  { id: 10, text: "我喜欢独立思考和研究", type: HollandCode.I },
  
  // 艺术型(A)问题
  { id: 11, text: "我喜欢创作艺术作品或表演", type: HollandCode.A },
  { id: 12, text: "我有较强的想象力和创造力", type: HollandCode.A },
  { id: 13, text: "我喜欢音乐、戏剧或文学作品", type: HollandCode.A },
  { id: 14, text: "我能用艺术形式表达自己的想法和情感", type: HollandCode.A },
  { id: 15, text: "我对创新和非传统的方法很感兴趣", type: HollandCode.A },
  
  // 社会型(S)问题
  { id: 16, text: "我喜欢帮助他人解决问题", type: HollandCode.S },
  { id: 17, text: "我对教导和培训他人很感兴趣", type: HollandCode.S },
  { id: 18, text: "我善于与人沟通和合作", type: HollandCode.S },
  { id: 19, text: "我关心社会问题和他人福祉", type: HollandCode.S },
  { id: 20, text: "我喜欢参与社区服务和志愿活动", type: HollandCode.S },
  
  // 企业型(E)问题
  { id: 21, text: "我喜欢领导和管理团队", type: HollandCode.E },
  { id: 22, text: "我善于说服他人接受我的想法", type: HollandCode.E },
  { id: 23, text: "我有较强的竞争意识", type: HollandCode.E },
  { id: 24, text: "我喜欢冒险和承担风险", type: HollandCode.E },
  { id: 25, text: "我乐于在公开场合发表演讲", type: HollandCode.E },
  
  // 常规型(C)问题
  { id: 26, text: "我喜欢有条理地整理数据和信息", type: HollandCode.C },
  { id: 27, text: "我注重细节和准确性", type: HollandCode.C },
  { id: 28, text: "我喜欢按照明确的规则和程序工作", type: HollandCode.C },
  { id: 29, text: "我擅长处理文书工作和数据管理", type: HollandCode.C },
  { id: 30, text: "我喜欢有计划和安排的工作环境", type: HollandCode.C },
];

// 按照类型分组测试问题
const groupedQuestions = Object.values(HollandCode).map(code => {
  return testQuestions.filter(q => q.type === code);
});

// 评分选项
const options = [
  { label: '非常不符合', value: 1 },
  { label: '不太符合', value: 2 },
  { label: '一般', value: 3 },
  { label: '比较符合', value: 4 },
  { label: '非常符合', value: 5 },
];

const HollandTest: React.FC<HollandTestProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // 当前步骤的问题
  const currentQuestions = currentStep < groupedQuestions.length 
    ? groupedQuestions[currentStep] 
    : [];
    
  // 总问题数
  const totalQuestions = testQuestions.length;
  
  // 已回答的问题数
  const answeredCount = Object.keys(answers).length;
  
  // 完成百分比
  const completionPercentage = Math.floor((answeredCount / totalQuestions) * 100);
  
  // 当前类型标题
  const getStepTitle = (step: number): string => {
    if (step >= Object.values(HollandCode).length) return '';
    
    const types = {
      [HollandCode.R]: '实用型 (Realistic)',
      [HollandCode.I]: '研究型 (Investigative)',
      [HollandCode.A]: '艺术型 (Artistic)',
      [HollandCode.S]: '社会型 (Social)',
      [HollandCode.E]: '企业型 (Enterprising)',
      [HollandCode.C]: '常规型 (Conventional)',
    };
    
    return types[Object.values(HollandCode)[step]];
  };
  
  // 处理答案更改
  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // 处理下一步
  const handleNext = () => {
    if (currentStep < groupedQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  // 处理上一步
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // 计算得分并提交结果
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // 计算每个类型的得分
    const scores: Record<HollandCode, number> = {
      [HollandCode.R]: 0,
      [HollandCode.I]: 0,
      [HollandCode.A]: 0,
      [HollandCode.S]: 0,
      [HollandCode.E]: 0,
      [HollandCode.C]: 0,
    };
    
    // 累加每个类型的分数
    testQuestions.forEach(question => {
      const answer = answers[question.id] || 0;
      scores[question.type] += answer;
    });
    
    // 计算百分比分数
    Object.keys(scores).forEach(key => {
      const maxPossible = 5 * 5; // 每类型5题，每题最高5分
      const type = key as HollandCode;
      scores[type] = Math.round((scores[type] / maxPossible) * 100);
    });
    
    // 找出得分最高的两个类型
    const sortedCodes = Object.entries(scores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([code]) => code as HollandCode);
    
    const primaryCode = sortedCodes[0];
    const secondaryCode = sortedCodes[1];
    
    // 模拟网络延迟
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete({
        scores,
        primaryCode,
        secondaryCode
      });
    }, 1000);
  };
  
  // 检查当前步骤是否所有问题都已回答
  const isCurrentStepComplete = () => {
    if (!currentQuestions.length) return true;
    return currentQuestions.every(q => answers[q.id]);
  };
  
  // 渲染当前页面的问题
  const renderQuestions = () => {
    return currentQuestions.map(question => (
      <QuestionCard key={question.id}>
        <Paragraph strong>{question.id}. {question.text}</Paragraph>
        <Radio.Group
          options={options}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          value={answers[question.id]}
          optionType="button"
          buttonStyle="solid"
        />
      </QuestionCard>
    ));
  };
  
  // 渲染步骤指示器
  const renderSteps = () => {
    const items = Object.values(HollandCode).map((code, index) => ({
      title: code,
      description: index === currentStep ? getStepTitle(index).split(' ')[0] : '',
    }));
    
    return (
      <StepContainer>
        <Steps 
          current={currentStep}
          items={items}
          size="small"
          labelPlacement="vertical"
        />
      </StepContainer>
    );
  };

  return (
    <div>
      <Title level={4}>{getStepTitle(currentStep)}</Title>
      <Paragraph>
        请根据您的真实情况，评估以下陈述与您的符合程度。
      </Paragraph>
      
      {renderSteps()}
      
      <ProgressContainer>
        <Progress 
          percent={completionPercentage} 
          status="active" 
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
        <Text type="secondary">已完成 {answeredCount}/{totalQuestions} 题</Text>
      </ProgressContainer>
      
      <Divider />
      
      {renderQuestions()}
      
      <Divider />
      
      <Space>
        <Button 
          onClick={handlePrev}
          disabled={currentStep === 0 || isSubmitting}
        >
          上一页
        </Button>
        <Button 
          type="primary" 
          onClick={handleNext}
          loading={isSubmitting}
          disabled={!isCurrentStepComplete()}
        >
          {currentStep < groupedQuestions.length - 1 ? '下一页' : '提交测试'}
        </Button>
      </Space>
    </div>
  );
};

export default HollandTest; 