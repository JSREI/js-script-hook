import React from 'react';
import { useTranslation } from 'react-i18next';
import './WorkflowDiagram.css';

const WorkflowDiagram: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section id="workflow" className="workflow">
      <div className="container">
        <div className="section-header">
          <h2>{t('workflow.title')}</h2>
          <p>{t('workflow.description')}</p>
        </div>

        <div className="workflow-diagram">
          {/* 请求断点部分 */}
          <div className="diagram-block request-point">
            <div className="diagram-label">
              <span>{t('workflow.requestPoint')}</span>
              <div className="arrow-line"></div>
            </div>
            <div className="diagram-box">
              <p>{t('workflow.requestDescription')}</p>
            </div>
          </div>

          {/* 连接箭头 */}
          <div className="diagram-arrow down"></div>

          {/* 服务器处理部分 */}
          <div className="diagram-block server-process">
            <div className="diagram-box yellow-box">
              <p>{t('workflow.serverProcess')}</p>
            </div>
          </div>

          {/* 连接箭头 */}
          <div className="diagram-arrow down"></div>

          {/* 响应断点部分 */}
          <div className="diagram-block response-point">
            <div className="diagram-label">
              <span>{t('workflow.responsePoint')}</span>
              <div className="arrow-line"></div>
            </div>
            <div className="diagram-box">
              <p>{t('workflow.responseDescription')}</p>
            </div>
            <div className="optional-note">
              <div className="arrow-line right"></div>
              <span>{t('workflow.optionalNote')}</span>
            </div>
          </div>

          {/* 文本说明 */}
          <div className="diagram-note lifecycle-note">
            <span>{t('workflow.lifecycleNote')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagram; 