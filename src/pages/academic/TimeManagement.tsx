import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Button,
  Space,
  Spin,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  message,
  Menu,
} from 'antd';
import {
  ClockCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { TimeBlock, FocusSession } from '../../types';
import { generateTimeBlockId, generateFocusSessionId } from '../../utils/idGenerator';

// 导入时间管理相关组件
import TimeBlockList from './components/timeManagement/TimeBlockList';
import FocusSessions from './components/timeManagement/FocusSessions';
import TimeStatistics from './components/timeManagement/TimeStatistics';
import TimelineView from './components/timeManagement/TimelineView';
import WeekPlanView from './components/timeManagement/WeekPlanView';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Content, Sider } = Layout;

// 样式组件
const StyledLayout = styled(Layout)`
  min-height: calc(100vh - 64px);
`;

const StyledSider = styled(Sider)`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  margin-right: 16px;
  border-radius: 8px;
  overflow: hidden;
`;

const ContentWrapper = styled(Content)`
  padding: 24px;
  background: #f5f5f5;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const HeaderCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: none;
  
  .ant-card-body {
    padding: 24px;
  }
  
  h3 {
    color: white !important;
    margin-bottom: 8px !important;
  }
  
  .ant-typography {
    color: rgba(255, 255, 255, 0.85);
  }
`;

const MenuWrapper = styled.div`
  padding: 16px 0;
  
  .ant-menu-item {
    margin: 8px 0;
    border-radius: 0 24px 24px 0;
    
    &::after {
      display: none;
    }
  }
  
  .ant-menu-item-selected {
    background: #e6f7ff;
    font-weight: 500;
  }
`;

// 时间块类别
const timeBlockCategories = [
  { value: 'study', label: '学习', color: '#1890ff' },
  { value: 'exercise', label: '运动', color: '#52c41a' },
  { value: 'rest', label: '休息', color: '#722ed1' },
  { value: 'entertainment', label: '娱乐', color: '#fa8c16' },
  { value: 'social', label: '社交', color: '#eb2f96' },
  { value: 'other', label: '其他', color: '#bfbfbf' },
];

// 生成模拟时间块数据
const generateMockTimeBlocks = (): TimeBlock[] => {
  const blocks: TimeBlock[] = [];
  const categories = ['study', 'rest', 'exercise', 'entertainment', 'social', 'other'];
  const today = dayjs();
  
  for (let i = 0; i < 20; i++) {
    const date = today.subtract(Math.floor(Math.random() * 14), 'day');
    const startHour = Math.floor(Math.random() * 14) + 8; // 8AM - 10PM
    const duration = Math.floor(Math.random() * 120) + 30; // 30min - 150min
    
    const startTime = date.hour(startHour).minute(0).second(0);
    const endTime = startTime.add(duration, 'minute');
    
    blocks.push({
      id: `time-block-${i}`,
      userId: 'current-user',
      title: `时间块 ${i + 1}`,
      description: `这是时间块 ${i + 1} 的详细描述`,
      startTime: startTime.format(),
      endTime: endTime.format(),
      category: categories[Math.floor(Math.random() * categories.length)],
      completed: Math.random() > 0.5,
      createdAt: date.subtract(1, 'day').format(),
      updatedAt: date.format(),
    });
  }
  
  return blocks;
};

// 生成模拟专注记录
const generateMockFocusSessions = (): FocusSession[] => {
  const sessions: FocusSession[] = [];
  const today = dayjs();
  
  for (let i = 0; i < 10; i++) {
    const date = today.subtract(Math.floor(Math.random() * 14), 'day');
    const duration = Math.floor(Math.random() * 90) + 30; // 30min - 120min
    const completedDuration = Math.floor(Math.random() * duration);
    const interruptions = Math.floor(Math.random() * 5);
    
    const startTime = date.hour(Math.floor(Math.random() * 14) + 8).minute(0).second(0);
    const endTime = startTime.add(duration, 'minute');
    
    sessions.push({
      id: `focus-session-${i}`,
      userId: 'current-user',
      title: `专注记录 ${i + 1}`,
      duration: duration,
      completedDuration: completedDuration,
      startTime: startTime.format(),
      endTime: endTime.format(),
      interruptions: interruptions,
      createdAt: date.format(),
    });
  }
  
  return sessions;
};

// 主组件
const TimeManagement: React.FC = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [addFocusModalVisible, setAddFocusModalVisible] = useState<boolean>(false);
  const [editingTimeBlock, setEditingTimeBlock] = useState<TimeBlock | null>(null);
  const [currentFocusSession, setCurrentFocusSession] = useState<FocusSession | null>(null);
  const [form] = Form.useForm();
  const [focusForm] = Form.useForm();
  const location = useLocation();

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('week-plan')) return 'week';
    if (path.includes('timeline')) return 'timeline';
    if (path.includes('statistics')) return 'statistics';
    if (path.includes('focus')) return 'focus';
    return 'list';
  };

  // 加载数据
  useEffect(() => {
    // 模拟API加载
    setTimeout(() => {
      setTimeBlocks(generateMockTimeBlocks());
      setFocusSessions(generateMockFocusSessions());
      setLoading(false);
    }, 1000);
  }, []);

  // 处理添加/编辑时间块
  const handleEdit = (timeBlock: TimeBlock | null) => {
    setEditingTimeBlock(timeBlock);
    
    if (timeBlock) {
      form.setFieldsValue({
        title: timeBlock.title,
        description: timeBlock.description || '',
        dateRange: [dayjs(timeBlock.startTime), dayjs(timeBlock.endTime)],
        category: timeBlock.category,
        completed: timeBlock.completed,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        dateRange: [dayjs(), dayjs().add(1, 'hour')],
        category: 'study',
        completed: false,
      });
    }
    
    setAddModalVisible(true);
  };

  // 处理保存时间块
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const [startTime, endTime] = values.dateRange;
      
      const newTimeBlock: TimeBlock = {
        id: editingTimeBlock ? editingTimeBlock.id : generateTimeBlockId(),
        userId: 'current-user',
        title: values.title,
        description: values.description,
        startTime: startTime.format(),
        endTime: endTime.format(),
        category: values.category,
        completed: values.completed,
        createdAt: editingTimeBlock ? editingTimeBlock.createdAt : dayjs().format(),
        updatedAt: dayjs().format(),
      };
      
      if (editingTimeBlock) {
        // 更新时间块
        setTimeBlocks(prevBlocks => 
          prevBlocks.map(block => 
            block.id === editingTimeBlock.id ? newTimeBlock : block
          )
        );
        message.success('时间块已更新');
      } else {
        // 添加新时间块
        setTimeBlocks(prevBlocks => [...prevBlocks, newTimeBlock]);
        message.success('时间块已添加');
      }
      
      setAddModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理删除时间块
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这个时间块吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setTimeBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
        message.success('时间块已删除');
      },
    });
  };

  // 处理更新时间块状态
  const handleUpdateStatus = (id: string, completed: boolean) => {
    setTimeBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, completed, updatedAt: dayjs().format() } : block
      )
    );
    message.success(`时间块已${completed ? '完成' : '标记为未完成'}`);
  };

  // 处理开始新的专注会话
  const handleStartFocusSession = async () => {
    try {
      const values = await focusForm.validateFields();
      
      const newFocusSession: FocusSession = {
        id: generateFocusSessionId(),
        userId: 'current-user',
        title: values.title,
        duration: values.duration,
        completedDuration: 0,
        startTime: dayjs().format(),
        endTime: '',
        interruptions: 0,
        createdAt: dayjs().format(),
      };
      
      setCurrentFocusSession(newFocusSession);
      setAddFocusModalVisible(false);
      message.success('专注会话已开始');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理完成专注会话
  const handleCompleteFocusSession = (
    session: FocusSession, 
    completedDuration: number, 
    interruptions: number
  ) => {
    const updatedSession = {
      ...session,
      completedDuration,
      interruptions,
      endTime: dayjs().format(),
    };
    
    setFocusSessions(prev => [updatedSession, ...prev]);
    setCurrentFocusSession(null);
    message.success('专注会话已完成');
  };

  // 处理取消专注会话
  const handleCancelFocusSession = () => {
    setCurrentFocusSession(null);
    message.info('专注会话已取消');
  };

  // 渲染表单
  const renderAddTimeBlockForm = () => (
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入时间块标题' }]}
      >
        <Input placeholder="输入时间块标题" />
      </Form.Item>
      
      <Form.Item name="description" label="描述">
        <Input.TextArea placeholder="输入时间块描述" rows={3} />
      </Form.Item>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="dateRange"
            label="时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker 
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item
        name="category"
        label="类别"
        rules={[{ required: true, message: '请选择类别' }]}
      >
        <Select placeholder="选择类别">
          {timeBlockCategories.map(cat => (
            <Option key={cat.value} value={cat.value}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: cat.color, 
                  marginRight: 8 
                }} />
                {cat.label}
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item name="completed" valuePropName="checked">
        <Checkbox>已完成</Checkbox>
      </Form.Item>
    </Form>
  );

  // 渲染添加专注会话表单
  const renderAddFocusSessionForm = () => (
    <Form form={focusForm} layout="vertical" onFinish={handleStartFocusSession}>
      <Form.Item
        name="title"
        label="专注主题"
        rules={[{ required: true, message: '请输入专注主题' }]}
      >
        <Input placeholder="如：数学作业、阅读、英语听力" />
      </Form.Item>
      
      <Form.Item
        name="duration"
        label="计划时长（分钟）"
        rules={[{ required: true, message: '请输入计划时长' }]}
        initialValue={25}
      >
        <Select>
          <Option value={25}>25分钟（经典番茄时间）</Option>
          <Option value={30}>30分钟</Option>
          <Option value={45}>45分钟</Option>
          <Option value={60}>60分钟</Option>
          <Option value={90}>90分钟</Option>
          <Option value={120}>120分钟</Option>
        </Select>
      </Form.Item>
    </Form>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <StyledLayout>
      <StyledSider width={220} theme="light">
        <MenuWrapper>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{ 
              height: '100%', 
              borderRight: 0
            }}
          >
            <Menu.Item key="list" icon={<UnorderedListOutlined />}>
              <Link to="/academic/time-management">时间块列表</Link>
            </Menu.Item>
            <Menu.Item key="week" icon={<CalendarOutlined />}>
              <Link to="/academic/time-management/week-plan">周计划视图</Link>
            </Menu.Item>
            <Menu.Item key="timeline" icon={<ClockCircleOutlined />}>
              <Link to="/academic/time-management/timeline">时间线视图</Link>
            </Menu.Item>
            <Menu.Item key="statistics" icon={<BarChartOutlined />}>
              <Link to="/academic/time-management/statistics">时间统计</Link>
            </Menu.Item>
            <Menu.Item key="focus" icon={<ThunderboltOutlined />}>
              <Link to="/academic/time-management/focus">专注记录</Link>
            </Menu.Item>
          </Menu>
        </MenuWrapper>
      </StyledSider>
      
      <ContentWrapper>
        <HeaderCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3} style={{ color: 'white', marginBottom: '8px' }}>时间管理</Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: 0 }}>
                规划你的时间，提高学习和生活效率。创建时间块、记录专注会话，查看时间使用情况统计。
              </Paragraph>
            </div>
            <Space size="middle">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => handleEdit(null)}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  borderColor: 'transparent',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }}
              >
                创建时间块
              </Button>
              <Button 
                icon={<ThunderboltOutlined />}
                onClick={() => setAddFocusModalVisible(true)}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)', 
                  borderColor: 'transparent',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
              >
                开始专注
              </Button>
            </Space>
          </div>
        </HeaderCard>
        
        <Routes>
          <Route path="/" element={
            <StyledCard>
              <TimeBlockList 
                timeBlocks={timeBlocks} 
                categories={timeBlockCategories} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
              />
            </StyledCard>
          } />
          <Route path="/week-plan" element={
            <StyledCard>
              <WeekPlanView 
                timeBlocks={timeBlocks} 
                categories={timeBlockCategories} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
              />
            </StyledCard>
          } />
          <Route path="/timeline" element={
            <StyledCard>
              <TimelineView 
                timeBlocks={timeBlocks}
                categories={timeBlockCategories} 
              />
            </StyledCard>
          } />
          <Route path="/statistics" element={
            <StyledCard>
              <TimeStatistics 
                timeBlocks={timeBlocks}
                focusSessions={focusSessions}
                categories={timeBlockCategories} 
              />
            </StyledCard>
          } />
          <Route path="/focus" element={
            <StyledCard>
              <FocusSessions 
                focusSessions={focusSessions}
                currentSession={currentFocusSession}
                onComplete={handleCompleteFocusSession}
                onCancel={handleCancelFocusSession}
                isHistory={true}
              />
            </StyledCard>
          } />
        </Routes>
      </ContentWrapper>
      
      <Modal
        title={editingTimeBlock ? "编辑时间块" : "创建新时间块"}
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          setEditingTimeBlock(null);
        }}
        onOk={() => form.submit()}
        okText={editingTimeBlock ? "更新" : "添加"}
        cancelText="取消"
        centered
        width={600}
        bodyStyle={{ padding: '24px' }}
      >
        {renderAddTimeBlockForm()}
      </Modal>
      
      <Modal
        title="开始专注"
        open={addFocusModalVisible}
        onCancel={() => setAddFocusModalVisible(false)}
        onOk={() => focusForm.submit()}
        okText="开始"
        cancelText="取消"
        centered
        width={400}
        bodyStyle={{ padding: '24px' }}
      >
        {renderAddFocusSessionForm()}
      </Modal>
    </StyledLayout>
  );
};

export default TimeManagement; 