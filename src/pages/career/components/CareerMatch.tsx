import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  List, 
  Tag, 
  Space, 
  Button, 
  Divider, 
  Input, 
  Select,
  Radio,
  Empty,
  Tooltip,
  Row,
  Col,
  Badge,
  Avatar
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  RocketOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  HeartFilled,
  AppstoreOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { HollandCode } from '../../../types';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface CareerInfo {
  id: string;
  title: string;
  description: string;
  hollandCode: string; // 主要霍兰德代码组合，如 "ISA"
  education: string; // 所需教育水平
  salary: string; // 薪资范围
  outlook: string; // 就业前景
  skills: string[]; // 所需技能
  tasks: string[]; // 工作内容
  isFavorite?: boolean; // 是否收藏
}

interface CareerMatchProps {
  hollandResults: {
    scores: Record<HollandCode, number>;
    primaryCode: HollandCode;
    secondaryCode: HollandCode;
  };
}

const FilterContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const CardViewItem = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const InfoItem = styled.div`
  margin-bottom: 8px;
`;

const CareerCodeTag = styled(Tag)<{ $isMatch?: boolean }>`
  font-weight: ${props => props.$isMatch ? 'bold' : 'normal'};
  border: ${props => props.$isMatch ? '1px solid #1890ff' : '1px solid #d9d9d9'};
`;

// 模拟职业数据
const mockCareers: CareerInfo[] = [
  {
    id: "1",
    title: "软件工程师",
    description: "设计、开发和测试软件应用程序",
    hollandCode: "IRC",
    education: "本科及以上",
    salary: "12-35万/年",
    outlook: "就业前景良好，需求持续增长",
    skills: ["编程语言", "算法设计", "问题解决", "团队协作", "系统思维"],
    tasks: ["编写和测试代码", "设计软件架构", "调试和解决问题", "参与技术评审", "编写技术文档"],
    isFavorite: false
  },
  {
    id: "2",
    title: "数据科学家",
    description: "分析和解释复杂数据，挖掘数据价值",
    hollandCode: "IEC",
    education: "硕士及以上",
    salary: "15-40万/年",
    outlook: "需求增长迅速，前景广阔",
    skills: ["统计分析", "机器学习", "数据挖掘", "编程", "数据可视化"],
    tasks: ["收集和处理数据", "构建预测模型", "分析数据趋势", "提供数据洞察", "报告研究结果"],
    isFavorite: false
  },
  {
    id: "3",
    title: "心理咨询师",
    description: "提供心理咨询和治疗服务，帮助他人解决心理问题",
    hollandCode: "SAI",
    education: "硕士及以上",
    salary: "8-25万/年",
    outlook: "社会需求日益增长",
    skills: ["倾听能力", "同理心", "心理学知识", "沟通技巧", "问题解决"],
    tasks: ["进行心理评估", "提供咨询服务", "制定干预计划", "跟踪客户进展", "保持专业记录"],
    isFavorite: true
  },
  {
    id: "4",
    title: "教师",
    description: "教授知识，培养学生的技能和能力",
    hollandCode: "SAE",
    education: "本科及以上",
    salary: "7-20万/年",
    outlook: "就业稳定，需求持续",
    skills: ["教学技能", "沟通能力", "组织能力", "耐心", "创造力"],
    tasks: ["准备和讲授课程", "评估学生表现", "提供指导和反馈", "参与学校活动", "专业发展和学习"],
    isFavorite: false
  },
  {
    id: "5",
    title: "生物学研究员",
    description: "研究生物学现象，进行实验和分析",
    hollandCode: "IRE",
    education: "博士",
    salary: "10-30万/年",
    outlook: "研究领域需求稳定",
    skills: ["实验设计", "数据分析", "科学写作", "批判性思维", "问题解决"],
    tasks: ["设计和执行实验", "收集和分析数据", "撰写研究论文", "申请研究经费", "参与学术交流"],
    isFavorite: false
  },
  {
    id: "6",
    title: "市场营销经理",
    description: "规划和实施营销策略，提升品牌认知度和销售额",
    hollandCode: "ESA",
    education: "本科及以上",
    salary: "12-35万/年",
    outlook: "就业机会广泛",
    skills: ["市场分析", "战略规划", "沟通能力", "创意思维", "项目管理"],
    tasks: ["开发营销策略", "管理营销活动", "分析市场趋势", "监督营销预算", "评估营销效果"],
    isFavorite: false
  },
  {
    id: "7",
    title: "室内设计师",
    description: "设计功能性和美观的室内空间",
    hollandCode: "AER",
    education: "本科及以上",
    salary: "8-25万/年",
    outlook: "需求稳定，发展空间大",
    skills: ["创意设计", "空间规划", "色彩理论", "CAD软件", "沟通表达"],
    tasks: ["与客户沟通需求", "创建设计方案", "选择材料和家具", "监督施工过程", "呈现最终设计"],
    isFavorite: false
  },
  {
    id: "8",
    title: "人力资源专员",
    description: "管理组织的人力资源，包括招聘、培训和发展",
    hollandCode: "SEC",
    education: "本科及以上",
    salary: "7-20万/年",
    outlook: "就业机会广泛且稳定",
    skills: ["人际交往", "沟通能力", "组织能力", "问题解决", "判断力"],
    tasks: ["招聘和筛选人才", "组织培训活动", "管理员工关系", "参与制定人力资源政策", "处理薪酬福利事务"],
    isFavorite: false
  },
  {
    id: "9",
    title: "金融分析师",
    description: "分析财务数据，提供投资建议和财务规划",
    hollandCode: "CIE",
    education: "本科及以上",
    salary: "12-35万/年",
    outlook: "就业前景良好",
    skills: ["财务分析", "数据解读", "金融市场知识", "风险评估", "决策能力"],
    tasks: ["分析财务报表", "评估投资机会", "撰写财务报告", "监控市场趋势", "提供财务建议"],
    isFavorite: false
  },
  {
    id: "10",
    title: "机械工程师",
    description: "设计、开发和测试机械系统和设备",
    hollandCode: "RIC",
    education: "本科及以上",
    salary: "10-30万/年",
    outlook: "就业需求稳定",
    skills: ["机械设计", "CAD软件", "问题解决", "技术知识", "分析能力"],
    tasks: ["设计机械系统", "分析机械性能", "测试原型", "解决技术问题", "编写技术文档"],
    isFavorite: false
  },
  {
    id: "11",
    title: "电气工程师",
    description: "设计、开发和测试电气设备和系统",
    hollandCode: "RIC",
    education: "本科及以上",
    salary: "10-30万/年",
    outlook: "就业需求强劲",
    skills: ["电路设计", "电气系统知识", "问题解决", "CAD软件", "项目管理"],
    tasks: ["设计电气系统", "测试和验证设计", "解决技术问题", "编写技术文档", "监督系统安装"],
    isFavorite: true
  },
  {
    id: "12",
    title: "图形设计师",
    description: "创建视觉概念，通过设计传达信息",
    hollandCode: "AER",
    education: "本科及以上",
    salary: "8-25万/年",
    outlook: "市场需求稳定",
    skills: ["创意设计", "设计软件", "色彩理论", "排版", "沟通能力"],
    tasks: ["创建视觉设计", "与客户协商需求", "选择字体和颜色", "制作品牌材料", "优化用户体验"],
    isFavorite: false
  },
];

const CareerMatch: React.FC<CareerMatchProps> = ({ hollandResults }) => {
  const [careers, setCareers] = useState<CareerInfo[]>(mockCareers);
  const [, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [educationFilter, setEducationFilter] = useState<string>('all');
  const [outlookFilter, setOutlookFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
  // 计算职业与用户的匹配度
  const calculateMatchScore = (careerCode: string): number => {
    const codeArray = careerCode.split('');
    // 如果职业的主要霍兰德代码包含用户的主要代码
    if (codeArray[0] === hollandResults.primaryCode) {
      return 90 + Math.floor(Math.random() * 10); // 90-99 分
    }
    // 如果职业的霍兰德代码包含用户的主要代码
    else if (codeArray.includes(hollandResults.primaryCode)) {
      return 80 + Math.floor(Math.random() * 10); // 80-89 分
    }
    // 如果职业的霍兰德代码包含用户的次要代码
    else if (codeArray.includes(hollandResults.secondaryCode)) {
      return 70 + Math.floor(Math.random() * 10); // 70-79 分
    }
    // 否则
    return 60 + Math.floor(Math.random() * 10); // 60-69 分
  };
  
  // 过滤职业
  const filterCareers = () => {
    setLoading(true);
    
    // 模拟网络请求
    setTimeout(() => {
      let filtered = [...mockCareers];
      
      // 搜索过滤
      if (searchText) {
        filtered = filtered.filter(career => 
          career.title.toLowerCase().includes(searchText.toLowerCase()) ||
          career.description.toLowerCase().includes(searchText.toLowerCase()) ||
          career.skills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase()))
        );
      }
      
      // 教育水平过滤
      if (educationFilter !== 'all') {
        filtered = filtered.filter(career => career.education.includes(educationFilter));
      }
      
      // 就业前景过滤
      if (outlookFilter !== 'all') {
        filtered = filtered.filter(career => 
          career.outlook.toLowerCase().includes(outlookFilter.toLowerCase())
        );
      }
      
      setCareers(filtered);
      setLoading(false);
    }, 500);
  };
  
  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  
  // 处理收藏
  const handleToggleFavorite = (careerId: string) => {
    setCareers(prev => 
      prev.map(career => 
        career.id === careerId 
          ? { ...career, isFavorite: !career.isFavorite } 
          : career
      )
    );
  };
  
  // 处理过滤条件变化
  useEffect(() => {
    filterCareers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, educationFilter, outlookFilter]);
  
  // 渲染卡片视图
  const renderCardView = () => {
    return (
      <Row gutter={[16, 16]}>
        {careers.map(career => {
          const matchScore = calculateMatchScore(career.hollandCode);
          
          return (
            <Col xs={24} sm={12} md={8} key={career.id}>
              <Badge.Ribbon 
                text={`匹配度 ${matchScore}%`} 
                color={matchScore >= 90 ? 'blue' : matchScore >= 80 ? 'green' : matchScore >= 70 ? 'orange' : 'volcano'}
              >
                <CardViewItem
                  actions={[
                    <Tooltip title="查看详情">
                      <InfoCircleOutlined key="info" />
                    </Tooltip>,
                    <Tooltip title={career.isFavorite ? "取消收藏" : "收藏"}>
                      {career.isFavorite ? 
                        <HeartFilled key="favorite" onClick={() => handleToggleFavorite(career.id)} style={{ color: '#ff4d4f' }} /> : 
                        <HeartOutlined key="favorite" onClick={() => handleToggleFavorite(career.id)} />
                      }
                    </Tooltip>
                  ]}
                >
                  <CardViewItem.Meta
                    avatar={<Avatar icon={<RocketOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                    title={career.title}
                    description={career.description}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <InfoItem>
                    <Text type="secondary">霍兰德代码：</Text>
                    {career.hollandCode.split('').map((code, index) => (
                      <CareerCodeTag 
                        key={index} 
                        color={code === hollandResults.primaryCode || code === hollandResults.secondaryCode ? "blue" : "default"}
                        $isMatch={code === hollandResults.primaryCode || code === hollandResults.secondaryCode}
                      >
                        {code}
                      </CareerCodeTag>
                    ))}
                  </InfoItem>
                  <InfoItem>
                    <Text type="secondary">教育要求：</Text>
                    <Text>{career.education}</Text>
                  </InfoItem>
                  <InfoItem>
                    <Text type="secondary">薪资范围：</Text>
                    <Text>{career.salary}</Text>
                  </InfoItem>
                  <InfoItem>
                    <Text type="secondary">技能要求：</Text>
                    <div>
                      {career.skills.slice(0, 3).map((skill, index) => (
                        <Tag key={index} color="blue">{skill}</Tag>
                      ))}
                      {career.skills.length > 3 && <Tag>...</Tag>}
                    </div>
                  </InfoItem>
                </CardViewItem>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>
    );
  };
  
  // 渲染列表视图
  const renderListView = () => {
    return (
      <List
        itemLayout="vertical"
        dataSource={careers}
        renderItem={career => {
          const matchScore = calculateMatchScore(career.hollandCode);
          
          return (
            <List.Item
              key={career.id}
              actions={[
                <Space key="code">
                  <Text type="secondary">霍兰德代码：</Text>
                  {career.hollandCode.split('').map((code, index) => (
                    <CareerCodeTag 
                      key={index} 
                      color={code === hollandResults.primaryCode || code === hollandResults.secondaryCode ? "blue" : "default"}
                      $isMatch={code === hollandResults.primaryCode || code === hollandResults.secondaryCode}
                    >
                      {code}
                    </CareerCodeTag>
                  ))}
                </Space>,
                <Space key="education">
                  <Text type="secondary">教育要求：</Text>
                  <Text>{career.education}</Text>
                </Space>,
                <Space key="salary">
                  <Text type="secondary">薪资范围：</Text>
                  <Text>{career.salary}</Text>
                </Space>
              ]}
              extra={
                <Space>
                  <Tag color={matchScore >= 90 ? 'blue' : matchScore >= 80 ? 'green' : matchScore >= 70 ? 'orange' : 'volcano'}>
                    匹配度 {matchScore}%
                  </Tag>
                  <Button 
                    type="text" 
                    icon={career.isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />} 
                    onClick={() => handleToggleFavorite(career.id)} 
                  />
                </Space>
              }
            >
              <List.Item.Meta
                avatar={<Avatar icon={<RocketOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                title={<Text strong>{career.title}</Text>}
                description={career.description}
              />
              <div>
                <Text type="secondary">技能要求：</Text>
                <div>
                  {career.skills.map((skill, index) => (
                    <Tag key={index} color="blue">{skill}</Tag>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">就业前景：</Text>
                <Text>{career.outlook}</Text>
              </div>
            </List.Item>
          );
        }}
      />
    );
  };

  return (
    <div>
      <Title level={4}>职业匹配分析</Title>
      <Paragraph>
        根据您的霍兰德职业兴趣测试结果 
        (<Text strong>{hollandResults.primaryCode}{hollandResults.secondaryCode}</Text>)，
        以下是与您的兴趣类型匹配的职业推荐。这些职业的工作环境和要求与您的兴趣和能力特点相符。
      </Paragraph>
      
      <FilterContainer>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Search
              placeholder="搜索职业或技能"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} md={16}>
            <Space wrap>
              <Text><FilterOutlined /> 筛选：</Text>
              <Select
                style={{ width: 150 }}
                placeholder="教育要求"
                value={educationFilter}
                onChange={setEducationFilter}
              >
                <Option value="all">全部教育水平</Option>
                <Option value="本科">本科</Option>
                <Option value="硕士">硕士</Option>
                <Option value="博士">博士</Option>
              </Select>
              <Select
                style={{ width: 150 }}
                placeholder="就业前景"
                value={outlookFilter}
                onChange={setOutlookFilter}
              >
                <Option value="all">全部前景</Option>
                <Option value="良好">良好</Option>
                <Option value="增长">增长</Option>
                <Option value="稳定">稳定</Option>
              </Select>
              <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
                <Radio.Button value="card"><AppstoreOutlined /></Radio.Button>
                <Radio.Button value="list"><UnorderedListOutlined /></Radio.Button>
              </Radio.Group>
            </Space>
          </Col>
        </Row>
      </FilterContainer>
      
      {careers.length > 0 ? (
        viewMode === 'card' ? renderCardView() : renderListView()
      ) : (
        <Empty description="未找到匹配的职业" />
      )}
    </div>
  );
};

export default CareerMatch; 