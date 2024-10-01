import {
  DashboardTwoTone,
  UserOutlined,
  TeamOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

const AdminConfig = () => {
  return [
    {
      key: "menu",
      icon: <DashboardTwoTone />, // Group title icon
      isGroupTitle: true, // To identify as a group
      breadcrumb: false,
      submenu: [
        {
          key: "dashboards-default",
          path: `admin/dashboards`,
          title: "Dashboard",
          icon: <DashboardTwoTone />, // Dashboard icon
          breadcrumb: false,
          submenu: [],
        },
        {
          key: "createclient",
          path: `admin/create-client`,
          title: "Create Client",
          icon: <TeamOutlined />, // Client icon (changed from DashboardTwoTone)
          breadcrumb: false,
          submenu: [],
        },
        {
          key: "createusers",
          path: `admin/create-user`,
          title: "Create User",
          icon: <UserOutlined />, // User icon (changed from DashboardTwoTone)
          breadcrumb: false,
          submenu: [],
        },
        {
          key: "panvalidation",
          path: `admin/pan-validation`,
          title: "Pan Validation",
          icon: <FileSearchOutlined />, // PAN Validation icon (changed from DashboardTwoTone)
          breadcrumb: false,
          submenu: [],
        },
      ],
    },
  ];
};

export default AdminConfig;
