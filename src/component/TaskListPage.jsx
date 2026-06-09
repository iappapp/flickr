import { Button, Progress, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React from 'react';

const tasks = [
  {
    id: 1,
    title: '智能创建受试者 DOLI 的1份资料',
    status: '已完成',
    stages: ['OCR解析', '生成病程', '初筛项目', '计算匹配度'],
    progress: 100,
    startTime: '2026-06-09 09:06:02',
    endTime: '2026-06-09 09:11:01',
  },
  {
    id: 2,
    title: '智能创建受试者 DKLI 的1份资料',
    status: '已完成',
    stages: ['OCR解析', '生成病程', '初筛项目', '计算匹配度'],
    progress: 100,
    startTime: '2026-06-09 08:58:41',
    endTime: '2026-06-09 09:04:25',
  },
  {
    id: 3,
    title: '智能创建受试者 DCHU 的1份资料',
    status: '已完成',
    stages: ['OCR解析', '生成病程', '初筛项目', '计算匹配度'],
    progress: 100,
    startTime: '2026-06-09 08:53:35',
    endTime: '2026-06-09 08:57:46',
  },
];

function TaskCard({ task }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-card-title">{task.title}</div>
        <Tag color="success">{task.status}</Tag>
      </div>

      <div className="task-card-stages">
        {task.stages.flatMap((stage, index) => {
          const nodes = [
            <div className="stage-step" key={stage}>
              <div className="stage-icon">✓</div>
              <div className="stage-text">{stage}</div>
            </div>,
          ];

          if (index < task.stages.length - 1) {
            nodes.push(<div className="stage-line" key={`${stage}-line`} />);
          }

          return nodes;
        })}
      </div>

      <div className="task-card-progress-row">
        <div className="progress-info-row">
          <div className="progress-label">导入进度</div>
          <div className="progress-value">{task.progress}%</div>
        </div>
        <Progress percent={task.progress} showInfo={false} strokeColor="#ff4d4f" />
      </div>

      <div className="task-card-times">
        <div className="time-block">
          <div className="time-label">开始时间</div>
          <div className="time-value">{task.startTime}</div>
        </div>
        <div className="time-block">
          <div className="time-label">结束时间</div>
          <div className="time-value">{task.endTime}</div>
        </div>
      </div>
    </div>
  );
}

export default function TaskListPage() {
  return (
    <div className="task-page-drawer">
      <div className="task-page">
        <div className="task-page-header">
          <div className="task-page-title">任务列表</div>
          <Button type="text" icon={<CloseOutlined />} className="task-header-close" />
        </div>

        <div className="task-list">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
