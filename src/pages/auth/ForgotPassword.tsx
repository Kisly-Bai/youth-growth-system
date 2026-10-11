import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin, Steps, Result } from 'antd';
import { MailOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import authService from '../../services/authService';

const { Title, Text } = Typography;
const { Step } = Steps;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1E90FF 0%, #48D1CC 100%);
`;

const StyledCard = styled(Card)`
  width: 450px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1E90FF;
  margin-bottom: 8px;
`;

const FormContainer = styled.div`
  padding: 16px 0;
`;

const StyledForm = styled(Form)`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const StyledSteps = styled(Steps)`
  margin-bottom: 24px;
`;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [, setEmail] = useState('');
  const [, setResetToken] = useState('');
  const [form] = Form.useForm();
  
  const steps = [
    {
      title: '验证电子邮箱',
      content: (
        <StyledForm
          form={form}
          name="emailVerification"
          onFinish={handleEmailSubmit}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入您的电子邮箱' },
              { type: 'email', message: '请输入有效的电子邮箱地址' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="请输入您注册时使用的电子邮箱" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              size="large"
            >
              发送重置链接
            </Button>
          </Form.Item>
        </StyledForm>
      ),
    },
    {
      title: '重置密码',
      content: (
        <StyledForm
          form={form}
          name="resetPassword"
          onFinish={handleResetSubmit}
        >
          <Form.Item
            name="token"
            rules={[
              { required: true, message: '请输入验证码' },
            ]}
          >
            <Input 
              placeholder="请输入您收到的验证码" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度不能少于8个字符' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: '密码必须包含大小写字母、数字和特殊字符'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认您的密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入新密码"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              size="large"
            >
              重置密码
            </Button>
          </Form.Item>
        </StyledForm>
      ),
    },
    {
      title: '完成',
      content: (
        <Result
          status="success"
          title="密码重置成功！"
          subTitle="您的密码已经成功重置，现在可以使用新密码登录系统。"
          extra={[
            <Button type="primary" key="login" size="large">
              <Link to="/login">立即登录</Link>
            </Button>,
          ]}
        />
      ),
    },
  ];
  
  async function handleEmailSubmit(values: any) {
    try {
      setLoading(true);
      const { email } = values;
      setEmail(email);
      
      const response = await authService.requestPasswordReset(email);
      
      if (response.success) {
        message.success('重置链接已发送到您的邮箱，请查收');
        setCurrentStep(1);
        form.resetFields();
      } else {
        message.error(response.error || '发送重置链接失败，请稍后重试');
      }
    } catch (error) {
      message.error('发送重置链接失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }
  
  async function handleResetSubmit(values: any) {
    try {
      setLoading(true);
      const { token, newPassword } = values;
      setResetToken(token);
      
      const response = await authService.resetPassword(token, newPassword);
      
      if (response.success) {
        message.success('密码重置成功');
        setCurrentStep(2);
        form.resetFields();
      } else {
        message.error(response.error || '密码重置失败，请稍后重试');
      }
    } catch (error) {
      message.error('密码重置失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Container>
      <StyledCard>
        <Spin spinning={loading}>
          <LogoContainer>
            <Logo>青少年成长支持系统</Logo>
            <Text type="secondary">专注青少年身心全面发展</Text>
          </LogoContainer>
          
          <FormContainer>
            <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
              找回密码
            </Title>
            
            <StyledSteps current={currentStep} size="small">
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </StyledSteps>
            
            {steps[currentStep].content}
            
            {currentStep < 2 && (
              <FooterLinks>
                <Link to="/login">返回登录</Link>
              </FooterLinks>
            )}
          </FormContainer>
        </Spin>
      </StyledCard>
    </Container>
  );
};

export default ForgotPassword; 