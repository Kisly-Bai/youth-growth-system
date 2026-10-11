import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Tabs,
  Empty,
  Tooltip,
  Row,
  Col,
  Statistic,
  message
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  HistoryOutlined, 
  FileTextOutlined, 
  EyeOutlined,
  ArrowLeftOutlined,
  ToolOutlined,
  ExperimentOutlined,
  HeartOutlined,
  TeamOutlined,
  TrophyOutlined,
  ScheduleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { HollandCode, HollandTestResult } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

// 样式组件
const Container = styled.div`
  padding: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const TypeTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
  margin: 4px;
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

// 霍兰德类型与图标和颜色映射
const typeColorMap = {
  [HollandCode.R]: { color: '#1890ff', icon: <ToolOutlined />, name: '现实型 (Realistic)' },
  [HollandCode.I]: { color: '#722ed1', icon: <ExperimentOutlined />, name: '研究型 (Investigative)' },
  [HollandCode.A]: { color: '#eb2f96', icon: <HeartOutlined />, name: '艺术型 (Artistic)' },
  [HollandCode.S]: { color: '#52c41a', icon: <TeamOutlined />, name: '社会型 (Social)' },
  [HollandCode.E]: { color: '#fa8c16', icon: <TrophyOutlined />, name: '企业型 (Enterprising)' },
  [HollandCode.C]: { color: '#13c2c2', icon: <ScheduleOutlined />, name: '传统型 (Conventional)' },
};

const TestHistory: React.FC = () => {
  const navigate = useNavigate();
  const [hollandHistory, setHollandHistory] = useState<HollandTestResult[]>([]);
  const [activeTab, setActiveTab] = useState('holland');
  const [isLoading, setIsLoading] = useState(false);
  
  // 加载测试历史数据
  const loadHistoryData = () => {
    setIsLoading(true);
    try {
      // 获取霍兰德测试历史记录
      const historyData = JSON.parse(localStorage.getItem('hollandTestHistory') || '[]');
      // 按日期降序排序
      const sortedData = [...historyData].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setHollandHistory(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error('加载历史记录失败:', error);
      message.error('加载历史记录失败');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadHistoryData();
  }, []);
  
  // 返回职业规划主页
  const backToCareerPlanning = () => {
    navigate('/career', { replace: false });
  };
  
  // 查看测试结果详情
  const viewTestResult = (resultId: string) => {
    navigate(`/career/result/${resultId}`, { replace: false });
  };
  
  // 开始新的测试
  const startNewTest = () => {
    navigate('/career/holland', { replace: false });
  };
  
  // 刷新历史数据
  const refreshHistory = () => {
    loadHistoryData();
    message.success('历史记录已刷新');
  };
  
  // 霍兰德测试历史表格列定义
  const hollandColumns: ColumnsType<HollandTestResult> = [
    {
      title: '测试日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: HollandTestResult, b: HollandTestResult) => 
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    },
    {
      title: '主要类型',
      dataIndex: 'primaryCode',
      key: 'primaryCode',
      render: (code: HollandCode) => (
        <TypeTag 
          color={typeColorMap[code].color}
          icon={typeColorMap[code].icon}
        >
          {typeColorMap[code].name}
        </TypeTag>
      ),
      filters: Object.values(HollandCode).map(code => ({
        text: typeColorMap[code].name,
        value: code,
      })),
      onFilter: (value, record: HollandTestResult) => record.primaryCode === value,
    },
    {
      title: '次要类型',
      dataIndex: 'secondaryCode',
      key: 'secondaryCode',
      render: (code: HollandCode) => (
        <TypeTag 
          color={typeColorMap[code].color}
          icon={typeColorMap[code].icon}
        >
          {typeColorMap[code].name}
        </TypeTag>
      ),
      filters: Object.values(HollandCode).map(code => ({
        text: typeColorMap[code].name,
        value: code,
      })),
      onFilter: (value, record: HollandTestResult) => record.secondaryCode === value,
    },
    {
      title: '组合类型',
      dataIndex: 'combinationCode',
      key: 'combinationCode',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: '详细得分',
      key: 'scores',
      render: (_: any, record: HollandTestResult) => (
        <Space size="small" wrap>
          {Object.entries(record.scores).map(([type, score]) => (
            <Tooltip key={type} title={typeColorMap[type as HollandCode].name}>
              <Tag color={typeColorMap[type as HollandCode].color}>
                {type.toUpperCase()}: {score}
              </Tag>
            </Tooltip>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: HollandTestResult) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />}
          onClick={() => viewTestResult(record.id)}
        >
          查看
        </Button>
      ),
    },
  ];
  
  // 渲染表格数据情况统计
  const renderStatistics = () => {
    if (hollandHistory.length === 0) return null;
    
    // 统计各种类型作为主要类型的次数
    const primaryCodeCounts: Record<string, number> = {};
    hollandHistory.forEach(record => {
      primaryCodeCounts[record.primaryCode] = (primaryCodeCounts[record.primaryCode] || 0) + 1;
    });
    
    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <StyledCard>
            <Statistic 
              title="测试总次数" 
              value={hollandHistory.length} 
              valueStyle={{ color: '#1890ff' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} md={16}>
          <StyledCard title="类型分布">
            <Space wrap>
              {Object.entries(primaryCodeCounts).map(([code, count]) => (
                <Tooltip key={code} title={`${count}次测试中为主要类型`}>
                  <TypeTag color={typeColorMap[code as HollandCode].color}>
                    {typeColorMap[code as HollandCode].name}: {count}次
                  </TypeTag>
                </Tooltip>
              ))}
            </Space>
          </StyledCard>
        </Col>
      </Row>
    );
  };
  
  return (
    <Container>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <HeaderActions>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={backToCareerPlanning}
            style={{ padding: 0 }}
          >
            返回职业规划
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={refreshHistory}
            loading={isLoading}
          >
            刷新数据
          </Button>
        </HeaderActions>
        
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>
              <HistoryOutlined style={{ marginRight: 8 }} />
              测试历史记录
            </Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<FileTextOutlined />}
              onClick={startNewTest}
            >
              开始新测试
            </Button>
          </Col>
        </Row>
        
        <Paragraph>
          查看您过往的所有测评结果，追踪职业兴趣和能力的变化与发展。
        </Paragraph>
        
        {renderStatistics()}
        
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition="top"
        >
          <TabPane tab="霍兰德职业兴趣测试" key="holland">
            <StyledCard>
              {hollandHistory.length > 0 ? (
                <Table 
                  columns={hollandColumns} 
                  dataSource={hollandHistory.map(item => ({ ...item, key: item.id }))} 
                  pagination={{ pageSize: 10 }}
                  rowKey="id"
                  loading={isLoading}
                />
              ) : (
                <Empty 
                  description="暂无测试记录" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button 
                    type="primary" 
                    onClick={startNewTest}
                  >
                    开始测试
                  </Button>
                </Empty>
              )}
            </StyledCard>
          </TabPane>
          
          <TabPane tab="职业能力评估" key="ability">
            <Empty 
              description="暂无评估记录，敬请期待" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </TabPane>
        </Tabs>
      </Space>
    </Container>
  );
};

export default TestHistory; 