import React from 'react';
import { Typography, Tag, List, Empty, Card, Button, Space } from 'antd';
import { BookOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;

const ResourceTag = styled(Tag)`
  margin: 2px;
  cursor: pointer;
`;

interface WeakPoint {
  subject: string;
  knowledgePoint: string;
  description: string;
  recommendedResources: string[];
}

interface WeakPointsAnalysisProps {
  weakPoints: WeakPoint[];
}

const WeakPointsAnalysis: React.FC<WeakPointsAnalysisProps> = ({ weakPoints }) => {
  if (!weakPoints || weakPoints.length === 0) {
    return <Empty description="暂无薄弱点数据" />;
  }

  // 按学科分组
  const groupedBySubject: { [key: string]: WeakPoint[] } = {};
  
  weakPoints.forEach(point => {
    if (!groupedBySubject[point.subject]) {
      groupedBySubject[point.subject] = [];
    }
    groupedBySubject[point.subject].push(point);
  });

  return (
    <List
      dataSource={Object.entries(groupedBySubject)}
      renderItem={([subject, points]) => (
        <List.Item>
          <Card 
            title={<Space><ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /><span>{subject} 薄弱知识点</span></Space>}
            style={{ width: '100%' }}
            size="small"
          >
            <List
              dataSource={points}
              renderItem={point => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<BookOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
                    title={<Text strong>{point.knowledgePoint}</Text>}
                    description={point.description}
                  />
                  <div>
                    <Paragraph>
                      <Text type="secondary">推荐资源：</Text>
                    </Paragraph>
                    <div>
                      {point.recommendedResources.map((resource, index) => (
                        <ResourceTag 
                          color="green" 
                          key={index}
                          icon={<BookOutlined />}
                          onClick={() => {}}
                        >
                          {resource}
                        </ResourceTag>
                      ))}
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <Button type="link" size="small">
                查看更多 {subject} 弱点分析
              </Button>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default WeakPointsAnalysis; 