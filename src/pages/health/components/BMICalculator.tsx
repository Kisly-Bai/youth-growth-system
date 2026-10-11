import React, { useState, useEffect } from 'react';
import { InputNumber, Card, Typography, Divider, Slider, Row, Col } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const BMIStatusBar = styled.div`
  height: 16px;
  border-radius: 8px;
  margin: 16px 0;
  background: linear-gradient(90deg, 
    #2db7f5 0%, 
    #52c41a 18%, 
    #52c41a 25%, 
    #faad14 42%, 
    #ff4d4f 65%
  );
  position: relative;
`;

const BMIPointer = styled.div<{ position: number }>`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #1890ff;
  top: 0px;
  left: ${props => Math.min(Math.max(props.position, 0), 100)}%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
`;

interface BMICalculatorProps {
  initialHeight?: number;
  initialWeight?: number;
}

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { text: '偏瘦', color: '#2db7f5', position: 9 };
  if (bmi >= 18.5 && bmi < 24) return { text: '正常', color: '#52c41a', position: 21 };
  if (bmi >= 24 && bmi < 28) return { text: '超重', color: '#faad14', position: 33 };
  return { text: '肥胖', color: '#ff4d4f', position: 55 };
};

const BMICalculator: React.FC<BMICalculatorProps> = ({ initialHeight = 170, initialWeight = 65 }) => {
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [bmi, setBMI] = useState(0);
  const [category, setCategory] = useState({ text: '', color: '', position: 0 });
  
  useEffect(() => {
    if (height > 0 && weight > 0) {
      const calculatedBMI = weight / ((height / 100) ** 2);
      setBMI(calculatedBMI);
      setCategory(getBMICategory(calculatedBMI));
    }
  }, [height, weight]);
  
  return (
    <StyledCard>
      <Title level={4}>BMI计算器</Title>
      <Divider />
      
      <Row gutter={16}>
        <Col span={12}>
          <Text>身高 (cm)</Text>
          <Slider
            min={120}
            max={220}
            value={height}
            onChange={(value) => setHeight(value)}
          />
          <InputNumber
            style={{ width: '100%' }}
            min={120}
            max={220}
            value={height}
            onChange={(value) => setHeight(value as number)}
          />
        </Col>
        
        <Col span={12}>
          <Text>体重 (kg)</Text>
          <Slider
            min={30}
            max={150}
            value={weight}
            onChange={(value) => setWeight(value)}
          />
          <InputNumber
            style={{ width: '100%' }}
            min={30}
            max={150}
            value={weight}
            onChange={(value) => setWeight(value as number)}
          />
        </Col>
      </Row>
      
      <Divider />
      
      <div style={{ textAlign: 'center' }}>
        <Title level={3}>{bmi.toFixed(1)}</Title>
        <Text style={{ color: category.color, fontWeight: 'bold' }}>{category.text}</Text>
      </div>
      
      <BMIStatusBar>
        <BMIPointer position={category.position} />
      </BMIStatusBar>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text type="secondary">偏瘦</Text>
        <Text type="secondary">正常</Text>
        <Text type="secondary">超重</Text>
        <Text type="secondary">肥胖</Text>
      </div>
      
      <Divider />
      
      <Text type="secondary">
        BMI（身体质量指数）= 体重(kg) / 身高(m)²
      </Text>
      <br />
      <Text type="secondary">
        BMI范围: 偏瘦 (&lt;18.5), 正常 (18.5-23.9), 超重 (24-27.9), 肥胖 (≥28)
      </Text>
    </StyledCard>
  );
};

export default BMICalculator; 