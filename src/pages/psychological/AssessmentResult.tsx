import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Tabs,
  Descriptions, 
  Empty,
  Button,
  Spin,
  message
} from 'antd';
import { 
  BarChartOutlined, 
  FileTextOutlined, 
  DownloadOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const ResultHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 576px) {
    margin-top: 16px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;

const AssessmentResult: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [assessmentType, setAssessmentType] = useState<string>('unknown');
  
  useEffect(() => {
    if (!id) {
      navigate('/psychological');
      return;
    }
    
    // 从本地存储中读取结果数据
    const loadResult = () => {
      const resultData = localStorage.getItem(`assessment_${id}`);
      
      if (resultData) {
        const parsedResult = JSON.parse(resultData);
        setResult(parsedResult);
        
        // 从ID中确定测评类型
        if (id.startsWith('mssmhs_')) {
          setAssessmentType('mssmhs');
        } else if (id.startsWith('holland_')) {
          setAssessmentType('holland');
        }
      }
      
      setLoading(false);
    };
    
    // 模拟网络延迟
    setTimeout(loadResult, 1000);
  }, [id, navigate]);
  
  // 返回测评列表
  const goBack = () => {
    navigate('/psychological');
  };
  
  // 打印报告
  const printReport = () => {
    window.print();
  };
  
  // 下载报告
  const downloadReport = () => {
    // 在实际应用中，这里可以生成PDF等格式的报告供下载
    message.info('下载功能尚未实现');
  };
  
  // 分享报告
  const shareReport = () => {
    // 在实际应用中，这里可以实现分享功能
    message.info('分享功能尚未实现');
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>加载测评结果中...</Text>
      </LoadingContainer>
    );
  }
  
  if (!result) {
    return (
      <Container>
        <Empty 
          description="未找到测评结果" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="primary" onClick={goBack}>
            返回测评列表
          </Button>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <StyledCard>
        <ResultHeading>
          <div>
            <Button 
              icon={<ArrowLeftOutlined />} 
              style={{ marginRight: 8 }}
              onClick={goBack}
            >
              返回
            </Button>
            <Title level={4} style={{ margin: 0, display: 'inline' }}>
              {assessmentType === 'mssmhs' 
                ? '中国中学生心理健康量表 (MSSMHS)' 
                : '霍兰德职业兴趣测试 (RIASEC)'}
            </Title>
          </div>
          
          <ActionButtons>
            <Button icon={<PrinterOutlined />} onClick={printReport}>
              打印
            </Button>
            <Button icon={<DownloadOutlined />} onClick={downloadReport}>
              下载
            </Button>
            <Button icon={<ShareAltOutlined />} onClick={shareReport}>
              分享
            </Button>
          </ActionButtons>
        </ResultHeading>
        
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="测评日期">{result.date}</Descriptions.Item>
          <Descriptions.Item label="测评ID">{id}</Descriptions.Item>
          <Descriptions.Item label="完成时间">
            {assessmentType === 'mssmhs' 
              ? `${Object.keys(result.answers).length}/60 题已回答` 
              : `${Object.keys(result.answers).length}/60 题已回答`}
          </Descriptions.Item>
        </Descriptions>
      </StyledCard>
      
      {/* 根据不同的测评类型渲染不同的结果内容 */}
      {assessmentType === 'mssmhs' ? (
        <Tabs defaultActiveKey="summary" style={{ background: '#fff', padding: '16px' }}>
          <TabPane 
            tab={
              <span>
                <BarChartOutlined /> 结果摘要
              </span>
            } 
            key="summary"
          >
            {/* 此处将渲染MSSMHS量表结果 */}
            <div>MSSMHS结果摘要将在这里显示</div>
          </TabPane>
          <TabPane 
            tab={
              <span>
                <FileTextOutlined /> 详细分析
              </span>
            } 
            key="details"
          >
            {/* 此处将渲染MSSMHS详细分析 */}
            <div>MSSMHS详细分析将在这里显示</div>
          </TabPane>
        </Tabs>
      ) : (
        <Tabs defaultActiveKey="summary" style={{ background: '#fff', padding: '16px' }}>
          <TabPane 
            tab={
              <span>
                <BarChartOutlined /> 结果摘要
              </span>
            } 
            key="summary"
          >
            {/* 此处将渲染霍兰德测试结果 */}
            <div>霍兰德测试结果将在这里显示</div>
          </TabPane>
          <TabPane 
            tab={
              <span>
                <FileTextOutlined /> 职业推荐
              </span>
            } 
            key="careers"
          >
            {/* 此处将渲染职业推荐 */}
            <div>霍兰德测试职业推荐将在这里显示</div>
          </TabPane>
        </Tabs>
      )}
    </Container>
  );
};

export default AssessmentResult; 