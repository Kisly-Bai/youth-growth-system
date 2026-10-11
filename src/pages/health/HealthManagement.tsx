import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Calendar,
  Badge,
  Button,
  Space,
  Progress,
  Divider,
  Form,
  InputNumber,
  message,
  Modal
} from 'antd';
import {
  StepForwardOutlined,
  RestOutlined,
  DashboardOutlined,
  PlusOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 直接导入组件，不通过index.ts
import SleepChart from './components/SleepChart';
import StepChart from './components/StepChart';
import BMICalculator from './components/BMICalculator';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Container = styled.div`
  padding: 0 4px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  height: 100%;
`;

const StatisticCard = styled(StyledCard)`
  text-align: center;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-5px);
  }
`;

const HealthManagement: React.FC = () => {
  const navigate = useNavigate();
  const [, setLoading] = useState(true);
  const [, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [dataEntryModalVisible, setDataEntryModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // 模拟数据
  const [healthData, setHealthData] = useState({
    steps: 8423,
    stepsGoal: 10000,
    sleepHours: 7.2,
    sleepGoal: 8,
    weight: 68.5,
    height: 175,
    bmi: 22.4,
    calories: 1850,
    caloriesGoal: 2200,
    water: 1500,
    waterGoal: 2000
  });
  
  // 模拟历史数据 - 一周数据
  const [weeklyData, setWeeklyData] = useState({
    steps: [7231, 8432, 6549, 9843, 7651, 5432, 8423],
    sleep: [6.8, 7.5, 6.9, 7.3, 7.0, 7.8, 7.2]
  });
  
  // 打开数据录入模态框
  const showDataEntryModal = () => {
    form.setFieldsValue({
      steps: 0,
      sleepHours: 0,
      calories: 0,
      water: 0
    });
    setDataEntryModalVisible(true);
  };
  
  // 处理数据录入提交
  const handleDataEntrySubmit = () => {
    form.validateFields().then(values => {
      // 更新当天数据
      setHealthData(prev => ({
        ...prev,
        steps: values.steps,
        sleepHours: values.sleepHours,
        calories: values.calories,
        water: values.water
      }));
      
      // 更新周数据
      setWeeklyData(prev => {
        const newSteps = [...prev.steps];
        const newSleep = [...prev.sleep];
        newSteps[newSteps.length - 1] = values.steps;
        newSleep[newSleep.length - 1] = values.sleepHours;
        return {
          steps: newSteps,
          sleep: newSleep
        };
      });
      
      message.success('健康数据已成功记录！');
      setDataEntryModalVisible(false);
    });
  };
  
  // 获取BMI状态
  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'warning', text: '偏瘦' };
    if (bmi >= 18.5 && bmi < 24) return { status: 'success', text: '正常' };
    if (bmi >= 24 && bmi < 28) return { status: 'warning', text: '超重' };
    return { status: 'exception', text: '肥胖' };
  };
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 确保dayjs使用中文
  useEffect(() => {
    dayjs.locale('zh-cn');
  }, []);
  
  // 日历中标记的日期数据
  const getCalendarData = (value: dayjs.Dayjs) => {
    const day = value.date();
    
    // 模拟一些记录数据
    if (day % 3 === 0) {
      return { type: 'success', content: '运动' };
    }
    if (day % 5 === 0) {
      return { type: 'warning', content: '睡眠不足' };
    }
    if (day % 7 === 0) {
      return { type: 'error', content: '摄入过多' };
    }
    return {};
  };
  
  // 渲染日历单元格
  const dateCellRender = (value: dayjs.Dayjs) => {
    const data = getCalendarData(value);
    return data.content ? (
      <Badge status={data.type as any} text={data.content} />
    ) : null;
  };
  
  // 记录健康数据
  const recordHealthData = () => {
    showDataEntryModal();
  };
  
  // 查看健康报告
  const viewHealthReport = () => {
    navigate('/health/report');
  };
  
  // 设置健康目标
  const setHealthGoals = () => {
    navigate('/health/goals');
  };
  
  return (
    <Container>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3}>健康管理</Title>
        </Col>
        <Col flex="auto">
          <Paragraph>
            跟踪和管理您的身体健康数据，了解健康趋势，设定并实现健康目标。
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={recordHealthData}
            >
              记录健康数据
            </Button>
            <Button onClick={setHealthGoals}>设置目标</Button>
          </Space>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        {/* 步数卡片 */}
        <Col xs={24} sm={12} md={8}>
          <StatisticCard>
            <Statistic
              title="今日步数"
              value={healthData.steps}
              suffix={`/ ${healthData.stepsGoal}`}
              prefix={<StepForwardOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={Math.round((healthData.steps / healthData.stepsGoal) * 100)} 
              status="active"
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            />
          </StatisticCard>
        </Col>
        
        {/* 睡眠卡片 */}
        <Col xs={24} sm={12} md={8}>
          <StatisticCard>
            <Statistic
              title="今日睡眠"
              value={healthData.sleepHours}
              suffix="小时"
              prefix={<RestOutlined />}
              valueStyle={{ color: '#722ed1' }}
              precision={1}
            />
            <Progress 
              percent={Math.round((healthData.sleepHours / healthData.sleepGoal) * 100)} 
              status={healthData.sleepHours < 7 ? "exception" : "active"}
              strokeColor={{ '0%': '#722ed1', '100%': '#a0d911' }}
            />
          </StatisticCard>
        </Col>
        
        {/* BMI卡片 */}
        <Col xs={24} sm={12} md={8}>
          <StatisticCard>
            <Statistic
              title="BMI指数"
              value={healthData.bmi}
              suffix={getBmiStatus(healthData.bmi).text}
              prefix={<DashboardOutlined />}
              valueStyle={{ color: getBmiStatus(healthData.bmi).status === 'success' ? '#52c41a' : '#faad14' }}
              precision={1}
            />
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              <Text type="secondary">
                体重: {healthData.weight}kg / 身高: {healthData.height}cm
              </Text>
            </div>
          </StatisticCard>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <StyledCard title="健康数据趋势">
            <Tabs defaultActiveKey="steps">
              <TabPane tab="步数" key="steps">
                <StepChart data={weeklyData.steps} />
              </TabPane>
              <TabPane tab="睡眠" key="sleep">
                <SleepChart data={weeklyData.sleep} />
              </TabPane>
            </Tabs>
          </StyledCard>
        </Col>
        
        <Col xs={24} md={8}>
          <StyledCard title="BMI计算器">
            <BMICalculator />
          </StyledCard>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <StyledCard title="营养摄入">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="卡路里摄入"
                  value={healthData.calories}
                  suffix={`/ ${healthData.caloriesGoal} 千卡`}
                  valueStyle={{ fontSize: '20px' }}
                />
                <Progress 
                  percent={Math.round((healthData.calories / healthData.caloriesGoal) * 100)} 
                  size="small"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="水分摄入"
                  value={healthData.water}
                  suffix={`/ ${healthData.waterGoal} ml`}
                  valueStyle={{ fontSize: '20px' }}
                />
                <Progress 
                  percent={Math.round((healthData.water / healthData.waterGoal) * 100)} 
                  size="small"
                  strokeColor="#1890ff"
                />
              </Col>
            </Row>
            <Divider />
            <Button type="link" onClick={() => navigate('/health/nutrition')}>
              查看详细营养数据
            </Button>
          </StyledCard>
        </Col>
        
        <Col xs={24} md={12}>
          <StyledCard title="健康日历">
            <Calendar 
              fullscreen={false}
              dateCellRender={dateCellRender}
              onChange={value => setSelectedDate(value)}
            />
          </StyledCard>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <StyledCard title="健康建议">
            <Paragraph>
              <strong>基于您的健康数据，我们有以下建议：</strong>
            </Paragraph>
            <ul>
              <li>您的步数接近目标，继续保持这个运动量有助于心血管健康。</li>
              <li>睡眠时间略低于建议的8小时，尝试早点睡觉或改善睡眠环境。</li>
              <li>您的BMI处于正常范围，继续保持健康的饮食和运动习惯。</li>
              <li>水分摄入不足，请记得每天至少饮用2000ml水。</li>
            </ul>
            <Divider />
            <Button type="primary" onClick={viewHealthReport}>
              生成健康报告
            </Button>
          </StyledCard>
        </Col>
      </Row>
      
      {/* 健康数据录入模态框 */}
      <Modal
        title="今日健康数据录入"
        open={dataEntryModalVisible}
        onCancel={() => setDataEntryModalVisible(false)}
        onOk={handleDataEntrySubmit}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="steps"
            label="今日步数"
            rules={[{ required: true, message: '请输入今日步数' }]}
          >
            <InputNumber 
              min={0} 
              max={100000} 
              style={{ width: '100%' }} 
              placeholder="请输入今日步数" 
              addonAfter="步"
            />
          </Form.Item>
          <Form.Item
            name="sleepHours"
            label="今日睡眠时间"
            rules={[{ required: true, message: '请输入今日睡眠时间' }]}
          >
            <InputNumber 
              min={0} 
              max={24} 
              step={0.1} 
              precision={1} 
              style={{ width: '100%' }} 
              placeholder="请输入今日睡眠时间" 
              addonAfter="小时"
            />
          </Form.Item>
          <Form.Item
            name="calories"
            label="今日卡路里摄入"
            rules={[{ required: true, message: '请输入今日卡路里摄入' }]}
          >
            <InputNumber 
              min={0} 
              max={5000} 
              style={{ width: '100%' }} 
              placeholder="请输入今日卡路里摄入" 
              addonAfter="千卡"
            />
          </Form.Item>
          <Form.Item
            name="water"
            label="今日水分摄入"
            rules={[{ required: true, message: '请输入今日水分摄入' }]}
          >
            <InputNumber 
              min={0} 
              max={5000} 
              step={100} 
              style={{ width: '100%' }} 
              placeholder="请输入今日水分摄入" 
              addonAfter="毫升"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default HealthManagement; 