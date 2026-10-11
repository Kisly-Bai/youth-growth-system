import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Tabs,
  Space,
  Spin,
  List,
  Tag,
  Progress,
  Divider,
  Statistic,
  Steps,
  Empty,
  Avatar,
  Modal,
  Form,
  Input,
  Select,
  Rate,
  Tooltip,
  Timeline,
} from 'antd';
import {
  CompassOutlined,
  BulbOutlined,
  BankOutlined,
  BookOutlined,
  RocketOutlined,
  FileTextOutlined,
  TrophyOutlined,
  TeamOutlined,
  StarOutlined,
  HeartOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  UserOutlined,
  FileSearchOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  PushpinOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  ExperimentOutlined,
  HistoryOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { HollandCode, HollandTestResult } from '../../types';
import { useNavigate } from 'react-router-dom';

// 组件导入
import HollandTest from './components/HollandTest';
import CareerMatch from './components/CareerMatch';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 样式组件
const Container = styled.div`
  padding: 24px;
`;

const HeaderCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const ActionCard = styled(Card)`
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
`;

const TagContainer = styled.div`
  margin-top: 8px;
`;

const BannerTitle = styled(Title)`
  color: white !important;
  margin-bottom: 8px !important;
`;

const BannerText = styled(Text)`
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 16px;
`;

const HistoryCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
`;

const TypeTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
  margin: 4px;
`;

const ProgressCard = styled(Card)`
  text-align: center;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 16px;
`;

const StatCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 16px;
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

// 模拟数据
const mockHollandResults = {
  scores: {
    [HollandCode.R]: 65, // 实用型
    [HollandCode.I]: 82, // 研究型
    [HollandCode.A]: 45, // 艺术型
    [HollandCode.S]: 70, // 社会型
    [HollandCode.E]: 55, // 企业型
    [HollandCode.C]: 60, // 常规型
  },
  primaryCode: HollandCode.I,
  secondaryCode: HollandCode.S,
};

const mockRecommendedMajors = [
  { 
    name: '计算机科学与技术', 
    match: 95, 
    description: '研究计算机原理、设计算法和开发软件的学科',
    schools: ['清华大学', '北京大学', '浙江大学', '上海交通大学']
  },
  { 
    name: '心理学', 
    match: 90, 
    description: '研究人类心理活动和行为规律的学科',
    schools: ['北京师范大学', '华东师范大学', '中国人民大学', '南京大学']
  },
  { 
    name: '生物信息学', 
    match: 88, 
    description: '结合生物学和信息科学的交叉学科',
    schools: ['清华大学', '复旦大学', '中国科学技术大学', '北京大学']
  },
  { 
    name: '数据科学', 
    match: 85, 
    description: '研究数据收集、处理、分析和应用的学科',
    schools: ['北京大学', '复旦大学', '中国人民大学', '武汉大学']
  },
];

const mockRecommendedCareers = [
  { 
    name: '软件工程师', 
    match: 96, 
    salary: '15-35万/年',
    outlook: '前景良好，需求持续增长',
    skills: ['编程', '算法', '问题解决', '团队协作']
  },
  { 
    name: '数据分析师', 
    match: 93, 
    salary: '12-30万/年',
    outlook: '需求增长迅速，岗位充足',
    skills: ['统计分析', 'SQL', '数据可视化', '业务分析']
  },
  { 
    name: '心理咨询师', 
    match: 89, 
    salary: '10-25万/年',
    outlook: '社会需求日益增长',
    skills: ['倾听', '同理心', '心理学知识', '沟通技巧']
  },
  { 
    name: '教育工作者', 
    match: 85, 
    salary: '8-20万/年',
    outlook: '就业稳定，发展空间大',
    skills: ['教学能力', '沟通表达', '知识传授', '耐心']
  },
];

const codeDescriptions = {
  [HollandCode.R]: {
    title: '实用型',
    description: '喜欢具体的任务，善于使用工具和机械，善于解决实际问题。',
    traits: ['实际', '坚持', '真诚', '节俭', '谦虚'],
    suitableCareers: ['工程师', '技术人员', '农林工作者', '电工', '机械师']
  },
  [HollandCode.I]: {
    title: '研究型',
    description: '喜欢分析和探索，善于思考和解决抽象问题，倾向于独立工作。',
    traits: ['分析性', '谨慎', '批判性', '好奇', '独立'],
    suitableCareers: ['科学家', '研究员', '大学教授', '医生', '程序员']
  },
  [HollandCode.A]: {
    title: '艺术型',
    description: '富有创造力和想象力，喜欢表达情感和创作，追求非传统和创新。',
    traits: ['创造性', '表现力', '理想主义', '直觉', '非传统'],
    suitableCareers: ['艺术家', '音乐家', '设计师', '作家', '演员']
  },
  [HollandCode.S]: {
    title: '社会型',
    description: '热爱与人交往，善于沟通和教导他人，关心社会问题和他人福祉。',
    traits: ['友好', '助人', '理解', '合作', '慷慨'],
    suitableCareers: ['教师', '社工', '咨询师', '护士', '人力资源专员']
  },
  [HollandCode.E]: {
    title: '企业型',
    description: '有领导能力，喜欢影响和说服他人，追求经济和物质成功。',
    traits: ['冒险', '野心', '自信', '说服力', '乐观'],
    suitableCareers: ['经理', '律师', '政治家', '销售人员', '创业者']
  },
  [HollandCode.C]: {
    title: '常规型',
    description: '善于管理和组织数据，喜欢按规则和程序行事，注重细节和准确性。',
    traits: ['顺从', '高效', '务实', '有条理', '谨慎'],
    suitableCareers: ['会计', '银行职员', '行政人员', '审计员', '文秘']
  }
};

// 根据霍兰德代码生成职业推荐
const generateRecommendedCareers = (primaryCode: HollandCode, secondaryCode: HollandCode) => {
  // 模拟基于霍兰德代码的职业推荐逻辑
  // 实际应用中，这里可能会调用API或使用更复杂的匹配算法
  return mockRecommendedCareers;
};

// 根据霍兰德代码生成专业推荐
const generateRecommendedMajors = (primaryCode: HollandCode, secondaryCode: HollandCode) => {
  // 模拟基于霍兰德代码的专业推荐逻辑
  // 实际应用中，这里可能会调用API或使用更复杂的匹配算法
  return mockRecommendedMajors;
};

const CareerPlanning: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(true); // 模拟已完成测试
  const [hollandResults, setHollandResults] = useState(mockHollandResults);
  const [recommendedMajors, setRecommendedMajors] = useState(mockRecommendedMajors);
  const [recommendedCareers, setRecommendedCareers] = useState(mockRecommendedCareers);
  const [activeTab, setActiveTab] = useState('overview');
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [hollandHistory, setHollandHistory] = useState<HollandTestResult[]>([]);
  
  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    
    // 加载霍兰德测试历史
    const historyData = JSON.parse(localStorage.getItem('hollandTestHistory') || '[]');
    setHollandHistory(historyData);
    
    // 判断是否已完成测试
    if (historyData.length > 0) {
      setTestCompleted(true);
      
      try {
        // 获取最新测试结果
        const latestResult = historyData[historyData.length - 1];
        
        // 检查并确保scores对象的键与HollandCode枚举一致
        const scores: Record<HollandCode, number> = {
          [HollandCode.R]: 50,
          [HollandCode.I]: 50,
          [HollandCode.A]: 50,
          [HollandCode.S]: 50,
          [HollandCode.E]: 50,
          [HollandCode.C]: 50
        };
        
        if (latestResult.scores) {
          Object.entries(latestResult.scores).forEach(([key, value]) => {
            // 转换key确保它使用HollandCode枚举值
            const hollandKey = Object.values(HollandCode).find(code => 
              code === key || code.toString() === key);
            
            if (hollandKey) {
              scores[hollandKey] = value as number;
            }
          });
        }
        
        // 设置最新结果
        setHollandResults({
          primaryCode: latestResult.primaryCode || HollandCode.I,
          secondaryCode: latestResult.secondaryCode || HollandCode.S,
          scores: scores
        });
        
        // 生成职业推荐和专业推荐
        setRecommendedCareers(generateRecommendedCareers(
          latestResult.primaryCode || HollandCode.I, 
          latestResult.secondaryCode || HollandCode.S
        ));
        setRecommendedMajors(generateRecommendedMajors(
          latestResult.primaryCode || HollandCode.I, 
          latestResult.secondaryCode || HollandCode.S
        ));
      } catch (error) {
        console.error("Error loading test results:", error);
        // 使用默认值
        setHollandResults(mockHollandResults);
        setRecommendedCareers(mockRecommendedCareers);
        setRecommendedMajors(mockRecommendedMajors);
      }
    }
    
    setLoading(false);
  }, []);

  // 渲染霍兰德代码描述卡片
  const renderHollandCodeCard = (code: HollandCode, score: number) => {
    const codeInfo = codeDescriptions[code];
    const isHighScore = score > 70;
    
    return (
      <StyledCard 
        title={
          <Space>
            <Text strong>{codeInfo.title}</Text>
            <Text type="secondary">({code})</Text>
          </Space>
        }
        extra={<Tag color={isHighScore ? "blue" : "default"}>{score}分</Tag>}
        style={{ marginBottom: 16 }}
      >
        <Paragraph>{codeInfo.description}</Paragraph>
        <div>
          <Text strong>特质：</Text>
          {codeInfo.traits.map((trait, index) => (
            <Tag key={index} color="blue">{trait}</Tag>
          ))}
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div>
          <Text strong>适合职业：</Text>
          {codeInfo.suitableCareers.map((career, index) => (
            <Tag key={index} color="green">{career}</Tag>
          ))}
        </div>
      </StyledCard>
    );
  };
  
  // 渲染测试重新开始按钮
  const renderTestActionButton = () => {
    if (testCompleted) {
      return (
        <Button 
          type="primary" 
          onClick={() => setTestModalVisible(true)}
          icon={<FileSearchOutlined />}
        >
          重新测试
        </Button>
      );
    }
    
    return (
      <Button 
        type="primary" 
        onClick={() => setTestModalVisible(true)}
        icon={<FileTextOutlined />}
      >
        开始测试
      </Button>
    );
  };
  
  // 渲染霍兰德代码得分
  const renderHollandScores = () => {
    return (
      <Row gutter={[16, 16]}>
        {Object.entries(hollandResults.scores).map(([code, score]) => {
          // 确保code是有效的HollandCode
          const hollandCode = code as HollandCode;
          // 添加判断确保codeDescriptions中有对应的项
          if (!codeDescriptions[hollandCode]) {
            console.error(`No description found for code: ${code}`);
            return null;
          }
          return (
            <Col xs={24} sm={12} md={8} key={code}>
              <ProgressCard>
                <Text strong style={{ fontSize: 16 }}>{codeDescriptions[hollandCode].title}</Text>
                <Progress
                  type="dashboard"
                  percent={score}
                  format={(percent) => `${percent}%`}
                  strokeColor={code === hollandResults.primaryCode ? "#1890ff" : 
                                code === hollandResults.secondaryCode ? "#52c41a" : "#bfbfbf"}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">{code === hollandResults.primaryCode ? '主导类型' : 
                                          code === hollandResults.secondaryCode ? '次导类型' : '其他类型'}</Text>
                </div>
              </ProgressCard>
            </Col>
          );
        })}
      </Row>
    );
  };
  
  // 渲染专业推荐
  const renderMajorRecommendations = () => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={recommendedMajors}
        renderItem={item => (
          <List.Item
            actions={[
              <Tooltip title="查看详情">
                <Button type="link" icon={<InfoCircleOutlined />} />
              </Tooltip>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<BookOutlined />} style={{ backgroundColor: '#1890ff' }} />}
              title={
                <Space>
                  <Text strong>{item.name}</Text>
                  <Tag color="blue">匹配度 {item.match}%</Tag>
                </Space>
              }
              description={
                <>
                  <div>{item.description}</div>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">推荐院校：</Text>
                    {item.schools.map((school, index) => (
                      <Tag key={index} color="purple">{school}</Tag>
                    ))}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };
  
  // 渲染职业推荐
  const renderCareerRecommendations = () => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={recommendedCareers}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" icon={<ArrowRightOutlined />}>查看路径</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<RocketOutlined />} style={{ backgroundColor: '#52c41a' }} />}
              title={
                <Space>
                  <Text strong>{item.name}</Text>
                  <Tag color="green">匹配度 {item.match}%</Tag>
                </Space>
              }
              description={
                <>
                  <Row>
                    <Col span={12}>
                      <Text type="secondary">薪资范围：</Text>
                      <Text>{item.salary}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">就业前景：</Text>
                      <Text>{item.outlook}</Text>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">所需技能：</Text>
                    {item.skills.map((skill, index) => (
                      <Tag key={index} color="orange">{skill}</Tag>
                    ))}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };
  
  // 渲染职业路径
  const renderCareerPath = () => {
    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <Text strong>选择一个职业查看发展路径：</Text>
          <Select
            style={{ width: 200, marginLeft: 16 }}
            placeholder="选择职业"
            defaultValue={recommendedCareers.length > 0 ? recommendedCareers[0].name : undefined}
          >
            {recommendedCareers.map((career, index) => (
              <Option key={index} value={career.name}>{career.name}</Option>
            ))}
          </Select>
        </Card>
        
        <Card>
          <Steps 
            direction="vertical"
            current={1}
            items={[
              {
                title: '入门阶段',
                description: (
                  <>
                    <div>初级职位 (0-2年经验)</div>
                    <div>薪资范围: 根据行业而定</div>
                    <div>需要技能: 基础专业知识与技能</div>
                    <div>发展建议: 积累实践经验，掌握基本技能</div>
                  </>
                ),
                icon: <UserOutlined />
              },
              {
                title: '成长阶段',
                description: (
                  <>
                    <div>中级职位 (2-5年经验)</div>
                    <div>薪资范围: 有所提升</div>
                    <div>需要技能: 专业技能深化，项目管理</div>
                    <div>发展建议: 深化专业知识，培养团队协作能力</div>
                  </>
                ),
                icon: <TeamOutlined />
              },
              {
                title: '专业阶段',
                description: (
                  <>
                    <div>高级职位 (5-8年经验)</div>
                    <div>薪资范围: 明显提升</div>
                    <div>需要技能: 领域专精，团队管理</div>
                    <div>发展建议: 专注领域深耕，提升管理能力</div>
                  </>
                ),
                icon: <TrophyOutlined />
              },
              {
                title: '专家阶段',
                description: (
                  <>
                    <div>专家/领导职位 (8年以上经验)</div>
                    <div>薪资范围: 行业高水平</div>
                    <div>需要技能: 战略思维，领导力</div>
                    <div>发展建议: 参与行业交流，持续学习创新</div>
                  </>
                ),
                icon: <StarOutlined />
              },
            ]}
          />
        </Card>
      </div>
    );
  };
  
  // 渲染技能评估结果
  const renderSkillAssessment = () => {
    const skills = [
      { name: '沟通能力', score: 85 },
      { name: '团队协作', score: 90 },
      { name: '问题解决', score: 92 },
      { name: '创新思维', score: 78 },
      { name: '领导力', score: 72 },
      { name: '时间管理', score: 80 },
      { name: '适应能力', score: 88 },
      { name: '抗压能力', score: 83 },
    ];
    
    return (
      <Row gutter={[16, 16]}>
        {skills.map((skill, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <StatCard>
              <Statistic
                title={skill.name}
                value={skill.score}
                suffix="/100"
                valueStyle={{ color: skill.score > 85 ? '#3f8600' : skill.score > 70 ? '#1890ff' : '#cf1322' }}
              />
              <Progress 
                percent={skill.score} 
                strokeColor={skill.score > 85 ? '#3f8600' : skill.score > 70 ? '#1890ff' : '#cf1322'} 
                size="small"
                showInfo={false}
              />
            </StatCard>
          </Col>
        ))}
      </Row>
    );
  };
  
  // 模拟进行中的测试
  const renderTestModal = () => {
    return (
      <Modal
        title="霍兰德职业兴趣测试"
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={null}
        width={700}
      >
        <HollandTest 
          onComplete={(results) => {
            setHollandResults(results);
            setTestCompleted(true);
            setTestModalVisible(false);
          }}
        />
      </Modal>
    );
  };
  
  // 模拟技能评估表单
  const renderSkillModal = () => {
    return (
      <Modal
        title="职业技能自评"
        open={skillModalVisible}
        onCancel={() => setSkillModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical">
          <Paragraph>
            请对自己的各项职业技能进行客观评价，这将帮助我们更准确地推荐适合你的职业和发展路径。
          </Paragraph>
          
          <Form.Item label="沟通表达能力">
            <Rate allowHalf defaultValue={4} />
          </Form.Item>
          
          <Form.Item label="团队协作能力">
            <Rate allowHalf defaultValue={4.5} />
          </Form.Item>
          
          <Form.Item label="问题分析与解决能力">
            <Rate allowHalf defaultValue={4.5} />
          </Form.Item>
          
          <Form.Item label="创新思维能力">
            <Rate allowHalf defaultValue={3.5} />
          </Form.Item>
          
          <Form.Item label="领导能力">
            <Rate allowHalf defaultValue={3.5} />
          </Form.Item>
          
          <Form.Item label="时间管理能力">
            <Rate allowHalf defaultValue={4} />
          </Form.Item>
          
          <Form.Item label="适应变化能力">
            <Rate allowHalf defaultValue={4.5} />
          </Form.Item>
          
          <Form.Item label="抗压能力">
            <Rate allowHalf defaultValue={4} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" onClick={() => setSkillModalVisible(false)}>
              提交评估
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  
  // 模拟职业档案表单
  const renderPortfolioModal = () => {
    return (
      <Modal
        title="创建职业档案"
        open={portfolioModalVisible}
        onCancel={() => setPortfolioModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical">
          <Paragraph>
            创建您的职业档案，记录个人成就、技能和经历，帮助您更好地规划未来职业发展。
          </Paragraph>
          
          <Form.Item
            label="职业目标"
            name="careerGoal"
            rules={[{ required: true, message: '请输入您的职业目标' }]}
          >
            <Input.TextArea placeholder="描述您短期和长期的职业目标" rows={3} />
          </Form.Item>
          
          <Form.Item
            label="技能清单"
            name="skills"
            rules={[{ required: true, message: '请输入您的技能' }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="输入您掌握的技能（按回车添加）"
              defaultValue={['编程', '数据分析', '沟通能力']}
            />
          </Form.Item>
          
          <Form.Item
            label="教育经历"
            name="education"
          >
            <Input.TextArea placeholder="描述您的学历和教育背景" rows={3} />
          </Form.Item>
          
          <Form.Item
            label="工作/实习经历"
            name="experience"
          >
            <Input.TextArea placeholder="描述您的工作或实习经历" rows={3} />
          </Form.Item>
          
          <Form.Item
            label="证书/认证"
            name="certifications"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="输入您获得的证书或认证（按回车添加）"
            />
          </Form.Item>
          
          <Form.Item
            label="项目经历"
            name="projects"
          >
            <Input.TextArea placeholder="描述您参与的项目经历" rows={3} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" onClick={() => setPortfolioModalVisible(false)}>
              保存档案
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  
  // 查看测试结果详情
  const viewTestResult = (resultId: string) => {
    navigate(`/career/result/${resultId}`, { replace: false });
  };
  
  // 渲染最近的霍兰德测试结果
  const renderRecentHollandResult = () => {
    if (hollandHistory.length === 0) {
      return (
        <Empty description="暂无测试记录" />
      );
    }
    
    const latestResult = hollandHistory[hollandHistory.length - 1];
    
    return (
      <HistoryCard>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Statistic 
              title="测试日期" 
              value={latestResult.date} 
              valueStyle={{ fontSize: '16px' }}
            />
          </Col>
          <Col xs={24} md={16}>
            <Space direction="vertical">
              <Text strong>职业兴趣类型</Text>
              <Space wrap>
                <TypeTag 
                  color={typeColorMap[latestResult.primaryCode].color}
                  icon={typeColorMap[latestResult.primaryCode].icon}
                >
                  {typeColorMap[latestResult.primaryCode].name} (主要)
                </TypeTag>
                <TypeTag 
                  color={typeColorMap[latestResult.secondaryCode].color}
                  icon={typeColorMap[latestResult.secondaryCode].icon}
                >
                  {typeColorMap[latestResult.secondaryCode].name} (次要)
                </TypeTag>
                <Tag color="blue">组合类型: {latestResult.combinationCode}</Tag>
              </Space>
            </Space>
          </Col>
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                onClick={() => viewTestResult(latestResult.id)}
                icon={<EyeOutlined />}
              >
                查看详细结果
              </Button>
              <Button 
                onClick={() => navigate('/career/history')}
                icon={<HistoryOutlined />}
              >
                历史记录
              </Button>
            </Space>
          </Col>
        </Row>
      </HistoryCard>
    );
  };
  
  // 渲染职业规划流程
  const renderCareerPlanningProcess = () => {
    return (
      <Timeline>
        <Timeline.Item color="green">
          <Title level={5}>自我认知</Title>
          <Paragraph>
            通过霍兰德职业兴趣测试等工具，了解自己的职业兴趣、价值观和能力特点。
          </Paragraph>
        </Timeline.Item>
        <Timeline.Item color="blue">
          <Title level={5}>职业探索</Title>
          <Paragraph>
            根据测试结果，探索符合自己兴趣和能力的职业领域，了解职业要求和发展前景。
          </Paragraph>
        </Timeline.Item>
        <Timeline.Item color="purple">
          <Title level={5}>设定目标</Title>
          <Paragraph>
            制定清晰、具体、可衡量的职业目标，包括短期、中期和长期目标。
          </Paragraph>
        </Timeline.Item>
        <Timeline.Item color="red">
          <Title level={5}>行动计划</Title>
          <Paragraph>
            制定实现目标的具体行动计划，包括学习路径、能力提升、实践经验积累等。
          </Paragraph>
        </Timeline.Item>
        <Timeline.Item color="orange">
          <Title level={5}>评估调整</Title>
          <Paragraph>
            定期评估计划执行情况，根据实际情况和反馈调整职业规划和行动计划。
          </Paragraph>
        </Timeline.Item>
      </Timeline>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Container>
      <HeaderCard>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <BannerTitle level={3}>职业规划中心</BannerTitle>
            <BannerText>
              发现你的职业兴趣，评估能力特长，探索专业选择，规划未来发展路径
            </BannerText>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space>
              {renderTestActionButton()}
              <Button 
                onClick={() => setSkillModalVisible(true)}
                icon={<BarChartOutlined />}
              >
                技能评估
              </Button>
              <Button 
                onClick={() => setPortfolioModalVisible(true)}
                icon={<ProfileOutlined />}
              >
                职业档案
              </Button>
            </Space>
          </Col>
        </Row>
      </HeaderCard>
      
      {!testCompleted ? (
        <StyledCard>
          <Empty 
            description="你还没有完成职业兴趣测试" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button 
              type="primary" 
              onClick={() => setTestModalVisible(true)}
              icon={<FileTextOutlined />}
            >
              开始测试
            </Button>
          </Empty>
        </StyledCard>
      ) : (
        <Tabs 
          defaultActiveKey="overview" 
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          <TabPane 
            tab={<span><CompassOutlined />总体分析</span>} 
            key="overview"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <StyledCard title="霍兰德兴趣测试结果">
                  <Paragraph>
                    霍兰德职业兴趣理论将人的职业兴趣分为六种类型：实用型(R)、研究型(I)、艺术型(A)、社会型(S)、企业型(E)和常规型(C)。
                    您的测试结果显示您的主导类型是<Text strong> {codeDescriptions[hollandResults.primaryCode].title} </Text>，
                    次导类型是<Text strong> {codeDescriptions[hollandResults.secondaryCode].title}</Text>。
                  </Paragraph>
                  
                  {renderHollandScores()}
                </StyledCard>
              </Col>
              
              <Col xs={24} lg={12}>
                {renderHollandCodeCard(hollandResults.primaryCode, hollandResults.scores[hollandResults.primaryCode])}
              </Col>
              
              <Col xs={24} lg={12}>
                {renderHollandCodeCard(hollandResults.secondaryCode, hollandResults.scores[hollandResults.secondaryCode])}
              </Col>
              
              <Col xs={24}>
                <StyledCard 
                  title="适合您的职业方向" 
                  extra={<Button type="link" onClick={() => setActiveTab('careers')}>查看详情</Button>}
                >
                  <Row gutter={[16, 16]}>
                    {recommendedCareers.slice(0, 3).map((career, index) => (
                      <Col xs={24} sm={8} key={index}>
                        <ActionCard
                          onClick={() => setActiveTab('careers')}
                        >
                          <Statistic 
                            title={career.name}
                            value={career.match}
                            suffix="%"
                            valueStyle={{ color: '#1890ff' }}
                          />
                          <Text type="secondary">匹配度</Text>
                          <TagContainer>
                            {career.skills.slice(0, 2).map((skill, i) => (
                              <Tag key={i} color="blue">{skill}</Tag>
                            ))}
                          </TagContainer>
                        </ActionCard>
                      </Col>
                    ))}
                  </Row>
                </StyledCard>
              </Col>
              
              <Col xs={24}>
                <StyledCard 
                  title="推荐专业" 
                  extra={<Button type="link" onClick={() => setActiveTab('majors')}>查看详情</Button>}
                >
                  <Row gutter={[16, 16]}>
                    {recommendedMajors.slice(0, 3).map((major, index) => (
                      <Col xs={24} sm={8} key={index}>
                        <ActionCard
                          onClick={() => setActiveTab('majors')}
                        >
                          <Statistic 
                            title={major.name}
                            value={major.match}
                            suffix="%"
                            valueStyle={{ color: '#52c41a' }}
                          />
                          <Text type="secondary">匹配度</Text>
                          <TagContainer>
                            {major.schools.slice(0, 2).map((school, i) => (
                              <Tag key={i} color="purple">{school}</Tag>
                            ))}
                          </TagContainer>
                        </ActionCard>
                      </Col>
                    ))}
                  </Row>
                </StyledCard>
              </Col>
              
              <Col xs={24}>
                <StyledCard title="技能评估">
                  {renderSkillAssessment()}
                </StyledCard>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane 
            tab={<span><BulbOutlined />霍兰德测试</span>} 
            key="holland"
          >
            <StyledCard>
              <CareerMatch hollandResults={hollandResults} />
            </StyledCard>
          </TabPane>
          
          <TabPane 
            tab={<span><BankOutlined />专业推荐</span>} 
            key="majors"
          >
            <StyledCard title="适合您的专业">
              {renderMajorRecommendations()}
            </StyledCard>
          </TabPane>
          
          <TabPane 
            tab={<span><RocketOutlined />职业推荐</span>} 
            key="careers"
          >
            <StyledCard title="适合您的职业">
              {renderCareerRecommendations()}
            </StyledCard>
          </TabPane>
          
          <TabPane 
            tab={<span><ScheduleOutlined />职业路径</span>} 
            key="path"
          >
            <StyledCard title="职业发展路径规划">
              {renderCareerPath()}
            </StyledCard>
          </TabPane>
          
          <TabPane 
            tab={<span><PushpinOutlined />行动计划</span>} 
            key="action"
          >
            <StyledCard title="职业目标实现计划">
              <Steps
                direction="vertical"
                current={1}
                items={[
                  {
                    title: '自我探索',
                    description: '完成职业兴趣测试和能力评估，了解自己的优势和偏好',
                    status: 'finish',
                  },
                  {
                    title: '信息收集',
                    description: '研究感兴趣专业和职业的详细信息，包括学习路径、技能要求和就业市场',
                    status: 'process',
                  },
                  {
                    title: '目标设定',
                    description: '设定短期和长期职业目标，明确发展方向',
                    status: 'wait',
                  },
                  {
                    title: '能力提升',
                    description: '针对目标职业所需的核心能力进行有针对性的培训和学习',
                    status: 'wait',
                  },
                  {
                    title: '经验积累',
                    description: '通过实习、项目和志愿者工作积累相关经验',
                    status: 'wait',
                  },
                  {
                    title: '网络建设',
                    description: '建立专业人际网络，参加行业活动和社区',
                    status: 'wait',
                  },
                  {
                    title: '定期反思',
                    description: '定期评估进展，调整计划以适应变化',
                    status: 'wait',
                  },
                ]}
              />
            </StyledCard>
          </TabPane>
        </Tabs>
      )}
      
      {renderTestModal()}
      {renderSkillModal()}
      {renderPortfolioModal()}
      
      <Divider orientation="left">职业规划流程</Divider>
      {renderCareerPlanningProcess()}
      
      <Divider orientation="left">最近测试结果</Divider>
      {renderRecentHollandResult()}
    </Container>
  );
};

export default CareerPlanning; 