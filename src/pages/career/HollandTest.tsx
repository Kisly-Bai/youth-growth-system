import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Space, 
  Progress, 
  Divider, 
  Radio, 
  Row, 
  Col, 
  Alert,
  Result,
  Spin,
  Modal,
  Tag,
  List
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircleOutlined, 
  ArrowLeftOutlined, 
  ToolOutlined,
  ExperimentOutlined,
  HeartOutlined,
  TeamOutlined,
  TrophyOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { HollandCode } from '../../types';

const { Title, Text, Paragraph } = Typography;

// 样式组件
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
`;

const ResultContainer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const CodeTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
  margin: 4px;
`;

const CareerList = styled(List<string>)`
  margin-top: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
`;

// 霍兰德测试问题
const questions = [
  { id: 1, content: '我喜欢把一件事情做完后再做另一件事。', key: 'S', answer: false },
  { id: 2, content: '在工作中我喜欢独自筹划，不愿受别人干涉。', key: 'R', answer: true },
  { id: 3, content: '在集体讨论中，我往往保持沉默。', key: 'E', answer: false },
  { id: 4, content: '我喜欢做戏剧、音乐、歌舞、新闻采访等方面的工作。', key: 'A', answer: true },
  { id: 5, content: '每次写信我都一挥而就，不再重复。', key: 'C', answer: false },
  { id: 6, content: '我经常不停地思考某一问题，直到想出正确的答案。', key: 'I', answer: true },
  { id: 7, content: '对别人借我的和我借别人的东西，我都能记得很清楚。', key: 'C', answer: true },
  { id: 8, content: '我喜欢抽象思维的工作，不喜欢动手的工作。', key: 'I', answer: true },
  { id: 9, content: '我喜欢成为人们注意的焦点。', key: 'A', answer: true },
  { id: 10, content: '我喜欢不时地夸耀一下自己取得的好成就。', key: 'A', answer: true },
  { id: 11, content: '我曾经渴望有机会参加探险。', key: 'E', answer: true },
  { id: 12, content: '当我一个独处时，会感到更愉快。', key: 'S', answer: false },
  { id: 13, content: '我喜欢在做事情前，对此事情做出细致的安排。', key: 'R', answer: true },
  { id: 14, content: '我讨厌修理自行车、电器一类的工作。', key: 'R', answer: false },
  { id: 15, content: '我喜欢参加各种各样的聚会。', key: 'S', answer: false },
  { id: 16, content: '我愿意从事虽然工资少、但是比较稳定的职业。', key: 'E', answer: false },
  { id: 17, content: '音乐能使我陶醉。', key: 'A', answer: true },
  { id: 18, content: '我办事很少思前想后。', key: 'C', answer: false },
  { id: 19, content: '我喜欢经常请示上级。', key: 'C', answer: true },
  { id: 20, content: '我喜欢需要运用智力的游戏。', key: 'I', answer: true },
  { id: 21, content: '我很难做那种需要持续集中注意力的工作。', key: 'I', answer: false },
  { id: 22, content: '我喜欢亲自动手制作一些东西，从中得到乐趣。', key: 'R', answer: true },
  { id: 23, content: '我的动手能力很差。', key: 'R', answer: false },
  { id: 24, content: '和不熟悉的人交谈对我来说毫不困难。', key: 'E', answer: true },
  { id: 25, content: '和别人谈判时，我总是很容易放弃自己的观点。', key: 'E', answer: false },
  { id: 26, content: '我很容易结识同性别朋友。', key: 'S', answer: true },
  { id: 27, content: '对于社会问题，我通常持中庸的态度。', key: 'S', answer: false },
  { id: 28, content: '当我开始做一件事情后，即使碰到再多的困难，我也要执著地干下去。', key: 'E', answer: true },
  { id: 29, content: '我是一个沉静而不易动感情的人。', key: 'C', answer: true },
  { id: 30, content: '当我工作时，我喜欢避免干扰。', key: 'I', answer: true }
];

// 将所有问题补充到60题
const fullQuestions = [
  ...questions,
  { id: 31, content: '我的理想是当一名科学家。', key: 'I', answer: true },
  { id: 32, content: '与言情小说相比，我更喜欢推理小说。', key: 'A', answer: false },
  { id: 33, content: '有些人太霸道，有时明明知道他们是对的，也要和他们对着干。', key: 'A', answer: true },
  { id: 34, content: '我爱幻想。', key: 'A', answer: true },
  { id: 35, content: '我总是主动地向别人提出自己的建议。', key: 'E', answer: true },
  { id: 36, content: '我喜欢使用榔头一类的工具。', key: 'R', answer: true },
  { id: 37, content: '我乐于解除别人的痛苦。', key: 'S', answer: true },
  { id: 38, content: '我更喜欢自己下了赌注的比赛或游戏。', key: 'E', answer: true },
  { id: 39, content: '我喜欢按部就班地完成要做的工作。', key: 'C', answer: true },
  { id: 40, content: '我希望能经常换不同的工作来做。', key: 'C', answer: false },
  { id: 41, content: '我总留有充裕的时间去赴约会。', key: 'C', answer: true },
  { id: 42, content: '我喜欢阅读自然科学方面的书籍和杂志。', key: 'I', answer: true },
  { id: 43, content: '如果掌握一门手艺并能以此为生，我会感到非常满意。', key: 'R', answer: true },
  { id: 44, content: '我曾渴望当一名汽车司机。', key: 'R', answer: false },
  { id: 45, content: '听别人谈"家中被盗"一类的事，很难引起我的同情。', key: 'S', answer: false },
  { id: 46, content: '如果待遇相同，我宁愿当商品推销员，而不愿当图书管理员。', key: 'E', answer: true },
  { id: 47, content: '我讨厌跟各类机械打交道。', key: 'R', answer: false },
  { id: 48, content: '我小时候经常把玩具拆开，把里面看个究竟。', key: 'R', answer: false },
  { id: 49, content: '当接受新任务后，我喜欢以自己的独特方法去完成它。', key: 'A', answer: true },
  { id: 50, content: '我有文艺方面的天赋。', key: 'A', answer: true },
  { id: 51, content: '我喜欢把一切安排得整整齐齐、井井有条。', key: 'C', answer: true },
  { id: 52, content: '我喜欢作一名教师。', key: 'S', answer: true },
  { id: 53, content: '和一群人在一起的时候，我总想不出恰当的话来说。', key: 'S', answer: false },
  { id: 54, content: '看情感影片时，我常禁不住眼圈红润。', key: 'A', answer: true },
  { id: 55, content: '我讨厌学数学。', key: 'I', answer: false },
  { id: 56, content: '在实验室里独自做实验会令我寂寞难耐。', key: 'I', answer: false },
  { id: 57, content: '对于急躁、爱发脾气的人，我仍能以礼相待。', key: 'C', answer: true },
  { id: 58, content: '遇到难解答的问题时，我常常放弃。', key: 'I', answer: false },
  { id: 59, content: '大家公认我是一名勤劳踏实的、愿为大家服务的人。', key: 'S', answer: true },
  { id: 60, content: '我喜欢在人事部门工作。', key: 'E', answer: true }
]; 

// 霍兰德职业兴趣类型说明
const hollandTypeDescriptions = {
  [HollandCode.R]: {
    title: '现实型 (Realistic)',
    description: '喜欢使用工具从事操作性工作，动手能力强，做事手脚灵活，动作协调。偏好于具体任务，不善言辞，做事保守，较为谦虚。缺乏社交能力，通常喜欢独立做事。',
    characteristics: ['踏实稳重', '诚实可靠', '谦逊', '喜欢动手', '有技术技能'],
    careers: ['技术工程师', '机械师', '电工', '农民', '园艺师', '厨师', '木匠', '测量员'],
    icon: <ToolOutlined />
  },
  [HollandCode.I]: {
    title: '研究型 (Investigative)',
    description: '思想家而非实干家，抽象思维能力强，求知欲强，肯动脑，善思考，不愿动手。喜欢独立的和富有创造性的工作，知识渊博，有学识才能，不善于领导他人。',
    characteristics: ['分析性强', '善于思考', '好奇心强', '独立', '理性'],
    careers: ['科学家', '工程师', '医生', '计算机程序员', '数学家', '分析师', '研究员'],
    icon: <ExperimentOutlined />
  },
  [HollandCode.A]: {
    title: '艺术型 (Artistic)',
    description: '有创造力，乐于创造新颖、与众不同的成果，渴望表现自己的个性，实现自身的价值。做事理想化，追求完美，不重实际。具有一定的艺术才能和个性。',
    characteristics: ['富有创造力', '直觉敏锐', '独立', '有想象力', '情感丰富'],
    careers: ['艺术家', '音乐家', '作家', '演员', '设计师', '建筑师', '摄影师', '舞者'],
    icon: <HeartOutlined />
  },
  [HollandCode.S]: {
    title: '社会型 (Social)',
    description: '喜欢与人交往、不断结交新的朋友、善言谈、愿意教导别人。关心社会问题、渴望发挥自己的社会作用。寻求广泛的人际关系，比较看重社会义务和社会道德。',
    characteristics: ['友好', '乐于助人', '善解人意', '合作', '慷慨'],
    careers: ['教师', '辅导员', '心理咨询师', '社会工作者', '护士', '医疗服务人员', '人力资源专家'],
    icon: <TeamOutlined />
  },
  [HollandCode.E]: {
    title: '企业型 (Enterprising)',
    description: '追求权力、权威和物质财富，具有领导才能。喜欢竞争、敢冒风险、有野心/抱负。为人务实，习惯以利益得失、权利、地位、金钱等来衡量做事的价值。',
    characteristics: ['自信', '有说服力', '冒险精神', '外向', '有野心'],
    careers: ['经理', '律师', '政治家', '销售人员', '企业家', '市场营销人员', '房地产经纪人'],
    icon: <TrophyOutlined />
  },
  [HollandCode.C]: {
    title: '传统型 (Conventional)',
    description: '尊重权威和规章制度，喜欢按计划办事，细心、有条理，习惯接受他人的指挥和领导，自己不谋求领导职务，喜欢关注实际和细节情况。',
    characteristics: ['细致', '有条理', '服从', '实际', '高效'],
    careers: ['会计师', '银行职员', '文秘', '行政助理', '财务分析师', '税务专家', '图书管理员'],
    icon: <ScheduleOutlined />
  }
};

// 常见三字组合类型对应的职业推荐
const combinationCareers: Record<string, string[]> = {
  'RIA': ['牙科技术员', '陶工', '建筑设计员', '模型工', '细木工', '制作链条人员'],
  'RIS': ['厨师', '林务员', '跳水员', '潜水员', '染色员', '电器修理', '眼镜制作', '电工', '纺织机器装配工', '服务员'],
  'RIE': ['建筑和桥梁工程师', '环境工程师', '航空工程师', '电力工程师', '信号工程师', '制图员', '农民', '交通工程技术人员'],
  'RIC': ['船上工作人员', '牙医助手', '制帽工', '石匠', '机器制造工', '汽车装配工', '缝纫机装配工', '钟表装配和检验员'],
  'RSI': ['纺织工', '编织工', '农业学校教师', '技术课程教师', '工艺课程教师'],
  'RSE': ['消防员', '交通巡警', '警察', '门卫', '理发师', '房间清洁工', '屠夫', '锻工', '开凿工人', '管道安装工'],
  'RES': ['旅馆服务员', '家畜饲养员', '渔民', '渔网修补工', '水手长', '收割机操作工', '搬运行李工人', '公园服务员', '救生员'],
  'REC': ['抄水表员', '保姆', '实验室动物饲养员', '动物管理员'],
  'REI': ['轮船船长', '航海领航员', '大副', '试管实验员'],
  'RCI': ['测量员', '勘测员', '仪表操作者', '农业工程技师', '化学工程技师', '民用工程技师', '石油工程技师'],
  'RCS': ['公共汽车驾驶员', '一等水手', '游泳池服务员', '裁缝', '建筑工作', '石匠', '烟囱修建工', '混凝土工', '电话修理工'],
  'RCE': ['打井工', '吊车驾驶员', '农场工人', '邮件分类员', '铲车司机', '拖拉机司机'],
  'IAR': ['人类学家', '天文学家', '化学家', '物理学家', '医学病理学家', '动物标本剥制者', '化石修复者', '艺术品管理者'],
  'IAS': ['普通经济学家', '农场经济学家', '财政经济学家', '国际贸易经济学家', '实验心理学家', '工程心理学家', '心理学家', '哲学家'],
  'ISA': ['实验心理学家', '普通心理学家', '发展心理学家', '教育心理学家', '社会心理学家', '临床心理学家', '妇产科医师', '眼科医生'],
  'ISE': ['营养学家', '饮食顾问', '火灾检查员', '邮政服务检查员'],
  'ISC': ['侦察员', '电视播音室修理员', '电视修理服务员', '验尸室人员', '编目录者', '医学实验定技师', '调查研究者'],
  'ISR': ['水生生物学者', '昆虫学者', '微生物学家', '配镜师', '矫正视力者', '细菌学家', '牙科医生'],
  'IES': ['细菌学家', '生理学家', '化学专家', '地质专家', '地理物理学专家', '纺织技术专家', '医院药剂师'],
  'IEC': ['档案保管员', '保险统计员'],
  'ICR': ['质量检验技术员', '地质学技师', '工程师', '法官', '图书馆技术辅导员', '计算机操作员', '医院听诊员'],
  'IRA': ['地理学家', '地质学家', '声学物理学家', '矿物学家', '古生物学家', '石油学家', '地震学家', '气象学家', '数学统计学家'],
  'AIS': ['画家', '剧作家', '编辑', '评论家', '时装艺术大师', '新闻摄影师', '男演员', '文学作者'],
  'AIE': ['花匠', '皮衣设计师', '工业产品设计师', '剪影艺术家', '复制雕刻品大师'],
  'AIR': ['建筑师', '画家', '摄影师', '绘图员', '雕刻家', '环境美化工', '包装设计师', '绣花工', '陶器设计师', '漫画工'],
  'ASE': ['戏剧导演', '舞蹈教师', '广告撰稿人', '报刊专栏作者', '记者', '演员', '英语翻译'],
  'ASI': ['音乐教师', '乐器教师', '美术教师', '管弦乐指挥', '合唱队指挥', '歌星', '演奏家', '哲学家', '作家'],
  'AER': ['新闻摄影师', '电视摄影师', '艺术指导', '录音指导', '丑角演员', '魔术师', '木偶戏演员', '骑士', '跳水员'],
  'AEI': ['音乐指挥', '舞台指导', '电影导演'],
  'AES': ['流行歌手', '舞蹈演员', '电影导演', '广播节目主持人', '舞蹈教师', '口技表演者', '喜剧演员', '模特'],
  'SEA': ['娱乐活动管理员', '国外服务办事员', '社会服务助理', '一般咨询者', '宗教教育工作者'],
  'SEC': ['社会活动家', '退伍军人服务官员', '工商会事务代表', '教育咨询者', '宿舍管理员', '旅馆经理', '饮食服务管理员'],
  'SER': ['体育教练', '游泳指导'],
  'SEI': ['大学校长', '学院院长', '医院行政管理员', '历史学家', '家政经济学家', '职业学校教师', '资料员'],
  'SCE': ['部长助理', '福利机构职员', '生产协调人', '环境卫生管理人员', '戏院经理', '餐馆经理', '售票员'],
  'SRI': ['外科医师助手', '医院服务员'],
  'SRE': ['体育教师', '职业病治疗者', '体育教练', '专业运动员', '房管员', '儿童家庭教师', '警察', '引座员', '传达员', '保姆'],
  'SIA': ['社会学家', '心理咨询者', '学校心理学家', '政治科学家', '大学系主任', '大学教育学教师', '大学农业教师', '大学法律教师'],
  'SIE': ['营养学家', '饮食学家', '海关检查员', '安全检查员', '税务稽查员', '校长'],
  'SIC': ['描图员', '兽医助手', '诊所助理', '体检检查员', '娱乐指导者', '监督缓刑犯的工作者', '咨询人员', '社会科学教师'],
  'SIR': ['理疗员', '救护队工作人员', '手足病医生', '职业病治疗助手'],
  'ECI': ['银行行长', '审计员', '信用管理员', '地产管理员', '商业管理员'],
  'ECS': ['信用办事员', '保险人员', '各类进货员', '海关服务经理', '售货员', '购买员', '会计'],
  'ERI': ['建筑物管理员', '工业工程师', '护士长', '农场管理员', '农业经营管理人员'],
  'ERS': ['仓库管理员', '房屋管理员', '货栈监督管理员'],
  'ERC': ['邮政局长', '渔船船长', '机械操作领班', '木工领班', '瓦工领班', '驾驶员领班'],
  'EIR': ['科学、技术和有关周期出版物的管理员'],
  'EIC': ['专利代理人', '鉴定人', '运输服务检查员', '安全检查员', '废品收购人员'],
  'EIS': ['警官', '侦察员', '交通检验员', '安全咨询员', '合同管理者', '商人'],
  'EAS': ['法官', '律师', '公证人'],
  'ESC': ['理发师', '裁判员', '政府行政管理员', '财政管理员', '工程管理员', '售货员', '职业病防治人员', '商业经理'],
  'ESR': ['家具售货员', '书店售货员', '公共汽车的驾驶员', '日用品售货员', '护士长', '自然科学和工程的行政领导'],
  'ESI': ['博物馆管理员', '图书馆管理员', '古迹管理员', '饮食业经理', '地区安全服务管理员', '技术服务咨询者'],
  'CIA': ['摄影暗室技术员', '数据处理员', '制图员', '物理实验室技师', '动植物标本技术员', '地质技术人员'],
  'CIS': ['记账员', '顾客服务员', '报刊发行员', '土地测量员', '保险公司职员', '会计师', '估价员', '邮政检查员'],
  'CIE': ['打字员', '统计员', '支票记录员', '订货员', '校对员', '办公室工作人员'],
  'CIR': ['校对员', '工程职员', '海底电报员', '检修计划员', '发扳员'],
  'CSE': ['接待员', '通讯员', '电话接线员', '卖票员', '旅馆服务员', '私人职员', '商学教师', '旅游办事员'],
  'CSA': ['秘书', '图书管理员', '办公室办事员'],
  'CRI': ['簿记员', '会计', '记时员', '铸造机操作工', '打字员', '按键操作工', '复印机操作工'],
  'CRS': ['仓库保管员', '档案管理员', '缝纫工', '讲述员', '收款人'],
  'CES': ['银行会计', '记账员', '法人秘书', '速记员', '法院报告人'],
  'CER': ['邮递员', '数据处理员', '办公室办事员'],
  'CEI': ['推销员', '经济分析家'],
};

// 霍兰德类型与图标和颜色映射
const typeColorMap = {
  [HollandCode.R]: { color: '#1890ff', icon: <ToolOutlined /> },
  [HollandCode.I]: { color: '#722ed1', icon: <ExperimentOutlined /> },
  [HollandCode.A]: { color: '#eb2f96', icon: <HeartOutlined /> },
  [HollandCode.S]: { color: '#52c41a', icon: <TeamOutlined /> },
  [HollandCode.E]: { color: '#fa8c16', icon: <TrophyOutlined /> },
  [HollandCode.C]: { color: '#13c2c2', icon: <ScheduleOutlined /> },
}; 

// 霍兰德测试组件
const HollandTest: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<{[key: number]: boolean}>({});
  const [result, setResult] = useState<{
    scores: {[key in HollandCode]: number},
    primaryCode: HollandCode,
    secondaryCode: HollandCode,
    combinationCode: string,
    suitableCareers: string[]
  } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 每页显示的问题数量
  const questionsPerPage = 10;
  const totalPages = Math.ceil(fullQuestions.length / questionsPerPage);
  
  // 获取当前页的问题
  const getCurrentPageQuestions = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    return fullQuestions.slice(startIndex, startIndex + questionsPerPage);
  };
  
  // 计算完成进度
  const getCompletionPercentage = () => {
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / fullQuestions.length) * 100);
  };
  
  // 处理回答变更
  const handleAnswerChange = (questionId: number, value: boolean) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };
  
  // 前往上一页
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // 前往下一页
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      setIsModalVisible(true);
    }
  };
  
  // 计算得分
  const calculateScores = () => {
    const scores = {
      [HollandCode.R]: 0,
      [HollandCode.I]: 0,
      [HollandCode.A]: 0,
      [HollandCode.S]: 0,
      [HollandCode.E]: 0,
      [HollandCode.C]: 0
    };
    
    fullQuestions.forEach(question => {
      const userAnswer = answers[question.id] || false;
      // 如果用户回答与题目标准答案一致，该类型得分+1
      if (userAnswer === question.answer) {
        const key = question.key as HollandCode;
        scores[key] += 1;
      }
    });
    
    return scores;
  };
  
  // 获取得分最高的两个类型
  const getTopTwoTypes = (scores: {[key in HollandCode]: number}) => {
    const sortedEntries = Object.entries(scores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    
    const primaryCode = sortedEntries[0][0] as HollandCode;
    const secondaryCode = sortedEntries[1][0] as HollandCode;
    
    return {
      primaryCode,
      secondaryCode
    };
  };
  
  // 获取三字组合代码
  const getCombinationCode = (scores: {[key in HollandCode]: number}) => {
    const sortedEntries = Object.entries(scores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 3);
    
    return sortedEntries.map(([code]) => code.toUpperCase()).join('');
  };
  
  // 获取合适的职业
  const getSuitableCareers = (combinationCode: string) => {
    // 优先查找精确的三字组合
    if (combinationCareers[combinationCode]) {
      return combinationCareers[combinationCode];
    }
    
    // 如果找不到精确组合，尝试查找前两个字母的组合
    const firstTwoLetters = combinationCode.substring(0, 2);
    const matchingCombinations = Object.keys(combinationCareers).filter(code => 
      code.startsWith(firstTwoLetters)
    );
    
    if (matchingCombinations.length > 0) {
      // 合并所有匹配组合的职业
      const combinedCareers = matchingCombinations.flatMap(code => combinationCareers[code]);
      // 去重
      return Array.from(new Set(combinedCareers)).slice(0, 15); // 限制为前15个
    }
    
    // 如果仍然找不到，返回主要类型的职业
    return hollandTypeDescriptions[combinationCode[0] as HollandCode].careers;
  };
  
  // 提交测试
  const handleSubmit = () => {
    setIsModalVisible(false);
    setIsSubmitting(true);
    
    // 计算结果
    const scores = calculateScores();
    const { primaryCode, secondaryCode } = getTopTwoTypes(scores);
    const combinationCode = getCombinationCode(scores);
    const suitableCareers = getSuitableCareers(combinationCode);
    
    const resultData = {
      scores,
      primaryCode,
      secondaryCode,
      combinationCode,
      suitableCareers
    };
    
    // 模拟网络请求
    setTimeout(() => {
      // 保存到本地存储
      const historyRecords = JSON.parse(localStorage.getItem('hollandTestHistory') || '[]');
      const resultId = `holland_${Date.now()}`;
      
      historyRecords.push({
        id: resultId,
        date: new Date().toISOString().split('T')[0],
        primaryCode,
        secondaryCode,
        combinationCode,
        scores
      });
      
      localStorage.setItem('hollandTestHistory', JSON.stringify(historyRecords));
      
      // 保存完整结果
      localStorage.setItem(`holland_${resultId}`, JSON.stringify({
        id: resultId,
        date: new Date().toISOString().split('T')[0],
        answers,
        ...resultData
      }));
      
      setResult(resultData);
      setShowResult(true);
      setIsSubmitting(false);
    }, 1500);
  };
  
  // 返回职业规划页面
  const backToCareerPlanning = () => {
    navigate('/career');
  };
  
  // 渲染测试问题
  const renderQuestions = () => {
    const currentQuestions = getCurrentPageQuestions();
    
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {currentQuestions.map(question => (
          <StyledCard key={question.id}>
            <Paragraph strong style={{ fontSize: 16 }}>
              {question.id}. {question.content}
            </Paragraph>
            <Radio.Group 
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              value={answers[question.id]}
            >
              <Space direction="horizontal">
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Space>
            </Radio.Group>
          </StyledCard>
        ))}
      </Space>
    );
  };
  
  // 渲染分数条
  const renderScoreBar = (type: HollandCode, score: number, maxScore: number) => {
    const description = hollandTypeDescriptions[type];
    const percent = (score / maxScore) * 100;
    
    return (
      <div key={type} style={{ marginBottom: 16 }}>
        <Space align="center">
          <CodeTag 
            icon={typeColorMap[type].icon} 
            color={typeColorMap[type].color}
          >
            {description.title}
          </CodeTag>
          <Text strong>{score}/{maxScore}分</Text>
        </Space>
        <Progress 
          percent={percent} 
          strokeColor={typeColorMap[type].color}
          showInfo={false}
          status="normal"
        />
      </div>
    );
  };
  
  // 渲染结果
  const renderResult = () => {
    if (!result) return null;
    
    const { scores, primaryCode, secondaryCode, combinationCode, suitableCareers } = result;
    const primaryDescription = hollandTypeDescriptions[primaryCode];
    const secondaryDescription = hollandTypeDescriptions[secondaryCode];
    
    // 计算各类型的最大可能分数
    const maxScores = {
      [HollandCode.R]: 10,
      [HollandCode.I]: 10,
      [HollandCode.A]: 10,
      [HollandCode.S]: 10,
      [HollandCode.E]: 10,
      [HollandCode.C]: 10
    };
    
    return (
      <ResultContainer>
        <Result
          icon={<CheckCircleOutlined />}
          title="霍兰德职业兴趣测试结果"
          subTitle={
            <Space size="large">
              <CodeTag color={typeColorMap[primaryCode].color} icon={typeColorMap[primaryCode].icon}>
                {primaryDescription.title} (主要)
              </CodeTag>
              <CodeTag color={typeColorMap[secondaryCode].color} icon={typeColorMap[secondaryCode].icon}>
                {secondaryDescription.title} (次要)
              </CodeTag>
              <Tag color="blue">组合类型: {combinationCode}</Tag>
            </Space>
          }
          extra={[
            <Button 
              type="primary" 
              key="back" 
              onClick={backToCareerPlanning}
            >
              返回职业规划
            </Button>
          ]}
        >
          <div style={{ textAlign: 'left', maxWidth: 800, margin: '0 auto' }}>
            <Divider orientation="left">职业兴趣类型分析</Divider>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Title level={4}>主要类型: {primaryDescription.title}</Title>
                <Paragraph>{primaryDescription.description}</Paragraph>
                <Paragraph strong>性格特点:</Paragraph>
                <ul>
                  {primaryDescription.characteristics.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>次要类型: {secondaryDescription.title}</Title>
                <Paragraph>{secondaryDescription.description}</Paragraph>
                <Paragraph strong>性格特点:</Paragraph>
                <ul>
                  {secondaryDescription.characteristics.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
              </Col>
            </Row>
            
            <Divider orientation="left">详细得分</Divider>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                {renderScoreBar(HollandCode.R, scores[HollandCode.R], maxScores[HollandCode.R])}
                {renderScoreBar(HollandCode.I, scores[HollandCode.I], maxScores[HollandCode.I])}
                {renderScoreBar(HollandCode.A, scores[HollandCode.A], maxScores[HollandCode.A])}
              </Col>
              <Col xs={24} md={12}>
                {renderScoreBar(HollandCode.S, scores[HollandCode.S], maxScores[HollandCode.S])}
                {renderScoreBar(HollandCode.E, scores[HollandCode.E], maxScores[HollandCode.E])}
                {renderScoreBar(HollandCode.C, scores[HollandCode.C], maxScores[HollandCode.C])}
              </Col>
            </Row>
            
            <Divider orientation="left">职业推荐</Divider>
            <Alert
              message="根据您的霍兰德代码组合，以下是适合您的职业推荐"
              description={`您的组合代码为 ${combinationCode}，表示您具有较强的${primaryDescription.title}和${secondaryDescription.title}特质。`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <CareerList
              header={<Title level={5}>推荐职业清单</Title>}
              bordered
              dataSource={suitableCareers}
              renderItem={(career) => (
                <List.Item>
                  <Text>{career}</Text>
                </List.Item>
              )}
            />
            
            <Alert
              message="提示"
              description="职业兴趣测试结果仅作为职业选择的参考依据，建议结合自身能力、教育背景、就业市场需求等多方面因素进行职业规划。"
              type="warning"
              showIcon
              style={{ marginTop: 24 }}
            />
          </div>
        </Result>
      </ResultContainer>
    );
  };
  
  if (showResult) {
    return renderResult();
  }
  
  if (isSubmitting) {
    return (
      <Container style={{ textAlign: 'center', paddingTop: 100 }}>
        <Spin tip="正在分析您的职业兴趣..." size="large" />
      </Container>
    );
  }
  
  return (
    <Container>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={backToCareerPlanning}
          style={{ padding: 0 }}
        >
          返回职业规划
        </Button>
        
        <Title level={3}>霍兰德职业兴趣测试</Title>
        
        <Alert
          message="测试说明"
          description={
            <div>
              <p>请根据对每一题目的第一印象作答，不必仔细推敲，答案没有好坏、对错之分。</p>
              <p>具体填写方法是，根据自己的情况每一题回答"是"或"否"。</p>
            </div>
          }
          type="info"
          showIcon
        />
        
        <div>
          <Text>进度: {getCompletionPercentage()}% (第 {currentPage} 页，共 {totalPages} 页)</Text>
          <Progress 
            percent={getCompletionPercentage()} 
            status="active" 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
        
        {renderQuestions()}
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            上一页
          </Button>
          <Button 
            type="primary" 
            onClick={handleNextPage}
            disabled={getCurrentPageQuestions().some(q => answers[q.id] === undefined)}
          >
            {currentPage < totalPages ? '下一页' : '完成测试'}
          </Button>
        </div>
      </Space>
      
      <Modal
        title="确认提交"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="确认提交"
        cancelText="继续检查"
      >
        <p>您已经完成所有问题，确认提交测试吗？</p>
        <p>提交后将无法修改答案。</p>
      </Modal>
    </Container>
  );
};

export default HollandTest; 