import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  InputNumber,
  Select,
  Button,
  Space,
  message,
  Row,
  Col,
  Table,
  Tag,
  Tooltip,
  Modal,
  Input,
  Progress
} from 'antd';
import {
  SaveOutlined,
  RollbackOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

interface GoalItem {
  id: string;
  type: string;
  targetValue: number;
  unit: string;
  frequency: string;
  deadline: string;
  createdAt: string;
  progress: number;
  status: 'active' | 'completed' | 'expired';
}

const HealthGoals: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // 模拟存储的目标数据
  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: '1',
      type: 'steps',
      targetValue: 10000,
      unit: '步',
      frequency: 'daily',
      deadline: '2025-06-30',
      createdAt: '2025-03-01',
      progress: 85,
      status: 'active'
    },
    {
      id: '2',
      type: 'sleep',
      targetValue: 8,
      unit: '小时',
      frequency: 'daily',
      deadline: '2025-06-30',
      createdAt: '2025-03-01',
      progress: 90,
      status: 'active'
    },
    {
      id: '3',
      type: 'weight',
      targetValue: 65,
      unit: 'kg',
      frequency: 'once',
      deadline: '2025-06-30',
      createdAt: '2025-03-01',
      progress: 70,
      status: 'active'
    },
    {
      id: '4',
      type: 'exercise',
      targetValue: 150,
      unit: '分钟',
      frequency: 'weekly',
      deadline: '2025-05-30',
      createdAt: '2025-03-01',
      progress: 100,
      status: 'completed'
    }
  ]);
  
  // 处理表单提交
  const handleSubmit = (values: any) => {
    setLoading(true);
    
    console.log('提交的目标数据:', values);
    
    // 构建新目标或更新目标
    const newGoal: GoalItem = {
      id: editingGoal ? editingGoal.id : Date.now().toString(),
      type: values.type,
      targetValue: values.targetValue,
      unit: getUnitByType(values.type),
      frequency: values.frequency,
      deadline: values.deadline,
      createdAt: editingGoal ? editingGoal.createdAt : new Date().toISOString().split('T')[0],
      progress: editingGoal ? editingGoal.progress : 0,
      status: 'active'
    };
    
    // 更新状态
    setTimeout(() => {
      if (editingGoal) {
        // 更新现有目标
        setGoals(goals.map(g => g.id === editingGoal.id ? newGoal : g));
        message.success('健康目标更新成功！');
      } else {
        // 添加新目标
        setGoals([...goals, newGoal]);
        message.success('健康目标设置成功！');
      }
      
      setLoading(false);
      setIsModalVisible(false);
      setEditingGoal(null);
      form.resetFields();
    }, 1000);
  };
  
  // 获取目标类型对应的单位
  const getUnitByType = (type: string): string => {
    switch (type) {
      case 'steps':
        return '步';
      case 'sleep':
        return '小时';
      case 'weight':
        return 'kg';
      case 'exercise':
        return '分钟';
      case 'calories':
        return '千卡';
      case 'water':
        return 'ml';
      default:
        return '';
    }
  };
  
  // 获取目标类型对应的描述
  const getGoalTypeLabel = (type: string): string => {
    switch (type) {
      case 'steps':
        return '步数';
      case 'sleep':
        return '睡眠时长';
      case 'weight':
        return '体重';
      case 'exercise':
        return '运动时长';
      case 'calories':
        return '卡路里摄入';
      case 'water':
        return '饮水量';
      default:
        return type;
    }
  };
  
  // 获取频率描述
  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case 'daily':
        return '每天';
      case 'weekly':
        return '每周';
      case 'monthly':
        return '每月';
      case 'once':
        return '一次性';
      default:
        return frequency;
    }
  };
  
  // 处理编辑目标
  const handleEdit = (record: GoalItem) => {
    setEditingGoal(record);
    form.setFieldsValue({
      type: record.type,
      targetValue: record.targetValue,
      frequency: record.frequency,
      deadline: record.deadline
    });
    setIsModalVisible(true);
  };
  
  // 处理删除目标
  const handleDelete = (id: string) => {
    confirm({
      title: '确定要删除这个健康目标吗？',
      content: '删除后无法恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setGoals(goals.filter(goal => goal.id !== id));
        message.success('目标已删除');
      }
    });
  };
  
  // 处理完成目标
  const handleCompleteGoal = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, status: 'completed', progress: 100 } : goal
    ));
    message.success('恭喜您完成健康目标！');
  };
  
  // 处理返回
  const handleBack = () => {
    navigate('/health');
  };
  
  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="processing">进行中</Tag>;
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'expired':
        return <Tag color="error">已过期</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };
  
  // 表格列定义
  const columns = [
    {
      title: '目标类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => getGoalTypeLabel(text)
    },
    {
      title: '目标值',
      dataIndex: 'targetValue',
      key: 'targetValue',
      render: (text: number, record: GoalItem) => `${text} ${record.unit}`
    },
    {
      title: '频率',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (text: string) => getFrequencyLabel(text)
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline'
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Tooltip title={`${progress}%`}>
          <Progress percent={progress} size="small" />
        </Tooltip>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => renderStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      render: (_: React.Key, record: GoalItem) => (
        <Space size="small">
          {record.status === 'active' && (
            <>
              <Button 
                type="text" 
                size="small" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)}
              />
              <Button 
                type="text" 
                size="small" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleCompleteGoal(record.id)}
              />
            </>
          )}
          <Button 
            type="text" 
            size="small" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      )
    }
  ];
  
  return (
    <Container>
      <Title level={3}>健康目标管理</Title>
      <Paragraph>
        设置和跟踪您的健康目标，持续改善您的健康状况。
      </Paragraph>
      
      <StyledCard
        title="目标列表"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingGoal(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            新增目标
          </Button>
        }
      >
        <Table
          dataSource={goals}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </StyledCard>
      
      <StyledCard title="健康目标建议">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title="体重管理" bordered={false}>
              <ul>
                <li>健康体重减轻：每周0.5-1公斤</li>
                <li>健康BMI范围：18.5-24.9</li>
                <li>避免快速减重，保持稳定饮食</li>
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="运动建议" bordered={false}>
              <ul>
                <li>每周150分钟中等强度运动</li>
                <li>每天10,000步</li>
                <li>每周进行2-3次力量训练</li>
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="生活习惯" bordered={false}>
              <ul>
                <li>每晚7-9小时睡眠</li>
                <li>每天饮水2000ml</li>
                <li>减少久坐时间，每小时起身活动</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </StyledCard>
      
      <Button 
        onClick={handleBack} 
        icon={<RollbackOutlined />} 
        style={{ marginTop: 16 }}
      >
        返回健康管理
      </Button>
      
      <Modal
        title={editingGoal ? "编辑健康目标" : "新增健康目标"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="type"
            label="目标类型"
            rules={[{ required: true, message: '请选择目标类型' }]}
          >
            <Select placeholder="选择目标类型">
              <Option value="steps">步数</Option>
              <Option value="sleep">睡眠时长</Option>
              <Option value="weight">体重</Option>
              <Option value="exercise">运动时长</Option>
              <Option value="calories">卡路里摄入</Option>
              <Option value="water">饮水量</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="targetValue"
            label="目标值"
            rules={[{ required: true, message: '请输入目标值' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          
          <Form.Item
            name="frequency"
            label="目标频率"
            rules={[{ required: true, message: '请选择目标频率' }]}
          >
            <Select placeholder="选择目标频率">
              <Option value="daily">每天</Option>
              <Option value="weekly">每周</Option>
              <Option value="monthly">每月</Option>
              <Option value="once">一次性</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="deadline"
            label="截止日期"
            rules={[{ required: true, message: '请选择截止日期' }]}
          >
            <Input type="date" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                {editingGoal ? '更新目标' : '保存目标'}
              </Button>
              <Button
                onClick={() => setIsModalVisible(false)}
                icon={<CloseCircleOutlined />}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default HealthGoals; 