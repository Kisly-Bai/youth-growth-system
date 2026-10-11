import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'student' | 'teacher' | 'admin'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 如果认证状态正在加载，显示加载中
  if (loading) {
    return <div>加载中...</div>;
  }

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: location.pathname } }} replace />;
  }

  // 如果指定了允许的角色，并且用户角色不在允许范围内，重定向到无权限页面
  if (allowedRoles.length > 0 && user && (user as any).role && !allowedRoles.includes((user as any).role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // 通过验证，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute; 