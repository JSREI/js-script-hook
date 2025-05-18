import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Installation.css';

const Installation: React.FC = () => {
  const { t } = useTranslation();
  // 主安装方式切换（油猴安装 vs 源码编译安装）
  const [installMethod, setInstallMethod] = useState<'userscript' | 'source'>('userscript');
  
  // 源码编译的包管理器选择
  const [packageManager, setPackageManager] = useState<'npm' | 'yarn'>('npm');
  
  // 复制成功提示状态
  const [copySuccess, setCopySuccess] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(index);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const installationGuide = {
    npm: {
      command: 'npm install js-script-hook',
      usage: `
// 直接引入脚本即可自动开始工作
// JS Script Hook会自动拦截document.createElement
// 并为创建的script元素添加钩子

// 可以通过配置控制行为
import { getGlobalConfig } from 'js-script-hook';

// 添加调试规则
getGlobalConfig().debugRules.push({
  // 匹配URL
  urlPattern: "api.example.com/data",
  // JSONP回调参数名
  callbackFunctionName: "callback",
  // 响应匹配规则（可选）
  responsePattern: /\"id\"\\s*:\\s*\"123\"/
});

// 设置钩子实现方式
getGlobalConfig().hookType = "use-proxy-function"; // 或 "use-redeclare-function"`
    },
    yarn: {
      command: 'yarn add js-script-hook',
      usage: `
// 直接引入脚本即可自动开始工作
// JS Script Hook会自动拦截document.createElement
// 并为创建的script元素添加钩子

// 可以通过配置控制行为
import { getGlobalConfig } from 'js-script-hook';

// 添加调试规则
getGlobalConfig().debugRules.push({
  // 匹配URL
  urlPattern: "api.example.com/data",
  // JSONP回调参数名
  callbackFunctionName: "callback",
  // 响应匹配规则（可选）
  responsePattern: /\"id\"\\s*:\\s*\"123\"/
});

// 设置钩子实现方式
getGlobalConfig().hookType = "use-proxy-function"; // 或 "use-redeclare-function"`
    },
    cdn: {
      command: '<script src="https://unpkg.com/js-script-hook@latest/dist/script-hook.min.js"></script>',
      usage: `
<script>
  // JS Script Hook已自动开始工作
  // 可以通过全局配置控制行为
  
  // 添加调试规则
  ScriptHook.getGlobalConfig().debugRules.push({
    // 匹配URL
    urlPattern: "api.example.com/data",
    // JSONP回调参数名
    callbackFunctionName: "callback",
    // 响应匹配规则（可选）
    responsePattern: /\"id\"\\s*:\\s*\"123\"/
  });
  
  // 设置钩子实现方式
  ScriptHook.getGlobalConfig().hookType = "use-proxy-function"; // 或 "use-redeclare-function"
</script>`
    }
  };

  return (
    <section id="installation" className="installation">
      <div className="container">
        <div className="section-header">
          <h2>{t('installation.title')}</h2>
          <p>{t('installation.description')}</p>
        </div>

        {/* 主安装方式选择 */}
        <div className="installation-method-tabs">
          <button 
            className={installMethod === 'userscript' ? 'active' : ''} 
            onClick={() => setInstallMethod('userscript')}
          >
            {t('installation.methods.userscript')}
          </button>
          <button 
            className={installMethod === 'source' ? 'active' : ''} 
            onClick={() => setInstallMethod('source')}
          >
            {t('installation.methods.source')}
          </button>
        </div>

        {/* 油猴脚本安装方式 */}
        {installMethod === 'userscript' && (
          <div className="userscript-installation">
            <div className="installation-steps">
              <h3>{t('installation.userscript.step1.title')}</h3>
              <p>{t('installation.userscript.step1.description')}</p>
              <ul>
                <li>
                  <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener noreferrer">
                    Tampermonkey
                  </a>{t('installation.userscript.step1.recommended')}
                </li>
              </ul>
              
              <h3>{t('installation.userscript.step2.title')}</h3>
              <p>{t('installation.userscript.step2.description')}</p>
              
              <a 
                href="https://greasyfork.org/zh-CN/scripts/419533-js-script-hook" 
                target="_blank" 
                rel="noopener noreferrer"
                className="install-button"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M4 14a1 1 0 0 1 .3-.7l8-8a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-.7.3H5a1 1 0 0 1-1-1v-4z"></path>
                  <path d="M13 3.59l7.41 7.41a1 1 0 0 1 0 1.41l-7.41 7.41"></path>
                  <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"></path>
                </svg>
                {t('installation.userscript.step2.button')}
              </a>
              
              <div className="note-box">
                <h4>{t('installation.userscript.notes.title')}</h4>
                <ul>
                  {(t('installation.userscript.notes.items', { returnObjects: true }) as string[]).map((note: string, index: number) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 源码编译安装方式 */}
        {installMethod === 'source' && (
          <div className="source-installation">
            <div className="source-tabs">
              <button 
                className={packageManager === 'npm' ? 'active' : ''} 
                onClick={() => setPackageManager('npm')}
              >
                {t('installation.source.tabs.npm')}
              </button>
              <button 
                className={packageManager === 'yarn' ? 'active' : ''} 
                onClick={() => setPackageManager('yarn')}
              >
                {t('installation.source.tabs.yarn')}
              </button>
            </div>
            
            <div className="installation-steps">
              <h3>{t('installation.source.step1.title')}</h3>
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '6px',
                    margin: '0',
                    padding: '15px 15px',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e'
                  }}
                  wrapLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: { whiteSpace: 'pre-wrap' }
                  }}
                >
                  {t('installation.source.step1.command')}
                </SyntaxHighlighter>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(t('installation.source.step1.command'), 1)}
                >
                  {copySuccess === 1 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      {t('installation.source.copied')}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      {t('installation.source.copy')}
                    </>
                  )}
                </button>
              </div>

              <h3>{t('installation.source.step2.title')}</h3>
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '6px',
                    margin: '0',
                    padding: '15px 15px',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e'
                  }}
                  wrapLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: { whiteSpace: 'pre-wrap' }
                  }}
                >
                  {t('installation.source.step2.command')}
                </SyntaxHighlighter>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(t('installation.source.step2.command'), 2)}
                >
                  {copySuccess === 2 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      {t('installation.source.copied')}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      {t('installation.source.copy')}
                    </>
                  )}
                </button>
              </div>

              <h3>{t('installation.source.step3.title')}</h3>
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '6px',
                    margin: '0',
                    padding: '15px 15px',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e'
                  }}
                  wrapLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: { whiteSpace: 'pre-wrap' }
                  }}
                >
                  {packageManager === 'npm' 
                    ? t('installation.source.step3.npmCommand')
                    : t('installation.source.step3.yarnCommand')
                  }
                </SyntaxHighlighter>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(
                    packageManager === 'npm' 
                      ? t('installation.source.step3.npmCommand')
                      : t('installation.source.step3.yarnCommand'), 
                    3
                  )}
                >
                  {copySuccess === 3 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      {t('installation.source.copied')}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      {t('installation.source.copy')}
                    </>
                  )}
                </button>
              </div>

              <h3>{t('installation.source.usage.title')}</h3>
              <p>{t('installation.source.usage.description')}</p>
              
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="javascript"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '6px',
                    margin: '0',
                    padding: '15px 15px',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e'
                  }}
                  wrapLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: { whiteSpace: 'pre-wrap' }
                  }}
                >
                  {installationGuide[packageManager].usage}
                </SyntaxHighlighter>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(installationGuide[packageManager].usage, 4)}
                >
                  {copySuccess === 4 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      {t('installation.source.copied')}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      {t('installation.source.copy')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Installation; 