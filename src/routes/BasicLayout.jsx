// layouts/BasicLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { useState, useEffect } from 'react';
import { DashboardOutlined, UserOutlined, IconComponent } from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import React from 'react';

// 后端返回的数据格式
const backendMenus = [
  {
    path: "/login",
    name: "仪表盘",
    icon: "DashboardOutlined"
  },
  {
    path: "/stopwatch",
    name: "用户列表",
    icon: "UserOutlined"
  },
  {
    path: "/game",
    name: "2048游戏",
    icon: "GameOutlined"
  },
  {
    path: "/message",
    name: "消息组件",
    icon: "MessageOutlined"
  }, 
  {
    path: "/form",
    name: "表单组件",
    icon: "FormOutlined"
  },
  {
    path: "/loginBox",
    name: "登录控制组件",
    icon: "LoginOutlined"
  },
  {
    path: "/taskListPage",
    name: "任务列表页面",
    icon: "DashboardOutlined"
  }
];

// formatMenus 函数实现
function formatMenus(menus) {
  return menus.map(menu => ({
    key: menu.path,           // 路由路径，用于跳转
    label: menu.name,         // 显示的文字
    icon: getIcon(menu.icon)  // 图标组件
  }));
}

const getIcon = (iconName) => {
  if (!iconName) return null;
  
  // Icons 对象包含了所有图标，如 Icons.DashboardOutlined、Icons.UserOutlined 等
  const IconComponent = Icons[iconName];
  
  // 如果图标存在，返回组件实例；否则返回 null 或默认图标
  return IconComponent ? React.createElement(IconComponent) : null;
};

export default function BasicLayout() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    // 获取菜单配置（通常和路由是同一个接口）
    const menuItems = formatMenus(backendMenus);
    setMenus(menuItems);
  }, []);

  const handleMenuClick = ({ key }) => {
    navigate(key); // 跳转到对应路由
  };

  

  return (
    <div className="layout">
      <Menu
        mode="inline"
        items={menus}
        onClick={handleMenuClick}
      />
      <div className="content">
        <Outlet /> {/* 子路由渲染位置 */}
      </div>
    </div>
  );
}
