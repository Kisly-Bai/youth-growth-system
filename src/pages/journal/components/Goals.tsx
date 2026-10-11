import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Typography, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select,
  Empty,
  message,
  Popconfirm,
  Progress,
  Slider,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  UnorderedListOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useAuth } from '../../../contexts/AuthContext';
import * as journalService from '../../../services/journal';
import { Goal } from '../../../services/journal';

// 配置dayjs
dayjs.locale('zh-cn');

// 定义目标状态
type GoalStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue';

// 定义目标状态与显示相关的映射
const goalStatuses: Record<GoalStatus, { color: string; text: string }> = {
  'not-started': { color: 'default', text: '未开始' },
  'in-progress': { color: 'processing', text: '进行中' },
  'completed': { color: 'success', text: '已完成' },
  'overdue': { color: 'error', text: '已逾期' }
};

// 定义目标类别
const goalCategories = [
  { value: 'academic', label: '学业' },
  { value: 'career', label: '职业规划' },
  { value: 'skill', label: '技能提升' },
  { value: 'health', label: '健康' },
  { value: 'personal', label: '个人发展' },
  { value: 'other', label: '其他' }
];

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // 获取目标列表
  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      const userGoals = journalService.getGoals(user.id);
      setGoals(userGoals);
      setLoading(false);
    }
  }, [user]);

  // 打开创建目标的模态框
  const showCreateModal = () => {
    setIsEditMode(false);
    setSelectedGoal(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑目标的模态框
  const showEditModal = (goal: Goal) => {
    setIsEditMode(true);
    setSelectedGoal(goal);
    
    // 设置表单初始值
    form.setFieldsValue({
      title: goal.title,
      description: goal.description,
      dateRange: [dayjs(goal.startDate), dayjs(goal.endDate)],
      category: goal.category,
      progress: goal.progress,
      steps: goal.steps
    });
    
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!user || !user.id) {
        message.error('请先登录');
        return;
      }
      
      const goalData = {
        title: values.title,
        description: values.description,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        category: values.category,
        progress: values.progress || 0,
        status: 'not-started' as GoalStatus,
        steps: values.steps || []
      };
      
      if (isEditMode && selectedGoal) {
        // 更新目标
        const updatedGoal = journalService.updateGoal(selectedGoal.id, goalData, user.id);
        if (updatedGoal) {
          message.success('目标已更新');
          setGoals(goals.map(g => g.id === selectedGoal.id ? updatedGoal : g));
        } else {
          message.error('更新目标失败');
        }
      } else {
        // 创建新目标
        const newGoal = journalService.saveGoal(goalData, user.id);
        message.success('目标已创建');
        setGoals([...goals, newGoal]);
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除目标
  const handleDelete = (goalId: string) => {
    if (!user || !user.id) {
      message.error('请先登录');
      return;
    }
    
    const success = journalService.deleteGoal(goalId, user.id);
    
    if (success) {
      message.success('目标已删除');
      setGoals(goals.filter(g => g.id !== goalId));
    } else {
      message.error('删除目标失败');
    }
  };

  // 更新步骤状态
  const toggleStepCompletion = (goalId: string, stepId: string, completed: boolean) => {
    if (!user || !user.id) {
      message.error('请先登录');
      return;
    }
    
    const goal = goals.find(g => g.id === goalId);
    
    if (!goal) {
      return;
    }
    
    const updatedSteps = goal.steps.map(step => 
      step.id === stepId ? { ...step, completed } : step
    );
    
    // 计算完成步骤的数量占比
    const completedStepsCount = updatedSteps.filter(s => s.completed).length;
    const progress = updatedSteps.length > 0 
      ? Math.round((completedStepsCount / updatedSteps.length) * 100) 
      : goal.progress;
    
    const updatedGoal = journalService.updateGoal(
      goalId, 
      { 
        steps: updatedSteps,
        progress
      }, 
      user.id
    );
    
    if (updatedGoal) {
      setGoals(goals.map(g => g.id === goalId ? updatedGoal : g));
    }
  };

  // 计算目标状态
  const getGoalStatus = (goal: Goal): GoalStatus => {
    if (goal.progress >= 100) {
      return 'completed';
    }
    
    const now = new Date();
    const endDate = new Date(goal.endDate);
    
    if (endDate < now && goal.progress < 100) {
      return 'overdue';
    }
    
    if (goal.progress > 0) {
      return 'in-progress';
    }
    
    return 'not-started' as GoalStatus;
  };

  // 计算剩余天数
  const getRemainingDays = (endDate: string): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // 渲染目标卡片
  const renderGoalItem = (goal: Goal) => {
    const status = getGoalStatus(goal);
    const remainingDays = getRemainingDays(goal.endDate);
    const { color, text } = goalStatuses[status];
    
    return (
      <List.Item>
        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {goal.title}
              </Typography.Title>
              <Tag color={color}>
                {text}
              </Tag>
            </div>
          }
          extra={
            <Space>
              <Button 
                icon={<EditOutlined />} 
                size="small" 
                onClick={() => showEditModal(goal)}
              />
              <Popconfirm
                title="确定要删除这个目标吗？"
                onConfirm={() => handleDelete(goal.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  danger 
                  icon={<DeleteOutlined />} 
                  size="small"
                />
              </Popconfirm>
            </Space>
          }
          style={{ width: '100%' }}
        >
          <Typography.Paragraph ellipsis={{ rows: 2 }}>
            {goal.description}
          </Typography.Paragraph>
          
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">{goalCategories.find(c => c.value === goal.category)?.label || goal.category}</Tag>
            <Tag icon={<FieldTimeOutlined />}>
              {remainingDays > 0 
                ? `剩余 ${remainingDays} 天` 
                : '已截止'}
            </Tag>
          </div>
          
          <Progress 
            percent={goal.progress} 
            status={status === 'overdue' ? 'exception' : undefined}
            style={{ marginBottom: 16 }}
          />
          
          {goal.steps.length > 0 && (
            <>
              <Divider orientation="left">
                <Space>
                  <UnorderedListOutlined />
                  <span>步骤</span>
                </Space>
              </Divider>
              
              <List
                size="small"
                dataSource={goal.steps}
                renderItem={step => (
                  <List.Item
                    actions={[
                      <Button 
                        type="text"
                        icon={step.completed ? <MinusCircleOutlined /> : <CheckCircleOutlined />}
                        size="small"
                        onClick={() => toggleStepCompletion(goal.id, step.id, !step.completed)}
                      />
                    ]}
                  >
                    <Typography.Text delete={step.completed}>
                      {step.title}
                    </Typography.Text>
                  </List.Item>
                )}
              />
            </>
          )}
        </Card>
      </List.Item>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>目标管理</Typography.Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          添加目标
        </Button>
      </div>
      
      {goals.length > 0 ? (
        <List
          grid={{ 
            gutter: 16, 
            xs: 1, 
            sm: 2, 
            md: 2, 
            lg: 3, 
            xl: 3, 
            xxl: 3 
          }}
          dataSource={goals}
          renderItem={renderGoalItem}
          loading={loading}
        />
      ) : (
        <Empty 
          description="暂无目标" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      )}
      
      <Modal
        title={isEditMode ? '编辑目标' : '创建新目标'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="目标标题"
            rules={[{ required: true, message: '请输入目标标题' }]}
          >
            <Input placeholder="请输入目标标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="目标描述"
          >
            <Input.TextArea 
              placeholder="请输入目标描述" 
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="dateRange"
            label="起止时间"
            rules={[{ required: true, message: '请选择起止时间' }]}
          >
            <DatePicker.RangePicker 
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="目标类别"
            rules={[{ required: true, message: '请选择目标类别' }]}
          >
            <Select
              placeholder="请选择目标类别"
              options={goalCategories}
            />
          </Form.Item>
          
          <Form.Item
            name="progress"
            label="完成进度"
          >
            <Slider />
          </Form.Item>
          
          <Divider orientation="left">步骤</Divider>
          
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space 
                    key={key} 
                    style={{ display: 'flex', marginBottom: 8 }} 
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      rules={[{ required: true, message: '请输入步骤描述' }]}
                      style={{ marginBottom: 0, width: '400px' }}
                    >
                      <Input placeholder="步骤描述" />
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'completed']}
                      valuePropName="checked"
                      style={{ marginBottom: 0 }}
                      initialValue={false}
                    >
                      <Input type="checkbox" style={{ display: 'none' }} />
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      style={{ display: 'none' }}
                      initialValue={Math.random().toString(36).substr(2, 9)}
                    >
                      <Input type="hidden" />
                    </Form.Item>
                    
                    <Button 
                      danger 
                      type="text"
                      icon={<MinusCircleOutlined />} 
                      onClick={() => remove(name)} 
                    />
                  </Space>
                ))}
                
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    添加步骤
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default Goals; 