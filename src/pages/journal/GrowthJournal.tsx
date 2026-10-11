import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Statistic, 
  Timeline, 
  Tag, 
  Space,
  Progress,
  Empty
} from 'antd';
import { 
  CalendarOutlined, 
  TrophyOutlined, 
  FlagOutlined, 
  HeartOutlined, 
  ReadOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import Diary from './components/Diary';
import Goals from './components/Goals';
import Achievements from './components/Achievements';
import Milestones from './components/Milestones';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

// 样式组件
const StyledCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 16px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
  }
`;

const HeaderCard = styled(StyledCard)`
  background: linear-gradient(135deg, #1890ff, #722ed1);
  color: white;
  
  .ant-card-head {
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .ant-card-head-title {
    color: white;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 16px;
  }
  
  .ant-tabs-ink-bar {
    background-color: #1890ff;
  }
`;

const StatisticWrapper = styled.div`
  text-align: center;
  padding: 16px 0;
  
  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .ant-statistic-content {
    color: white;
  }
`;

// 主组件
const GrowthJournal: React.FC = () => {
  // 用于显示用户的成长统计信息
  const [statistics, setStatistics] = useState({
    diaryCount: 42,
    goalCount: 12,
    achievementCount: 21,
    milestoneCount: 8,
    currentStreak: 7,
    longestStreak: 14
  });
  
  // 当前活跃的标签
  const [activeTab, setActiveTab] = useState('diary');
  
  // 监听标签变化
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div style={{ padding: '8px' }}>
      <HeaderCard>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={2} style={{ color: 'white', margin: '0 0 16px 0' }}>
              成长印记
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              记录你的学习、成长历程，见证每一次的进步和收获
            </Paragraph>
          </Col>
          <Col xs={8} sm={8} md={4}>
            <StatisticWrapper>
              <Statistic title="日记数量" value={statistics.diaryCount} />
            </StatisticWrapper>
          </Col>
          <Col xs={8} sm={8} md={4}>
            <StatisticWrapper>
              <Statistic title="目标数量" value={statistics.goalCount} />
            </StatisticWrapper>
          </Col>
          <Col xs={8} sm={8} md={4}>
            <StatisticWrapper>
              <Statistic title="成就数量" value={statistics.achievementCount} />
            </StatisticWrapper>
          </Col>
          <Col xs={8} sm={8} md={4}>
            <StatisticWrapper>
              <Statistic title="里程碑" value={statistics.milestoneCount} />
            </StatisticWrapper>
          </Col>
          <Col xs={8} sm={8} md={4}>
            <StatisticWrapper>
              <Statistic title="当前连续" value={statistics.currentStreak} suffix="天" />
            </StatisticWrapper>
          </Col>
          <Col xs={8} sm={8} md={4}>
            <StatisticWrapper>
              <Statistic title="最长连续" value={statistics.longestStreak} suffix="天" />
            </StatisticWrapper>
          </Col>
        </Row>
      </HeaderCard>

      <StyledTabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        tabPosition="top"
        size="large"
      >
        <TabPane 
          tab={
            <span>
              <CalendarOutlined />
              日记
            </span>
          } 
          key="diary"
        >
          <Diary />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <FlagOutlined />
              目标
            </span>
          } 
          key="goals"
        >
          <Goals />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              成就
            </span>
          } 
          key="achievements"
        >
          <Achievements />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <ClockCircleOutlined />
              里程碑
            </span>
          } 
          key="milestones"
        >
          <Milestones />
        </TabPane>
      </StyledTabs>
    </div>
  );
};

export default GrowthJournal; 