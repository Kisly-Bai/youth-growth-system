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

const NotFound: React.FC = () => {
  return (
    <Container>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button type="primary">
            <Link to="/">返回首页</Link>
          </Button>
        }
      />
    </Container>
  );
};

export default NotFound; 