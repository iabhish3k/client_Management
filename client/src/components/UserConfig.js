import { DashboardTwoTone, IdcardOutlined } from "@ant-design/icons"; // Import a different icon

const UserConfig = () => {
  return [
    {
      key: "menu",
      icon: <DashboardTwoTone />, // Icon for the group title
      isGroupTitle: true, // To identify as a group
      breadcrumb: false,
      submenu: [
        {
          key: "panvalidation",
          path: `user/pan-validation`,
          title: "Pan Validation",
          icon: <IdcardOutlined />, 
          breadcrumb: false,
          submenu: [],
        },
      ],
    },
  ];
};

export default UserConfig;
