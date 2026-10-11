import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  UserOutlined, 
  HomeOutlined, 
  LineChartOutlined, 
  HeartOutlined, 
  BookOutlined, 
  CompassOutlined, 
  ClockCircleOutlined, 
  TeamOutlined, 
  BookFilled, 
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const Logo = styled.div`
  height: 64px;
  margin: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
  overflow: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.span`
  margin-left: 8px;
`;

const BetaTag = styled.span`
  font-size: 12px;
  color: #faad14;
  margin-left: 5px;
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const getMenuItems = (role: UserRole) => {
  const items = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">个人中心</Link>,
    },
    {
      key: 'academic',
      icon: <BookFilled />,
      label: <Link to="/academic">学业分析</Link>,
    },
    {
      key: 'time',
      icon: <ClockCircleOutlined />,
      label: <Link to="/academic/time-management">时间管理</Link>,
    },
    {
      key: 'psychological',
      icon: <HeartOutlined />,
      label: <Link to="/psychological">心理健康</Link>,
    },
    {
      key: 'health',
      icon: <LineChartOutlined />,
      label: <Link to="/health">健康管理</Link>,
    },
    {
      key: 'learning',
      icon: <BookOutlined />,
      label: <Link to="/learning">个性化学习<BetaTag>(Beta)</BetaTag></Link>,
    },
    {
      key: 'career',
      icon: <CompassOutlined />,
      label: <Link to="/career">生涯规划</Link>,
    },
    {
      key: 'community',
      icon: <TeamOutlined />,
      label: <Link to="/community">成长社区<BetaTag>(Beta)</BetaTag></Link>,
    },
  ];

  // 学生可以查看成长印记
  if (role === UserRole.STUDENT) {
    items.push({
      key: 'journal',
      icon: <BookFilled />,
      label: <Link to="/journal">成长印记</Link>,
    });
  }

  // 老师有特殊的管理功能
  if (role === UserRole.TEACHER || role === UserRole.ADMIN) {
    items.push({
      key: 'admin',
      icon: <SettingOutlined />,
      label: <Link to="/admin">管理中心</Link>,
    });
  }

  return items;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 获取当前路径的第一段作为选中的key，处理特殊情况
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/academic/time-management')) {
      return 'time';
    }
    if (path.includes('/community')) {
      return 'community';
    }
    return path.split('/')[1] || 'dashboard';
  };

  const selectedKey = getSelectedKey();
  const userRole = user ? user.role as unknown as UserRole : UserRole.STUDENT;

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ];

  return (
    <StyledLayout>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={240}
        theme="dark"
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
      >
        <Logo>
          {!collapsed ? '青少年成长支持系统' : '成长'}
        </Logo>
        {user && (
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={getMenuItems(userRole)}
          />
        )}
      </Sider>
      <Layout>
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          {user && (
            <UserInfo>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div style={{ cursor: 'pointer' }}>
                  <Avatar 
                    size="large" 
                    icon={<UserOutlined />} 
                    src={user.avatar}
                  />
                  <UserName>{user.name || user.username}</UserName>
                </div>
              </Dropdown>
            </UserInfo>
          )}
        </StyledHeader>
        <StyledContent>
          {children}
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default MainLayout; 