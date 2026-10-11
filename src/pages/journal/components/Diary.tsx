import React, { useState } from 'react';
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
  Rate
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PictureOutlined,
  TagOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  SmileOutlined,
  UploadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

// 配置dayjs
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 样式组件
const DiaryCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const MoodTag = styled(Tag)`
  border-radius: 12px;
  padding: 2px 10px;
  margin-right: 8px;
`;

// 模拟数据
const initialDiaries = [
  {
    id: 1,
    title: '期中考试结束啦',
    content: '今天期中考试结束了，数学考得还不错，但英语有几道题不太确定。总体来说比预期要好，接下来要继续努力，特别是英语的听力部分需要加强训练。',
    date: '2024-06-20',
    mood: 4,
    tags: ['考试', '学习', '反思'],
    location: '学校',
    images: ['https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'],
  },
  {
    id: 2,
    title: '科学竞赛准备',
    content: '今天开始准备科学竞赛，查阅了很多资料，制定了学习计划。感觉有点紧张但也很期待，希望能在比赛中取得好成绩。明天继续学习相关知识，准备实验部分。',
    date: '2024-06-19',
    mood: 5,
    tags: ['竞赛', '科学', '计划'],
    location: '图书馆',
    images: [],
  },
  {
    id: 3,
    title: '和朋友一起学习',
    content: '今天和朋友一起在图书馆学习了一整天，我们互相解答了许多问题，效率很高。发现合作学习真的很有帮助，计划以后定期一起学习。',
    date: '2024-06-18',
    mood: 5,
    tags: ['学习', '朋友', '合作'],
    location: '图书馆',
    images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'],
  }
];

// 心情映射
const moodColors = ['#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#1890ff'];
const moodTexts = ['很差', '一般', '还好', '不错', '很好'];

const Diary: React.FC = () => {
  // 状态管理
  const [diaries, setDiaries] = useState(initialDiaries);
  const [visible, setVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDiary, setCurrentDiary] = useState<any>(null);
  const [form] = Form.useForm();
  
  // 处理打开模态框
  const handleOpenModal = (diary?: any) => {
    setEditMode(!!diary);
    if (diary) {
      setCurrentDiary(diary);
      form.setFieldsValue({
        ...diary,
        date: dayjs(diary.date)
      });
    } else {
      setCurrentDiary(null);
      form.resetFields();
      form.setFieldsValue({
        date: dayjs(),
        mood: 3
      });
    }
    setVisible(true);
  };
  
  // 查看日记
  const handleViewDiary = (diary: any) => {
    setCurrentDiary(diary);
    setViewVisible(true);
  };
  
  // 删除日记
  const handleDeleteDiary = (id: number) => {
    setDiaries(diaries.filter(diary => diary.id !== id));
    message.success('日记已删除');
  };
  
  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        images: values.images ? values.images.fileList.map((file: any) => file.url || URL.createObjectURL(file.originFileObj)) : []
      };
      
      if (editMode && currentDiary) {
        // 编辑模式
        setDiaries(diaries.map(diary => 
          diary.id === currentDiary.id ? { ...diary, ...formattedValues } : diary
        ));
        message.success('日记已更新');
      } else {
        // 新建模式
        const newDiary = {
          id: Date.now(),
          ...formattedValues
        };
        setDiaries([newDiary, ...diaries]);
        message.success('日记已创建');
      }
      
      setVisible(false);
    } catch (error) {
      console.error('提交表单错误:', error);
    }
  };
  
  // 上传前处理
  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
    }
    return isImage && isLt2M;
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4}>我的日记</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => handleOpenModal()}
        >
          写日记
        </Button>
      </div>
      
      {diaries.length === 0 ? (
        <Empty 
          description="暂无日记记录，开始写下你的第一篇日记吧" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={diaries}
          renderItem={diary => (
            <DiaryCard 
              hoverable
              onClick={() => handleViewDiary(diary)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>{diary.title}</Title>
                <Space>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<EditOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(diary);
                    }}
                  />
                  <Popconfirm
                    title="确定要删除这篇日记吗？"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      handleDeleteDiary(diary.id);
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />} 
                      onClick={(e) => e.stopPropagation()}
                      danger
                    />
                  </Popconfirm>
                </Space>
              </div>
              
              <div style={{ marginBottom: 8 }}>
                <Space>
                  <MoodTag color={moodColors[diary.mood - 1]}>
                    <SmileOutlined /> {moodTexts[diary.mood - 1]}
                  </MoodTag>
                  <Text type="secondary">
                    <CalendarOutlined /> {diary.date}
                  </Text>
                  {diary.location && (
                    <Text type="secondary">
                      <EnvironmentOutlined /> {diary.location}
                    </Text>
                  )}
                </Space>
              </div>
              
              <Paragraph ellipsis={{ rows: 2 }}>
                {diary.content}
              </Paragraph>
              
              <div style={{ marginTop: 8 }}>
                <Space wrap>
                  {diary.tags.map((tag: string, index: number) => (
                    <Tag key={index} color="blue">{tag}</Tag>
                  ))}
                  {diary.images && diary.images.length > 0 && (
                    <Tag icon={<PictureOutlined />}>{diary.images.length}张图片</Tag>
                  )}
                </Space>
              </div>
            </DiaryCard>
          )}
        />
      )}
      
      {/* 新建/编辑日记对话框 */}
      <Modal
        title={editMode ? '编辑日记' : '写新日记'}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
        okText={editMode ? '保存' : '创建'}
        cancelText="取消"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入日记标题' }]}
          >
            <Input placeholder="给今天的日记起个标题吧" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入日记内容' }]}
          >
            <TextArea rows={6} placeholder="记录今天的经历、感想和收获..." />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="mood"
            label="今日心情"
          >
            <Rate 
              character={<SmileOutlined />} 
              count={5}
              tooltips={moodTexts}
            />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="位置"
          >
            <Input 
              placeholder="你在哪里写下这篇日记？" 
              prefix={<EnvironmentOutlined />} 
            />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select 
              mode="tags" 
              style={{ width: '100%' }} 
              placeholder="添加标签，按回车创建"
              tokenSeparators={[',']}
            >
              <Option value="学习">学习</Option>
              <Option value="考试">考试</Option>
              <Option value="心情">心情</Option>
              <Option value="计划">计划</Option>
              <Option value="反思">反思</Option>
              <Option value="朋友">朋友</Option>
              <Option value="活动">活动</Option>
              <Option value="竞赛">竞赛</Option>
              <Option value="读书">读书</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="images"
            label="图片"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              beforeUpload={beforeUpload}
              multiple
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 查看日记对话框 */}
      {currentDiary && (
        <Modal
          title={currentDiary.title}
          open={viewVisible}
          onCancel={() => setViewVisible(false)}
          footer={[
            <Button key="edit" type="primary" onClick={() => {
              setViewVisible(false);
              handleOpenModal(currentDiary);
            }}>
              编辑
            </Button>,
            <Button key="close" onClick={() => setViewVisible(false)}>
              关闭
            </Button>
          ]}
          width={700}
        >
          <div style={{ marginBottom: 16 }}>
            <Space wrap>
              <MoodTag color={moodColors[currentDiary.mood - 1]}>
                <SmileOutlined /> {moodTexts[currentDiary.mood - 1]}
              </MoodTag>
              <Text>
                <CalendarOutlined /> {currentDiary.date}
              </Text>
              {currentDiary.location && (
                <Text>
                  <EnvironmentOutlined /> {currentDiary.location}
                </Text>
              )}
            </Space>
          </div>
          
          <Paragraph style={{ fontSize: '16px', whiteSpace: 'pre-line' }}>
            {currentDiary.content}
          </Paragraph>
          
          {currentDiary.images && currentDiary.images.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Space wrap>
                {currentDiary.images.map((image: string, index: number) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`图片${index+1}`}
                    style={{ 
                      width: '100%', 
                      maxWidth: '300px', 
                      borderRadius: '8px',
                      marginBottom: '8px' 
                    }} 
                  />
                ))}
              </Space>
            </div>
          )}
          
          {currentDiary.tags && currentDiary.tags.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ marginRight: 8 }}>
                <TagOutlined /> 标签:
              </Text>
              <Space wrap>
                {currentDiary.tags.map((tag: string, index: number) => (
                  <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </Space>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Diary; 