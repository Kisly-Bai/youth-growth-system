import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Divider,
  Space,
  Tag,
  Statistic,
  Progress,
  DatePicker,
  Spin
} from 'antd';
import {
  DownloadOutlined,
  RollbackOutlined,
  PrinterOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const PrintableArea = styled.div`
  background: white;
  padding: 20px;
`;

const SummaryBox = styled.div`
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #f5f5f5;
`;

const HealthReport: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  
  // 模拟健康数据
  const [healthData] = useState({
    steps: {
      average: 8562,
      totalSteps: 256860,
      daysActiveAboveGoal: 18,
      goal: 10000,
      percentToGoal: 85.62
    },
    sleep: {
      average: 7.3,
      longestSleep: 9.2,
      shortestSleep: 5.5,
      goal: 8,
      percentToGoal: 91.25
    },
    weight: {
      start: 70.2,
      end: 68.5,
      change: -1.7,
      goal: 65,
      percentToGoal: 32.69
    },
    heartRate: {
      average: 72,
      max: 158,
      min: 52,
      restingAverage: 65
    },
    activity: {
      activeMinutes: 1248,
      caloriesBurned: 15640,
      activeMinutesPerDay: 41.6,
      activeMinutesGoal: 30,
      percentToGoal: 138.67
    },
    nutrition: {
      averageCalories: 1950,
      averageWater: 1650,
      caloriesGoal: 2200,
      waterGoal: 2000,
      percentToCaloriesGoal: 88.64,
      percentToWaterGoal: 82.5
    }
  });
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
      setLoading(true);
      
      // 模拟加载新的数据
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };
  
  // 处理打印
  const handlePrint = () => {
    window.print();
  };
  
  // 处理下载
  const handleDownload = () => {
    // 这里应该实现报告下载逻辑
    console.log('下载报告...');
  };
  
  // 处理返回
  const handleBack = () => {
    navigate('/health');
  };
  
  // 渲染健康状态标签
  const renderHealthStatus = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Tag color="success" icon={<CheckCircleOutlined />}>优秀</Tag>;
      case 'good':
        return <Tag color="processing" icon={<CheckCircleOutlined />}>良好</Tag>;
      case 'fair':
        return <Tag color="warning" icon={<InfoCircleOutlined />}>一般</Tag>;
      case 'poor':
        return <Tag color="error" icon={<WarningOutlined />}>不足</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };
  
  // 获取整体健康评分
  const getOverallHealthScore = () => {
    // 简单计算一个总评分
    const stepsScore = Math.min(100, (healthData.steps.percentToGoal / 100) * 20);
    const sleepScore = Math.min(100, (healthData.sleep.percentToGoal / 100) * 30);
    const activityScore = Math.min(100, (healthData.activity.percentToGoal / 100) * 30);
    const nutritionScore = Math.min(100, (
      (healthData.nutrition.percentToCaloriesGoal + healthData.nutrition.percentToWaterGoal) / 200
    ) * 20);
    
    return Math.round(stepsScore + sleepScore + activityScore + nutritionScore);
  };
  
  // 获取健康评分等级
  const getHealthScoreStatus = (score: number) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  };
  
  const healthScore = getOverallHealthScore();
  const healthStatus = getHealthScoreStatus(healthScore);
  
  return (
    <Container>
      <Title level={3}>健康报告</Title>
      <Paragraph>
        查看您在所选时间段内的健康数据总结和分析。
      </Paragraph>
      
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <RangePicker 
            value={dateRange}
            onChange={handleDateRangeChange}
            allowClear={false}
            style={{ width: 280 }}
          />
        </Col>
        <Col>
          <Space>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              打印报告
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleDownload}>
              下载PDF
            </Button>
          </Space>
        </Col>
      </Row>
      
      <Spin spinning={loading}>
        <PrintableArea id="printable-report">
          <StyledCard className="no-print-style">
            <Row gutter={16} align="middle">
              <Col span={16}>
                <Title level={4}>
                  健康报告: {dateRange[0].format('YYYY-MM-DD')} 至 {dateRange[1].format('YYYY-MM-DD')}
                </Title>
                <Paragraph>
                  本报告基于您在所选时间段内的健康数据，为您提供个人健康状况的总结和建议。
                </Paragraph>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Statistic 
                  title="总体健康评分" 
                  value={healthScore} 
                  suffix="/100"
                  valueStyle={{ color: healthStatus === 'excellent' ? '#52c41a' : 
                                healthStatus === 'good' ? '#1890ff' : 
                                healthStatus === 'fair' ? '#faad14' : '#f5222d' }}
                />
                {renderHealthStatus(healthStatus)}
              </Col>
            </Row>
            
            <Divider orientation="left">健康数据概览</Divider>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <SummaryBox>
                  <Statistic 
                    title="平均每日步数" 
                    value={healthData.steps.average} 
                    suffix="步"
                    valueStyle={{ fontSize: '24px' }}
                  />
                  <Progress 
                    percent={healthData.steps.percentToGoal} 
                    size="small"
                    status={healthData.steps.percentToGoal >= 100 ? "success" : "active"}
                  />
                  <Text type="secondary">目标: {healthData.steps.goal} 步</Text>
                </SummaryBox>
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <SummaryBox>
                  <Statistic 
                    title="平均睡眠时长" 
                    value={healthData.sleep.average} 
                    suffix="小时"
                    precision={1}
                    valueStyle={{ fontSize: '24px' }}
                  />
                  <Progress 
                    percent={healthData.sleep.percentToGoal} 
                    size="small"
                    status={healthData.sleep.percentToGoal >= 100 ? "success" : "active"}
                  />
                  <Text type="secondary">目标: {healthData.sleep.goal} 小时</Text>
                </SummaryBox>
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <SummaryBox>
                  <Statistic 
                    title="平均每日活动时间" 
                    value={healthData.activity.activeMinutesPerDay} 
                    suffix="分钟"
                    precision={1}
                    valueStyle={{ fontSize: '24px' }}
                  />
                  <Progress 
                    percent={healthData.activity.percentToGoal} 
                    size="small"
                    status={healthData.activity.percentToGoal >= 100 ? "success" : "active"}
                  />
                  <Text type="secondary">目标: {healthData.activity.activeMinutesGoal} 分钟</Text>
                </SummaryBox>
              </Col>
              
              <Col xs={24} sm={12} md={12}>
                <SummaryBox>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="平均心率" 
                        value={healthData.heartRate.average} 
                        suffix="BPM"
                        valueStyle={{ fontSize: '20px' }}
                      />
                      <div style={{ marginTop: 5 }}>
                        <Text type="secondary">
                          静息心率: {healthData.heartRate.restingAverage} BPM
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="心率范围" 
                        value={`${healthData.heartRate.min}-${healthData.heartRate.max}`} 
                        suffix="BPM"
                        valueStyle={{ fontSize: '20px' }}
                      />
                    </Col>
                  </Row>
                </SummaryBox>
              </Col>
              
              <Col xs={24} sm={12} md={12}>
                <SummaryBox>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="体重变化" 
                        value={healthData.weight.change} 
                        suffix="kg"
                        valueStyle={{ 
                          fontSize: '20px',
                          color: healthData.weight.change < 0 ? '#52c41a' : 
                                (healthData.weight.change > 0 ? '#f5222d' : 'inherit')
                        }}
                        prefix={healthData.weight.change < 0 ? '↓' : 
                              (healthData.weight.change > 0 ? '↑' : '')}
                      />
                      <div style={{ marginTop: 5 }}>
                        <Text type="secondary">
                          从 {healthData.weight.start}kg 到 {healthData.weight.end}kg
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="卡路里摄入" 
                        value={healthData.nutrition.averageCalories} 
                        suffix="千卡/天"
                        valueStyle={{ fontSize: '20px' }}
                      />
                      <Progress 
                        percent={healthData.nutrition.percentToCaloriesGoal} 
                        size="small"
                        status={
                          healthData.nutrition.percentToCaloriesGoal >= 90 && 
                          healthData.nutrition.percentToCaloriesGoal <= 110 ? 
                          "success" : "exception"
                        }
                      />
                    </Col>
                  </Row>
                </SummaryBox>
              </Col>
            </Row>
            
            <Divider orientation="left">健康分析</Divider>
            
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="活动与运动" bordered={false}>
                  <Paragraph>
                    在过去的30天里，您平均每天走了<Text strong>{healthData.steps.average}</Text>步，
                    达到了您每日目标的<Text strong>{healthData.steps.percentToGoal.toFixed(1)}%</Text>。
                    您有<Text strong>{healthData.steps.daysActiveAboveGoal}</Text>天达到或超过了每日步数目标。
                  </Paragraph>
                  <Paragraph>
                    您的平均每日活动时间为<Text strong>{healthData.activity.activeMinutesPerDay}</Text>分钟，
                    超过了推荐的每日<Text strong>{healthData.activity.activeMinutesGoal}</Text>分钟适度活动目标，表现很好！
                  </Paragraph>
                  <Paragraph>
                    <Text strong type="success">建议：</Text> 继续保持当前的活动水平，尝试每天安排一些有氧运动和力量训练，以提高心肺功能和肌肉力量。
                  </Paragraph>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="睡眠质量" bordered={false}>
                  <Paragraph>
                    您的平均睡眠时间为<Text strong>{healthData.sleep.average}</Text>小时，
                    略低于理想的<Text strong>{healthData.sleep.goal}</Text>小时。
                    最短睡眠时间为<Text strong>{healthData.sleep.shortestSleep}</Text>小时，
                    最长为<Text strong>{healthData.sleep.longestSleep}</Text>小时。
                  </Paragraph>
                  <Paragraph>
                    <Text strong type="warning">建议：</Text> 尝试调整您的睡眠习惯，保持固定的睡眠和起床时间，睡前避免使用电子设备，
                    创造一个安静、舒适的睡眠环境，以提高睡眠质量。
                  </Paragraph>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="心脏健康" bordered={false}>
                  <Paragraph>
                    您的平均心率为<Text strong>{healthData.heartRate.average}</Text> BPM，
                    静息心率平均为<Text strong>{healthData.heartRate.restingAverage}</Text> BPM，
                    处于健康范围内。心率范围在<Text strong>{healthData.heartRate.min}</Text>到
                    <Text strong>{healthData.heartRate.max}</Text> BPM之间。
                  </Paragraph>
                  <Paragraph>
                    <Text strong type="success">建议：</Text> 继续进行有规律的有氧运动，保持健康的生活方式，
                    控制压力水平，这些都有助于维持心脏健康。
                  </Paragraph>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="体重管理" bordered={false}>
                  <Paragraph>
                    在此期间，您的体重从<Text strong>{healthData.weight.start}</Text>kg变化到
                    <Text strong>{healthData.weight.end}</Text>kg，净变化
                    <Text strong style={{ color: healthData.weight.change < 0 ? '#52c41a' : '#f5222d' }}>
                      {healthData.weight.change}kg
                    </Text>。
                    {healthData.weight.change < 0 ? 
                      '这是一个积极的变化，表明您正在向目标体重前进。' : 
                      '您的体重有所增加，可能需要调整饮食和运动计划。'}
                  </Paragraph>
                  <Paragraph>
                    <Text strong type={healthData.weight.change <= 0 ? "success" : "warning"}>建议：</Text> 
                    {healthData.weight.change <= 0 ? 
                      '继续保持健康的饮食结构和运动习惯，确保均衡营养。' : 
                      '增加体力活动，控制每日卡路里摄入，注意饮食质量，减少高糖、高脂肪食物的摄入。'}
                  </Paragraph>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="营养与饮食" bordered={false}>
                  <Paragraph>
                    您的平均每日卡路里摄入为<Text strong>{healthData.nutrition.averageCalories}</Text>千卡，
                    达到目标的<Text strong>{healthData.nutrition.percentToCaloriesGoal.toFixed(1)}%</Text>。
                    平均每日饮水量为<Text strong>{healthData.nutrition.averageWater}</Text>ml，
                    达到目标的<Text strong>{healthData.nutrition.percentToWaterGoal.toFixed(1)}%</Text>。
                  </Paragraph>
                  <Paragraph>
                    <Text strong type="warning">建议：</Text> 增加每日饮水量，尽量达到<Text strong>{healthData.nutrition.waterGoal}</Text>ml的目标。
                    确保摄入足够的蛋白质、纤维和必要的维生素矿物质，减少加工食品的摄入。
                  </Paragraph>
                </Card>
              </Col>
            </Row>
            
            <Divider orientation="left">健康行动计划</Divider>
            
            <Card bordered={false}>
              <ol>
                <li>
                  <Text strong>保持活动水平：</Text> 继续每天步行，目标达到10,000步。增加每周1-2次的力量训练，提高肌肉质量。
                </li>
                <li>
                  <Text strong>改善睡眠：</Text> 尝试在晚上10:30前上床，创造规律的睡前习惯，目标达到每晚8小时的睡眠。
                </li>
                <li>
                  <Text strong>水分摄入：</Text> 增加每日饮水量，达到2000ml的目标。在办公桌上放一个水瓶，设置提醒定时喝水。
                </li>
                <li>
                  <Text strong>健康饮食：</Text> 增加蔬菜和水果的摄入，减少加工食品和糖分摄入，保持均衡营养。
                </li>
                <li>
                  <Text strong>压力管理：</Text> 每天安排15-20分钟的放松时间，可以是深呼吸、冥想或轻度瑜伽。
                </li>
              </ol>
            </Card>
          </StyledCard>
        </PrintableArea>
      </Spin>
      
      <Button 
        onClick={handleBack} 
        icon={<RollbackOutlined />} 
        style={{ marginTop: 16 }}
        className="no-print"
      >
        返回健康管理
      </Button>
      
      <style>
        {`
          @media print {
            .no-print, .no-print * {
              display: none !important;
            }
            .no-print-style {
              box-shadow: none !important;
              border: none !important;
            }
            body {
              background: white !important;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default HealthReport; 