import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ThemeProvider } from 'styled-components';

// 导入样式和主题
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';

// 导入上下文
import { AuthProvider, useAuth } from './contexts/AuthContext';

// 导入布局
import MainLayout from './layouts/MainLayout';

// 导入页面
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/errors/NotFound';
import Forbidden from './pages/errors/Forbidden';
import PsychologicalAssessment from './pages/psychological/PsychologicalAssessment';
import Phq9 from './pages/psychological/Phq9';
import AssessmentResult from './pages/psychological/AssessmentResult';
import AssessmentHistory from './pages/psychological/AssessmentHistory';
import HealthManagement from './pages/health/HealthManagement';
import HealthRecord from './pages/health/HealthRecord';
import HealthGoals from './pages/health/HealthGoals';
import HealthReport from './pages/health/HealthReport';
import Nutrition from './pages/health/Nutrition';
import AcademicAnalysis from './pages/academic/AcademicAnalysis';
import SAS from './pages/psychological/SAS';
import SES from './pages/psychological/SES';
import CareerPlanning from './pages/career/CareerPlanning';
import HollandTest from './pages/career/HollandTest';
import TestHistory from './pages/career/TestHistory';
import TestResult from './pages/career/TestResult';
// 导入时间管理页面容器，而不是直接导入各个组件
import TimeManagement from './pages/academic/TimeManagement';
// 导入个性化学习页面
import PersonalizedLearning from './pages/learning/PersonalizedLearning';
// 导入新的社区组件
import SimpleCommunity from './pages/community/new/SimpleCommunity';

// 添加成长印记路由的引入
import JournalRoutes from './pages/journal';

// 修改 PrivateRoute 组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    // 正在加载认证状态，显示加载中...
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="正在加载..." />
    </div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{ from: { pathname: window.location.pathname } }} />;
};

// 修改 LayoutWrapper 组件的定义
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

// 添加错误边界组件
class ErrorBoundary extends Component<{ children: ReactNode, fallback?: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode, fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 显示自定义回退UI
      return this.props.fallback || (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>出现了一些问题</h2>
          <p>错误信息: {this.state.error?.message}</p>
          <p>请刷新页面或联系管理员</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <Router>
      <ConfigProvider locale={zhCN}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <ErrorBoundary>
            <AuthProvider>
              <Routes>
                {/* 认证页面 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* 错误页面 */}
                <Route path="/forbidden" element={<Forbidden />} />
                
                {/* 受保护的路由 */}
                <Route element={<PrivateRoute><LayoutWrapper><Outlet /></LayoutWrapper></PrivateRoute>}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/psychological" element={<PsychologicalAssessment />} />
                  <Route path="/psychological/result/:id" element={<AssessmentResult />} />
                  <Route path="/psychological/results/:id" element={<AssessmentResult />} />
                  <Route path="/psychological/history" element={<AssessmentHistory />} />
                  <Route path="/psychological/phq9" element={<Phq9 />} />
                  <Route path="/psychological/assessment/phq9" element={<Phq9 />} />
                  <Route path="/psychological/sas" element={<SAS />} />
                  <Route path="/psychological/ses" element={<SES />} />
                  <Route path="/health" element={<HealthManagement />} />
                  <Route path="/health/record" element={<HealthRecord />} />
                  <Route path="/health/goals" element={<HealthGoals />} />
                  <Route path="/health/report" element={<HealthReport />} />
                  <Route path="/health/nutrition" element={<Nutrition />} />
                  <Route path="/academic" element={<AcademicAnalysis />} />
                  {/* 使用时间管理容器组件 */}
                  <Route path="/academic/time-management/*" element={<TimeManagement />} />
                  {/* 个性化学习路由 */}
                  <Route path="/learning" element={<PersonalizedLearning />} />
                  <Route path="career" element={<CareerPlanning />} />
                  <Route path="career/holland" element={<HollandTest />} />
                  <Route path="career/history" element={<TestHistory />} />
                  <Route path="career/result/:id" element={<TestResult />} />
                  <Route path="community" element={<SimpleCommunity />} />
                  {/* 添加成长印记路由 */}
                  <Route path="journal/*" element={<JournalRoutes />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </ConfigProvider>
    </Router>
  );
};

export default App;
