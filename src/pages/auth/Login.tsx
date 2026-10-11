import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1E90FF 0%, #48D1CC 100%);
`;

const StyledCard = styled(Card)`
  width: 400px;
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

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const redirectPath = state?.from?.pathname || '/dashboard';

  const onFinish = (values: any) => {
    setLoading(true);
    
    // 调用登录函数
    login(values.username, values.password)
      .then((success) => {
        if (success) {
          // 处理记住我功能
          if (values.remember) {
            localStorage.setItem('rememberedUsername', values.username);
          } else {
            localStorage.removeItem('rememberedUsername');
          }
          
          message.success('登录成功');
          
          // 修复 - 使用simple值进行路由跳转
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 1000); // 等待1秒，让消息显示完成
        } else {
          message.error('登录失败，请检查用户名和密码');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('登录失败:', error);
        message.error('登录失败，请检查用户名和密码');
        setLoading(false);
      });
  };

  const rememberedUsername = localStorage.getItem('rememberedUsername') || '';

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
              用户登录
            </Title>
            
            <StyledForm
              name="login"
              initialValues={{ 
                username: rememberedUsername,
                remember: !!rememberedUsername 
              }}
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入您的用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名" 
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入您的密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                
                <Link to="/forgot-password" style={{ float: 'right' }}>
                  忘记密码？
                </Link>
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  登录
                </Button>
              </Form.Item>
              
              <FooterLinks>
                <Text type="secondary">还没有账号？</Text>
                <Link to="/register">立即注册</Link>
              </FooterLinks>
            </StyledForm>
          </FormContainer>
        </Spin>
      </StyledCard>
    </Container>
  );
};

export default Login; 