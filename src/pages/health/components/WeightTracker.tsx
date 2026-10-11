import React, { useState } from 'react';
import { Button, DatePicker, Form, InputNumber, Table, Typography, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #f0f5ff;
  }
`;

interface WeightRecord {
  key: string;
  date: string;
  weight: number;
  notes?: string;
}

const mockWeightRecords: WeightRecord[] = [
  {
    key: '1',
    date: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    weight: 72.5,
    notes: '开始健身计划',
  },
  {
    key: '2',
    date: dayjs().subtract(23, 'day').format('YYYY-MM-DD'),
    weight: 71.8,
    notes: '坚持跑步',
  },
  {
    key: '3',
    date: dayjs().subtract(16, 'day').format('YYYY-MM-DD'),
    weight: 70.9,
    notes: '减少碳水摄入',
  },
  {
    key: '4',
    date: dayjs().subtract(9, 'day').format('YYYY-MM-DD'),
    weight: 70.2,
    notes: '增加蛋白质摄入',
  },
  {
    key: '5',
    date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    weight: 69.5,
    notes: '保持锻炼频率',
  },
];

const WeightTracker: React.FC = () => {
  const [form] = Form.useForm();
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(mockWeightRecords);

  const handleAddRecord = (values: { date: Dayjs; weight: number; notes?: string }) => {
    const newRecord: WeightRecord = {
      key: Date.now().toString(),
      date: values.date.format('YYYY-MM-DD'),
      weight: values.weight,
      notes: values.notes,
    };

    setWeightRecords([...weightRecords, newRecord]);
    form.resetFields();
  };

  const handleDeleteRecord = (key: string) => {
    setWeightRecords(weightRecords.filter(record => record.key !== key));
  };

  const columns: ColumnsType<unknown> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => 
        dayjs((a as WeightRecord).date).unix() - dayjs((b as WeightRecord).date).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: '体重 (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteRecord((record as WeightRecord).key)}
            danger
          />
        </Space>
      ),
    },
  ];

  // 计算体重变化
  const getWeightChange = () => {
    if (weightRecords.length < 2) return null;
    
    const sortedRecords = [...weightRecords].sort((a, b) => 
      dayjs(a.date).unix() - dayjs(b.date).unix()
    );
    
    const oldestWeight = sortedRecords[0].weight;
    const latestWeight = sortedRecords[sortedRecords.length - 1].weight;
    const change = latestWeight - oldestWeight;
    
    return {
      change,
      percentage: ((change / oldestWeight) * 100).toFixed(1),
      isGain: change > 0,
    };
  };

  const weightChange = getWeightChange();

  return (
    <div>
      <Title level={4}>体重记录</Title>
      
      <Form
        form={form}
        layout="inline"
        onFinish={handleAddRecord}
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="date"
          label="日期"
          rules={[{ required: true, message: '请选择日期' }]}
          initialValue={dayjs()}
        >
          <DatePicker />
        </Form.Item>
        
        <Form.Item
          name="weight"
          label="体重 (kg)"
          rules={[{ required: true, message: '请输入体重' }]}
        >
          <InputNumber min={20} max={200} step={0.1} precision={1} />
        </Form.Item>
        
        <Form.Item name="notes" label="备注">
          <input type="text" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            添加记录
          </Button>
        </Form.Item>
      </Form>
      
      {weightChange && (
        <div style={{ marginBottom: 16 }}>
          <Typography.Text>
            体重总变化: 
            <Typography.Text 
              strong
              type={weightChange.isGain ? 'danger' : 'success'}
              style={{ marginLeft: 8 }}
            >
              {weightChange.isGain ? '+' : ''}{weightChange.change.toFixed(1)} kg 
              ({weightChange.isGain ? '+' : ''}{weightChange.percentage}%)
            </Typography.Text>
          </Typography.Text>
        </div>
      )}
      
      <StyledTable 
        dataSource={weightRecords} 
        columns={columns} 
        pagination={false}
        bordered
      />
    </div>
  );
};

export default WeightTracker; 