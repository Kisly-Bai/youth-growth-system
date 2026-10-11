import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  ClockCircleOutlined,
  BookOutlined,
  SmileOutlined,
  ToolOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  ThunderboltOutlined,
  ReadOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  CompassOutlined,
  FundOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={onCollapse}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        zIndex: 2
      }}
    >
      <div className="logo" style={{ 
        height: '32px', 
        margin: '16px', 
        background: 'rgba(255, 255, 255, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: collapsed ? '14px' : '18px',
        fontWeight: 'bold'
      }}>
        {collapsed ? 'YGS' : '青年成长系统'}
      </div>
      <Menu 
        theme="dark" 
        defaultSelectedKeys={['/']} 
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={[
          '/time', 
          '/study', 
          '/psychological',
          '/career'
        ]}
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">首页</Link>
        </Menu.Item>

        <SubMenu key="/time" icon={<ClockCircleOutlined />} title="时间管理">
          <Menu.Item key="/time" icon={<CalendarOutlined />}>
            <Link to="/time">总览</Link>
          </Menu.Item>
          <Menu.Item key="/time/tasks" icon={<CheckSquareOutlined />}>
            <Link to="/time/tasks">任务列表</Link>
          </Menu.Item>
          <Menu.Item key="/time/pomodoro" icon={<ThunderboltOutlined />}>
            <Link to="/time/pomodoro">番茄钟</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="/study" icon={<BookOutlined />} title="学习规划">
          <Menu.Item key="/study" icon={<ReadOutlined />}>
            <Link to="/study">学习计划</Link>
          </Menu.Item>
          <Menu.Item key="/study/resources" icon={<FileTextOutlined />}>
            <Link to="/study/resources">学习资源</Link>
          </Menu.Item>
          <Menu.Item key="/study/summary" icon={<FileTextOutlined />}>
            <Link to="/study/summary">学习总结</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="/psychological" icon={<SmileOutlined />} title="心理评估">
          <Menu.Item key="/psychological" icon={<SmileOutlined />}>
            <Link to="/psychological">评估主页</Link>
          </Menu.Item>
          <Menu.Item key="/psychological/phq9" icon={<MedicineBoxOutlined />}>
            <Link to="/psychological/phq9">抑郁症筛查 (PHQ-9)</Link>
          </Menu.Item>
          <Menu.Item key="/psychological/gad7" icon={<MedicineBoxOutlined />}>
            <Link to="/psychological/gad7">焦虑症筛查 (GAD-7)</Link>
          </Menu.Item>
          <Menu.Item key="/psychological/sas" icon={<MedicineBoxOutlined />}>
            <Link to="/psychological/sas">焦虑自评量表 (SAS)</Link>
          </Menu.Item>
          <Menu.Item key="/psychological/ses" icon={<HeartOutlined />}>
            <Link to="/psychological/ses">自尊量表 (SES)</Link>
          </Menu.Item>
          <Menu.Item key="/psychological/history" icon={<HistoryOutlined />}>
            <Link to="/psychological/history">测试历史</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="/career" icon={<CompassOutlined />} title="职业规划">
          <Menu.Item key="/career" icon={<FundOutlined />}>
            <Link to="/career">职业总览</Link>
          </Menu.Item>
          <Menu.Item key="/career/holland" icon={<CompassOutlined />}>
            <Link to="/career/holland">霍兰德测试</Link>
          </Menu.Item>
          <Menu.Item key="/career/history" icon={<HistoryOutlined />}>
            <Link to="/career/history">测试历史</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="/tools" icon={<ToolOutlined />}>
          <Link to="/tools">工具箱</Link>
        </Menu.Item>

        <Menu.Item key="/profile" icon={<UserOutlined />}>
          <Link to="/profile">个人中心</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar; 