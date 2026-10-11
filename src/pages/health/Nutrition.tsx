import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  Tabs,
  Calendar,
  List,
  Badge,
  Tag,
  Button,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  TimePicker,
  Space,
  Spin,
  Table,
  Upload,
  message,
  Radio,
  Switch,
  InputNumber,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { 
  PlusOutlined, 
  DropboxOutlined, 
  FireOutlined,
  PieChartOutlined, 
  BarChartOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  ShareAltOutlined,
  SaveOutlined,
  CameraOutlined,
  FileImageOutlined,
  BookOutlined,
} from '@ant-design/icons';

import { 
  MacrosPieChart, 
  NutritionBarChart, 
  CalorieChart,
  WaterIntakeChart
} from './components';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Content } = Layout;

// 样式组件
const StyledCard = styled(Card)`
  margin-bottom: 16px;
`;

const MealCard = styled(Card)`
  margin-bottom: 16px;
  .ant-card-head {
    background-color: #fafafa;
  }
`;

const MealItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const WaterButton = styled(Button)`
  margin: 0 4px;
  height: 40px;
  width: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 接口定义
interface Meal {
  id: string;
  type: string;
  time: string;
  items: Array<{
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

interface DailyNutrition {
  date: string;
  calories: {
    consumed: number;
    target: number;
  };
  water: {
    consumed: number;
    target: number;
  };
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  };
  meals: Meal[];
}

interface CalendarData {
  date: string;
  type: 'success' | 'warning' | 'error';
  content: string;
}

// 模拟数据
const generateMockData = (): DailyNutrition => {
  const breakfast: Meal = {
    id: '1',
    type: '早餐',
    time: '07:30',
    items: [
      { name: '全麦面包', calories: 180, protein: 8, fat: 2, carbs: 35 },
      { name: '煮鸡蛋', calories: 77, protein: 6, fat: 5, carbs: 1 },
      { name: '牛奶', calories: 120, protein: 8, fat: 5, carbs: 12 },
    ],
    totalCalories: 377,
    totalProtein: 22,
    totalFat: 12,
    totalCarbs: 48,
  };

  const lunch: Meal = {
    id: '2',
    type: '午餐',
    time: '12:00',
    items: [
      { name: '米饭', calories: 200, protein: 4, fat: 0, carbs: 45 },
      { name: '鸡胸肉', calories: 165, protein: 31, fat: 3.5, carbs: 0 },
      { name: '西蓝花', calories: 55, protein: 3, fat: 0, carbs: 11 },
      { name: '胡萝卜', calories: 25, protein: 1, fat: 0, carbs: 6 },
    ],
    totalCalories: 445,
    totalProtein: 39,
    totalFat: 3.5,
    totalCarbs: 62,
  };

  const dinner: Meal = {
    id: '3',
    type: '晚餐',
    time: '18:30',
    items: [
      { name: '三文鱼', calories: 206, protein: 22, fat: 13, carbs: 0 },
      { name: '藜麦', calories: 120, protein: 4, fat: 2, carbs: 21 },
      { name: '沙拉', calories: 25, protein: 1, fat: 0, carbs: 5 },
    ],
    totalCalories: 351,
    totalProtein: 27,
    totalFat: 15,
    totalCarbs: 26,
  };

  const snack: Meal = {
    id: '4',
    type: '加餐',
    time: '15:30',
    items: [
      { name: '苹果', calories: 95, protein: 0, fat: 0, carbs: 25 },
      { name: '坚果', calories: 170, protein: 6, fat: 14, carbs: 6 },
    ],
    totalCalories: 265,
    totalProtein: 6,
    totalFat: 14,
    totalCarbs: 31,
  };

  return {
    date: dayjs().format('YYYY-MM-DD'),
    calories: {
      consumed: breakfast.totalCalories + lunch.totalCalories + dinner.totalCalories + snack.totalCalories,
      target: 2000,
    },
    water: {
      consumed: 1600,
      target: 2000,
    },
    macros: {
      protein: breakfast.totalProtein + lunch.totalProtein + dinner.totalProtein + snack.totalProtein,
      fat: breakfast.totalFat + lunch.totalFat + dinner.totalFat + snack.totalFat,
      carbs: breakfast.totalCarbs + lunch.totalCarbs + dinner.totalCarbs + snack.totalCarbs,
    },
    meals: [breakfast, lunch, dinner, snack],
  };
};

// 生成模拟历史营养数据
const generateHistoricalCalorieData = () => {
  const data = [];
  const now = dayjs();
  
  for (let i = 6; i >= 0; i--) {
    const date = now.subtract(i, 'day');
    data.push({
      date: date.format('MM-DD'),
      calories: Math.floor(Math.random() * 300) + 1600,
      target: 2000,
    });
  }
  
  return data;
};

// 生成模拟水分摄入数据
const generateWaterIntakeData = () => {
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    data.push(Math.floor(Math.random() * 1000) + 1000);
  }
  
  return data;
};

// 食物数据库数据
const foodData = [
  { name: '苹果', category: '水果', calories: 95, protein: 0.5, fat: 0.3, carbs: 25, fiber: 4.4 },
  { name: '香蕉', category: '水果', calories: 105, protein: 1.3, fat: 0.4, carbs: 27, fiber: 3.1 },
  { name: '橙子', category: '水果', calories: 62, protein: 1.2, fat: 0.2, carbs: 15.4, fiber: 3.1 },
  { name: '鸡胸肉', category: '肉类', calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0 },
  { name: '三文鱼', category: '鱼类', calories: 208, protein: 20, fat: 13, carbs: 0, fiber: 0 },
  { name: '牛肉', category: '肉类', calories: 250, protein: 26, fat: 17, carbs: 0, fiber: 0 },
  { name: '豆腐', category: '豆制品', calories: 76, protein: 8, fat: 4, carbs: 2, fiber: 0.3 },
  { name: '糙米', category: '谷物', calories: 216, protein: 5, fat: 1.8, carbs: 45, fiber: 3.5 },
  { name: '全麦面包', category: '谷物', calories: 81, protein: 4, fat: 1, carbs: 15, fiber: 2 },
  { name: '牛奶', category: '乳制品', calories: 61, protein: 3.2, fat: 3.4, carbs: 4.8, fiber: 0 },
  { name: '鸡蛋', category: '蛋类', calories: 78, protein: 6, fat: 5, carbs: 0.6, fiber: 0 },
  { name: '花生', category: '坚果', calories: 567, protein: 25.8, fat: 49.2, carbs: 16.1, fiber: 8.5 },
];

// 日历数据
const calendarData: CalendarData[] = [
  { date: dayjs().format('YYYY-MM-DD'), type: 'success', content: '营养均衡' },
  { date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), type: 'warning', content: '缺少纤维' },
  { date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), type: 'error', content: '高热量' },
  { date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'), type: 'success', content: '理想摄入' },
];

const Nutrition: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [addMealVisible, setAddMealVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [viewMode, setViewMode] = useState('day');
  const [, setSelectedDate] = useState<Dayjs>(dayjs());
  const [nutritionData, setNutritionData] = useState<DailyNutrition | null>(null);
  const [form] = Form.useForm();

  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setNutritionData(generateMockData());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 处理添加记录
  const handleAddMeal = () => {
    setAddMealVisible(true);
  };

  // 提交表单
  const handleSubmit = (values: any) => {
    console.log('提交的表单值:', values);
    
    // 计算总营养素
    const totalCalories = values.foods.reduce((sum: number, food: any) => sum + (Number(food.calories) || 0), 0);
    const totalProtein = values.foods.reduce((sum: number, food: any) => sum + (Number(food.protein) || 0), 0);
    const totalFat = values.foods.reduce((sum: number, food: any) => sum + (Number(food.fat) || 0), 0);
    const totalCarbs = values.foods.reduce((sum: number, food: any) => sum + (Number(food.carbs) || 0), 0);
    
    // 如果有现有的营养数据，则更新它
    if (nutritionData) {
      const newMeal = {
        id: String(Date.now()),
        type: values.mealType === 'breakfast' ? '早餐' : 
              values.mealType === 'lunch' ? '午餐' : 
              values.mealType === 'dinner' ? '晚餐' : '加餐',
        time: values.time.format('HH:mm'),
        items: values.foods.map((food: any) => ({
          name: food.name,
          calories: Number(food.calories) || 0,
          protein: Number(food.protein) || 0,
          fat: Number(food.fat) || 0,
          carbs: Number(food.carbs) || 0,
        })),
        totalCalories,
        totalProtein,
        totalFat,
        totalCarbs
      };
      
      const updatedNutritionData = { ...nutritionData };
      updatedNutritionData.meals = [...updatedNutritionData.meals, newMeal];
      updatedNutritionData.calories.consumed += totalCalories;
      updatedNutritionData.macros.protein += totalProtein;
      updatedNutritionData.macros.fat += totalFat;
      updatedNutritionData.macros.carbs += totalCarbs;
      
      setNutritionData(updatedNutritionData);
      message.success('餐食记录已添加！');
    }
    
    setAddMealVisible(false);
    form.resetFields();
  };

  // 处理上传图片
  const handleUpload = () => {
    setUploadVisible(true);
  };

  // 处理上传完成
  const handleUploadFinish = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功！`);
      setUploadVisible(false);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败！`);
    }
  };

  // 处理分享
  const handleShare = () => {
    setShareVisible(true);
  };

  // 处理保存
  const handleSave = () => {
    // 模拟保存操作
    setTimeout(() => {
      setSavedMessage('营养日记已保存！');
      message.success('营养日记已保存！');
      
      // 2秒后清除消息
      setTimeout(() => {
        setSavedMessage('');
      }, 2000);
    }, 500);
  };

  // 更新水摄入量
  const updateWaterIntake = (amount: number) => {
    if (nutritionData) {
      const updatedData = { ...nutritionData };
      updatedData.water.consumed = Math.min(updatedData.water.consumed + amount, 4000);
      setNutritionData(updatedData);
    }
  };

  // 日历数据渲染
  const getCalendarData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const data = calendarData.find(item => item.date === dateStr);
    
    if (data) {
      return {
        type: data.type,
        content: data.content,
      };
    }
    return null;
  };

  // 日历单元格渲染
  const calendarCellRender = (date: Dayjs) => {
    const data = getCalendarData(date);
    
    if (data) {
      return (
        <div>
          <Badge
            status={data.type as any}
            text={data.content}
            style={{ fontSize: '12px' }}
          />
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col>
          <Title level={2}>营养管理</Title>
        </Col>
        <Col flex="auto">
          <Paragraph>
            通过记录每日饮食摄入，跟踪营养摄入量，保持健康饮食习惯。
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddMeal}
            >
              添加餐食
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={handleUpload}
            >
              上传照片
            </Button>
            <Button 
              icon={<SaveOutlined />} 
              onClick={handleSave}
            >
              保存
            </Button>
            <Button 
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            >
              分享
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card>
            <Radio.Group 
              value={viewMode} 
              onChange={e => setViewMode(e.target.value)} 
              buttonStyle="solid"
            >
              <Radio.Button value="day">日视图</Radio.Button>
              <Radio.Button value="week">周视图</Radio.Button>
              <Radio.Button value="month">月视图</Radio.Button>
            </Radio.Group>
            
            {savedMessage && (
              <Tag color="success" style={{ marginLeft: 16 }}>
                {savedMessage}
              </Tag>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 左侧部分 */}
        <Col xs={24} md={16}>
          {/* 营养摄入统计 */}
          <StyledCard title="今日营养摄入">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="已摄入热量"
                  value={nutritionData?.calories.consumed || 0}
                  suffix="/ 2000千卡"
                  precision={0}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<FireOutlined />}
                />
                <div style={{ marginTop: 8 }}>
                  <Badge 
                    status={(nutritionData && nutritionData.calories.consumed > nutritionData.calories.target) ? 'error' : 'success'} 
                    text={
                      (nutritionData && nutritionData.calories.consumed > nutritionData.calories.target) 
                        ? '超出目标' 
                        : '符合目标'
                    } 
                  />
                </div>
              </Col>
              
              <Col span={8}>
                <Statistic
                  title="饮水量"
                  value={nutritionData?.water.consumed || 0}
                  suffix="/ 2000毫升"
                  precision={0}
                  valueStyle={{ color: '#13c2c2' }}
                  prefix={<FireOutlined />}
                />
                <div style={{ marginTop: 8, display: 'flex' }}>
                  <WaterButton 
                    type="primary" 
                    shape="circle" 
                    onClick={() => updateWaterIntake(200)}
                  >
                    +
                  </WaterButton>
                  <WaterButton 
                    type="primary" 
                    shape="circle" 
                    onClick={() => updateWaterIntake(500)}
                  >
                    ++
                  </WaterButton>
                </div>
              </Col>
              
              <Col span={8}>
                <Statistic
                  title="蛋白质/脂肪/碳水"
                  value={`${nutritionData?.macros.protein || 0}/${nutritionData?.macros.fat || 0}/${nutritionData?.macros.carbs || 0}`}
                  suffix="克"
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<PieChartOutlined />}
                />
              </Col>
            </Row>
          </StyledCard>

          {/* 今日餐食 */}
          <StyledCard 
            title="今日餐食" 
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMeal}>
                添加记录
              </Button>
            }
          >
            {nutritionData?.meals.map(meal => (
              <MealCard
                key={meal.id}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{meal.type} - {meal.time}</span>
                    <span>{meal.totalCalories} 千卡</span>
                  </div>
                }
                size="small"
              >
                {meal.items.map((item, index) => (
                  <MealItem key={index}>
                    <div>
                      <Text strong>{item.name}</Text>
                      <div>
                        <Text type="secondary">蛋白质: {item.protein}g, 脂肪: {item.fat}g, 碳水: {item.carbs}g</Text>
                      </div>
                    </div>
                    <Text>{item.calories} 千卡</Text>
                  </MealItem>
                ))}
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div>
                    <Tag color="blue">蛋白质: {meal.totalProtein}g</Tag>
                    <Tag color="orange">脂肪: {meal.totalFat}g</Tag>
                    <Tag color="green">碳水: {meal.totalCarbs}g</Tag>
                  </div>
                </div>
              </MealCard>
            ))}
          </StyledCard>

          {/* 营养分析 */}
          <StyledCard>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <PieChartOutlined />
                    每日总结
                  </span>
                }
                key="1"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="热量分布" bordered={false}>
                      {nutritionData && (
                        <MacrosPieChart 
                          data={{
                            protein: nutritionData.macros.protein,
                            fat: nutritionData.macros.fat,
                            carbs: nutritionData.macros.carbs
                          }} 
                        />
                      )}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="宏量营养素分布" bordered={false}>
                      <NutritionBarChart 
                        data={[
                          { name: '蛋白质', value: nutritionData?.macros.protein || 0, target: 100 },
                          { name: '脂肪', value: nutritionData?.macros.fat || 0, target: 60 },
                          { name: '碳水化合物', value: nutritionData?.macros.carbs || 0, target: 200 }
                        ]}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane
                tab={
                  <span>
                    <BarChartOutlined />
                    营养分析
                  </span>
                }
                key="2"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="每日热量趋势" bordered={false}>
                      <CalorieChart data={generateHistoricalCalorieData()} />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="每日饮水量" bordered={false}>
                      <WaterIntakeChart data={generateWaterIntakeData()} />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    营养建议
                  </span>
                }
                key="3"
              >
                <Card bordered={false}>
                  <Title level={4}>个性化饮食建议</Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        title: '增加蛋白质摄入',
                        description: '建议增加鸡胸肉、鱼类、鸡蛋、豆腐等高蛋白食物的摄入，有助于肌肉发育和修复。',
                        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      },
                      {
                        title: '控制碳水化合物摄入',
                        description: '选择复合碳水化合物，如全谷物、糙米、燕麦等，避免过多摄入精制碳水化合物。',
                        icon: <InfoCircleOutlined style={{ color: '#faad14' }} />
                      },
                      {
                        title: '增加膳食纤维',
                        description: '多吃蔬菜、水果和全谷物，增加膳食纤维摄入，改善消化系统健康。',
                        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      },
                      {
                        title: '均衡摄入维生素和矿物质',
                        description: '通过多样化的饮食，确保获取足够的维生素和矿物质，必要时可考虑适当补充。',
                        icon: <InfoCircleOutlined style={{ color: '#faad14' }} />
                      }
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={item.icon}
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </TabPane>
            </Tabs>
          </StyledCard>
        </Col>

        {/* 右侧部分 */}
        <Col xs={24} md={8}>
          <StyledCard title="营养日历" extra={<ScheduleOutlined />}>
            <Calendar 
              fullscreen={false} 
              dateCellRender={calendarCellRender}
              onChange={setSelectedDate}
            />
          </StyledCard>

          <StyledCard title="常见食物库" extra={<DropboxOutlined />}>
            <Table
              dataSource={foodData}
              columns={[
                {
                  title: '食物名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '类别',
                  dataIndex: 'category',
                  key: 'category',
                  render: (text) => <Tag color="blue">{text}</Tag>,
                },
                {
                  title: '热量(千卡)',
                  dataIndex: 'calories',
                  key: 'calories',
                  sorter: (a, b) => a.calories - b.calories,
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Button 
                      type="link" 
                      size="small" 
                      onClick={() => console.log('添加食物', record)}
                    >
                      添加
                    </Button>
                  ),
                },
              ]}
              size="small"
              pagination={{ pageSize: 5 }}
            />
          </StyledCard>
        </Col>
      </Row>

      {/* 添加餐食记录的模态框 */}
      <Modal
        title="添加餐食记录"
        open={addMealVisible}
        onCancel={() => setAddMealVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mealType"
                label="餐食类型"
                rules={[{ required: true, message: '请选择餐食类型' }]}
              >
                <Select>
                  <Select.Option value="breakfast">早餐</Select.Option>
                  <Select.Option value="lunch">午餐</Select.Option>
                  <Select.Option value="dinner">晚餐</Select.Option>
                  <Select.Option value="snack">加餐</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label="用餐时间"
                rules={[{ required: true, message: '请选择用餐时间' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="食物">
            <Form.List name="foods">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card 
                      key={key} 
                      size="small" 
                      style={{ marginBottom: 8 }}
                      extra={
                        <Button onClick={() => remove(name)} type="text" danger>
                          删除
                        </Button>
                      }
                    >
                      <Row gutter={8}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            rules={[{ required: true, message: '请输入食物名称' }]}
                            style={{ marginBottom: 8 }}
                          >
                            <Input placeholder="食物名称" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'calories']}
                            rules={[{ required: true, message: '请输入热量' }]}
                            style={{ marginBottom: 8 }}
                          >
                            <InputNumber 
                              placeholder="热量" 
                              style={{ width: '100%' }} 
                              addonAfter="千卡"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'protein']}
                            style={{ marginBottom: 8 }}
                          >
                            <InputNumber 
                              placeholder="蛋白质" 
                              style={{ width: '100%' }} 
                              addonAfter="克"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'fat']}
                            style={{ marginBottom: 8 }}
                          >
                            <InputNumber 
                              placeholder="脂肪" 
                              style={{ width: '100%' }} 
                              addonAfter="克"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'carbs']}
                            style={{ marginBottom: 8 }}
                          >
                            <InputNumber 
                              placeholder="碳水" 
                              style={{ width: '100%' }} 
                              addonAfter="克"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Form.Item>
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                    >
                      添加食物
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="notes"
                label="备注"
              >
                <Input.TextArea 
                  placeholder="添加关于这餐饭的备注..." 
                  rows={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mood"
                label="用餐心情"
              >
                <Select placeholder="选择用餐当时的心情">
                  <Select.Option value="great">心情愉快</Select.Option>
                  <Select.Option value="good">心情不错</Select.Option>
                  <Select.Option value="neutral">一般</Select.Option>
                  <Select.Option value="bad">心情不好</Select.Option>
                  <Select.Option value="stressed">压力大</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                <Button 
                  icon={<CameraOutlined />} 
                  style={{ marginRight: 8 }}
                >
                  拍照添加
                </Button>
                <Button 
                  icon={<DropboxOutlined />}
                >
                  从食物库添加
                </Button>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                >
                  保存记录
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      {/* 上传照片模态框 */}
      <Modal
        title="上传照片"
        open={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={<span><CameraOutlined /> 上传食物照片</span>}
            key="1"
          >
            <Upload.Dragger
              name="files"
              action="/api/upload" // 替换成实际的上传API
              onChange={handleUploadFinish}
              multiple
              showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            >
              <p className="ant-upload-drag-icon">
                <FileImageOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传食物照片
              </p>
            </Upload.Dragger>
          </TabPane>
          <TabPane 
            tab={<span><BookOutlined /> 上传营养成分表</span>}
            key="2"
          >
            <Upload.Dragger
              name="nutritionTable"
              action="/api/upload/nutrition-table" // 替换成实际的上传API
              onChange={handleUploadFinish}
              accept=".jpg,.jpeg,.png,.pdf"
            >
              <p className="ant-upload-drag-icon">
                <FileImageOutlined />
              </p>
              <p className="ant-upload-text">上传食品营养成分表照片</p>
              <p className="ant-upload-hint">
                我们将通过OCR技术自动识别营养成分数据
              </p>
            </Upload.Dragger>
          </TabPane>
        </Tabs>
      </Modal>

      {/* 分享模态框 */}
      <Modal
        title="分享营养日记"
        open={shareVisible}
        onCancel={() => setShareVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setShareVisible(false)}>
            取消
          </Button>,
          <Button key="share" type="primary" onClick={() => {
            message.success('分享链接已复制到剪贴板！');
            setShareVisible(false);
          }}>
            复制链接
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/nutrition/share/12345" 
            alt="分享二维码"
            style={{ width: 150, height: 150 }}
          />
          <p>扫描二维码查看分享内容</p>
        </div>
        <Form layout="vertical">
          <Form.Item label="分享内容">
            <Select defaultValue="today">
              <Select.Option value="today">今日营养摄入</Select.Option>
              <Select.Option value="week">本周营养摄入</Select.Option>
              <Select.Option value="custom">自定义时间段</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="分享设置">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row>
                <Col span={16}>包含详细食物项目</Col>
                <Col span={8}><Switch defaultChecked /></Col>
              </Row>
              <Row>
                <Col span={16}>包含营养分析图表</Col>
                <Col span={8}><Switch defaultChecked /></Col>
              </Row>
              <Row>
                <Col span={16}>显示我的个人信息</Col>
                <Col span={8}><Switch /></Col>
              </Row>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default Nutrition; 