import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  List, 
  Tag, 
  Space, 
  Divider, 
  Tabs, 
  Row, 
  Col,
  Avatar,
  Button,
  Progress,
  Rate,
  Table,
  Tooltip,
  Empty,
  Input,
  Select,
  Collapse
} from 'antd';
import {
  BookOutlined, 
  BulbOutlined,
  ReadOutlined,
  TeamOutlined,
  RiseOutlined,
  DollarOutlined,
  BankOutlined,
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { HollandCode } from '../../../types';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;
const { Option } = Select;

interface School {
  name: string;
  rank: number;
  minScore: number;
  location: string;
  type: string; // 985/211/普通本科等
  features: string[];
}

interface Major {
  id: string;
  name: string;
  category: string; // 学科门类
  field: string; // 专业领域
  description: string;
  hollandCode: string;
  subjects: string[]; // 核心课程
  careerPath: string[]; // A类职业
  match: number; // 匹配度
  requirements: {
    math: number; // 数学要求 1-5
    english: number; // 英语要求 1-5
    physics: number; // 物理要求 1-5
    chemistry: number; // 化学要求 1-5
    biology: number; // 生物要求 1-5
    politics: number; // 政治要求 1-5
    history: number; // 历史要求 1-5
    geography: number; // 地理要求 1-5
  };
  schools: School[];
}

interface MajorInfoProps {
  hollandResults?: {
    primaryCode: HollandCode;
    secondaryCode: HollandCode;
  };
}

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
`;

const FilterContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const MajorItem = styled(List.Item)`
  transition: all 0.3s;
  
  &:hover {
    background: #f0f7ff;
  }
`;

const MajorTag = styled(Tag)`
  margin-right: 8px;
  margin-bottom: 8px;
`;

const RequirementBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const SubjectLabel = styled(Text)`
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: 12px;
`;

// 模拟专业数据
const mockMajors: Major[] = [
  {
    id: "1",
    name: "计算机科学与技术",
    category: "工学",
    field: "计算机类",
    description: "计算机科学与技术专业培养具备计算机硬件、软件与应用基础知识，能在IT领域从事设计、研发等工作的高级专门人才。",
    hollandCode: "IRC",
    subjects: ["高等数学", "离散数学", "数据结构", "计算机组成原理", "操作系统", "编译原理", "计算机网络", "数据库系统"],
    careerPath: ["软件工程师", "系统架构师", "数据分析师", "网络工程师", "IT项目经理"],
    match: 95,
    requirements: {
      math: 5,
      english: 4,
      physics: 3,
      chemistry: 1,
      biology: 1,
      politics: 1,
      history: 1,
      geography: 1
    },
    schools: [
      {
        name: "清华大学",
        rank: 1,
        minScore: 680,
        location: "北京",
        type: "985",
        features: ["拥有一流的计算机学院", "注重理论与实践结合", "与国际接轨的课程体系"]
      },
      {
        name: "北京大学",
        rank: 2,
        minScore: 675,
        location: "北京",
        type: "985",
        features: ["强大的学术研究氛围", "师资力量雄厚", "交叉学科融合"]
      },
      {
        name: "浙江大学",
        rank: 3,
        minScore: 660,
        location: "杭州",
        type: "985",
        features: ["产学研结合紧密", "创新创业氛围浓厚", "就业前景广阔"]
      }
    ]
  },
  {
    id: "2",
    name: "心理学",
    category: "理学",
    field: "心理学类",
    description: "心理学专业主要研究人类的心理现象、精神功能和行为，培养能在教育、医疗、企业等领域从事心理健康教育与咨询、人力资源管理等工作的专门人才。",
    hollandCode: "SAI",
    subjects: ["普通心理学", "发展心理学", "社会心理学", "认知心理学", "心理统计学", "心理测量学", "心理咨询与治疗"],
    careerPath: ["心理咨询师", "心理治疗师", "人力资源专员", "教育工作者", "社会工作者"],
    match: 90,
    requirements: {
      math: 3,
      english: 4,
      physics: 1,
      chemistry: 1,
      biology: 3,
      politics: 3,
      history: 3,
      geography: 1
    },
    schools: [
      {
        name: "北京师范大学",
        rank: 1,
        minScore: 650,
        location: "北京",
        type: "985",
        features: ["国内心理学研究重镇", "师资力量雄厚", "临床与实验并重"]
      },
      {
        name: "华东师范大学",
        rank: 2,
        minScore: 635,
        location: "上海",
        type: "985",
        features: ["应用研究见长", "注重学生实践能力培养", "国际交流机会多"]
      },
      {
        name: "中国人民大学",
        rank: 3,
        minScore: 640,
        location: "北京",
        type: "985",
        features: ["社会与应用心理学优势明显", "就业前景广阔", "研究资源丰富"]
      }
    ]
  },
  {
    id: "3",
    name: "数据科学与大数据技术",
    category: "理学",
    field: "数学类",
    description: "数据科学与大数据技术专业培养具备数学、统计学和计算机科学交叉知识，能够从事大数据处理、分析和挖掘等工作的高级专门人才。",
    hollandCode: "ICE",
    subjects: ["高等数学", "线性代数", "概率论与数理统计", "数据结构", "机器学习", "数据挖掘", "分布式计算"],
    careerPath: ["数据分析师", "数据工程师", "算法工程师", "商业智能分析师", "研究科学家"],
    match: 88,
    requirements: {
      math: 5,
      english: 4,
      physics: 3,
      chemistry: 1,
      biology: 1,
      politics: 1,
      history: 1,
      geography: 1
    },
    schools: [
      {
        name: "北京大学",
        rank: 1,
        minScore: 670,
        location: "北京",
        type: "985",
        features: ["数学与统计学科实力强", "交叉学科优势明显", "就业前景良好"]
      },
      {
        name: "复旦大学",
        rank: 2,
        minScore: 660,
        location: "上海",
        type: "985",
        features: ["数学基础研究深厚", "产学研合作紧密", "创新能力培养"]
      },
      {
        name: "中国人民大学",
        rank: 3,
        minScore: 655,
        location: "北京",
        type: "985",
        features: ["统计学科国内领先", "大数据分析优势", "应用型人才培养"]
      }
    ]
  },
  {
    id: "4",
    name: "软件工程",
    category: "工学",
    field: "计算机类",
    description: "软件工程专业培养能够从事软件开发、测试、维护和管理的高级工程技术人才，注重软件工程方法和实践能力的培养。",
    hollandCode: "IRE",
    subjects: ["程序设计基础", "数据结构", "软件工程", "需求分析", "软件测试", "项目管理", "软件架构"],
    careerPath: ["软件开发工程师", "测试工程师", "项目经理", "产品经理", "软件架构师"],
    match: 85,
    requirements: {
      math: 4,
      english: 4,
      physics: 3,
      chemistry: 1,
      biology: 1,
      politics: 1,
      history: 1,
      geography: 1
    },
    schools: [
      {
        name: "华中科技大学",
        rank: 1,
        minScore: 640,
        location: "武汉",
        type: "985",
        features: ["软件工程学科实力强", "产学研结合紧密", "就业率高"]
      },
      {
        name: "南京大学",
        rank: 2,
        minScore: 650,
        location: "南京",
        type: "985",
        features: ["基础研究扎实", "师资力量雄厚", "国际合作广泛"]
      },
      {
        name: "北京航空航天大学",
        rank: 3,
        minScore: 645,
        location: "北京",
        type: "985",
        features: ["应用研究见长", "实践能力培养", "行业特色明显"]
      }
    ]
  },
  {
    id: "5",
    name: "人工智能",
    category: "工学",
    field: "计算机类",
    description: "人工智能专业培养掌握计算机科学、数学与认知科学等多学科知识，能够从事智能系统开发与应用的高级技术人才。",
    hollandCode: "IRE",
    subjects: ["高等数学", "人工智能导论", "机器学习", "深度学习", "自然语言处理", "计算机视觉", "知识表示与推理"],
    careerPath: ["AI算法工程师", "机器学习工程师", "自然语言处理工程师", "计算机视觉工程师", "智能系统架构师"],
    match: 82,
    requirements: {
      math: 5,
      english: 4,
      physics: 3,
      chemistry: 1,
      biology: 2,
      politics: 1,
      history: 1,
      geography: 1
    },
    schools: [
      {
        name: "清华大学",
        rank: 1,
        minScore: 685,
        location: "北京",
        type: "985",
        features: ["人工智能学科领先", "科研实力强", "产业联系紧密"]
      },
      {
        name: "上海交通大学",
        rank: 2,
        minScore: 670,
        location: "上海",
        type: "985",
        features: ["基础研究扎实", "国际合作广泛", "就业前景广阔"]
      },
      {
        name: "中国科学技术大学",
        rank: 3,
        minScore: 665,
        location: "合肥",
        type: "985",
        features: ["科研氛围浓厚", "数学基础强", "拔尖创新人才培养"]
      }
    ]
  }
];

const MajorInfo: React.FC<MajorInfoProps> = ({ hollandResults }) => {
  const [majors, setMajors] = useState<Major[]>(mockMajors);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>(mockMajors);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  
  // 获取所有学科门类
  const categories = Array.from(new Set(majors.map(m => m.category)));
  
  // 获取所有专业领域
  const fields = Array.from(new Set(majors.map(m => m.field)));
  
  // 过滤专业
  useEffect(() => {
    setLoading(true);
    
    let filtered = [...majors];
    
    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(major => 
        major.name.toLowerCase().includes(searchText.toLowerCase()) ||
        major.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 学科门类过滤
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(major => major.category === categoryFilter);
    }
    
    // 专业领域过滤
    if (fieldFilter !== 'all') {
      filtered = filtered.filter(major => major.field === fieldFilter);
    }
    
    // 排序：按匹配度降序
    filtered.sort((a, b) => b.match - a.match);
    
    setTimeout(() => {
      setFilteredMajors(filtered);
      setLoading(false);
    }, 300);
  }, [searchText, categoryFilter, fieldFilter]);
  
  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  
  // 查看专业详情
  const viewMajorDetail = (major: Major) => {
    setSelectedMajor(major);
  };
  
  // 关闭专业详情
  const closeMajorDetail = () => {
    setSelectedMajor(null);
  };
  
  // 渲染专业列表
  const renderMajorList = () => {
    return (
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={filteredMajors}
        renderItem={major => (
          <MajorItem
            actions={[
              <Button 
                type="link" 
                onClick={() => viewMajorDetail(major)}
                icon={<InfoCircleOutlined />}
              >
                查看详情
              </Button>
            ]}
            extra={
              <Space direction="vertical" align="end">
                <Tag color="blue" style={{ fontSize: 16, padding: '4px 8px' }}>
                  匹配度: {major.match}%
                </Tag>
                <Space style={{ marginTop: 8 }}>
                  {major.hollandCode.split('').map((code, index) => (
                    <Tag 
                      key={index} 
                      color={hollandResults && (code === hollandResults.primaryCode || code === hollandResults.secondaryCode) ? "green" : "default"}
                    >
                      {code}
                    </Tag>
                  ))}
                </Space>
              </Space>
            }
          >
            <List.Item.Meta
              avatar={<Avatar size={48} icon={<BookOutlined />} style={{ backgroundColor: '#1890ff' }} />}
              title={<Text strong style={{ fontSize: 18 }}>{major.name}</Text>}
              description={
                <Space direction="vertical">
                  <Space>
                    <Text type="secondary">学科门类:</Text>
                    <Tag color="purple">{major.category}</Tag>
                    <Text type="secondary">专业领域:</Text>
                    <Tag color="cyan">{major.field}</Tag>
                  </Space>
                  <Paragraph ellipsis={{ rows: 2 }}>{major.description}</Paragraph>
                </Space>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">核心课程:</Text>
              <div>
                {major.subjects.slice(0, 4).map((subject, index) => (
                  <MajorTag key={index} color="blue">{subject}</MajorTag>
                ))}
                {major.subjects.length > 4 && <MajorTag>...</MajorTag>}
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">就业方向:</Text>
              <div>
                {major.careerPath.slice(0, 3).map((career, index) => (
                  <MajorTag key={index} color="green">{career}</MajorTag>
                ))}
                {major.careerPath.length > 3 && <MajorTag>...</MajorTag>}
              </div>
            </div>
          </MajorItem>
        )}
      />
    );
  };
  
  // 渲染专业详情
  const renderMajorDetail = () => {
    if (!selectedMajor) return null;
    
    const subjectColumns = [
      {
        title: '课程名称',
        dataIndex: 'name',
        key: 'name',
      },
    ];
    
    const subjectData = selectedMajor.subjects.map((subject, index) => ({
      key: index,
      name: subject,
    }));
    
    const schoolColumns = [
      {
        title: '学校名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
        sorter: (a: School, b: School) => a.rank - b.rank,
      },
      {
        title: '所在地',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '最低分/位次',
        dataIndex: 'minScore',
        key: 'minScore',
        sorter: (a: School, b: School) => a.minScore - b.minScore,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text: string) => <Tag color={text === '985' ? 'red' : text === '211' ? 'orange' : 'default'}>{text}</Tag>
      },
    ];
    
    return (
      <StyledCard
        title={
          <Space>
            <BookOutlined />
            <Text strong>{selectedMajor.name}</Text>
            <Tag color="blue">匹配度: {selectedMajor.match}%</Tag>
          </Space>
        }
        extra={<Button onClick={closeMajorDetail}>返回列表</Button>}
      >
        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={<span><BulbOutlined />专业概况</span>}
            key="1"
          >
            <Paragraph>{selectedMajor.description}</Paragraph>
            
            <Divider orientation="left">学科信息</Divider>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>学科门类：</Text>
                <Tag color="purple">{selectedMajor.category}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>专业领域：</Text>
                <Tag color="cyan">{selectedMajor.field}</Tag>
              </Col>
            </Row>
            
            <Divider orientation="left">霍兰德类型</Divider>
            <Space>
              {selectedMajor.hollandCode.split('').map((code, index) => (
                <Tag 
                  key={index} 
                  color={hollandResults && (code === hollandResults.primaryCode || code === hollandResults.secondaryCode) ? "green" : "default"}
                  style={{ padding: '4px 12px', fontSize: 16 }}
                >
                  {code}
                </Tag>
              ))}
            </Space>
            
            <Divider orientation="left">学科要求</Divider>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <RequirementBar>
                  <SubjectLabel>数学：</SubjectLabel>
                  <Rate disabled defaultValue={selectedMajor.requirements.math} />
                </RequirementBar>
                <RequirementBar>
                  <SubjectLabel>英语：</SubjectLabel>
                  <Rate disabled defaultValue={selectedMajor.requirements.english} />
                </RequirementBar>
                <RequirementBar>
                  <SubjectLabel>物理：</SubjectLabel>
                  <Rate disabled defaultValue={selectedMajor.requirements.physics} />
                </RequirementBar>
                <RequirementBar>
                  <SubjectLabel>化学：</SubjectLabel>
                  <Rate disabled defaultValue={selectedMajor.requirements.chemistry} />
                </RequirementBar>
              </Col>
              <Col span={12}>
                <RequirementBar>
                  <SubjectLabel>生物：</SubjectLabel>
                  <Rate disabled defaultValue={selectedMajor.requirements.biology} />
                </RequirementBar>
                <RequirementBar>
                  <SubjectLabel>政治：</SubjectLabel>
                  <Rate disabled defaultValue={selectedMajor.requirements.politics} />
                </RequirementBar>
                <RequirementBar>
                  <SubjectLabel>历史：</SubjectLabel>
                  <Rate disabled defaultValue={selectedMajor.requirements.history} />
                </RequirementBar>
                <RequirementBar>
                  <SubjectLabel>地理：</SubjectLabel>
                  <Rate disabled defaultValue={selectedMajor.requirements.geography} />
                </RequirementBar>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane 
            tab={<span><ReadOutlined />核心课程</span>}
            key="2"
          >
            <Table columns={subjectColumns} dataSource={subjectData} pagination={false} />
          </TabPane>
          
          <TabPane 
            tab={<span><TeamOutlined />就业方向</span>}
            key="3"
          >
            <List
              itemLayout="horizontal"
              dataSource={selectedMajor.careerPath}
              renderItem={career => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<RiseOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                    title={career}
                    description="点击了解更多职业详情"
                  />
                </List.Item>
              )}
            />
          </TabPane>
          
          <TabPane 
            tab={<span><BankOutlined />开设院校</span>}
            key="4"
          >
            <Table 
              columns={schoolColumns} 
              dataSource={selectedMajor.schools.map((school, index) => ({ ...school, key: index }))} 
              pagination={false} 
              expandable={{
                expandedRowRender: record => (
                  <Space direction="vertical" style={{ margin: 0 }}>
                    <Text strong>院校特点：</Text>
                    <div>
                      {record.features.map((feature, index) => (
                        <Tag key={index} color="blue" style={{ margin: '4px' }}>{feature}</Tag>
                      ))}
                    </div>
                  </Space>
                ),
              }}
            />
          </TabPane>
        </Tabs>
      </StyledCard>
    );
  };

  return (
    <div>
      <Title level={4}>专业选择指南</Title>
      <Paragraph>
        根据您的霍兰德代码和兴趣特点，我们推荐了以下可能适合您的专业。
        您可以根据匹配度、学科类型和个人兴趣进行筛选，点击查看详细信息。
      </Paragraph>
      
      {!selectedMajor ? (
        <>
          <FilterContainer>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Search
                  placeholder="搜索专业名称"
                  allowClear
                  onSearch={handleSearch}
                  enterButton={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space>
                  <Text><FilterOutlined /> 筛选：</Text>
                  <Select
                    style={{ width: 180 }}
                    placeholder="学科门类"
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                  >
                    <Option value="all">全部学科门类</Option>
                    {categories.map((category, index) => (
                      <Option key={index} value={category}>{category}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: 180 }}
                    placeholder="专业领域"
                    value={fieldFilter}
                    onChange={setFieldFilter}
                  >
                    <Option value="all">全部专业领域</Option>
                    {fields.map((field, index) => (
                      <Option key={index} value={field}>{field}</Option>
                    ))}
                  </Select>
                </Space>
              </Col>
            </Row>
          </FilterContainer>
          
          {filteredMajors.length > 0 ? (
            renderMajorList()
          ) : (
            <Empty description="没有找到匹配的专业" />
          )}
        </>
      ) : renderMajorDetail()}
    </div>
  );
};

export default MajorInfo; 