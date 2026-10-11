import React, { useState, useEffect } from 'react';
import { 
  Timeline, 
  Typography, 
  Button, 
  Card, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select,
  Empty,
  message,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  TagOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';
import * as journalService from '../../../services/journal';
import { Milestone } from '../../../services/journal';

// 配置dayjs
dayjs.locale('zh-cn');

const { TextArea } = Input;
const { Option } = Select;

// 里程碑类别
const milestoneCategories = [
  { value: 'academic', label: '学业', color: '#1890ff' },
  { value: 'career', label: '职业规划', color: '#52c41a' },
  { value: 'personal', label: '个人成长', color: '#722ed1' },
  { value: 'skill', label: '技能发展', color: '#fa8c16' },
  { value: 'relationship', label: '人际关系', color: '#eb2f96' },
  { value: 'health', label: '身心健康', color: '#13c2c2' },
  { value: 'other', label: '其他', color: '#8c8c8c' }
];

// 获取类别标签
const getCategoryLabel = (value: string): string => {
  const category = milestoneCategories.find(c => c.value === value);
  return category ? category.label : value;
};

// 获取类别颜色
const getCategoryColor = (value: string): string => {
  const category = milestoneCategories.find(c => c.value === value);
  return category ? category.color : '#8c8c8c';
};

const Milestones: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const { user } = useAuth();

  // 获取里程碑列表
  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      const userMilestones = journalService.getMilestones(user.id);
      setMilestones(userMilestones);
      setLoading(false);
    }
  }, [user]);

  // 打开创建里程碑的模态框
  const showCreateModal = () => {
    setIsEditMode(false);
    setSelectedMilestone(null);
    form.resetFields();
    form.setFieldsValue({
      date: dayjs(),
      color: '#1890ff',
      tags: []
    });
    setIsModalVisible(true);
  };

  // 打开编辑里程碑的模态框
  const showEditModal = (milestone: Milestone) => {
    setIsEditMode(true);
    setSelectedMilestone(milestone);
    
    // 设置表单初始值
    form.setFieldsValue({
      title: milestone.title,
      description: milestone.description,
      date: dayjs(milestone.date),
      category: milestone.category,
      color: milestone.color,
      tags: milestone.tags
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
      
      const milestoneData = {
        title: values.title,
        description: values.description,
        date: values.date.toISOString(),
        category: values.category,
        color: values.color || getCategoryColor(values.category),
        tags: values.tags || []
      };
      
      if (isEditMode && selectedMilestone) {
        // 更新里程碑
        const updatedMilestone = journalService.updateMilestone(selectedMilestone.id, milestoneData, user.id);
        
        if (updatedMilestone) {
          message.success('里程碑已更新');
          setMilestones(milestones.map(m => m.id === selectedMilestone.id ? updatedMilestone : m));
        } else {
          message.error('更新里程碑失败');
        }
      } else {
        // 创建新里程碑
        const newMilestone = journalService.saveMilestone(milestoneData, user.id);
        
        message.success('里程碑已创建');
        setMilestones([...milestones, newMilestone]);
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除里程碑
  const handleDelete = (milestoneId: string) => {
    if (!user || !user.id) {
      message.error('请先登录');
      return;
    }
    
    const success = journalService.deleteMilestone(milestoneId, user.id);
    
    if (success) {
      message.success('里程碑已删除');
      setMilestones(milestones.filter(m => m.id !== milestoneId));
    } else {
      message.error('删除里程碑失败');
    }
  };

  // 处理颜色选择
  const handleCategoryChange = (value: string) => {
    form.setFieldsValue({ color: getCategoryColor(value) });
  };

  // 按日期排序的里程碑
  const sortedMilestones = [...milestones].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // 降序，最新的在最前
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>重要里程碑</Typography.Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          添加里程碑
        </Button>
      </div>
      
      {milestones.length > 0 ? (
        <Card loading={loading}>
          <Timeline
            mode="left"
            items={sortedMilestones.map(milestone => ({
              color: milestone.color,
              label: dayjs(milestone.date).format('YYYY-MM-DD'),
              children: (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {milestone.title}
                    </Typography.Title>
                    <Space>
                      <Button 
                        icon={<EditOutlined />} 
                        size="small" 
                        onClick={() => showEditModal(milestone)}
                      />
                      <Popconfirm
                        title="确定要删除这个里程碑吗？"
                        onConfirm={() => handleDelete(milestone.id)}
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
                  </div>
                  
                  <div style={{ margin: '8px 0' }}>
                    <Tag color={milestone.color}>
                      {getCategoryLabel(milestone.category)}
                    </Tag>
                    {milestone.tags.map((tag, index) => (
                      <Tag key={index} icon={<TagOutlined />}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  
                  <Typography.Paragraph style={{ marginTop: 8 }}>
                    {milestone.description}
                  </Typography.Paragraph>
                </div>
              )
            }))}
          />
        </Card>
      ) : (
        <Empty 
          description="暂无里程碑记录" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      )}
      
      <Modal
        title={isEditMode ? '编辑里程碑' : '创建新里程碑'}
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
            label="里程碑标题"
            rules={[{ required: true, message: '请输入里程碑标题' }]}
          >
            <Input placeholder="请输入里程碑标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="里程碑描述"
          >
            <TextArea 
              placeholder="请描述这个里程碑的意义" 
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="类别"
            rules={[{ required: true, message: '请选择类别' }]}
          >
            <Select 
              placeholder="请选择类别"
              onChange={handleCategoryChange}
            >
              {milestoneCategories.map(category => (
                <Option key={category.value} value={category.value}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                      style={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        background: category.color,
                        marginRight: 8 
                      }} 
                    />
                    {category.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="color"
            label="颜色"
            tooltip="时间线上显示的颜色"
          >
            <Input type="color" style={{ width: 120 }} />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="标签"
            tooltip="添加标签以便更好地组织和查找"
          >
            <Select
              mode="tags"
              placeholder="添加标签"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Milestones; 