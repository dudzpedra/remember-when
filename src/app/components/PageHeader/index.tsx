"use client";

import { Typography } from "antd";

const { Title } = Typography;

export default function PageHeader() {
  return (
    <Title level={2}
      style={{
        color: '#fff'
      }}
    >
      Fê e Dudz
    </Title>
  );
}