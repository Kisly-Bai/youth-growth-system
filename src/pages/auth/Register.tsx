import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Spin 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  InfoCircleOutlined,
  EyeTwoTone, 
  EyeInvisibleOutlined 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1E90FF 0%, #48D1CC 100%);
`;

const StyledCard = styled(Card)`
  width: 500px;
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
  justify-content: space-between;
  margin-top: 16px;
`;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const onFinish = (values: any) => {
    const { username, email, password, confirmPassword } = values;
    
    setLoading(true);
    
    register({
      username,
      email,
      password,
      confirmPassword
    })
      .then(success => {
        if (success) {
          navigate('/dashboard');
        }
      })
      .catch(() => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
              新用户注册
            </Title>
            
            <StyledForm
              form={form}
              name="register"
              onFinish={onFinish}
              scrollToFirstError
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入您的用户名' },
                  { min: 4, message: '用户名长度不能少于4个字符' },
                  { max: 20, message: '用户名长度不能超过20个字符' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="请输入用户名" 
                />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[
                  { required: true, message: '请输入您的电子邮箱' },
                  { type: 'email', message: '请输入有效的电子邮箱地址' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="请输入电子邮箱" 
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入您的密码' },
                  { min: 8, message: '密码长度不能少于8个字符' }
                ]}
                tooltip={{
                  title: '密码长度至少为8位',
                  icon: <InfoCircleOutlined />
                }}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认您的密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请再次输入密码"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              
              <Form.Item>
                <Paragraph type="secondary" style={{ fontSize: '12px' }}>
                  注册即表示您同意我们的
                  <a href="/terms" target="_blank">服务条款</a>
                  和
                  <a href="/privacy" target="_blank">隐私政策</a>
                </Paragraph>
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  注册
                </Button>
              </Form.Item>
              
              <FooterLinks>
                <Text type="secondary">已有账号？</Text>
                <Link to="/login">立即登录</Link>
              </FooterLinks>
            </StyledForm>
          </FormContainer>
        </Spin>
      </StyledCard>
    </Container>
  );
};

export default Register; 