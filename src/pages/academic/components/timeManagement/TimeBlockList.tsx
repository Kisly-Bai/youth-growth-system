import React, { useState } from 'react';
import {
  List,
  Typography,
  Tag,
  Button,
  Space,
  Checkbox,
  Empty,
  Divider,
  Select,
  Input,
  Radio,
  Card,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { TimeBlock } from '../../../../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

// 样式组件
const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const BlockItem = styled(List.Item)<{ completed: boolean }>`
  background-color: ${props => props.completed ? '#f6ffed' : 'white'};
  border-left: 4px solid ${props => props.completed ? '#52c41a' : '#bfbfbf'};
  border-radius: 2px;
  margin-bottom: 8px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TimeTag = styled(Tag)`
  border-radius: 4px;
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

interface TimeBlockListProps {
  timeBlocks: TimeBlock[];
  categories: any[];
  onEdit: (timeBlock: TimeBlock) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, completed: boolean) => void;
}

const TimeBlockList: React.FC<TimeBlockListProps> = ({
  timeBlocks,
  categories,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  // 过滤和排序时间块
  const getFilteredAndSortedBlocks = () => {
    return timeBlocks
      .filter(block => {
        // 搜索过滤
        if (searchText && !block.title.toLowerCase().includes(searchText.toLowerCase())) {
          return false;
        }
        
        // 类别过滤
        if (filterCategory !== 'all' && block.category !== filterCategory) {
          return false;
        }
        
        // 状态过滤
        if (filterStatus === 'completed' && !block.completed) {
          return false;
        }
        if (filterStatus === 'pending' && block.completed) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // 排序
        const dateA = new Date(a.startTime).getTime();
        const dateB = new Date(b.startTime).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  };

  const filteredBlocks = getFilteredAndSortedBlocks();

  // 渲染筛选器
  const renderFilters = () => (
    <Space wrap style={{ marginBottom: 16 }}>
      <Search
        placeholder="搜索时间块"
        allowClear
        style={{ width: 200 }}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        prefix={<SearchOutlined />}
      />
      
      <Select
        placeholder="按类别筛选"
        style={{ width: 140 }}
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
      
      <Radio.Group value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
        <Radio.Button value="all">全部</Radio.Button>
        <Radio.Button value="completed">已完成</Radio.Button>
        <Radio.Button value="pending">待完成</Radio.Button>
      </Radio.Group>
      
      <Button
        icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        {sortOrder === 'asc' ? '从早到晚' : '从晚到早'}
      </Button>
    </Space>
  );

  // 渲染时间块
  const renderTimeBlock = (block: TimeBlock) => {
    const startTime = dayjs(block.startTime);
    const endTime = dayjs(block.endTime);
    const duration = endTime.diff(startTime, 'minute');
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const durationText = `${hours > 0 ? `${hours}小时` : ''}${minutes > 0 ? `${minutes}分钟` : ''}`;

    return (
      <BlockItem completed={block.completed}>
        <List.Item.Meta
          title={
            <Space>
              <Text strong>{block.title}</Text>
              <Tag color={getCategoryColor(block.category, categories)}>
                {getCategoryLabel(block.category, categories)}
              </Tag>
              {block.completed ? (
                <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>
              ) : (
                <Tag icon={<ClockCircleOutlined />} color="processing">进行中</Tag>
              )}
            </Space>
          }
          description={
            <Space direction="vertical" style={{ width: '100%' }}>
              {block.description && <Paragraph>{block.description}</Paragraph>}
              <Space>
                <TimeTag color="blue">
                  开始: {startTime.format('YYYY-MM-DD HH:mm')}
                </TimeTag>
                <TimeTag color="red">
                  结束: {endTime.format('YYYY-MM-DD HH:mm')}
                </TimeTag>
                <TimeTag color="purple">
                  时长: {durationText}
                </TimeTag>
              </Space>
            </Space>
          }
        />
        <Space>
          <Checkbox
            checked={block.completed}
            onChange={e => onUpdateStatus(block.id, e.target.checked)}
          >
            {block.completed ? '已完成' : '完成'}
          </Checkbox>
          <Tooltip title="编辑">
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(block)}
              type="text"
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => onDelete(block.id)}
              type="text"
              danger
            />
          </Tooltip>
        </Space>
      </BlockItem>
    );
  };

  return (
    <StyledCard>
      <Title level={4}>时间块列表</Title>
      
      {renderFilters()}
      
      <Divider />
      
      {filteredBlocks.length > 0 ? (
        <List
          dataSource={filteredBlocks}
          renderItem={renderTimeBlock}
        />
      ) : (
        <Empty 
          description="没有找到符合条件的时间块" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </StyledCard>
  );
};

export default TimeBlockList; 