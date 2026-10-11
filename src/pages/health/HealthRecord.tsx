import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  Select,
  Button,
  Divider,
  Space,
  message,
  Row,
  Col
} from 'antd';
import {
  SaveOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const HealthRecord: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [recordType, setRecordType] = useState<string>('physical');
  
  // 表单提交处理
  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    // 格式化日期时间
    if (values.date) {
      values.date = values.date.format('YYYY-MM-DD');
    }
    if (values.time) {
      values.time = values.time.format('HH:mm');
    }
    
    console.log('提交的健康数据:', values);
    
    // 模拟API请求
    setTimeout(() => {
      setLoading(false);
      message.success('健康数据记录成功！');
      
      // 重置表单
      form.resetFields();
      
      // 返回健康管理页面
      navigate('/health');
    }, 1500);
  };
  
  // 处理返回
  const handleBack = () => {
    navigate('/health');
  };
  
  // 更改记录类型
  const handleTypeChange = (value: string) => {
    setRecordType(value);
    
    // 重置表单中的部分字段
    form.resetFields(['value', 'unit']);
  };
  
  // 渲染不同记录类型的表单字段
  const renderFormFields = () => {
    switch (recordType) {
      case 'physical':
        return (
          <>
            <Form.Item 
              name="weight" 
              label="体重" 
              rules={[{ required: true, message: '请输入体重' }]}
            >
              <InputNumber min={20} max={200} addonAfter="kg" step={0.1} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item 
              name="height" 
              label="身高" 
              rules={[{ required: true, message: '请输入身高' }]}
            >
              <InputNumber min={100} max={250} addonAfter="cm" style={{ width: '100%' }} />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="bodyFat" label="体脂率">
                  <InputNumber min={0} max={100} addonAfter="%" step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="muscleRate" label="肌肉率">
                  <InputNumber min={0} max={100} addonAfter="%" step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      
      case 'activity':
        return (
          <>
            <Form.Item 
              name="activityType" 
              label="活动类型" 
              rules={[{ required: true, message: '请选择活动类型' }]}
            >
              <Select placeholder="选择活动类型">
                <Option value="walking">步行</Option>
                <Option value="running">跑步</Option>
                <Option value="cycling">骑行</Option>
                <Option value="swimming">游泳</Option>
                <Option value="basketball">篮球</Option>
                <Option value="football">足球</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="duration" 
              label="活动时长" 
              rules={[{ required: true, message: '请输入活动时长' }]}
            >
              <InputNumber min={1} max={1440} addonAfter="分钟" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="distance" label="活动距离">
              <InputNumber min={0} step={0.01} addonAfter="公里" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="calories" label="消耗卡路里">
              <InputNumber min={0} addonAfter="千卡" style={{ width: '100%' }} />
            </Form.Item>
          </>
        );
      
      case 'sleep':
        return (
          <>
            <Form.Item 
              name="sleepTime" 
              label="入睡时间" 
              rules={[{ required: true, message: '请选择入睡时间' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item 
              name="wakeTime" 
              label="起床时间" 
              rules={[{ required: true, message: '请选择起床时间' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="sleepQuality" label="睡眠质量">
              <Select placeholder="选择睡眠质量">
                <Option value="excellent">优秀</Option>
                <Option value="good">良好</Option>
                <Option value="fair">一般</Option>
                <Option value="poor">较差</Option>
                <Option value="terrible">糟糕</Option>
              </Select>
            </Form.Item>
          </>
        );
      
      case 'nutrition':
        return (
          <>
            <Form.Item 
              name="mealType" 
              label="餐食类型" 
              rules={[{ required: true, message: '请选择餐食类型' }]}
            >
              <Select placeholder="选择餐食类型">
                <Option value="breakfast">早餐</Option>
                <Option value="lunch">午餐</Option>
                <Option value="dinner">晚餐</Option>
                <Option value="snack">零食</Option>
                <Option value="water">饮水</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="foodItems" label="食物项目">
              <Input.TextArea rows={4} placeholder="请输入食物项目，以逗号分隔" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="calories" label="卡路里">
                  <InputNumber min={0} addonAfter="千卡" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="water" label="水分摄入">
                  <InputNumber min={0} addonAfter="ml" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      
      case 'vitals':
        return (
          <>
            <Form.Item name="heartRate" label="心率">
              <InputNumber min={30} max={220} addonAfter="BPM" style={{ width: '100%' }} />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="systolicPressure" label="收缩压">
                  <InputNumber min={60} max={250} addonAfter="mmHg" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="diastolicPressure" label="舒张压">
                  <InputNumber min={40} max={150} addonAfter="mmHg" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item name="bloodOxygen" label="血氧饱和度">
              <InputNumber min={0} max={100} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="bodyTemperature" label="体温">
              <InputNumber min={35} max={42} step={0.1} addonAfter="°C" style={{ width: '100%' }} />
            </Form.Item>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Container>
      <Title level={3}>记录健康数据</Title>
      <Paragraph>
        记录您的健康数据以跟踪身体状况和生活习惯的变化。
      </Paragraph>
      
      <StyledCard>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            date: dayjs(),
            time: dayjs(),
            recordType: 'physical'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="date" 
                label="日期" 
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="time" 
                label="时间" 
                rules={[{ required: true, message: '请选择时间' }]}
              >
                <TimePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="recordType" 
            label="记录类型" 
            rules={[{ required: true, message: '请选择记录类型' }]}
          >
            <Select 
              placeholder="选择记录类型" 
              onChange={handleTypeChange}
              value={recordType}
            >
              <Option value="physical">身体测量</Option>
              <Option value="activity">运动活动</Option>
              <Option value="sleep">睡眠记录</Option>
              <Option value="nutrition">饮食营养</Option>
              <Option value="vitals">生命体征</Option>
            </Select>
          </Form.Item>
          
          <Divider orientation="left">{recordType === 'physical' ? '身体测量' : 
                                      recordType === 'activity' ? '运动活动' : 
                                      recordType === 'sleep' ? '睡眠记录' : 
                                      recordType === 'nutrition' ? '饮食营养' : '生命体征'}</Divider>
          
          {renderFormFields()}
          
          <Form.Item name="notes" label="备注">
            <Input.TextArea rows={4} placeholder="添加备注信息..." />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={loading}
              >
                保存记录
              </Button>
              <Button 
                onClick={handleBack} 
                icon={<RollbackOutlined />}
              >
                返回
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </StyledCard>
    </Container>
  );
};

export default HealthRecord; 