import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Progress,
  Button,
  Space,
  Spin,
  Table,
  Tag,
  Select,
  Empty,
  Radio,
  DatePicker,
  List,
  Divider,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Tooltip,
  Slider,
  Checkbox,
} from 'antd';
import {
  TrophyOutlined,
  BarChartOutlined,
  LineChartOutlined,
  BookOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  HistoryOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';

// 导入图表组件
import GradeChart from './components/GradeChart';
import SubjectPerformance from './components/SubjectPerformance';
import LearningProgress from './components/LearningProgress';
import StudyTimeDistribution from './components/StudyTimeDistribution';
import WeakPointsAnalysis from './components/WeakPointsAnalysis';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 样式组件
const Container = styled.div`
  padding: 0 4px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  height: 100%;
`;

const QuarterCard = styled(StyledCard)`
  text-align: center;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-5px);
  }
`;

const SubjectTag = styled(Tag)`
  margin: 5px;
  padding: 4px 8px;
  font-size: 14px;
`;

// 枚举和接口
enum GradeType {
  PRIMARY = '小学',
  JUNIOR = '初中',
  SENIOR = '高中',
}

enum Subject {
  CHINESE = '语文',
  MATH = '数学',
  ENGLISH = '英语',
  PHYSICS = '物理',
  CHEMISTRY = '化学',
  BIOLOGY = '生物',
  HISTORY = '历史',
  GEOGRAPHY = '地理',
  POLITICS = '政治',
}

interface SubjectData {
  subject: Subject;
  score: number;
  totalScore: number;
  rank: number;
  totalStudents: number;
  lastScore?: number;
  lastRank?: number;
  weakPoints?: string[];
  averageScore?: number;
  variance?: number;
}

interface ExamRecord {
  id: string;
  name: string;
  date: string;
  subjects: SubjectData[];
  totalScore: number;
  totalPossibleScore: number;
  averageScore: number;
  rank: number;
  totalStudents: number;
}

interface WeakPoint {
  subject: Subject;
  knowledgePoint: string;
  description: string;
  recommendedResources: string[];
}

interface LearningTarget {
  id: string;
  subject: Subject;
  description: string;
  deadline: string;
  completed: boolean;
  progress: number;
}

interface HomeworkStatus {
  id: string;
  subject: Subject;
  title: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  score?: number;
  teacherComment?: string;
}

// 模拟数据生成函数
const generateMockExamRecords = (): ExamRecord[] => {
  const records: ExamRecord[] = [];
  const examNames = ['期中考试', '期末考试', '模拟考试', '单元测试'];
  
  for (let i = 0; i < 5; i++) {
    const date = dayjs().subtract(i * 30, 'day').format('YYYY-MM-DD');
    const subjects: SubjectData[] = Object.values(Subject).slice(0, 6).map(subject => {
      const score = Math.floor(Math.random() * 30) + 70;
      const totalScore = 100;
      const rank = Math.floor(Math.random() * 20) + 1;
      const totalStudents = 50;
      const lastScore = Math.floor(Math.random() * 30) + 70;
      const lastRank = Math.floor(Math.random() * 20) + 1;
      const weakPoints = ['知识点1', '知识点2', '知识点3'].slice(0, Math.floor(Math.random() * 3) + 1);
      
      return {
        subject,
        score,
        totalScore,
        rank,
        totalStudents,
        lastScore,
        lastRank,
        weakPoints,
      };
    });
    
    const totalScore = subjects.reduce((sum, subject) => sum + subject.score, 0);
    const totalPossibleScore = subjects.reduce((sum, subject) => sum + subject.totalScore, 0);
    const averageScore = totalScore / subjects.length;
    const rank = Math.floor(Math.random() * 20) + 1;
    
    records.push({
      id: `exam-${i}`,
      name: `${examNames[i % examNames.length]} ${i + 1}`,
      date,
      subjects,
      totalScore,
      totalPossibleScore,
      averageScore,
      rank,
      totalStudents: 50,
    });
  }
  
  return records;
};

const generateMockWeakPoints = (): WeakPoint[] => {
  return [
    {
      subject: Subject.MATH,
      knowledgePoint: '函数图像与性质',
      description: '对函数图像变换理解不够深入，解题时经常出错',
      recommendedResources: ['《高中数学函数专题》', '函数图像变换视频课程', '函数性质练习题']
    },
    {
      subject: Subject.PHYSICS,
      knowledgePoint: '电磁感应',
      description: '对法拉第电磁感应定律应用不熟练，解题方法单一',
      recommendedResources: ['《电磁感应专题讲解》', '物理实验视频：探究电磁感应现象', '习题集：电磁感应应用题']
    },
    {
      subject: Subject.ENGLISH,
      knowledgePoint: '虚拟语气',
      description: '对虚拟语气的使用场景和规则理解不清晰',
      recommendedResources: ['虚拟语气语法讲解', '虚拟语气练习题', '英语语法专项训练']
    },
    {
      subject: Subject.CHEMISTRY,
      knowledgePoint: '有机化学反应',
      description: '对有机物的官能团反应规律掌握不够',
      recommendedResources: ['有机化学反应规律总结', '官能团反应练习', '有机化学视频讲解']
    },
  ];
};

const generateMockLearningTargets = (): LearningTarget[] => {
  return [
    {
      id: '1',
      subject: Subject.MATH,
      description: '掌握三角函数的图像和性质',
      deadline: dayjs().add(10, 'day').format('YYYY-MM-DD'),
      completed: false,
      progress: 60,
    },
    {
      id: '2',
      subject: Subject.ENGLISH,
      description: '背诵核心词汇200个',
      deadline: dayjs().add(5, 'day').format('YYYY-MM-DD'),
      completed: false,
      progress: 75,
    },
    {
      id: '3',
      subject: Subject.PHYSICS,
      description: '完成力学综合练习50题',
      deadline: dayjs().add(3, 'day').format('YYYY-MM-DD'),
      completed: true,
      progress: 100,
    },
    {
      id: '4',
      subject: Subject.CHEMISTRY,
      description: '掌握有机物命名规则',
      deadline: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      completed: false,
      progress: 30,
    },
  ];
};

const generateMockHomeworkStatus = (): HomeworkStatus[] => {
  return [
    {
      id: '1',
      subject: Subject.MATH,
      title: '第三章习题',
      dueDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      status: 'pending',
    },
    {
      id: '2',
      subject: Subject.ENGLISH,
      title: '阅读理解练习',
      dueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      status: 'completed',
      score: 92,
      teacherComment: '阅读理解能力有提升，但细节把握还需加强',
    },
    {
      id: '3',
      subject: Subject.PHYSICS,
      title: '力学计算题',
      dueDate: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
      status: 'completed',
      score: 85,
      teacherComment: '计算过程清晰，但解题思路需要多样化',
    },
    {
      id: '4',
      subject: Subject.CHEMISTRY,
      title: '化学方程式平衡',
      dueDate: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
      status: 'overdue',
    },
  ];
};

// 主组件
const AcademicAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [examRecords, setExamRecords] = useState<ExamRecord[]>([]);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const [learningTargets, setLearningTargets] = useState<LearningTarget[]>([]);
  const [homeworkStatus, setHomeworkStatus] = useState<HomeworkStatus[]>([]);
  const [, setSelectedExam] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(6, 'month'),
    dayjs()
  ]);
  const [gradeType, setGradeType] = useState<GradeType>(GradeType.SENIOR);
  
  // 新增的状态
  const [examModalVisible, setExamModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [homeworkModalVisible, setHomeworkModalVisible] = useState(false);
  const [weakPointModalVisible, setWeakPointModalVisible] = useState(false);
  const [examForm] = Form.useForm();
  const [targetForm] = Form.useForm();
  const [homeworkForm] = Form.useForm();
  const [weakPointForm] = Form.useForm();
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      const examRecordsData = generateMockExamRecords();
      setExamRecords(examRecordsData);
      setWeakPoints(generateMockWeakPoints());
      setLearningTargets(generateMockLearningTargets());
      setHomeworkStatus(generateMockHomeworkStatus());
      
      if (examRecordsData.length > 0) {
        setSelectedExam(examRecordsData[0].id);
      }
      
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 最新考试记录
  const latestExam = examRecords.length > 0 ? examRecords[0] : null;
  
  // 表现提升的科目
  const improvedSubjects = latestExam ? latestExam.subjects.filter(
    subject => subject.lastScore !== undefined && subject.score > subject.lastScore
  ) : [];
  
  // 需要加强的科目
  const weakSubjects = latestExam ? latestExam.subjects.filter(
    subject => subject.lastScore !== undefined && subject.score < subject.lastScore
  ) : [];
  
  // 目标达成率
  const targetCompletionRate = learningTargets.length > 0
    ? Math.round((learningTargets.filter(target => target.completed).length / learningTargets.length) * 100)
    : 0;
  
  // 作业完成率
  const homeworkCompletionRate = homeworkStatus.length > 0
    ? Math.round((homeworkStatus.filter(hw => hw.status === 'completed').length / homeworkStatus.length) * 100)
    : 0;
  
  // 渲染学科表现
  const renderSubjectPerformance = (subjects: SubjectData[]) => {
    return (
      <Row gutter={[16, 16]}>
        {subjects.map(subject => (
          <Col xs={24} sm={12} md={8} key={subject.subject}>
            <StyledCard title={subject.subject}>
              <Statistic
                title="得分"
                value={subject.score}
                suffix={`/ ${subject.totalScore}`}
                precision={0}
                valueStyle={{ color: '#1890ff' }}
              />
              <Progress
                percent={Math.round((subject.score / subject.totalScore) * 100)}
                status="active"
                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
              />
              <div style={{ marginTop: 16 }}>
                <Space direction="vertical" size="small">
                  <div>
                    <Text>排名: </Text>
                    <Text strong>{subject.rank}</Text>
                    <Text> / {subject.totalStudents}</Text>
                  </div>
                  
                  {subject.averageScore && (
                    <div>
                      <Text>班级平均分: </Text>
                      <Text strong style={{ color: '#722ed1' }}>{subject.averageScore}</Text>
                      {subject.score > (subject.averageScore || 0) ? (
                        <Text type="success"> (+{(subject.score - (subject.averageScore || 0)).toFixed(1)})</Text>
                      ) : subject.score < (subject.averageScore || 0) ? (
                        <Text type="danger"> (-{((subject.averageScore || 0) - subject.score).toFixed(1)})</Text>
                      ) : (
                        <Text> (持平)</Text>
                      )}
                    </div>
                  )}
                  
                  {subject.variance && (
                    <div>
                      <Text>分数方差: </Text>
                      <Text strong style={{ color: '#eb2f96' }}>{subject.variance}</Text>
                      <Tooltip title="方差越大表示班级成绩差异越大，方差越小表示成绩分布越集中">
                        <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                      </Tooltip>
                    </div>
                  )}
                  
                  {subject.lastScore && (
                    <div>
                      <Text>与上次考试相比: </Text>
                      {subject.score > subject.lastScore ? (
                        <Text type="success">提升 {(subject.score - subject.lastScore).toFixed(1)}</Text>
                      ) : subject.score < subject.lastScore ? (
                        <Text type="danger">下降 {(subject.lastScore - subject.score).toFixed(1)}</Text>
                      ) : (
                        <Text>持平</Text>
                      )}
                    </div>
                  )}
                </Space>
              </div>
            </StyledCard>
          </Col>
        ))}
      </Row>
    );
  };
  
  // 渲染考试记录表格
  const examColumns = [
    {
      title: '考试名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '考试日期',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      render: (score: number, record: ExamRecord) => `${score} / ${record.totalPossibleScore}`,
    },
    {
      title: '平均分',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score: number) => score.toFixed(1),
    },
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank: number, record: ExamRecord) => `${rank} / ${record.totalStudents}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ExamRecord) => (
        <Button type="link" onClick={() => setSelectedExam(record.id)}>查看详情</Button>
      ),
    },
  ];
  
  // 渲染学习目标
  const renderLearningTargets = () => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={learningTargets}
        renderItem={item => (
          <List.Item
            actions={[
              <Tooltip title="更新进度">
                <Button 
                  type="link" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: '更新学习目标进度',
                      content: (
                        <div>
                          <Text>当前进度: {item.progress}%</Text>
                          <Progress 
                            percent={item.progress} 
                            size="small" 
                            style={{ marginBottom: 16, marginTop: 8 }}
                            status={item.completed ? 'success' : 'active'}
                          />
                          <div>新进度:</div>
                          <Slider 
                            defaultValue={item.progress} 
                            onChange={(value) => {
                              Modal.confirm({
                                content: `设置进度为${value}%，是否完成？`,
                                onOk: () => handleUpdateTargetProgress(item.id, value, value === 100),
                              });
                            }}
                          />
                          <div style={{ marginTop: 16 }}>
                            <Checkbox 
                              checked={item.completed}
                              onChange={(e) => handleUpdateTargetProgress(item.id, item.progress, e.target.checked)}
                            >
                              标记为已完成
                            </Checkbox>
                          </div>
                        </div>
                      ),
                      okText: '确认',
                      cancelText: '取消',
                    });
                  }}
                />
              </Tooltip>,
              <Button 
                type="link" 
                icon={item.completed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              >
                {item.completed ? '已完成' : '未完成'}
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
              title={
                <Space>
                  <SubjectTag color="blue">{item.subject}</SubjectTag>
                  <Text strong>{item.description}</Text>
                </Space>
              }
              description={`截止日期: ${item.deadline}`}
            />
            <Progress percent={item.progress} size="small" status={item.completed ? 'success' : 'active'} />
          </List.Item>
        )}
      />
    );
  };
  
  // 渲染作业状态
  const renderHomeworkStatus = () => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={homeworkStatus}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
              title={
                <Space>
                  <SubjectTag color="blue">{item.subject}</SubjectTag>
                  <Text strong>{item.title}</Text>
                  {item.status === 'completed' && (
                    <Tag color="success">已完成</Tag>
                  )}
                  {item.status === 'pending' && (
                    <Tag color="warning">待完成</Tag>
                  )}
                  {item.status === 'overdue' && (
                    <Tag color="error">已逾期</Tag>
                  )}
                </Space>
              }
              description={
                <>
                  <div>截止日期: {item.dueDate}</div>
                  {item.score !== undefined && (
                    <div>得分: {item.score}</div>
                  )}
                  {item.teacherComment && (
                    <div>老师评语: {item.teacherComment}</div>
                  )}
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  // 新增函数 - 处理添加考试记录
  const handleAddExam = (values: any) => {
    // 创建新的考试记录对象
    const subjectList = values.subjects.map((subjectData: any) => {
      return {
        subject: subjectData.subject,
        score: subjectData.score,
        totalScore: subjectData.totalScore || 100,
        rank: subjectData.rank,
        totalStudents: subjectData.totalStudents || 50,
        averageScore: subjectData.averageScore,
        variance: subjectData.variance
      };
    });

    const totalScore = subjectList.reduce((sum: number, subject: SubjectData) => sum + subject.score, 0);
    const totalPossibleScore = subjectList.reduce((sum: number, subject: SubjectData) => sum + subject.totalScore, 0);
    const averageScore = totalScore / subjectList.length;

    const newExam: ExamRecord = {
      id: `exam-${Date.now()}`,
      name: values.name,
      date: values.date.format('YYYY-MM-DD'),
      subjects: subjectList,
      totalScore,
      totalPossibleScore,
      averageScore,
      rank: values.rank,
      totalStudents: values.totalStudents || 50,
    };

    // 添加到状态
    setExamRecords([newExam, ...examRecords]);
    message.success('考试记录已添加');
    setExamModalVisible(false);
    examForm.resetFields();
  };

  // 添加学习目标
  const handleAddTarget = (values: any) => {
    const newTarget: LearningTarget = {
      id: `target-${Date.now()}`,
      subject: values.subject,
      description: values.description,
      deadline: values.deadline.format('YYYY-MM-DD'),
      completed: false,
      progress: 0,
    };

    setLearningTargets([...learningTargets, newTarget]);
    message.success('学习目标已添加');
    setTargetModalVisible(false);
    targetForm.resetFields();
  };

  // 添加作业
  const handleAddHomework = (values: any) => {
    const newHomework: HomeworkStatus = {
      id: `homework-${Date.now()}`,
      subject: values.subject,
      title: values.title,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      status: 'pending',
    };

    setHomeworkStatus([...homeworkStatus, newHomework]);
    message.success('作业已添加');
    setHomeworkModalVisible(false);
    homeworkForm.resetFields();
  };

  // 添加薄弱知识点
  const handleAddWeakPoint = (values: any) => {
    const newWeakPoint: WeakPoint = {
      subject: values.subject,
      knowledgePoint: values.knowledgePoint,
      description: values.description,
      recommendedResources: values.resources.split('\n').filter((resource: string) => resource.trim() !== ''),
    };

    setWeakPoints([...weakPoints, newWeakPoint]);
    message.success('薄弱知识点已添加');
    setWeakPointModalVisible(false);
    weakPointForm.resetFields();
  };

  // 导入Excel文件（模拟）
  const handleExcelImport = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功，数据正在处理中...`);
      // 模拟数据处理延迟
      setTimeout(() => {
        message.success('成绩数据导入成功');
      }, 1500);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  // 更新学习目标进度
  const handleUpdateTargetProgress = (id: string, progress: number, completed: boolean) => {
    const updatedTargets = learningTargets.map(target => {
      if (target.id === id) {
        return { ...target, progress, completed };
      }
      return target;
    });
    setLearningTargets(updatedTargets);
    message.success('学习目标进度已更新');
  };

  // 渲染考试表单
  const renderExamForm = () => (
    <Form form={examForm} layout="vertical" onFinish={handleAddExam}>
      <Form.Item
        name="name"
        label="考试名称"
        rules={[{ required: true, message: '请输入考试名称' }]}
      >
        <Input placeholder="例如: 期中考试、单元测试" />
      </Form.Item>

      <Form.Item
        name="date"
        label="考试日期"
        rules={[{ required: true, message: '请选择考试日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="rank"
        label="总排名"
        rules={[{ required: true, message: '请输入排名' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="totalStudents"
        label="总人数"
        initialValue={50}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Divider orientation="left">学科成绩</Divider>

      <Form.List name="subjects">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card style={{ marginBottom: 16 }} key={key} size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'subject']}
                      rules={[{ required: true, message: '请选择学科' }]}
                    >
                      <Select placeholder="选择学科">
                        {Object.values(Subject).map(subject => (
                          <Option key={subject} value={subject}>{subject}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'score']}
                      rules={[{ required: true, message: '请输入分数' }]}
                    >
                      <InputNumber 
                        min={0} 
                        max={150} 
                        placeholder="分数" 
                        style={{ width: '100%' }} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'totalScore']}
                      initialValue={100}
                      label="满分"
                    >
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'rank']}
                      label="排名"
                      rules={[{ required: true, message: '请输入排名' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'totalStudents']}
                      label="总人数"
                      initialValue={50}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'averageScore']}
                      label="班级平均分"
                    >
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'variance']}
                      label="成绩方差"
                    >
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Button 
                  type="text" 
                  danger 
                  onClick={() => remove(name)} 
                  icon={<DeleteOutlined />}
                  style={{ position: 'absolute', top: 8, right: 8 }}
                >
                  删除
                </Button>
              </Card>
            ))}
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
              >
                添加学科
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      
      <Divider />
      
      <Form.Item label="从Excel导入" help="支持Excel、CSV格式">
        <Upload.Dragger 
          name="file" 
          action="/api/upload" // 模拟接口
          onChange={handleExcelImport}
          accept=".xlsx,.xls,.csv"
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            按照模板格式填写数据，一次上传多门课程成绩
          </p>
        </Upload.Dragger>
      </Form.Item>
    </Form>
  );

  // 渲染学习目标表单
  const renderTargetForm = () => (
    <Form form={targetForm} layout="vertical" onFinish={handleAddTarget}>
      <Form.Item
        name="subject"
        label="学科"
        rules={[{ required: true, message: '请选择学科' }]}
      >
        <Select placeholder="选择学科">
          {Object.values(Subject).map(subject => (
            <Option key={subject} value={subject}>{subject}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="目标描述"
        rules={[{ required: true, message: '请输入目标描述' }]}
      >
        <Input.TextArea 
          placeholder="例如: 掌握三角函数的图像和性质" 
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item
        name="deadline"
        label="截止日期"
        rules={[{ required: true, message: '请选择截止日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );

  // 渲染作业表单
  const renderHomeworkForm = () => (
    <Form form={homeworkForm} layout="vertical" onFinish={handleAddHomework}>
      <Form.Item
        name="subject"
        label="学科"
        rules={[{ required: true, message: '请选择学科' }]}
      >
        <Select placeholder="选择学科">
          {Object.values(Subject).map(subject => (
            <Option key={subject} value={subject}>{subject}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="title"
        label="作业标题"
        rules={[{ required: true, message: '请输入作业标题' }]}
      >
        <Input placeholder="例如: 第三章习题、阅读理解练习" />
      </Form.Item>

      <Form.Item
        name="dueDate"
        label="截止日期"
        rules={[{ required: true, message: '请选择截止日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="details"
        label="作业详情"
      >
        <Input.TextArea 
          placeholder="输入作业详细内容、要求等" 
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
      
      <Form.Item label="上传附件">
        <Upload
          action="/api/upload" // 模拟接口
          listType="text"
        >
          <Button icon={<UploadOutlined />}>上传作业要求文件</Button>
        </Upload>
      </Form.Item>
    </Form>
  );

  // 渲染薄弱知识点表单
  const renderWeakPointForm = () => (
    <Form form={weakPointForm} layout="vertical" onFinish={handleAddWeakPoint}>
      <Form.Item
        name="subject"
        label="学科"
        rules={[{ required: true, message: '请选择学科' }]}
      >
        <Select placeholder="选择学科">
          {Object.values(Subject).map(subject => (
            <Option key={subject} value={subject}>{subject}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="knowledgePoint"
        label="薄弱知识点"
        rules={[{ required: true, message: '请输入薄弱知识点' }]}
      >
        <Input placeholder="例如: 函数图像与性质、虚拟语气" />
      </Form.Item>

      <Form.Item
        name="description"
        label="问题描述"
        rules={[{ required: true, message: '请描述难点所在' }]}
      >
        <Input.TextArea 
          placeholder="描述具体的困难点或错误类型" 
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item
        name="resources"
        label="推荐资源"
        help="每行一个资源，例如书籍名、网站链接等"
      >
        <Input.TextArea 
          placeholder="《高中数学函数专题》
函数图像变换视频课程
习题集：函数图像练习" 
          autoSize={{ minRows: 3, maxRows: 8 }}
        />
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
    <Container>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3}>学业分析</Title>
        </Col>
        <Col flex="auto">
          <Paragraph>
            跟踪学业表现，分析学习情况，设定并完成学习目标，提高学习效率。
          </Paragraph>
        </Col>
        <Col>
          <Space wrap>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setExamModalVisible(true)}
            >
              添加考试记录
            </Button>
            
            <Radio.Group value={gradeType} onChange={e => setGradeType(e.target.value)}>
              <Radio.Button value={GradeType.PRIMARY}>小学</Radio.Button>
              <Radio.Button value={GradeType.JUNIOR}>初中</Radio.Button>
              <Radio.Button value={GradeType.SENIOR}>高中</Radio.Button>
            </Radio.Group>
            
            <RangePicker 
              value={selectedTimeRange} 
              onChange={dates => dates && setSelectedTimeRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} 
            />
          </Space>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        {/* 统计卡片 */}
        <Col xs={24} sm={12} md={6}>
          <QuarterCard>
            <Statistic
              title="最近考试排名"
              value={latestExam ? latestExam.rank : 0}
              suffix={latestExam ? `/ ${latestExam.totalStudents}` : ''}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            {latestExam && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <Text type="secondary">{latestExam.name} ({dayjs(latestExam.date).format('YYYY-MM-DD')})</Text>
              </div>
            )}
          </QuarterCard>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <QuarterCard>
            <Statistic
              title="平均成绩"
              value={latestExam ? latestExam.averageScore : 0}
              precision={1}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="分"
            />
            <Progress 
              percent={latestExam ? Math.round((latestExam.averageScore / 100) * 100) : 0} 
              strokeColor={{ '0%': '#722ed1', '100%': '#f759ab' }}
              size="small"
            />
          </QuarterCard>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <QuarterCard>
            <Statistic
              title="学习目标达成率"
              value={targetCompletionRate}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
            <Progress 
              percent={targetCompletionRate} 
              strokeColor={{ '0%': '#52c41a', '100%': '#87d068' }}
              size="small"
            />
          </QuarterCard>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <QuarterCard>
            <Statistic
              title="作业完成率"
              value={homeworkCompletionRate}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="%"
            />
            <Progress 
              percent={homeworkCompletionRate} 
              strokeColor={{ '0%': '#faad14', '100%': '#ffc53d' }}
              size="small"
            />
          </QuarterCard>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <StyledCard>
            <Tabs defaultActiveKey="overview">
              <TabPane 
                tab={<span><LineChartOutlined />成绩趋势</span>}
                key="overview"
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <GradeChart data={examRecords} />
                  
                  {latestExam && (
                    <div style={{ marginTop: 24 }}>
                      <Title level={4}>最近考试详情</Title>
                      <Paragraph>
                        <Space>
                          <Text strong>{latestExam.name}</Text>
                          <Text>({dayjs(latestExam.date).format('YYYY-MM-DD')})</Text>
                        </Space>
                      </Paragraph>
                      
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                          <Card title="总体情况">
                            <Statistic
                              title="总分"
                              value={latestExam.totalScore}
                              suffix={`/ ${latestExam.totalPossibleScore}`}
                              valueStyle={{ color: '#1890ff' }}
                            />
                            <Divider style={{ margin: '12px 0' }} />
                            <Statistic
                              title="排名"
                              value={latestExam.rank}
                              suffix={`/ ${latestExam.totalStudents}`}
                              valueStyle={{ color: '#722ed1' }}
                            />
                            <Divider style={{ margin: '12px 0' }} />
                            <Statistic
                              title="平均分"
                              value={latestExam.averageScore}
                              precision={1}
                              valueStyle={{ color: '#52c41a' }}
                            />
                          </Card>
                        </Col>
                        
                        <Col xs={24} md={8}>
                          <Card 
                            title="表现提升的科目" 
                            extra={<RiseOutlined style={{ color: '#52c41a' }} />}
                          >
                            {improvedSubjects.length > 0 ? (
                              <List
                                itemLayout="horizontal"
                                dataSource={improvedSubjects}
                                renderItem={item => (
                                  <List.Item>
                                    <List.Item.Meta
                                      title={item.subject}
                                      description={
                                        <Space>
                                          <Text>分数: </Text>
                                          <Text type="success">
                                            {item.lastScore} → {item.score} 
                                            (+{(item.score - (item.lastScore || 0)).toFixed(1)})
                                          </Text>
                                        </Space>
                                      }
                                    />
                                  </List.Item>
                                )}
                              />
                            ) : (
                              <Empty description="暂无提升科目" />
                            )}
                          </Card>
                        </Col>
                        
                        <Col xs={24} md={8}>
                          <Card 
                            title="需要加强的科目" 
                            extra={<FallOutlined style={{ color: '#ff4d4f' }} />}
                          >
                            {weakSubjects.length > 0 ? (
                              <List
                                itemLayout="horizontal"
                                dataSource={weakSubjects}
                                renderItem={item => (
                                  <List.Item>
                                    <List.Item.Meta
                                      title={item.subject}
                                      description={
                                        <Space>
                                          <Text>分数: </Text>
                                          <Text type="danger">
                                            {item.lastScore} → {item.score} 
                                            ({(item.score - (item.lastScore || 0)).toFixed(1)})
                                          </Text>
                                        </Space>
                                      }
                                    />
                                  </List.Item>
                                )}
                              />
                            ) : (
                              <Empty description="暂无下降科目" />
                            )}
                          </Card>
                        </Col>
                      </Row>
                      
                      <div style={{ marginTop: 24 }}>
                        <Title level={4}>各科表现</Title>
                        {renderSubjectPerformance(latestExam.subjects)}
                      </div>
                    </div>
                  )}
                </Space>
              </TabPane>
              
              <TabPane 
                tab={<span><BookOutlined />学科分析</span>}
                key="subjects"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <StyledCard title="学科表现趋势">
                      <SubjectPerformance data={examRecords} />
                    </StyledCard>
                  </Col>
                  <Col xs={24} md={12}>
                    <StyledCard 
                      title="薄弱知识点分析" 
                      extra={
                        <Button 
                          type="link" 
                          icon={<PlusOutlined />} 
                          onClick={() => setWeakPointModalVisible(true)}
                        >
                          添加弱点
                        </Button>
                      }
                    >
                      <WeakPointsAnalysis weakPoints={weakPoints} />
                    </StyledCard>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane 
                tab={<span><TeamOutlined />排名分析</span>}
                key="ranking"
              >
                <StyledCard title="历次考试记录">
                  <Table
                    dataSource={examRecords}
                    columns={examColumns}
                    rowKey="id"
                    pagination={false}
                  />
                </StyledCard>
              </TabPane>
              
              <TabPane 
                tab={<span><CalendarOutlined />学习规划</span>}
                key="plan"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <StyledCard 
                      title="学习目标" 
                      extra={
                        <Button 
                          type="link" 
                          icon={<PlusOutlined />}
                          onClick={() => setTargetModalVisible(true)}
                        >
                          添加目标
                        </Button>
                      }
                    >
                      {renderLearningTargets()}
                    </StyledCard>
                  </Col>
                  <Col xs={24} md={12}>
                    <StyledCard title="学习时间分布">
                      <StudyTimeDistribution />
                    </StyledCard>
                  </Col>
                </Row>
                
                <StyledCard 
                  title="学习进度" 
                  style={{ marginTop: 16 }}
                >
                  <LearningProgress />
                </StyledCard>
              </TabPane>
              
              <TabPane 
                tab={<span><HistoryOutlined />作业记录</span>}
                key="homework"
              >
                <StyledCard 
                  title="作业完成情况" 
                  extra={
                    <Button 
                      type="link" 
                      icon={<PlusOutlined />} 
                      onClick={() => setHomeworkModalVisible(true)}
                    >
                      添加作业
                    </Button>
                  }
                >
                  {renderHomeworkStatus()}
                </StyledCard>
              </TabPane>
            </Tabs>
          </StyledCard>
        </Col>
      </Row>

      {/* 模态窗口 - 添加考试记录 */}
      <Modal
        title="添加考试记录"
        open={examModalVisible}
        onCancel={() => setExamModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setExamModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => examForm.submit()}
          >
            保存
          </Button>,
        ]}
        width={700}
      >
        {renderExamForm()}
      </Modal>

      {/* 模态窗口 - 添加学习目标 */}
      <Modal
        title="添加学习目标"
        open={targetModalVisible}
        onCancel={() => setTargetModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setTargetModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => targetForm.submit()}
          >
            保存
          </Button>,
        ]}
      >
        {renderTargetForm()}
      </Modal>

      {/* 模态窗口 - 添加作业 */}
      <Modal
        title="添加作业"
        open={homeworkModalVisible}
        onCancel={() => setHomeworkModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setHomeworkModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => homeworkForm.submit()}
          >
            保存
          </Button>,
        ]}
      >
        {renderHomeworkForm()}
      </Modal>

      {/* 模态窗口 - 添加薄弱知识点 */}
      <Modal
        title="添加薄弱知识点"
        open={weakPointModalVisible}
        onCancel={() => setWeakPointModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setWeakPointModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => weakPointForm.submit()}
          >
            保存
          </Button>,
        ]}
      >
        {renderWeakPointForm()}
      </Modal>
    </Container>
  );
};

export default AcademicAnalysis; 