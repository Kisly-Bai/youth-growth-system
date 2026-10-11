import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Typography,
  Button,
  Progress,
  Space,
  Statistic,
  List,
  Tag,
  Empty,
  Row,
  Col,
  Badge,
  Modal,
  Tooltip,
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  RiseOutlined,
  WarningOutlined,
  SoundOutlined,
  BellOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { FocusSession } from '../../../../types';

const { Title, Text, Paragraph } = Typography;

// 样式组件
const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const FocusCard = styled(Card)`
  text-align: center;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
`;

const CountdownContainer = styled.div`
  margin: 20px 0;
`;

const CountdownText = styled.div`
  font-size: 64px;
  font-weight: bold;
  line-height: 1.2;
  color: #1890ff;
`;

const SessionTag = styled(Tag)`
  margin: 4px;
  border-radius: 4px;
`;

const StatCard = styled(Card)`
  text-align: center;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 16px;
`;

interface FocusSessionsProps {
  currentSession?: FocusSession | null;
  focusSessions?: FocusSession[];
  onComplete?: (session: FocusSession, completedDuration: number, interruptions: number) => void;
  onCancel?: () => void;
  isHistory?: boolean;
}

const FocusSessions: React.FC<FocusSessionsProps> = ({
  currentSession,
  focusSessions = [],
  onComplete,
  onCancel,
  isHistory = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [interruptions, setInterruptions] = useState(0);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [showBreakTimer, setShowBreakTimer] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60); // 5分钟休息
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breakTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [playSound, setPlaySound] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 初始化计时器
  useEffect(() => {
    if (currentSession) {
      setTimeLeft(currentSession.duration * 60);
      setCompletedDuration(0);
      setInterruptions(0);
      setIsPaused(false);
    }
  }, [currentSession]);

  // 计时器逻辑
  useEffect(() => {
    if (currentSession && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setCompletedDuration(prev => prev + 1/60);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentSession, isPaused, timeLeft]);

  // 专注结束逻辑
  useEffect(() => {
    if (timeLeft === 0 && currentSession) {
      // 播放提示音
      if (playSound && audioRef.current) {
        audioRef.current.play().catch(error => console.error('播放音频失败:', error));
      }
      
      // 显示休息定时器
      setShowBreakTimer(true);
      
      // 启动休息计时器
      breakTimerRef.current = setInterval(() => {
        setBreakTimeLeft(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }
    };
  }, [timeLeft, currentSession, playSound]);

  // 休息结束逻辑
  useEffect(() => {
    if (breakTimeLeft === 0) {
      // 播放提示音
      if (playSound && audioRef.current) {
        audioRef.current.play().catch(error => console.error('播放音频失败:', error));
      }
      
      // 清除休息计时器
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }
      
      // 关闭休息定时器
      setShowBreakTimer(false);
      
      // 重置休息时间
      setBreakTimeLeft(5 * 60);
    }
  }, [breakTimeLeft, playSound]);

  // 处理暂停/继续
  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
      setInterruptions(prev => prev + 1);
    }
  };

  // 处理完成
  const handleComplete = () => {
    if (currentSession && onComplete) {
      onComplete(currentSession, completedDuration, interruptions);
    }
  };

  // 处理取消
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度百分比
  const calculateProgress = () => {
    if (!currentSession) return 0;
    const totalSeconds = currentSession.duration * 60;
    const elapsedSeconds = totalSeconds - timeLeft;
    return Math.round((elapsedSeconds / totalSeconds) * 100);
  };

  // 渲染当前专注会话
  const renderCurrentSession = () => {
    if (!currentSession) return null;

    return (
      <FocusCard>
        <Title level={3}>专注模式</Title>
        <Paragraph>
          <Space>
            <Text>{currentSession.title}</Text>
            <Tag color="blue">计划时长: {currentSession.duration}分钟</Tag>
          </Space>
        </Paragraph>
        
        <CountdownContainer>
          <CountdownText>{formatTime(timeLeft)}</CountdownText>
          <Progress 
            percent={calculateProgress()} 
            status={isPaused ? 'exception' : 'active'} 
            strokeWidth={10}
          />
        </CountdownContainer>
        
        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
            onClick={handleTogglePause}
          >
            {isPaused ? '继续' : '暂停'}
          </Button>
          <Button
            size="large"
            icon={<StopOutlined />}
            onClick={handleComplete}
            disabled={completedDuration < 1}
          >
            完成
          </Button>
          <Button
            danger
            size="large"
            icon={<ReloadOutlined />}
            onClick={handleCancel}
          >
            取消
          </Button>
        </Space>
        
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">已专注时间: {Math.round(completedDuration)}分钟</Text>
          <br />
          <Text type="secondary">中断次数: {interruptions}次</Text>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <Tooltip title={playSound ? '关闭提示音' : '开启提示音'}>
            <Button
              icon={playSound ? <SoundOutlined /> : <StopOutlined />}
              onClick={() => setPlaySound(!playSound)}
              type={playSound ? 'default' : 'dashed'}
            >
              {playSound ? '提示音: 开' : '提示音: 关'}
            </Button>
          </Tooltip>
        </div>
      </FocusCard>
    );
  };
  
  // 渲染休息计时器
  const renderBreakTimer = () => {
    if (!showBreakTimer) return null;
    
    return (
      <Modal
        title={<Space><BellOutlined /> 休息时间到了</Space>}
        open={showBreakTimer}
        footer={[
          <Button 
            key="skip" 
            onClick={() => {
              setShowBreakTimer(false);
              setBreakTimeLeft(5 * 60);
              if (breakTimerRef.current) {
                clearInterval(breakTimerRef.current);
                breakTimerRef.current = null;
              }
            }}
          >
            跳过休息
          </Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>恭喜完成一次专注！</Title>
          <Paragraph>
            建议休息一下眼睛和身体，让大脑得到放松。
          </Paragraph>
          
          <div style={{ margin: '20px 0' }}>
            <CountdownText style={{ color: '#52c41a' }}>{formatTime(breakTimeLeft)}</CountdownText>
            <Progress percent={100 - (breakTimeLeft / (5 * 60)) * 100} status="active" strokeColor="#52c41a" />
          </div>
          
          <ul style={{ textAlign: 'left' }}>
            <li>站起来伸展一下身体</li>
            <li>做一些眼部放松运动</li>
            <li>喝一杯水</li>
            <li>深呼吸几次</li>
          </ul>
        </div>
      </Modal>
    );
  };

  // 渲染专注会话历史
  const renderFocusHistory = () => {
    if (!focusSessions || focusSessions.length === 0) {
      return (
        <Empty 
          description="暂无专注记录" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    // 计算总专注时间和平均专注时间
    const totalFocusDuration = focusSessions.reduce((sum, session) => sum + session.completedDuration, 0);
    const avgFocusDuration = totalFocusDuration / focusSessions.length;
    
    // 计算每日专注次数
    const focusByDay = focusSessions.reduce((acc, session) => {
      const day = dayjs(session.startTime).format('YYYY-MM-DD');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 获取连续专注天数
    const getConsecutiveDays = () => {
      const days = Object.keys(focusByDay).sort();
      if (days.length === 0) return 0;
      
      let consecutiveDays = 1;
      let maxConsecutiveDays = 1;
      
      for (let i = 1; i < days.length; i++) {
        const prevDate = dayjs(days[i-1]);
        const currDate = dayjs(days[i]);
        
        if (currDate.diff(prevDate, 'day') === 1) {
          consecutiveDays++;
        } else {
          maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);
          consecutiveDays = 1;
        }
      }
      
      maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);
      return maxConsecutiveDays;
    };

    return (
      <>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={12} md={6}>
            <StatCard>
              <Statistic 
                title="总专注次数" 
                value={focusSessions.length}
                prefix={<FireOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </StatCard>
          </Col>
          <Col xs={12} md={6}>
            <StatCard>
              <Statistic 
                title="总专注时间" 
                value={Math.round(totalFocusDuration)}
                suffix="分钟"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </StatCard>
          </Col>
          <Col xs={12} md={6}>
            <StatCard>
              <Statistic 
                title="平均专注时长" 
                value={Math.round(avgFocusDuration)}
                suffix="分钟"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </StatCard>
          </Col>
          <Col xs={12} md={6}>
            <StatCard>
              <Statistic 
                title="连续专注天数" 
                value={getConsecutiveDays()}
                suffix="天"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </StatCard>
          </Col>
        </Row>
        
        <StyledCard title="专注历史记录">
          <List
            dataSource={[...focusSessions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
            renderItem={session => {
              const startTime = dayjs(session.startTime);
              const endTime = dayjs(session.endTime);
              const duration = Math.round(session.completedDuration);
              const efficiency = Math.min(100, Math.round((session.completedDuration / session.duration) * 100));
              
              return (
                <List.Item
                  key={session.id}
                  actions={[
                    <Tooltip title="中断次数">
                      <Badge 
                        count={session.interruptions} 
                        style={{ 
                          backgroundColor: session.interruptions > 3 ? '#f5222d' : session.interruptions > 0 ? '#faad14' : '#52c41a',
                        }} 
                        showZero
                      >
                        <WarningOutlined style={{ fontSize: 16 }} />
                      </Badge>
                    </Tooltip>,
                    <Space>
                      <Text type="secondary">效率:</Text>
                      <Progress 
                        percent={efficiency} 
                        size="small" 
                        style={{ width: 80 }}
                        strokeColor={
                          efficiency >= 80 ? '#52c41a' : 
                          efficiency >= 60 ? '#1890ff' : 
                          efficiency >= 40 ? '#faad14' : '#f5222d'
                        }
                      />
                    </Space>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{session.title}</Text>
                        <Tag color="blue">计划: {session.duration}分钟</Tag>
                        <Tag color="green">实际: {duration}分钟</Tag>
                      </Space>
                    }
                    description={
                      <Space wrap>
                        <SessionTag color="blue">
                          开始: {startTime.format('YYYY-MM-DD HH:mm')}
                        </SessionTag>
                        <SessionTag color="red">
                          结束: {endTime.format('YYYY-MM-DD HH:mm')}
                        </SessionTag>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
            pagination={{
              pageSize: 5,
              showTotal: total => `共 ${total} 条记录`,
            }}
          />
        </StyledCard>
      </>
    );
  };

  return (
    <>
      {currentSession && renderCurrentSession()}
      {showBreakTimer && renderBreakTimer()}
      {isHistory && renderFocusHistory()}
    </>
  );
};

export default FocusSessions; 