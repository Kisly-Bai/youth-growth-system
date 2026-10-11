import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  DatePicker,
  Timeline,
  Tag,
  Badge,
  Empty,
  Select,
  Divider,
  Button,
} from 'antd';
import {
  ClockCircleOutlined,
  CalendarOutlined,
  FilterOutlined,
  CaretRightOutlined,
  CaretLeftOutlined,
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

const TimelineItem = styled.div`
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TimeTag = styled(Tag)`
  border-radius: 4px;
  margin: 0 4px;
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

interface TimelineViewProps {
  timeBlocks: TimeBlock[];
  categories: any[];
}

const TimelineView: React.FC<TimelineViewProps> = ({
  timeBlocks,
  categories,
}) => {
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // 获取当前日期的时间块
  const getCurrentDateTimeBlocks = () => {
    return timeBlocks
      .filter(block => {
        const blockDate = dayjs(block.startTime);
        return blockDate.isSame(currentDate, 'day') &&
               (filterCategory === 'all' || block.category === filterCategory);
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  // 处理上一天
  const handlePrevDay = () => {
    setCurrentDate(currentDate.subtract(1, 'day'));
  };

  // 处理下一天
  const handleNextDay = () => {
    setCurrentDate(currentDate.add(1, 'day'));
  };

  const currentDateTimeBlocks = getCurrentDateTimeBlocks();

  return (
    <StyledCard>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>时间线视图</Title>
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
          </Space>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <Button icon={<CaretLeftOutlined />} onClick={handlePrevDay} />
          <DatePicker
            value={currentDate}
            onChange={(date) => date && setCurrentDate(date)}
            allowClear={false}
            style={{ margin: '0 16px' }}
          />
          <Button icon={<CaretRightOutlined />} onClick={handleNextDay} />
        </div>
        
        <Divider>
          <Space>
            <CalendarOutlined />
            <Text>{currentDate.format('YYYY年MM月DD日')}</Text>
            <Tag color="blue">{currentDate.format('dddd')}</Tag>
          </Space>
        </Divider>

        {currentDateTimeBlocks.length > 0 ? (
          <Timeline mode="left">
            {currentDateTimeBlocks.map((block) => {
              const startTime = dayjs(block.startTime);
              const endTime = dayjs(block.endTime);
              const duration = endTime.diff(startTime, 'minute');
              const hours = Math.floor(duration / 60);
              const minutes = duration % 60;
              const durationText = `${hours > 0 ? `${hours}小时` : ''}${minutes > 0 ? `${minutes}分钟` : ''}`;
              
              return (
                <Timeline.Item
                  key={block.id}
                  color={getCategoryColor(block.category, categories)}
                  label={
                    <Space>
                      <Text strong>{startTime.format('HH:mm')}</Text>
                      <Text type="secondary">→</Text>
                      <Text strong>{endTime.format('HH:mm')}</Text>
                    </Space>
                  }
                >
                  <TimelineItem>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <Text strong>{block.title}</Text>
                        <TimeTag color={getCategoryColor(block.category, categories)}>
                          {getCategoryLabel(block.category, categories)}
                        </TimeTag>
                        {block.completed ? (
                          <Badge status="success" text="已完成" />
                        ) : (
                          <Badge status="processing" text="进行中" />
                        )}
                      </Space>
                      
                      {block.description && (
                        <Paragraph style={{ margin: '4px 0' }}>
                          {block.description}
                        </Paragraph>
                      )}
                      
                      <TimeTag color="purple">
                        <Space>
                          <ClockCircleOutlined />
                          <Text>持续时间: {durationText}</Text>
                        </Space>
                      </TimeTag>
                    </Space>
                  </TimelineItem>
                </Timeline.Item>
              );
            })}
          </Timeline>
        ) : (
          <Empty 
            description={`${currentDate.format('YYYY-MM-DD')} 没有安排时间块`} 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Space>
    </StyledCard>
  );
};

export default TimelineView; 