import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";
import { Layout } from "antd";
import { selectToken } from "./store/authSlice";
import "bootstrap/dist/css/bootstrap.min.css";
const { Content, Sider } = Layout;

const App = () => {
  const token = useSelector(selectToken);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {token && (
        <Sider
          collapsible
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "auto",
            backgroundColor: "#dedede",
          }}
        >
          <Sidebar />
        </Sider>
      )}
      <Layout>
        <Header />
        <Content>
          <AppRoutes />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
