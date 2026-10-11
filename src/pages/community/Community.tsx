import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Card,
  Tabs,
  Row,
  Col,
  Button,
  Space,
  Tag,
  List,
  Avatar,
  Input,
  Divider,
  Badge,
  Modal,
  Form,
  Upload,
  message,
  Empty,
  Skeleton,
  Rate,
  Tooltip,
  Popover,
  Menu,
  Dropdown,
  Statistic,
  Timeline,
  Carousel,
  DatePicker,
  InputNumber,
  Select
} from 'antd';
import {
  FireOutlined,
  TeamOutlined,
  MessageOutlined,
  LikeOutlined,
  StarOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  PictureOutlined,
  LinkOutlined,
  FileTextOutlined,
  BookOutlined,
  TrophyOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  CommentOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileUnknownOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// 内联模拟数据代替导入
const mockPosts = [
  {
    id: 1,
    author: {
      name: '张明',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      level: '高三',
      school: '市重点中学'
    },
    content: '今天完成了数学竞赛的集训，分享一些解题技巧：\n1. 函数问题要特别注意定义域\n2. 几何题要善于运用辅助线\n3. 概率题要理清事件关系\n\n希望对大家有帮助！',
    images: ['https://img.yzcdn.cn/vant/cat.jpeg'],
    likes: 128,
    comments: 32,
    shares: 15,
    tags: ['数学竞赛', '学习经验'],
    createdAt: '2024-02-20 14:30:00'
  },
  {
    id: 2,
    author: {
      name: '李华',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      level: '高二',
      school: '省重点中学'
    },
    content: '英语四级考试备考经验分享：\n1. 听力训练：每天听15分钟英语新闻\n2. 阅读练习：从简单文章开始，逐步提高难度\n3. 写作积累：背诵常用句型和范文\n4. 口语练习：大声朗读或找伙伴对话\n\n大家一起加油！',
    images: [],
    likes: 256,
    comments: 48,
    shares: 28,
    tags: ['英语学习', '考试经验'],
    createdAt: '2024-02-20 13:15:00'
  }
];

const mockGroups = [
  {
    id: 1,
    name: '高中数学竞赛小组',
    description: '分享数学竞赛经验，讨论解题方法，组织线上学习活动',
    cover: 'https://img.yzcdn.cn/vant/cat.jpeg',
    members: 128,
    posts: 256,
    tags: ['数学竞赛', '学习小组'],
    isJoined: true
  },
  {
    id: 2,
    name: '英语口语练习营',
    description: '每天进行英语口语练习，分享学习资源，互相督促进步',
    cover: 'https://img.yzcdn.cn/vant/cat.jpeg',
    members: 96,
    posts: 180,
    tags: ['英语学习', '口语练习'],
    isJoined: false
  }
];

const mockQuestions = [
  {
    id: 1,
    title: '如何解决二次方程的根的问题？',
    content: '在做二次方程题目时，经常遇到求根的问题，有什么好的解题思路吗？',
    author: {
      name: '王同学',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    answers: 5,
    views: 128,
    tags: ['数学', '二次方程'],
    createdAt: '2024-02-20 10:30:00'
  },
  {
    id: 2,
    title: '英语听力提高方法',
    content: '听力一直是弱项，想请教大家有什么好的提高方法？',
    author: {
      name: '李同学',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    answers: 8,
    views: 256,
    tags: ['英语', '听力'],
    createdAt: '2024-02-20 09:15:00'
  }
];

const mockResources = [
  {
    id: 1,
    title: '高中数学竞赛真题解析',
    type: 'pdf',
    size: '2.5MB',
    downloads: 128,
    rating: 4.8,
    tags: ['数学竞赛', '真题解析'],
    author: {
      name: '张老师',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    createdAt: '2024-02-20 08:30:00'
  },
  {
    id: 2,
    title: '英语四级听力训练材料',
    type: 'audio',
    size: '15MB',
    downloads: 256,
    rating: 4.6,
    tags: ['英语', '听力训练'],
    author: {
      name: '李老师',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    createdAt: '2024-02-20 07:15:00'
  }
];

const mockEvents = [
  {
    id: 1,
    title: '数学竞赛经验分享会',
    description: '邀请数学竞赛获奖者分享备考经验和解题技巧',
    date: '2024-02-25 14:00:00',
    location: '线上直播',
    participants: 128,
    maxParticipants: 200,
    tags: ['数学竞赛', '经验分享'],
    organizer: {
      name: '数学竞赛小组',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
  },
  {
    id: 2,
    title: '英语口语角',
    description: '每周一次的英语口语练习活动，提高口语表达能力',
    date: '2024-02-26 19:00:00',
    location: '线上会议',
    participants: 96,
    maxParticipants: 150,
    tags: ['英语学习', '口语练习'],
    organizer: {
      name: '英语口语练习营',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
  }
];

// 配置 dayjs 插件
dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Content } = Layout;

// 样式组件
const Container = styled.div`
  padding: 0 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
`;

const PostCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const GroupCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-cover img {
    height: 160px;
    object-fit: cover;
  }
`;

const QuestionCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ResourceCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const EventCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CommentSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const CommentItem = styled.div`
  display: flex;
  margin-bottom: 12px;
  
  .ant-avatar {
    margin-right: 12px;
  }
  
  .comment-content {
    flex: 1;
    background: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
  }
`;

// 类型定义
interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    level: string;
    school: string;
  };
  content: string;
  images: string[];
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  createdAt: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  cover: string;
  members: number;
  posts: number;
  tags: string[];
  isJoined: boolean;
}

interface Question {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  answers: number;
  views: number;
  tags: string[];
  createdAt: string;
}

interface Resource {
  id: number;
  title: string;
  type: string;
  size: string;
  downloads: number;
  rating: number;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  tags: string[];
  organizer: {
    name: string;
    avatar: string;
  };
}

// 社区主组件
const Community: React.FC = () => {
  console.log('渲染社区组件');
  
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Record<number, Array<{id: number, author: string, avatar: string, content: string, time: string}>>>({});
  const [groups, setGroups] = useState(mockGroups);
  const [questions, setQuestions] = useState(mockQuestions);
  const [resources, setResources] = useState(mockResources);
  const [events, setEvents] = useState(mockEvents);
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [filteredGroups, setFilteredGroups] = useState(mockGroups);
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);
  const [filteredResources, setFilteredResources] = useState(mockResources);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [postSearch, setPostSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [showResourceDetailModal, setShowResourceDetailModal] = useState(false);
  const [currentResourceId, setCurrentResourceId] = useState<number | null>(null);
  const [resourceRating, setResourceRating] = useState<number>(5);
  const [postForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [resourceForm] = Form.useForm();
  const [eventForm] = Form.useForm();
  const [answerForm] = Form.useForm();
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);

  // 模拟数据加载
  useEffect(() => {
    // 初始化模拟评论数据
    const initialComments: Record<number, Array<{id: number, author: string, avatar: string, content: string, time: string}>> = {
      1: [
        {
          id: 1,
          author: '王同学',
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          content: '感谢分享！这些技巧很有帮助。',
          time: '2小时前'
        },
        {
          id: 2,
          author: '李明',
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          content: '我在比赛中用了第二点建议，效果很好！',
          time: '1小时前'
        }
      ],
      2: [
        {
          id: 1,
          author: '张华',
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          content: '听力方法非常实用，我已经坚持了一周。',
          time: '3小时前'
        }
      ]
    };
    
    setComments(initialComments);
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // 处理评论提交
  const handleCommentSubmit = (postId: number) => {
    if (!commentText.trim()) {
      message.warning('评论内容不能为空');
      return;
    }
    
    const newComment = {
      id: Date.now(),
      author: user?.name || user?.username || '匿名用户',
      avatar: user?.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg',
      content: commentText,
      time: '刚刚'
    };
    
    setComments(prev => {
      const updatedComments = { ...prev };
      if (!updatedComments[postId]) {
        updatedComments[postId] = [];
      }
      updatedComments[postId] = [...updatedComments[postId], newComment];
      return updatedComments;
    });
    
    setCommentText('');
    message.success('评论发布成功！');
  };

  // 处理发布动态
  const handlePostSubmit = async () => {
    try {
      const values = await postForm.validateFields();
      console.log('发布动态:', values);
      message.success('发布成功！');
      setShowPostModal(false);
      postForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理发布问题
  const handleQuestionSubmit = async () => {
    try {
      const values = await questionForm.validateFields();
      console.log('发布问题:', values);
      message.success('发布成功！');
      setShowQuestionModal(false);
      questionForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理分享资源
  const handleResourceSubmit = async () => {
    try {
      const values = await resourceForm.validateFields();
      console.log('分享资源:', values);
      message.success('分享成功！');
      setShowResourceModal(false);
      resourceForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理创建活动
  const handleEventSubmit = async () => {
    try {
      const values = await eventForm.validateFields();
      console.log('创建活动:', values);
      message.success('创建成功！');
      setShowEventModal(false);
      eventForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理加入或退出学习小组
  const handleJoinGroup = (groupId: number) => {
    setGroups((prev: Group[]) => 
      prev.map((group: Group) => 
        group.id === groupId 
          ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 } 
          : group
      )
    );
    
    const group = groups.find((g: Group) => g.id === groupId);
    if (group) {
      message.success(group.isJoined ? `已退出"${group.name}"` : `已加入"${group.name}"`);
    }
  };

  // 处理回答问题
  const handleAnswerSubmit = async () => {
    if (!currentQuestionId) return;
    
    try {
      const values = await answerForm.validateFields();
      console.log('提交回答:', values);
      
      // 更新问题的回答数量
      setQuestions((prev: Question[]) => 
        prev.map((question: Question) => 
          question.id === currentQuestionId 
            ? { ...question, answers: question.answers + 1 } 
            : question
        )
      );
      
      message.success('回答已提交！');
      setShowAnswerModal(false);
      answerForm.resetFields();
      setCurrentQuestionId(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 查看问题详情
  const viewQuestionDetail = (questionId: number) => {
    const question = questions.find((q: Question) => q.id === questionId);
    if (question) {
      setQuestions((prev: Question[]) => 
        prev.map((q: Question) => 
          q.id === questionId 
            ? { ...q, views: q.views + 1 } 
            : q
        )
      );
      message.info(`查看问题：${question.title}`);
    }
  };

  // 处理资源下载
  const handleDownloadResource = (resourceId: number) => {
    // 这里模拟下载操作
    const resource = resources.find((r: Resource) => r.id === resourceId);
    if (resource) {
      // 更新下载次数
      setResources((prev: Resource[]) => 
        prev.map((r: Resource) => 
          r.id === resourceId 
            ? { ...r, downloads: r.downloads + 1 } 
            : r
        )
      );
      message.success(`正在下载"${resource.title}"，请稍候...`);
    }
  };

  // 处理资源评分
  const handleRateResource = () => {
    if (!currentResourceId) return;
    
    setResources(prev => 
      prev.map(r => 
        r.id === currentResourceId 
          ? { ...r, rating: ((r.rating * r.downloads) + resourceRating) / (r.downloads + 1) } 
          : r
      )
    );
    
    message.success('评分已提交，感谢您的反馈！');
    setShowResourceDetailModal(false);
  };

  // 处理活动报名
  const handleJoinEvent = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    if (event.participants >= event.maxParticipants) {
      message.warning('该活动已报满，请选择其他活动');
      return;
    }
    
    // 更新报名人数
    setEvents(prev => 
      prev.map(e => 
        e.id === eventId 
          ? { ...e, participants: e.participants + 1 } 
          : e
      )
    );
    
    message.success(`已成功报名"${event.title}"活动`);
    
    if (showEventDetailModal) {
      setShowEventDetailModal(false);
    }
  };

  // 处理活动详情查看
  const viewEventDetail = (eventId: number) => {
    setCurrentEventId(eventId);
    setShowEventDetailModal(true);
  };

  // 渲染动态卡片
  const renderPostCard = (post: any) => {
    const postComments = comments[post.id] || [];
    
    return (
    <PostCard key={post.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={post.author.avatar} size={40} />
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 'bold' }}>{post.author.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
              {post.author.level} · {post.author.school}
            </div>
          </div>
        </div>
        <Dropdown menu={{
          items: [
            { key: 'report', label: '举报' },
            { key: 'block', label: '屏蔽' },
          ]
        }}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
      
      <Paragraph style={{ whiteSpace: 'pre-line' }}>{post.content}</Paragraph>
      
      {post.images && post.images.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <img 
            src={post.images[0]} 
            alt="post" 
            style={{ 
              width: '100%', 
              maxHeight: 400, 
              objectFit: 'cover',
              borderRadius: 8
            }} 
          />
        </div>
      )}
      
      <div style={{ marginTop: 16 }}>
        <Space wrap>
          {post.tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      </div>
      
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button 
            type="text" 
            icon={<LikeOutlined />} 
            onClick={() => {
              message.success('点赞成功');
            }}
          >
            {post.likes}
          </Button>
          <Button 
            type="text" 
            icon={<CommentOutlined />}
            onClick={() => {
              const inputElement = document.getElementById(`comment-input-${post.id}`);
              if (inputElement) {
                inputElement.focus();
              }
            }}
          >
            {postComments.length || post.comments}
          </Button>
          <Button 
            type="text" 
            icon={<ShareAltOutlined />}
            onClick={() => {
              message.success('分享成功');
            }}
          >
            {post.shares}
          </Button>
        </Space>
        <Text type="secondary">{dayjs(post.createdAt).fromNow()}</Text>
      </div>
      
      <CommentSection>
        <div style={{ display: 'flex', marginBottom: 16 }}>
          <Avatar src={user?.avatar || "https://img.yzcdn.cn/vant/cat.jpeg"} />
          <Input 
            id={`comment-input-${post.id}`}
            placeholder="写下你的评论..." 
            style={{ marginLeft: 12 }}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onPressEnter={() => handleCommentSubmit(post.id)}
            suffix={
              <SendOutlined 
                style={{ color: '#1890ff', cursor: 'pointer' }} 
                onClick={() => handleCommentSubmit(post.id)}
              />
            }
          />
        </div>
        
        {postComments.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {postComments.map((comment) => (
              <CommentItem key={comment.id}>
                <Avatar src={comment.avatar} />
                <div className="comment-content">
                  <div style={{ fontWeight: 'bold' }}>{comment.author}</div>
                  <div>{comment.content}</div>
                  <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)', marginTop: 4 }}>
                    {comment.time}
                    <Button 
                      type="link" 
                      size="small" 
                      style={{ padding: '0 4px', fontSize: 12 }}
                      onClick={() => {
                        setCommentText(`回复 @${comment.author}：`);
                        const inputElement = document.getElementById(`comment-input-${post.id}`);
                        if (inputElement) {
                          inputElement.focus();
                        }
                      }}
                    >
                      回复
                    </Button>
                  </div>
                </div>
              </CommentItem>
            ))}
            
            {postComments.length < post.comments && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Button type="link">查看全部 {post.comments} 条评论</Button>
              </div>
            )}
          </div>
        )}
      </CommentSection>
    </PostCard>
    );
  };

  // 渲染学习小组卡片
  const renderGroupCard = (group: any) => (
    <Col xs={24} sm={12} md={8} lg={6} key={group.id}>
      <GroupCard
        hoverable
        cover={
          <div style={{ position: 'relative' }}>
            <img alt={group.name} src={group.cover} />
            <Tag style={{ position: 'absolute', top: 10, right: 10 }} color="#108ee9">
              {group.members}人
            </Tag>
          </div>
        }
      >
        <Title level={4} style={{ marginBottom: 8 }}>{group.name}</Title>
        <Paragraph ellipsis={{ rows: 2 }} style={{ color: 'rgba(0, 0, 0, 0.65)', minHeight: 44 }}>
          {group.description}
        </Paragraph>
        <Space wrap style={{ marginBottom: 16 }}>
          {group.tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <UserOutlined />
            <Text>{group.members}人</Text>
            <MessageOutlined />
            <Text>{group.posts}条动态</Text>
          </Space>
          <Button 
            type={group.isJoined ? 'default' : 'primary'}
            onClick={() => handleJoinGroup(group.id)}
          >
            {group.isJoined ? '已加入' : '加入小组'}
          </Button>
        </div>
      </GroupCard>
    </Col>
  );

  // 渲染问题卡片
  const renderQuestionCard = (question: any) => (
    <QuestionCard key={question.id} onClick={() => viewQuestionDetail(question.id)}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ marginBottom: 8 }}>{question.title}</Title>
          <Paragraph ellipsis={{ rows: 2 }} style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{question.content}</Paragraph>
          <Space wrap style={{ marginTop: 8 }}>
            {question.tags.map((tag: string) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </div>
        <div style={{ marginLeft: 16, textAlign: 'right' }}>
          <div style={{ marginBottom: 8 }}>
            <Avatar src={question.author.avatar} />
            <Text style={{ marginLeft: 8 }}>{question.author.name}</Text>
          </div>
          <Space>
            <Button 
              type="text" 
              icon={<MessageOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentQuestionId(question.id);
                setShowAnswerModal(true);
              }}
            >
              {question.answers}回答
            </Button>
            <Button type="text" icon={<FireOutlined />}>
              {question.views}浏览
            </Button>
          </Space>
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Text type="secondary">{dayjs(question.createdAt).fromNow()}</Text>
      </div>
    </QuestionCard>
  );

  // 渲染资源卡片
  const renderResourceCard = (resource: any) => (
    <ResourceCard 
      key={resource.id}
      onClick={() => {
        setCurrentResourceId(resource.id);
        setShowResourceDetailModal(true);
        setResourceRating(5);
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ marginBottom: 8 }}>{resource.title}</Title>
          <Space>
            <Tag color="#108ee9">{resource.type.toUpperCase()}</Tag>
            <Text type="secondary">{resource.size}</Text>
            <Text type="secondary">{resource.downloads}次下载</Text>
          </Space>
          <Space wrap style={{ marginTop: 8 }}>
            {resource.tags.map((tag: string) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </div>
        <div style={{ marginLeft: 16, textAlign: 'right' }}>
          <div style={{ marginBottom: 8 }}>
            <Avatar src={resource.author.avatar} />
            <Text style={{ marginLeft: 8 }}>{resource.author.name}</Text>
          </div>
          <Rate disabled defaultValue={resource.rating} />
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<DownloadOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadResource(resource.id);
            }}
          >
            下载
          </Button>
        </Space>
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          {dayjs(resource.createdAt).fromNow()}
        </Text>
      </div>
    </ResourceCard>
  );

  // 渲染活动卡片
  const renderEventCard = (event: any) => (
    <EventCard 
      key={event.id}
      onClick={() => viewEventDetail(event.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ marginBottom: 8 }}>{event.title}</Title>
          <Paragraph ellipsis={{ rows: 2 }} style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{event.description}</Paragraph>
          <Space wrap style={{ marginTop: 8 }}>
            {event.tags.map((tag: string) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </div>
        <div style={{ marginLeft: 16, textAlign: 'right' }}>
          <div style={{ marginBottom: 8 }}>
            <Avatar src={event.organizer.avatar} />
            <Text style={{ marginLeft: 8 }}>{event.organizer.name}</Text>
          </div>
          <Space direction="vertical">
            <Button 
              type="primary"
              disabled={event.participants >= event.maxParticipants}
              onClick={(e) => {
                e.stopPropagation();
                handleJoinEvent(event.id);
              }}
            >
              {event.participants >= event.maxParticipants ? '已报满' : '报名参加'}
            </Button>
            <Text type="secondary">
              {event.participants}/{event.maxParticipants}人
            </Text>
          </Space>
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <CalendarOutlined />
          <Text>{dayjs(event.date).format('YYYY-MM-DD HH:mm')}</Text>
          <EnvironmentOutlined />
          <Text>{event.location}</Text>
        </Space>
        <Text type="secondary">{dayjs(event.date).fromNow()}</Text>
      </div>
    </EventCard>
  );

  // 搜索功能
  const handlePostSearch = (value: string) => {
    setPostSearch(value);
    if (!value.trim()) {
      setFilteredPosts(mockPosts);
      return;
    }
    
    const filtered = mockPosts.filter(post => 
      post.content.toLowerCase().includes(value.toLowerCase()) || 
      post.author.name.toLowerCase().includes(value.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    );
    
    setFilteredPosts(filtered);
  };
  
  const handleGroupSearch = (value: string) => {
    setGroupSearch(value);
    if (!value.trim()) {
      setFilteredGroups(groups);
      return;
    }
    
    const filtered = groups.filter(group => 
      group.name.toLowerCase().includes(value.toLowerCase()) || 
      group.description.toLowerCase().includes(value.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    );
    
    setFilteredGroups(filtered);
  };
  
  const handleQuestionSearch = (value: string) => {
    setQuestionSearch(value);
    if (!value.trim()) {
      setFilteredQuestions(questions);
      return;
    }
    
    const filtered = questions.filter(question => 
      question.title.toLowerCase().includes(value.toLowerCase()) || 
      question.content.toLowerCase().includes(value.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    );
    
    setFilteredQuestions(filtered);
  };
  
  const handleResourceSearch = (value: string) => {
    setResourceSearch(value);
    if (!value.trim()) {
      setFilteredResources(resources);
      return;
    }
    
    const filtered = resources.filter(resource => 
      resource.title.toLowerCase().includes(value.toLowerCase()) || 
      resource.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase())) ||
      resource.type.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredResources(filtered);
  };
  
  const handleEventSearch = (value: string) => {
    setEventSearch(value);
    if (!value.trim()) {
      setFilteredEvents(events);
      return;
    }
    
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(value.toLowerCase()) || 
      event.description.toLowerCase().includes(value.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase())) ||
      event.location.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredEvents(filtered);
  };
  
  // 更新过滤结果当源数据变化时
  useEffect(() => {
    if (postSearch) {
      handlePostSearch(postSearch);
    } else {
      setFilteredPosts(mockPosts);
    }
  }, [mockPosts]);
  
  useEffect(() => {
    if (groupSearch) {
      handleGroupSearch(groupSearch);
    } else {
      setFilteredGroups(groups);
    }
  }, [groups]);
  
  useEffect(() => {
    if (questionSearch) {
      handleQuestionSearch(questionSearch);
    } else {
      setFilteredQuestions(questions);
    }
  }, [questions]);
  
  useEffect(() => {
    if (resourceSearch) {
      handleResourceSearch(resourceSearch);
    } else {
      setFilteredResources(resources);
    }
  }, [resources]);
  
  useEffect(() => {
    if (eventSearch) {
      handleEventSearch(eventSearch);
    } else {
      setFilteredEvents(events);
    }
  }, [events]);

  if (loading) {
    return (
      <Container>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Col>
          <Col span={24}>
            <Skeleton active paragraph={{ rows: 10 }} />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      {/* 顶部统计卡片 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <StyledCard>
            <Statistic
              title="社区成员"
              value={1234}
              prefix={<TeamOutlined />}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StyledCard>
            <Statistic
              title="今日动态"
              value={56}
              prefix={<FireOutlined />}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StyledCard>
            <Statistic
              title="学习小组"
              value={28}
              prefix={<StarOutlined />}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StyledCard>
            <Statistic
              title="问答数量"
              value={189}
              prefix={<QuestionCircleOutlined />}
            />
          </StyledCard>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane 
          tab={<span><FireOutlined />社区动态</span>} 
          key="posts"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Search 
                  placeholder="搜索动态..." 
                  enterButton="搜索" 
                  style={{ maxWidth: 400 }}
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  onSearch={handlePostSearch}
                  allowClear
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setShowPostModal(true)}
                >
                  发布动态
                </Button>
              </div>
            </Col>
            
            <Col span={24}>
              {filteredPosts.map(renderPostCard)}
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><TeamOutlined />学习小组</span>} 
          key="groups"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Search 
                  placeholder="搜索学习小组..." 
                  enterButton="搜索" 
                  style={{ maxWidth: 400 }}
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  onSearch={handleGroupSearch}
                  allowClear
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => message.info('创建小组功能开发中')}
                >
                  创建小组
                </Button>
              </div>
            </Col>
            
            <Col span={24}>
              <Row gutter={[24, 24]}>
                {filteredGroups.map(renderGroupCard)}
              </Row>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><QuestionCircleOutlined />问答互动</span>} 
          key="questions"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Search 
                  placeholder="搜索问题..." 
                  enterButton="搜索" 
                  style={{ maxWidth: 400 }}
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  onSearch={handleQuestionSearch}
                  allowClear
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setShowQuestionModal(true)}
                >
                  发布问题
                </Button>
              </div>
            </Col>
            
            <Col span={24}>
              {filteredQuestions.map(renderQuestionCard)}
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><BookOutlined />资源分享</span>} 
          key="resources"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Search 
                  placeholder="搜索资源..." 
                  enterButton="搜索" 
                  style={{ maxWidth: 400 }}
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  onSearch={handleResourceSearch}
                  allowClear
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setShowResourceModal(true)}
                >
                  分享资源
                </Button>
              </div>
            </Col>
            
            <Col span={24}>
              {filteredResources.map(renderResourceCard)}
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><CalendarOutlined />活动组织</span>} 
          key="events"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Search 
                  placeholder="搜索活动..." 
                  enterButton="搜索" 
                  style={{ maxWidth: 400 }}
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  onSearch={handleEventSearch}
                  allowClear
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setShowEventModal(true)}
                >
                  创建活动
                </Button>
              </div>
            </Col>
            
            <Col span={24}>
              {filteredEvents.map(renderEventCard)}
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 发布动态对话框 */}
      <Modal
        title="发布动态"
        open={showPostModal}
        onCancel={() => setShowPostModal(false)}
        onOk={() => postForm.submit()}
        width={600}
      >
        <Form form={postForm} layout="vertical" onFinish={handlePostSubmit}>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入动态内容' }]}
          >
            <Input.TextArea rows={4} placeholder="分享你的学习经验和心得..." />
          </Form.Item>
          
          <Form.Item name="images" label="图片">
            <Upload
              listType="picture-card"
              maxCount={9}
              multiple
              showUploadList
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>
          
          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="添加标签"
              options={[
                { value: '学习经验', label: '学习经验' },
                { value: '考试技巧', label: '考试技巧' },
                { value: '学习方法', label: '学习方法' },
                { value: '学习资源', label: '学习资源' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 发布问题对话框 */}
      <Modal
        title="发布问题"
        open={showQuestionModal}
        onCancel={() => setShowQuestionModal(false)}
        onOk={() => questionForm.submit()}
        width={600}
      >
        <Form form={questionForm} layout="vertical" onFinish={handleQuestionSubmit}>
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入问题标题' }]}
          >
            <Input placeholder="请输入问题标题" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="问题描述"
            rules={[{ required: true, message: '请详细描述你的问题' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细描述你的问题，这样更容易得到准确的回答" />
          </Form.Item>
          
          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="添加标签"
              options={[
                { value: '数学', label: '数学' },
                { value: '英语', label: '英语' },
                { value: '物理', label: '物理' },
                { value: '化学', label: '化学' },
                { value: '生物', label: '生物' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 分享资源对话框 */}
      <Modal
        title="分享资源"
        open={showResourceModal}
        onCancel={() => setShowResourceModal(false)}
        onOk={() => resourceForm.submit()}
        width={600}
      >
        <Form form={resourceForm} layout="vertical" onFinish={handleResourceSubmit}>
          <Form.Item
            name="title"
            label="资源标题"
            rules={[{ required: true, message: '请输入资源标题' }]}
          >
            <Input placeholder="请输入资源标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="资源描述"
            rules={[{ required: true, message: '请输入资源描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请简要描述这个资源的内容和用途" />
          </Form.Item>
          
          <Form.Item
            name="file"
            label="上传文件"
            rules={[{ required: true, message: '请上传资源文件' }]}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<Upload />}>选择文件</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="添加标签"
              options={[
                { value: '学习资料', label: '学习资料' },
                { value: '考试真题', label: '考试真题' },
                { value: '教学视频', label: '教学视频' },
                { value: '学习笔记', label: '学习笔记' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建活动对话框 */}
      <Modal
        title="创建活动"
        open={showEventModal}
        onCancel={() => setShowEventModal(false)}
        onOk={() => eventForm.submit()}
        width={600}
      >
        <Form form={eventForm} layout="vertical" onFinish={handleEventSubmit}>
          <Form.Item
            name="title"
            label="活动标题"
            rules={[{ required: true, message: '请输入活动标题' }]}
          >
            <Input placeholder="请输入活动标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true, message: '请输入活动描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请详细描述活动内容和安排" />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="活动时间"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
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
            label="人数限制"
            rules={[{ required: true, message: '请输入人数限制' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="添加标签"
              options={[
                { value: '学习活动', label: '学习活动' },
                { value: '经验分享', label: '经验分享' },
                { value: '竞赛培训', label: '竞赛培训' },
                { value: '交流讨论', label: '交流讨论' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 回答问题对话框 */}
      <Modal
        title="回答问题"
        open={showAnswerModal}
        onCancel={() => {
          setShowAnswerModal(false);
          setCurrentQuestionId(null);
        }}
        onOk={() => answerForm.submit()}
        width={600}
      >
        {currentQuestionId && (
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>{questions.find(q => q.id === currentQuestionId)?.title}</Title>
            <Paragraph>{questions.find(q => q.id === currentQuestionId)?.content}</Paragraph>
          </div>
        )}
        
        <Form form={answerForm} layout="vertical" onFinish={handleAnswerSubmit}>
          <Form.Item
            name="content"
            label="你的回答"
            rules={[{ required: true, message: '请输入回答内容' }]}
          >
            <Input.TextArea rows={6} placeholder="请详细描述你的答案，尽量提供完整信息和解决方案" />
          </Form.Item>
          
          <Form.Item name="images" label="添加图片">
            <Upload
              listType="picture-card"
              maxCount={3}
              showUploadList
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 资源详情对话框 */}
      <Modal
        title="资源详情"
        open={showResourceDetailModal}
        onCancel={() => {
          setShowResourceDetailModal(false);
          setCurrentResourceId(null);
        }}
        footer={[
          <Button key="back" onClick={() => setShowResourceDetailModal(false)}>
            关闭
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => {
              if (currentResourceId) {
                handleDownloadResource(currentResourceId);
                setShowResourceDetailModal(false);
              }
            }}
          >
            下载资源
          </Button>,
        ]}
        width={600}
      >
        {currentResourceId && resources.find(r => r.id === currentResourceId) && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>{resources.find(r => r.id === currentResourceId)?.title}</Title>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <Avatar src={resources.find(r => r.id === currentResourceId)?.author.avatar} />
                <Text style={{ margin: '0 16px 0 8px' }}>
                  {resources.find(r => r.id === currentResourceId)?.author.name}
                </Text>
                <Tag color="#108ee9">
                  {resources.find(r => r.id === currentResourceId)?.type.toUpperCase()}
                </Tag>
                <Text type="secondary" style={{ margin: '0 8px' }}>
                  {resources.find(r => r.id === currentResourceId)?.size}
                </Text>
              </div>
              
              <Paragraph>
                这是一份高质量的学习资源，包含了详细的内容和实用的学习材料。下载后可根据实际需求使用，建议结合课程学习效果更佳。
              </Paragraph>
              
              <Space wrap style={{ marginTop: 8 }}>
                {resources.find(r => r.id === currentResourceId)?.tags.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>
            
            <Divider />
            
            <div>
              <Title level={5}>资源评价</Title>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Rate 
                  value={resourceRating} 
                  onChange={setResourceRating} 
                  allowClear={false}
                />
                <Button type="primary" size="small" onClick={handleRateResource}>
                  提交评分
                </Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text>下载次数: {resources.find(r => r.id === currentResourceId)?.downloads}</Text>
                <Text>平均评分: {resources.find(r => r.id === currentResourceId)?.rating.toFixed(1)}</Text>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* 活动详情对话框 */}
      <Modal
        title="活动详情"
        open={showEventDetailModal}
        onCancel={() => {
          setShowEventDetailModal(false);
          setCurrentEventId(null);
        }}
        footer={[
          <Button key="back" onClick={() => setShowEventDetailModal(false)}>
            关闭
          </Button>,
          (() => {
            const currentEvent = currentEventId ? events.find((e: Event) => e.id === currentEventId) : null;
            if (currentEvent && currentEvent.participants < currentEvent.maxParticipants) {
              return (
                <Button 
                  key="join" 
                  type="primary"
                  onClick={() => {
                    if (currentEventId) {
                      handleJoinEvent(currentEventId);
                    }
                  }}
                >
                  报名参加
                </Button>
              );
            } else {
              return (
                <Button key="full" disabled>
                  活动已报满
                </Button>
              );
            }
          })()
        ]}
        width={600}
      >
        {currentEventId && (() => {
          const currentEvent = events.find((e: Event) => e.id === currentEventId);
          if (!currentEvent) return null;
          
          return (
            <>
              <div style={{ marginBottom: 24 }}>
                <Title level={4}>{currentEvent.title}</Title>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Avatar src={currentEvent.organizer.avatar} />
                  <Text style={{ margin: '0 16px 0 8px' }}>
                    主办方: {currentEvent.organizer.name}
                  </Text>
                </div>
                
                <Paragraph style={{ whiteSpace: 'pre-line' }}>
                  {currentEvent.description}
                </Paragraph>
                
                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginTop: 16 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      <Text strong>活动时间: </Text>
                      <Text>{dayjs(currentEvent.date).format('YYYY年MM月DD日 HH:mm')}</Text>
                    </div>
                    <div>
                      <EnvironmentOutlined style={{ marginRight: 8 }} />
                      <Text strong>活动地点: </Text>
                      <Text>{currentEvent.location}</Text>
                    </div>
                    <div>
                      <TeamOutlined style={{ marginRight: 8 }} />
                      <Text strong>参与人数: </Text>
                      <Text>{currentEvent.participants}/{currentEvent.maxParticipants}人</Text>
                    </div>
                  </Space>
                </div>
                
                <Space wrap style={{ marginTop: 16 }}>
                  {currentEvent.tags.map((tag: string) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              </div>
              
              <Divider />
              
              <div>
                <Title level={5}>参与须知</Title>
                <Paragraph>
                  1. 请提前10分钟进入会议室/直播间，做好准备工作。
                  <br />
                  2. 活动过程中请遵守规则，文明交流，共同维护良好的学习氛围。
                  <br />
                  3. 如有特殊情况需要取消报名，请提前通知主办方。
                </Paragraph>
              </div>
            </>
          );
        })()}
      </Modal>
    </Container>
  );
};

export default Community; 