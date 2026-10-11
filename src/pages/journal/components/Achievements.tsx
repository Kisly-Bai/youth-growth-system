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
  Upload,
  Empty,
  message,
  Popconfirm,
  Rate,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PictureOutlined,
  TagOutlined,
  TrophyOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import { useAuth } from '../../../contexts/AuthContext';
import * as journalService from '../../../services/journal';
import { Achievement } from '../../../services/journal';

// 配置dayjs
dayjs.locale('zh-cn');

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 样式组件
const AchievementCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

// 成就类别
const achievementCategories = [
  { value: 'academic', label: '学术成就' },
  { value: 'competition', label: '竞赛获奖' },
  { value: 'certificate', label: '证书认证' },
  { value: 'skill', label: '技能掌握' },
  { value: 'personal', label: '个人突破' },
  { value: 'other', label: '其他成就' }
];

// 获取显示标签
const getDisplayLabel = (value: string, options: { value: string; label: string }[]) => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label : value;
};

// 重要性等级描述
const significanceLabels = ['一般', '重要', '较重要', '非常重要', '极其重要'];

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const { user } = useAuth();

  // 获取成就列表
  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      const userAchievements = journalService.getAchievements(user.id);
      setAchievements(userAchievements);
      setLoading(false);
    }
  }, [user]);

  // 打开创建成就的模态框
  const showCreateModal = () => {
    setIsEditMode(false);
    setSelectedAchievement(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({
      significance: 3,
      date: dayjs(),
      tags: []
    });
    setIsModalVisible(true);
  };

  // 打开查看成就的模态框
  const showViewModal = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsViewModalVisible(true);
  };

  // 打开编辑成就的模态框
  const showEditModal = (achievement: Achievement) => {
    setIsEditMode(true);
    setSelectedAchievement(achievement);
    
    // 转换现有图片为文件列表
    const images: UploadFile[] = achievement.images.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}.jpg`,
      status: 'done' as UploadFileStatus,
      url,
      thumbUrl: url,
    }));
    
    setFileList(images);
    
    // 设置表单初始值
    form.setFieldsValue({
      title: achievement.title,
      description: achievement.description,
      date: dayjs(achievement.date),
      category: achievement.category,
      significance: achievement.significance,
      tags: achievement.tags
    });
    
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 关闭查看模态框
  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  // 处理图片上传
  const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  // 处理图片上传前的操作
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件');
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片必须小于5MB');
    }
    
    return false;
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!user || !user.id) {
        message.error('请先登录');
        return;
      }
      
      // 处理图片数据
      const imageUrls = fileList.map(file => {
        // 如果是新上传的文件，将其转换为数据URL
        if (file.originFileObj) {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file.originFileObj as Blob);
          });
        }
        // 如果是已有的图片，直接返回URL
        return Promise.resolve(file.url || '');
      });
      
      const resolvedImageUrls = await Promise.all(imageUrls);
      
      const achievementData = {
        title: values.title,
        description: values.description,
        date: values.date.toISOString(),
        category: values.category,
        significance: values.significance,
        tags: values.tags || [],
        images: resolvedImageUrls.filter(Boolean)
      };
      
      if (isEditMode && selectedAchievement) {
        // 更新成就
        const updatedAchievement = journalService.updateAchievement(selectedAchievement.id, achievementData, user.id);
        
        if (updatedAchievement) {
          message.success('成就已更新');
          setAchievements(achievements.map(a => a.id === selectedAchievement.id ? updatedAchievement : a));
        } else {
          message.error('更新成就失败');
        }
      } else {
        // 创建新成就
        const newAchievement = journalService.saveAchievement(achievementData, user.id);
        
        message.success('成就已创建');
        setAchievements([...achievements, newAchievement]);
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除成就
  const handleDelete = (achievementId: string) => {
    if (!user || !user.id) {
      message.error('请先登录');
      return;
    }
    
    const success = journalService.deleteAchievement(achievementId, user.id);
    
    if (success) {
      message.success('成就已删除');
      setAchievements(achievements.filter(a => a.id !== achievementId));
    } else {
      message.error('删除成就失败');
    }
  };

  // 渲染成就卡片
  const renderAchievementItem = (achievement: Achievement) => {
    const categoryLabel = getDisplayLabel(achievement.category, achievementCategories);
    
    return (
      <List.Item>
        <AchievementCard 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge count={achievement.significance} overflowCount={5} color="#faad14">
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {achievement.title}
                </Typography.Title>
              </Badge>
            </div>
          }
          extra={
            <Space>
              <Button 
                icon={<EditOutlined />} 
                size="small" 
                onClick={() => showEditModal(achievement)}
              />
              <Popconfirm
                title="确定要删除这个成就吗？"
                onConfirm={() => handleDelete(achievement.id)}
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
          onClick={() => showViewModal(achievement)}
          hoverable
        >
          <Typography.Paragraph ellipsis={{ rows: 2 }}>
            {achievement.description}
          </Typography.Paragraph>
          
          <div style={{ marginBottom: 16 }}>
            <Space wrap>
              <Tag color="blue">{categoryLabel}</Tag>
              <Tag icon={<CalendarOutlined />}>
                {dayjs(achievement.date).format('YYYY-MM-DD')}
              </Tag>
              {achievement.tags.map((tag, index) => (
                <Tag key={index} icon={<TagOutlined />}>
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>
          
          {achievement.images.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Space>
                <PictureOutlined />
                <Text>{achievement.images.length}张图片</Text>
              </Space>
            </div>
          )}
        </AchievementCard>
      </List.Item>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>成就记录</Typography.Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          添加成就
        </Button>
      </div>
      
      {achievements.length > 0 ? (
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
          dataSource={achievements}
          renderItem={renderAchievementItem}
          loading={loading}
        />
      ) : (
        <Empty 
          description="暂无成就记录" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      )}
      
      {/* 创建/编辑成就模态框 */}
      <Modal
        title={isEditMode ? '编辑成就' : '创建新成就'}
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
            label="成就标题"
            rules={[{ required: true, message: '请输入成就标题' }]}
          >
            <Input placeholder="请输入成就标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="成就描述"
          >
            <TextArea 
              placeholder="请描述这个成就的详情" 
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="获得日期"
            rules={[{ required: true, message: '请选择获得日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="成就类别"
            rules={[{ required: true, message: '请选择成就类别' }]}
          >
            <Select placeholder="请选择成就类别">
              {achievementCategories.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="significance"
            label="重要程度"
            tooltip="评价这个成就对你的重要性"
            initialValue={3}
          >
            <Rate tooltips={significanceLabels} />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="标签"
            tooltip="添加标签以便更好地分类和查找"
          >
            <Select
              mode="tags"
              placeholder="添加标签"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>
          
          <Form.Item
            label="相关图片"
            tooltip="上传与成就相关的图片、证书照片等"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageChange}
              beforeUpload={beforeUpload}
              multiple
            >
              {fileList.length >= 9 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 查看成就详情模态框 */}
      {selectedAchievement && (
        <Modal
          title={
            <Space>
              <TrophyOutlined style={{ color: '#faad14' }} />
              <span>{selectedAchievement.title}</span>
            </Space>
          }
          open={isViewModalVisible}
          onCancel={handleViewCancel}
          footer={[
            <Button key="close" onClick={handleViewCancel}>
              关闭
            </Button>
          ]}
          width={700}
        >
          <Card bordered={false}>
            <div style={{ marginBottom: 16 }}>
              <Space wrap>
                <Tag color="blue">
                  {getDisplayLabel(selectedAchievement.category, achievementCategories)}
                </Tag>
                <Tag icon={<CalendarOutlined />}>
                  {dayjs(selectedAchievement.date).format('YYYY-MM-DD')}
                </Tag>
                <Rate 
                  disabled 
                  value={selectedAchievement.significance} 
                  tooltips={significanceLabels}
                />
              </Space>
            </div>
            
            <Paragraph style={{ fontSize: '16px', marginBottom: 24 }}>
              {selectedAchievement.description}
            </Paragraph>
            
            {selectedAchievement.tags.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>标签</Title>
                <div>
                  {selectedAchievement.tags.map((tag, index) => (
                    <Tag key={index} icon={<TagOutlined />}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            
            {selectedAchievement.images.length > 0 && (
              <div>
                <Title level={5}>图片</Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 12 }}>
                  {selectedAchievement.images.map((image, index) => (
                    <img 
                      key={index} 
                      src={image} 
                      alt={`achievement-${index}`} 
                      onClick={() => window.open(image, '_blank')}
                      style={{ cursor: 'pointer', width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Modal>
      )}
    </div>
  );
};

export default Achievements; 