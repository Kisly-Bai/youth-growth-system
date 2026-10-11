import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  message, 
  Avatar, 
  DatePicker,
  Tag,
  Badge
} from 'antd';
import { 
  LikeOutlined, 
  CommentOutlined, 
  ShareAltOutlined, 
  PlusOutlined, 
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  LikeFilled
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

// 配置 dayjs
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// 样式组件
const StyledCard = styled(Card)`
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
  }
`;

const PostItem = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const GroupItem = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const EventItem = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

// 模拟数据
const initialPosts = [
  {
    id: 1,
    author: '张明',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    content: '今天完成了数学竞赛的集训，分享一些解题技巧：\n1. 函数问题要特别注意定义域\n2. 几何题要善于运用辅助线\n3. 概率题要理清事件关系',
    likes: 15,
    liked: false,
    comments: 3,
    shares: 2,
    time: '2024-06-20 14:30'
  },
  {
    id: 2,
    author: '李华',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    content: '英语四级考试备考经验分享：\n每天听15分钟英语新闻，从简单文章开始阅读，背诵常用句型和范文，找伙伴对话练习口语。',
    likes: 23,
    liked: false,
    comments: 5,
    shares: 4,
    time: '2024-06-20 10:15'
  }
];

const initialGroups = [
  {
    id: 1,
    name: '高中数学竞赛小组',
    description: '分享数学竞赛经验，讨论解题方法，组织线上学习活动',
    members: 128,
    joined: false
  },
  {
    id: 2,
    name: '英语口语练习营',
    description: '每天进行英语口语练习，分享学习资源，互相督促进步',
    members: 96,
    joined: false
  }
];

const initialEvents = [
  {
    id: 1,
    title: '数学竞赛经验分享会',
    date: '2024-06-25 14:00',
    location: '线上直播',
    participants: 56,
    maxParticipants: 100,
    registered: false
  },
  {
    id: 2,
    title: '英语口语角',
    date: '2024-06-26 19:00',
    location: '线上会议',
    participants: 42,
    maxParticipants: 80,
    registered: false
  }
];

const SimpleCommunity: React.FC = () => {
  // 状态管理
  const [posts, setPosts] = useState(initialPosts);
  const [groups, setGroups] = useState(initialGroups);
  const [events, setEvents] = useState(initialEvents);
  
  // 模态框状态
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  
  // 表单状态
  const [postForm] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [eventForm] = Form.useForm();
  const [commentForm] = Form.useForm();

  // 点赞功能
  const handleLike = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked 
            } 
          : post
      )
    );
    
    const post = posts.find(p => p.id === postId);
    if (post) {
      message.success(post.liked ? '已取消点赞' : '点赞成功');
    }
  };

  // 加入小组功能
  const handleJoinGroup = (groupId: number) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { 
              ...group, 
              members: group.joined ? group.members - 1 : group.members + 1,
              joined: !group.joined 
            } 
          : group
      )
    );
    
    const group = groups.find(g => g.id === groupId);
    if (group) {
      message.success(group.joined ? `已退出"${group.name}"` : `已加入"${group.name}"`);
    }
  };

  // 报名活动功能
  const handleRegisterEvent = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    if (event.participants >= event.maxParticipants && !event.registered) {
      message.error('该活动已报满');
      return;
    }
    
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              participants: event.registered 
                ? event.participants - 1 
                : event.participants + 1,
              registered: !event.registered 
            } 
          : event
      )
    );
    
    if (event) {
      message.success(event.registered 
        ? `已取消报名"${event.title}"` 
        : `已成功报名"${event.title}"`);
    }
  };

  // 发布动态
  const handlePostSubmit = async () => {
    try {
      const values = await postForm.validateFields();
      
      const newPost = {
        id: posts.length + 1,
        author: '我',
        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        content: values.content,
        likes: 0,
        liked: false,
        comments: 0,
        shares: 0,
        time: dayjs().format('YYYY-MM-DD HH:mm')
      };
      
      setPosts([newPost, ...posts]);
      message.success('发布成功！');
      setPostModalVisible(false);
      postForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 创建小组
  const handleGroupSubmit = async () => {
    try {
      const values = await groupForm.validateFields();
      
      const newGroup = {
        id: groups.length + 1,
        name: values.name,
        description: values.description,
        members: 1, // 创建者自动加入
        joined: true
      };
      
      setGroups([...groups, newGroup]);
      message.success('小组创建成功！');
      setGroupModalVisible(false);
      groupForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 创建活动
  const handleEventSubmit = async () => {
    try {
      const values = await eventForm.validateFields();
      
      const newEvent = {
        id: events.length + 1,
        title: values.title,
        date: values.date.format('YYYY-MM-DD HH:mm'),
        location: values.location,
        participants: 0,
        maxParticipants: values.maxParticipants,
        registered: false
      };
      
      setEvents([...events, newEvent]);
      message.success('活动创建成功！');
      setEventModalVisible(false);
      eventForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 评论功能
  const handleComment = (postId: number) => {
    setCurrentPostId(postId);
    setCommentModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    try {
      await commentForm.validateFields();
      
      // 在实际应用中，这里会发送到后端保存评论
      message.success('评论发布成功！');
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === currentPostId 
            ? { ...post, comments: post.comments + 1 } 
            : post
        )
      );
      
      setCommentModalVisible(false);
      commentForm.resetFields();
      setCurrentPostId(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 分享功能
  const handleShare = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, shares: post.shares + 1 } 
          : post
      )
    );
    
    message.success('分享成功！');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>成长社区</Title>
      <Paragraph>欢迎来到青少年成长社区，这里是分享经验、互相学习的平台。</Paragraph>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <StyledCard 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Badge count={posts.length}>
                    <span>最新动态</span>
                  </Badge>
                </Space>
                <Button type="primary" onClick={() => setPostModalVisible(true)}>
                  发布动态
                </Button>
              </div>
            }
            bordered={true}
          >
            {posts.map(post => (
              <PostItem key={post.id}>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <Avatar src={post.avatar} />
                  <div style={{ marginLeft: 12 }}>
                    <Text strong>{post.author}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {dayjs(post.time).fromNow()}
                      </Text>
                    </div>
                  </div>
                </div>
                <Paragraph style={{ whiteSpace: 'pre-line' }}>
                  {post.content}
                </Paragraph>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={post.liked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
                      onClick={() => handleLike(post.id)}
                    >
                      {post.likes > 0 && post.likes}
                    </Button>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<CommentOutlined />}
                      onClick={() => handleComment(post.id)}
                    >
                      {post.comments > 0 && post.comments}
                    </Button>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<ShareAltOutlined />}
                      onClick={() => handleShare(post.id)}
                    >
                      {post.shares > 0 && post.shares}
                    </Button>
                  </Space>
                </div>
              </PostItem>
            ))}
          </StyledCard>
        </Col>
        
        <Col xs={24} md={8}>
          <StyledCard 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Badge count={groups.length}>
                    <span>学习小组</span>
                  </Badge>
                </Space>
                <Button type="primary" onClick={() => setGroupModalVisible(true)}>
                  创建小组
                </Button>
              </div>
            }
            bordered={true}
          >
            {groups.map(group => (
              <GroupItem key={group.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Text strong>{group.name}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Space>
                        <TeamOutlined />
                        <Text type="secondary">{group.members}人</Text>
                      </Space>
                    </div>
                  </div>
                </div>
                <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                  {group.description}
                </Paragraph>
                <Button 
                  type={group.joined ? "default" : "primary"}
                  size="small"
                  onClick={() => handleJoinGroup(group.id)}
                >
                  {group.joined ? '已加入' : '加入小组'}
                </Button>
              </GroupItem>
            ))}
          </StyledCard>
        </Col>
        
        <Col xs={24} md={8}>
          <StyledCard 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Badge count={events.length}>
                    <span>热门活动</span>
                  </Badge>
                </Space>
                <Button type="primary" onClick={() => setEventModalVisible(true)}>
                  创建活动
                </Button>
              </div>
            }
            bordered={true}
          >
            {events.map(event => (
              <EventItem key={event.id}>
                <Text strong>{event.title}</Text>
                <div style={{ margin: '8px 0' }}>
                  <Space direction="vertical" size={4}>
                    <Space>
                      <CalendarOutlined />
                      <Text type="secondary">{event.date}</Text>
                    </Space>
                    <Space>
                      <EnvironmentOutlined />
                      <Text type="secondary">{event.location}</Text>
                    </Space>
                    <Space>
                      <TeamOutlined />
                      <Text type="secondary">
                        {event.participants}/{event.maxParticipants}人
                      </Text>
                      {event.participants >= event.maxParticipants && !event.registered && (
                        <Tag color="red">已满</Tag>
                      )}
                    </Space>
                  </Space>
                </div>
                <Button 
                  type={event.registered ? "default" : "primary"} 
                  size="small"
                  disabled={event.participants >= event.maxParticipants && !event.registered}
                  onClick={() => handleRegisterEvent(event.id)}
                >
                  {event.registered ? '取消报名' : '报名参加'}
                </Button>
              </EventItem>
            ))}
          </StyledCard>
        </Col>
      </Row>
      
      {/* 发布动态对话框 */}
      <Modal
        title="发布动态"
        open={postModalVisible}
        onCancel={() => setPostModalVisible(false)}
        onOk={handlePostSubmit}
        okText="发布"
        cancelText="取消"
      >
        <Form form={postForm} layout="vertical">
          <Form.Item
            name="content"
            label="分享你的经验和想法"
            rules={[{ required: true, message: '请输入动态内容' }]}
          >
            <TextArea rows={4} placeholder="分享你的学习经验、心得体会或问题..." />
          </Form.Item>
          <Form.Item name="images" label="添加图片">
            <Upload listType="picture-card" maxCount={4} beforeUpload={() => false}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 创建小组对话框 */}
      <Modal
        title="创建学习小组"
        open={groupModalVisible}
        onCancel={() => setGroupModalVisible(false)}
        onOk={handleGroupSubmit}
        okText="创建"
        cancelText="取消"
      >
        <Form form={groupForm} layout="vertical">
          <Form.Item
            name="name"
            label="小组名称"
            rules={[{ required: true, message: '请输入小组名称' }]}
          >
            <Input placeholder="请输入小组名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="小组描述"
            rules={[{ required: true, message: '请输入小组描述' }]}
          >
            <TextArea rows={3} placeholder="描述小组的目标、活动内容和加入条件等..." />
          </Form.Item>
          <Form.Item name="cover" label="小组封面">
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 创建活动对话框 */}
      <Modal
        title="创建活动"
        open={eventModalVisible}
        onCancel={() => setEventModalVisible(false)}
        onOk={handleEventSubmit}
        okText="创建"
        cancelText="取消"
      >
        <Form form={eventForm} layout="vertical">
          <Form.Item
            name="title"
            label="活动标题"
            rules={[{ required: true, message: '请输入活动标题' }]}
          >
            <Input placeholder="请输入活动标题" />
          </Form.Item>
          <Form.Item
            name="date"
            label="活动时间"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="location"
            label="活动地点"
            rules={[{ required: true, message: '请输入活动地点' }]}
          >
            <Input placeholder="请输入活动地点" />
          </Form.Item>
          <Form.Item
            name="maxParticipants"
            label="人数上限"
            rules={[{ required: true, message: '请输入人数上限' }]}
          >
            <Input type="number" min={1} placeholder="请输入活动人数上限" />
          </Form.Item>
          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true, message: '请输入活动描述' }]}
          >
            <TextArea rows={3} placeholder="描述活动内容、安排和注意事项等..." />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 评论对话框 */}
      <Modal
        title="发表评论"
        open={commentModalVisible}
        onCancel={() => {
          setCommentModalVisible(false);
          setCurrentPostId(null);
        }}
        onOk={handleCommentSubmit}
        okText="发布"
        cancelText="取消"
      >
        <Form form={commentForm} layout="vertical">
          <Form.Item
            name="comment"
            rules={[{ required: true, message: '请输入评论内容' }]}
          >
            <TextArea rows={3} placeholder="写下你的评论..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SimpleCommunity; 