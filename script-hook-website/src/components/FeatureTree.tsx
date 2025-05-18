import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          label: t('featureTree.nodes.main'),
          nodeType: 'main' as const
        },
        type: 'custom'
      },
      
      // 一级节点：Hook功能
      {
        id: 'hook',
        position: { x: windowSize.width / 2 - 300, y: 150 },
        data: { 
          label: t('featureTree.nodes.hook.title'),
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // Hook的子节点
      {
        id: 'request-hook',
        position: { x: windowSize.width / 2 - 500, y: 80 },
        data: { 
          label: t('featureTree.nodes.hook.requestHook.title'),
          description: t('featureTree.nodes.hook.requestHook.description'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'response-hook',
        position: { x: windowSize.width / 2 - 500, y: 180 },
        data: { 
          label: t('featureTree.nodes.hook.responseHook.title'),
          description: t('featureTree.nodes.hook.responseHook.description'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      
      // 一级节点：分析器
      {
        id: 'analyzer',
        position: { x: windowSize.width / 2 - 300, y: 350 },
        data: { 
          label: t('featureTree.nodes.analyzer.title'),
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // 分析器的子节点
      {
        id: 'request-analyzer',
        position: { x: windowSize.width / 2 - 500, y: 290 },
        data: { 
          label: t('featureTree.nodes.analyzer.requestAnalyzer.title'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'response-analyzer',
        position: { x: windowSize.width / 2 - 500, y: 410 },
        data: { 
          label: t('featureTree.nodes.analyzer.responseAnalyzer.title'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      // 请求分析器的子节点
      {
        id: 'callback-detect',
        position: { x: windowSize.width / 2 - 700, y: 250 },
        data: { 
          label: t('featureTree.nodes.analyzer.requestAnalyzer.callbackDetect'),
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      {
        id: 'auto-breakpoint',
        position: { x: windowSize.width / 2 - 700, y: 330 },
        data: { 
          label: t('featureTree.nodes.analyzer.requestAnalyzer.autoBreakpoint.title'),
          description: t('featureTree.nodes.analyzer.requestAnalyzer.autoBreakpoint.description'),
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      // 响应分析器的子节点
      {
        id: 'static-analyze',
        position: { x: windowSize.width / 2 - 700, y: 410 },
        data: { 
          label: t('featureTree.nodes.analyzer.responseAnalyzer.staticAnalyze'),
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      
      // 一级节点：全局设置
      {
        id: 'settings',
        position: { x: windowSize.width / 2 + 150, y: 200 },
        data: { 
          label: t('featureTree.nodes.settings.title'),
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // 全局设置的子节点
      {
        id: 'ui-language',
        position: { x: windowSize.width / 2 + 350, y: 100 },
        data: { 
          label: t('featureTree.nodes.settings.language.title'),
          description: t('featureTree.nodes.settings.language.description'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'hook-method',
        position: { x: windowSize.width / 2 + 350, y: 200 },
        data: { 
          label: t('featureTree.nodes.settings.hookMethod.title'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'flag-options',
        position: { x: windowSize.width / 2 + 350, y: 300 },
        data: { 
          label: t('featureTree.nodes.settings.flagOptions'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      // Hook方式的子节点
      {
        id: 'proxy-method',
        position: { x: windowSize.width / 2 + 580, y: 160 },
        data: { 
          label: t('featureTree.nodes.settings.hookMethod.proxyMethod'),
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      {
        id: 'redeclare-method',
        position: { x: windowSize.width / 2 + 580, y: 240 },
        data: { 
          label: t('featureTree.nodes.settings.hookMethod.redeclareMethod'),
          nodeType: 'tertiary' as const
        },
        type: 'custom'
      },
      
      // 一级节点：UI界面
      {
        id: 'ui',
        position: { x: windowSize.width / 2 + 150, y: 500 },
        data: { 
          label: t('featureTree.nodes.ui.title'), 
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // UI界面的子节点
      {
        id: 'new-url-config',
        position: { x: windowSize.width / 2 + 350, y: 400 },
        data: { 
          label: t('featureTree.nodes.ui.urlConfig.title'),
          description: t('featureTree.nodes.ui.urlConfig.description'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'breakpoint-setting',
        position: { x: windowSize.width / 2 + 350, y: 500 },
        data: { 
          label: t('featureTree.nodes.ui.breakpointSetting'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      {
        id: 'response-breakpoint',
        position: { x: windowSize.width / 2 + 350, y: 600 },
        data: { 
          label: t('featureTree.nodes.ui.responseBreakpoint'),
          nodeType: 'secondary' as const
        },
        type: 'custom'
      },
      
      // 一级节点：控制台
      {
        id: 'console',
        position: { x: windowSize.width / 2 - 300, y: 550 },
        data: { 
          label: t('featureTree.nodes.console.title'),
          nodeType: 'primary' as const
        },
        type: 'custom'
      },
      // 控制台的子节点
      {
        id: 'print-style',
        position: { x: windowSize.width / 2 - 500, y: 550 },
        data: { 
          label: t('featureTree.nodes.console.printStyle'),
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
  }, [windowSize.width, setNodes, setEdges, t]);

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
  const { t } = useTranslation();
  
  return (
    <section id="feature-tree" className="feature-tree">
      <div className="container">
        <div className="section-header">
          <h2>{t('featureTree.title')}</h2>
          <p>{t('featureTree.description')}</p>
        </div>
        <div className="feature-tree-container">
          <ReactFlowProvider>
            <FlowDiagram />
          </ReactFlowProvider>
          <div className="feature-tree-legend">
            <div className="legend-item">
              <div className="legend-color main"></div>
              <span>{t('featureTree.legend.core')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color primary"></div>
              <span>{t('featureTree.legend.mainModule')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color secondary"></div>
              <span>{t('featureTree.legend.subFeature')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color tertiary"></div>
              <span>{t('featureTree.legend.implementation')}</span>
            </div>
          </div>
          <div className="feature-tree-instructions">
            <p>{t('featureTree.instructions')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureTree; 