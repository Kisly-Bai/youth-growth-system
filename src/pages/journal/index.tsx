import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Tabs, Typography } from 'antd';
import styled from 'styled-components';
import { BookOutlined, TrophyOutlined, FlagOutlined } from '@ant-design/icons';

// 导入组件
import Goals from './components/Goals';
import Achievements from './components/Achievements';
import Milestones from './components/Milestones';

const { Title } = Typography;
const PageContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const ContentContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const JournalPage: React.FC = () => {
  const items = [
    {
      key: 'goals',
      label: (
        <span>
          <FlagOutlined />
          目标管理
        </span>
      ),
      children: <Goals />,
    },
    {
      key: 'achievements',
      label: (
        <span>
          <TrophyOutlined />
          成就记录
        </span>
      ),
      children: <Achievements />,
    },
    {
      key: 'milestones',
      label: (
        <span>
          <BookOutlined />
          重要里程碑
        </span>
      ),
      children: <Milestones />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <Title level={2}>成长印记</Title>
        <Typography.Paragraph>
          记录你的成长目标、成就与重要里程碑，见证自己的每一步成长。
        </Typography.Paragraph>
      </PageHeader>
      
      <ContentContainer>
        <Tabs
          defaultActiveKey="goals"
          items={items}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        />
      </ContentContainer>
    </PageContainer>
  );
};

const JournalRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<JournalPage />} />
    </Routes>
  );
};

export default JournalRoutes; 