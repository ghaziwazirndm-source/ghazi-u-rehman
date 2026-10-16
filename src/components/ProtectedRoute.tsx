import React from 'react';
import { AppRole, AppPermission } from '../types/auth';
import { authService } from '../services/AuthService';
import { isRoleAuthorized, hasPermission } from '../permissions/accessControl';
import { AccessDeniedView } from './AccessDeniedView';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
  requiredPermission?: AppPermission;
  currentRoute: string;
  navigate: (route: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  currentRoute,
  navigate,
}) => {
  const currentRole = authService.getCurrentRole();

  // Role check
  if (allowedRoles && allowedRoles.length > 0) {
    if (!isRoleAuthorized(currentRole, allowedRoles)) {
      return (
        <AccessDeniedView
          path={currentRoute}
          userRole={currentRole}
          navigate={navigate}
          requiredRole={allowedRoles.join(' | ')}
        />
      );
    }
  }

  // Permission check
  if (requiredPermission) {
    if (!hasPermission(currentRole, requiredPermission)) {
      return (
        <AccessDeniedView
          path={currentRoute}
          userRole={currentRole}
          navigate={navigate}
          requiredRole={requiredPermission}
        />
      );
    }
  }

  return <>{children}</>;
};
