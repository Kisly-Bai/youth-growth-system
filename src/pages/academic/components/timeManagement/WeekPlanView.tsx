import React, { useState } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Select,
  Badge,
  Popover,
  Calendar,
  Divider,
  Radio,
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { TimeBlock } from '../../../../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// 样式组件
const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const WeekHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const DayCell = styled.div`
  min-height: 100px;
  padding: 4px;
`;

const TimeBlockItem = styled.div<{ color: string; completed: boolean }>`
  background-color: ${props => props.completed ? '#f6ffed' : '#fff'};
  border-left: 3px solid ${props => props.color};
  border-radius: 4px;
  padding: 4px 8px;
  margin-bottom: 4px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const TimeLabel = styled(Text)`
  font-size: 11px;
  color: #666;
`;

const CalendarWrapper = styled.div`
  .ant-picker-calendar-date-content {
    height: auto !important;
    min-height: 80px;
  }
`;

// 获取类别颜色
const getCategoryColor = (category: string, categories: any[]): string => {
  const cat = categories.find(c => c.value === category);
  return cat ? cat.color : '#bfbfbf';
};

// 获取类别标签
const getCategoryLabel = (category: string, categories: any[]): string => {
  const cat = categories.find(c => c.value === category);
  return cat ? cat.label : '其他';
};

interface WeekPlanViewProps {
  timeBlocks: TimeBlock[];
  categories: any[];
  onEdit: (timeBlock: TimeBlock) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, completed: boolean) => void;
}

const WeekPlanView: React.FC<WeekPlanViewProps> = ({
  timeBlocks,
  categories,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const [currentWeek, setCurrentWeek] = useState<dayjs.Dayjs>(dayjs().startOf('week'));
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // 获取周日期范围
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(currentWeek.add(i, 'day'));
    }
    return days;
  };
  
  // 获取周时间块数据
  const getWeekTimeBlocks = () => {
    const weekStart = currentWeek;
    const weekEnd = currentWeek.add(6, 'day').endOf('day');
    
    return timeBlocks
      .filter(block => {
        const blockStartTime = dayjs(block.startTime);
        
        // 类别筛选
        if (filterCategory !== 'all' && block.category !== filterCategory) {
          return false;
        }
        
        // 日期范围筛选
        return blockStartTime.isAfter(weekStart) && blockStartTime.isBefore(weekEnd);
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };
  
  // 获取某一天的时间块
  const getDayTimeBlocks = (date: dayjs.Dayjs) => {
    return timeBlocks
      .filter(block => {
        const blockStartTime = dayjs(block.startTime);
        
        // 类别筛选
        if (filterCategory !== 'all' && block.category !== filterCategory) {
          return false;
        }
        
        // 日期筛选
        return blockStartTime.isSame(date, 'day');
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };
  
  // 处理上一周
  const handlePrevWeek = () => {
    setCurrentWeek(currentWeek.subtract(1, 'week'));
  };
  
  // 处理下一周
  const handleNextWeek = () => {
    setCurrentWeek(currentWeek.add(1, 'week'));
  };
  
  // 渲染时间块内容
  const renderTimeBlock = (block: TimeBlock) => {
    const startTime = dayjs(block.startTime);
    const endTime = dayjs(block.endTime);
    
    return (
      <TimeBlockItem 
        key={block.id}
        color={getCategoryColor(block.category, categories)}
        completed={block.completed}
        onClick={() => onEdit(block)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text strong style={{ fontSize: '12px' }}>{block.title}</Text>
          {block.completed ? (
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
          ) : null}
        </div>
        <TimeLabel>{startTime.format('HH:mm')} - {endTime.format('HH:mm')}</TimeLabel>
      </TimeBlockItem>
    );
  };
  
  // 渲染详细内容
  const renderBlockDetail = (block: TimeBlock) => {
    const startTime = dayjs(block.startTime);
    const endTime = dayjs(block.endTime);
    const duration = endTime.diff(startTime, 'minute');
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const durationText = `${hours > 0 ? `${hours}小时` : ''}${minutes > 0 ? `${minutes}分钟` : ''}`;
    
    return (
      <div style={{ width: 300 }}>
        <div>
          <Text strong>{block.title}</Text>
          <Tag 
            color={getCategoryColor(block.category, categories)}
            style={{ marginLeft: 8 }}
          >
            {getCategoryLabel(block.category, categories)}
          </Tag>
        </div>
        
        {block.description && (
          <Paragraph style={{ margin: '8px 0' }}>
            {block.description}
          </Paragraph>
        )}
        
        <Divider style={{ margin: '8px 0' }} />
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Text type="secondary">开始时间:</Text>
            <Text strong>{startTime.format('YYYY-MM-DD HH:mm')}</Text>
          </Space>
          <Space>
            <Text type="secondary">结束时间:</Text>
            <Text strong>{endTime.format('YYYY-MM-DD HH:mm')}</Text>
          </Space>
          <Space>
            <Text type="secondary">持续时间:</Text>
            <Text strong>{durationText}</Text>
          </Space>
          <Space>
            <Text type="secondary">状态:</Text>
            {block.completed ? (
              <Badge status="success" text="已完成" />
            ) : (
              <Badge status="processing" text="进行中" />
            )}
          </Space>
        </Space>
        
        <Divider style={{ margin: '8px 0' }} />
        
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => onEdit(block)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(block.id)}
          >
            删除
          </Button>
          <Button
            size="small"
            type={block.completed ? 'default' : 'primary'}
            icon={block.completed ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => onUpdateStatus(block.id, !block.completed)}
          >
            {block.completed ? '标记未完成' : '标记完成'}
          </Button>
        </Space>
      </div>
    );
  };
  
  // 渲染周视图
  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const columns = weekDays.map(day => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <div>{day.format('ddd')}</div>
          <div 
            style={{ 
              fontWeight: day.isSame(dayjs(), 'day') ? 'bold' : 'normal',
              color: day.isSame(dayjs(), 'day') ? '#1890ff' : 'inherit'
            }}
          >
            {day.format('MM-DD')}
          </div>
        </div>
      ),
      dataIndex: day.format('YYYY-MM-DD'),
      key: day.format('YYYY-MM-DD'),
      render: (_: any, record: any) => {
        const dayBlocks = getDayTimeBlocks(day);
        
        if (dayBlocks.length === 0) {
          return <div style={{ minHeight: 50, textAlign: 'center', color: '#ccc' }}>无安排</div>;
        }
        
        return (
          <DayCell>
            {dayBlocks.map(block => (
              <Popover
                key={block.id}
                content={renderBlockDetail(block)}
                title={null}
                trigger="hover"
                placement="right"
              >
                {renderTimeBlock(block)}
              </Popover>
            ))}
          </DayCell>
        );
      },
    }));
    
    return (
      <Table
        columns={columns}
        dataSource={[{}]}
        pagination={false}
        bordered
        showHeader
        rowKey={() => 'week'}
      />
    );
  };
  
  // 渲染月视图
  const renderMonthView = () => {
    const dateCellRender = (date: dayjs.Dayjs) => {
      const dayBlocks = getDayTimeBlocks(date);
      
      if (dayBlocks.length === 0) {
        return null;
      }
      
      return (
        <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          {dayBlocks.slice(0, 3).map(block => (
            <Popover
              key={block.id}
              content={renderBlockDetail(block)}
              title={null}
              trigger="hover"
              placement="right"
            >
              <li style={{ margin: '2px 0' }}>
                <Tag 
                  color={getCategoryColor(block.category, categories)}
                  style={{ 
                    width: '100%', 
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {block.completed && <CheckCircleOutlined style={{ marginRight: 3 }} />}
                  {block.title}
                </Tag>
              </li>
            </Popover>
          ))}
          {dayBlocks.length > 3 && (
            <li>
              <Text type="secondary" style={{ fontSize: 12 }}>
                还有 {dayBlocks.length - 3} 项...
              </Text>
            </li>
          )}
        </ul>
      );
    };
    
    return (
      <CalendarWrapper>
        <Calendar 
          dateCellRender={dateCellRender} 
          value={currentWeek}
          onChange={(date) => setCurrentWeek(date.startOf('week'))}
        />
      </CalendarWrapper>
    );
  };
  
  const weekTimeBlocks = getWeekTimeBlocks();
  
  return (
    <StyledCard>
      <WeekHeader>
        <Space>
          <Title level={4}>周计划视图</Title>
          <Radio.Group 
            value={viewType} 
            onChange={e => setViewType(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="week">周视图</Radio.Button>
            <Radio.Button value="month">月视图</Radio.Button>
          </Radio.Group>
        </Space>
        
        <Space>
          <Select
            placeholder="按类别筛选"
            style={{ width: 120 }}
            value={filterCategory}
            onChange={setFilterCategory}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">全部类别</Option>
            {categories.map(cat => (
              <Option key={cat.value} value={cat.value}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: cat.color, 
                    marginRight: 6 
                  }} />
                  {cat.label}
                </div>
              </Option>
            ))}
          </Select>
          
          <Button icon={<ReloadOutlined />} onClick={() => setCurrentWeek(dayjs().startOf('week'))}>
            本周
          </Button>
        </Space>
      </WeekHeader>
      
      {viewType === 'week' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Button icon={<LeftOutlined />} onClick={handlePrevWeek}>
              上一周
            </Button>
            
            <Space>
              <CalendarOutlined />
              <Text strong>
                {currentWeek.format('YYYY年MM月DD日')} - {currentWeek.add(6, 'day').format('YYYY年MM月DD日')}
              </Text>
            </Space>
            
            <Button icon={<RightOutlined />} onClick={handleNextWeek}>
              下一周
            </Button>
          </div>
          
          {renderWeekView()}
        </>
      )}
      
      {viewType === 'month' && renderMonthView()}
      
      <Divider>统计信息</Divider>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Text>本周总计:</Text>
          <Text strong>{weekTimeBlocks.length}</Text>
          <Text>项安排</Text>
        </Space>
        
        <Space>
          <Text>已完成:</Text>
          <Text strong style={{ color: '#52c41a' }}>
            {weekTimeBlocks.filter(block => block.completed).length}
          </Text>
          <Text>项</Text>
          
          <Text style={{ marginLeft: 16 }}>完成率:</Text>
          <Text strong style={{ color: '#1890ff' }}>
            {weekTimeBlocks.length > 0 
              ? Math.round((weekTimeBlocks.filter(block => block.completed).length / weekTimeBlocks.length) * 100) 
              : 0}%
          </Text>
        </Space>
        
        <Space>
          <Text>按类别统计:</Text>
          {categories.map(cat => {
            const count = weekTimeBlocks.filter(block => block.category === cat.value).length;
            if (count === 0) return null;
            
            return (
              <Tag key={cat.value} color={cat.color}>
                {cat.label}: {count}项
              </Tag>
            );
          })}
        </Space>
      </Space>
    </StyledCard>
  );
};

export default WeekPlanView; 