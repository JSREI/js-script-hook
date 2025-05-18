import React from 'react';
import './WorkflowDiagram.css';

const WorkflowDiagram: React.FC = () => {
  return (
    <section id="workflow" className="workflow">
      <div className="container">
        <div className="section-header">
          <h2>工作原理</h2>
          <p>JS Script Hook 如何拦截和处理脚本请求的生命周期</p>
        </div>

        <div className="workflow-diagram">
          {/* 请求断点部分 */}
          <div className="diagram-block request-point">
            <div className="diagram-label">
              <span>请求断点</span>
              <div className="arrow-line"></div>
            </div>
            <div className="diagram-box">
              <p>浏览器JS使用script标签发起请求</p>
            </div>
          </div>

          {/* 连接箭头 */}
          <div className="diagram-arrow down"></div>

          {/* 服务器处理部分 */}
          <div className="diagram-block server-process">
            <div className="diagram-box yellow-box">
              <p>服务器收到请求处理并返回响应</p>
            </div>
          </div>

          {/* 连接箭头 */}
          <div className="diagram-arrow down"></div>

          {/* 响应断点部分 */}
          <div className="diagram-block response-point">
            <div className="diagram-label">
              <span>响应断点</span>
              <div className="arrow-line"></div>
            </div>
            <div className="diagram-box">
              <p>浏览器收到服务器响应，<br/>回调callback函数处理响应</p>
            </div>
            <div className="optional-note">
              <div className="arrow-line right"></div>
              <span>可选，可能没有回调函数</span>
            </div>
          </div>

          {/* 文本说明 */}
          <div className="diagram-note lifecycle-note">
            <span>一次jsonp请求的生命周期</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagram; 