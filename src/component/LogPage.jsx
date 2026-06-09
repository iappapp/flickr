import { Table, Button, Input, Select, Tag, Space } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const logData = [
  {
    id: 1,
    startTime: '2026-06-09 09:06:52',
    status: 'SUCCESS',
    duration: '59.024s',
    tokens: 14168,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 2,
    startTime: '2026-06-09 08:59:11',
    status: 'SUCCESS',
    duration: '38.078s',
    tokens: 10258,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 3,
    startTime: '2026-06-09 08:53:55',
    status: 'SUCCESS',
    duration: '53.781s',
    tokens: 7314,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 4,
    startTime: '2026-06-08 17:50:14',
    status: 'SUCCESS',
    duration: '75.594s',
    tokens: 15425,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 5,
    startTime: '2026-06-08 17:08:22',
    status: 'SUCCESS',
    duration: '26.921s',
    tokens: 8225,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 6,
    startTime: '2026-06-08 17:03:43',
    status: 'SUCCESS',
    duration: '56.281s',
    tokens: 8910,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 7,
    startTime: '2026-06-08 16:53:19',
    status: 'SUCCESS',
    duration: '40.954s',
    tokens: 14659,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 8,
    startTime: '2026-06-08 16:40:58',
    status: 'SUCCESS',
    duration: '36.206s',
    tokens: 11462,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 9,
    startTime: '2026-06-08 16:36:16',
    status: 'SUCCESS',
    duration: '60.381s',
    tokens: 14203,
    user: 'cdssai',
    trigger: '网页应用',
  },
  {
    id: 10,
    startTime: '2026-06-08 16:03:46',
    status: 'SUCCESS',
    duration: '42.357s',
    tokens: 14230,
    user: 'cdssai',
    trigger: '网页应用',
  },
];

export default function LogPage() {
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 200,
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color="success">{status}</Tag>
      ),
    },
    {
      title: '运行时间',
      dataIndex: 'duration',
      key: 'duration',
      width: 140,
    },
    {
      title: 'TOKENS',
      dataIndex: 'tokens',
      key: 'tokens',
      width: 100,
    },
    {
      title: '用户或账户',
      dataIndex: 'user',
      key: 'user',
      width: 150,
    },
    {
      title: '触发方式',
      dataIndex: 'trigger',
      key: 'trigger',
      width: 150,
      render: () => (
        <Button type="primary" size="small">
          网页应用
        </Button>
      ),
    },
  ];

  return (
    <div className="log-page">
      <div className="log-page-header">
        <div className="log-page-title">日志</div>
        <div className="log-page-subtitle">日志记录了应用的执行情况</div>
      </div>

      <div className="log-filter-bar">
        <Space size="middle" wrap>
          <Button type="default">
            All
          </Button>
          <Button type="default">
            昨过去 7 天
            <CloseOutlined style={{ marginLeft: 8 }} />
          </Button>
          <Input
            placeholder="搜索"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="log-search-input"
          />
        </Space>
      </div>

      <div className="log-table-wrapper">
        <Table
          columns={columns}
          dataSource={logData}
          pagination={{
            pageSize,
            total: logData.length,
            showSizeChanger: true,
            pageSizeOptions: ['4', '25', '50'],
            onShowSizeChange: (current, size) => setPageSize(size),
            showQuickJumper: true,
          }}
          size="middle"
          bordered={true}
        />
      </div>
    </div>
  );
}
