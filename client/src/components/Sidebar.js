import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "antd";
import AdminConfig from "./AdminConfig";
import ClientConfig from "./ClientConfig";
import UserConfig from "./UserConfig";

const Sidebar = () => {
  const role = useSelector((state) => state.auth.role);
  let menuItems;

  // Choose the appropriate menu configuration based on the role
  if (role === "admin") {
    menuItems = AdminConfig();
  } else if (role === "client") {
    menuItems = ClientConfig();
  } else {
    menuItems = UserConfig();
  }

  // Recursively map the navigation items to Ant Design Menu items
  const getSideNavMenuItem = (navItems) => {
    return navItems.map((nav) => {
      return {
        key: nav.key,
        label: nav.isGroupTitle ? (
          nav.title
        ) : (
          <Link to={nav.path}>{nav.title}</Link> // Use <Link> to handle navigation
        ),
        icon: nav.icon, // Icons are already rendered as JSX, so just pass them
        type: nav.isGroupTitle ? "group" : null, // Handle group titles
        children:
          nav.submenu && nav.submenu.length > 0
            ? getSideNavMenuItem(nav.submenu) // Recursively handle submenus
            : null,
      };
    });
  };

  // Use useMemo to optimize performance, recalculating menu items only when the config changes
  const myMenuItems = useMemo(() => getSideNavMenuItem(menuItems), [menuItems]);

  return (
    <Menu
      mode="inline"
      theme="light"
      style={{ height: "100%", backgroundColor: "#dedede" }}
      items={myMenuItems}
    />
  );
};

export default Sidebar;
