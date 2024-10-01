import { DashboardTwoTone, UserAddOutlined, IdcardOutlined } from "@ant-design/icons";
const ClientConfig = () => {
  return [
    {
      key: "menu",
      icon: <DashboardTwoTone />, // Icon for the group title
      isGroupTitle: true, // To identify as a group
      breadcrumb: false,
      submenu: [
        {
          key: "createuser",
          path: `client/create-user`,
          title: "Create User",
          icon: <UserAddOutlined />,
          breadcrumb: false,
          submenu: [],
        },
        {
          key: "panvalidation",
          path: `client/pan-validation`,
          title: "Pan Validation",
          icon: <IdcardOutlined />, 
          breadcrumb: false,
          submenu: [],
        },
      ],
    },
  ];
};

export default ClientConfig;
