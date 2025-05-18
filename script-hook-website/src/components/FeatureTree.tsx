import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Handle,
  Position,
  MarkerType,
  NodeProps,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import './FeatureTree.css';

// 节点数据类型
interface NodeData {
  label: string;
  description?: string;
  nodeType?: 'main' | 'primary' | 'secondary' | 'tertiary' | 'default';
}

// 自定义节点组件
const CustomNode: React.FC<NodeProps<NodeData>> = ({ data, isConnectable }) => {
  return (
    <div className={`custom-node ${data.nodeType || 'default'}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="custom-node-content">
        <div className="node-label">{data.label}</div>
        {data.description && <div className="node-description">{data.description}</div>}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const FlowDiagram: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: 800
  });

  // 响应式宽度调整
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: 800
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 初始化节点和边
  useEffect(() => {
    // 中心主节点
    const initialNodes = [
      {
        id: 'jsrei',
        position: { x: windowSize.width / 2 - 100, y: 350 },
        data: { 
          label: 'JSREI Script Hook',
          nodeType: 'main' as const
        },
        type: 'custom'
      },
      
      // 一级节点：Hook功能
      {
        id: 'hook',
        position: { x: windowSize.width / 2 - 300, y: 150 },
        data: { 
          label: 'Hook',
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // Hook的子节点
      {
        id: 'request-hook',
        position: { x: windowSize.width / 2 - 500, y: 80 },
        data: { 
          label: '请求之前拦截',
          description: '用于分析请求参数中有的回调参数',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'response-hook',
        position: { x: windowSize.width / 2 - 500, y: 180 },
        data: { 
          label: '响应之后拦截',
          description: '用于分析jsonp响应中有的内容',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      
      // 一级节点：分析器
      {
        id: 'analyzer',
        position: { x: windowSize.width / 2 - 300, y: 350 },
        data: { 
          label: '分析器',
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // 分析器的子节点
      {
        id: 'request-analyzer',
        position: { x: windowSize.width / 2 - 500, y: 290 },
        data: { 
          label: '请求分析器',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'response-analyzer',
        position: { x: windowSize.width / 2 - 500, y: 410 },
        data: { 
          label: '响应分析器',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      // 请求分析器的子节点
      {
        id: 'callback-detect',
        position: { x: windowSize.width / 2 - 700, y: 250 },
        data: { 
          label: '内置算法自动探测jsonp的callback参数',
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      {
        id: 'auto-breakpoint',
        position: { x: windowSize.width / 2 - 700, y: 330 },
        data: { 
          label: '自动给新参数可能的回调方式断点',
          description: '(beta)',
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      // 响应分析器的子节点
      {
        id: 'static-analyze',
        position: { x: windowSize.width / 2 - 700, y: 410 },
        data: { 
          label: '暂未实现，目前采取已经足够',
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      
      // 一级节点：全局设置
      {
        id: 'settings',
        position: { x: windowSize.width / 2 + 150, y: 200 },
        data: { 
          label: '全局设置',
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // 全局设置的子节点
      {
        id: 'ui-language',
        position: { x: windowSize.width / 2 + 350, y: 100 },
        data: { 
          label: '国际化多语言',
          description: '(仅提供简体中文)',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'hook-method',
        position: { x: windowSize.width / 2 + 350, y: 200 },
        data: { 
          label: '两种脚本Hook方式',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'flag-options',
        position: { x: windowSize.width / 2 + 350, y: 300 },
        data: { 
          label: 'Hook Flag选项',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      // Hook方式的子节点
      {
        id: 'proxy-method',
        position: { x: windowSize.width / 2 + 580, y: 160 },
        data: { 
          label: '使用代理函数方式拦Hook',
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      {
        id: 'redeclare-method',
        position: { x: windowSize.width / 2 + 580, y: 240 },
        data: { 
          label: '修改原函数代码覆盖定义',
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      
      // 一级节点：UI界面
      {
        id: 'ui',
        position: { x: windowSize.width / 2 + 150, y: 500 },
        data: { 
          label: 'UI界面', 
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // UI界面的子节点
      {
        id: 'new-url-config',
        position: { x: windowSize.width / 2 + 350, y: 400 },
        data: { 
          label: '新的URL配置界面',
          description: '(可同时配置多个规则)',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'breakpoint-setting',
        position: { x: windowSize.width / 2 + 350, y: 500 },
        data: { 
          label: '是否开启请求断点',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'response-breakpoint',
        position: { x: windowSize.width / 2 + 350, y: 600 },
        data: { 
          label: '是否开启响应断点',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      
      // 一级节点：控制台
      {
        id: 'console',
        position: { x: windowSize.width / 2 - 300, y: 550 },
        data: { 
          label: '控制台',
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // 控制台的子节点
      {
        id: 'print-style',
        position: { x: windowSize.width / 2 - 500, y: 550 },
        data: { 
          label: '表格形式打印',
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
    ];
    
    // 定义连接关系
    const initialEdges = [
      // 主节点到一级节点的连接
      { id: 'jsrei-hook', source: 'jsrei', target: 'hook', animated: true, type: 'smoothstep', style: { stroke: '#e74c3c' }, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'jsrei-analyzer', source: 'jsrei', target: 'analyzer', animated: true, type: 'smoothstep', style: { stroke: '#f1c40f' }, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'jsrei-settings', source: 'jsrei', target: 'settings', animated: true, type: 'smoothstep', style: { stroke: '#3498db' }, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'jsrei-ui', source: 'jsrei', target: 'ui', animated: true, type: 'smoothstep', style: { stroke: '#3498db' }, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'jsrei-console', source: 'jsrei', target: 'console', animated: true, type: 'smoothstep', style: { stroke: '#e74c3c' }, markerEnd: { type: MarkerType.ArrowClosed } },
      
      // Hook连接
      { id: 'hook-request', source: 'hook', target: 'request-hook', type: 'smoothstep', style: { stroke: '#e74c3c' } },
      { id: 'hook-response', source: 'hook', target: 'response-hook', type: 'smoothstep', style: { stroke: '#e74c3c' } },
      
      // 分析器连接
      { id: 'analyzer-request', source: 'analyzer', target: 'request-analyzer', type: 'smoothstep', style: { stroke: '#f1c40f' } },
      { id: 'analyzer-response', source: 'analyzer', target: 'response-analyzer', type: 'smoothstep', style: { stroke: '#f1c40f' } },
      
      // 请求分析器连接
      { id: 'request-callback', source: 'request-analyzer', target: 'callback-detect', type: 'smoothstep', style: { stroke: '#f1c40f' } },
      { id: 'request-auto', source: 'request-analyzer', target: 'auto-breakpoint', type: 'smoothstep', style: { stroke: '#f1c40f' } },
      
      // 响应分析器连接
      { id: 'response-static', source: 'response-analyzer', target: 'static-analyze', type: 'smoothstep', style: { stroke: '#f1c40f' } },
      
      // 全局设置连接
      { id: 'settings-language', source: 'settings', target: 'ui-language', type: 'smoothstep', style: { stroke: '#3498db' } },
      { id: 'settings-hook', source: 'settings', target: 'hook-method', type: 'smoothstep', style: { stroke: '#3498db' } },
      { id: 'settings-flag', source: 'settings', target: 'flag-options', type: 'smoothstep', style: { stroke: '#3498db' } },
      
      // Hook方式连接
      { id: 'hook-proxy', source: 'hook-method', target: 'proxy-method', type: 'smoothstep', style: { stroke: '#3498db' } },
      { id: 'hook-redeclare', source: 'hook-method', target: 'redeclare-method', type: 'smoothstep', style: { stroke: '#3498db' } },
      
      // UI界面连接
      { id: 'ui-config', source: 'ui', target: 'new-url-config', type: 'smoothstep', style: { stroke: '#3498db' } },
      { id: 'ui-breakpoint', source: 'ui', target: 'breakpoint-setting', type: 'smoothstep', style: { stroke: '#3498db' } },
      { id: 'ui-response', source: 'ui', target: 'response-breakpoint', type: 'smoothstep', style: { stroke: '#3498db' } },
      
      // 控制台连接
      { id: 'console-print', source: 'console', target: 'print-style', type: 'smoothstep', style: { stroke: '#e74c3c' } },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [windowSize.width, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="bottom-left"
    >
      <Controls />
      <Background color="#aaa" gap={16} />
      <MiniMap 
        nodeStrokeColor={(n) => {
          if (n.data?.nodeType === 'main') return '#1976d2';
          if (n.data?.nodeType === 'primary') return '#e74c3c';
          return '#333';
        }}
        nodeColor={(n) => {
          if (n.data?.nodeType === 'main') return '#bbdefb';
          if (n.data?.nodeType === 'primary') return '#ffccbc';
          if (n.data?.nodeType === 'secondary') return '#e8f5e9';
          return '#f5f5f5';
        }}
        maskColor="rgba(240, 240, 240, 0.6)"
      />
    </ReactFlow>
  );
};

// 主组件，添加ReactFlowProvider
const FeatureTree: React.FC = () => {
  return (
    <section id="feature-tree" className="feature-tree">
      <div className="container">
        <div className="section-header">
          <h2>功能结构图</h2>
          <p>JS Script Hook 提供的完整功能体系</p>
        </div>
        <div className="feature-tree-container">
          <ReactFlowProvider>
            <FlowDiagram />
          </ReactFlowProvider>
          <div className="feature-tree-legend">
            <div className="legend-item">
              <div className="legend-color main"></div>
              <span>核心功能</span>
            </div>
            <div className="legend-item">
              <div className="legend-color primary"></div>
              <span>主要模块</span>
            </div>
            <div className="legend-item">
              <div className="legend-color secondary"></div>
              <span>子功能</span>
            </div>
            <div className="legend-item">
              <div className="legend-color tertiary"></div>
              <span>实现细节</span>
            </div>
          </div>
          <div className="feature-tree-instructions">
            <p>提示: 可拖动、缩放查看完整功能树，使用小地图快速导航</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureTree; 