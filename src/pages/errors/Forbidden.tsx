import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const Forbidden: React.FC = () => {
  return (
    <Container>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面"
        extra={
          <Button type="primary">
            <Link to="/dashboard">返回仪表盘</Link>
          </Button>
        }
      />
    </Container>
  );
};

export default Forbidden; 