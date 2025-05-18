import React from 'react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

interface LocalizedRichTextProps {
  translationKey: string;
  className?: string;
  variables?: Record<string, string | number>;
  tagName?: keyof JSX.IntrinsicElements;
}

/**
 * 本地化富文本组件
 * 支持HTML内容的i18n翻译，同时确保安全性
 */
const LocalizedRichText: React.FC<LocalizedRichTextProps> = ({
  translationKey,
  className,
  variables = {},
  tagName: TagName = 'div'
}) => {
  const { t } = useTranslation();
  
  // 支持HTML内容的翻译并替换变量
  let htmlContent = t(translationKey, variables);
  
  // 使用DOMPurify清理HTML，防止XSS攻击
  // 注意：DOMPurify需要安装: npm install dompurify @types/dompurify
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  
  return (
    <TagName 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default LocalizedRichText;

// 使用说明：
// 1. 安装DOMPurify: npm install dompurify @types/dompurify
// 2. 在翻译文件中，如zh.json中添加带HTML标签的内容:
//    "richText": {
//      "example": "这是一段<strong>富文本</strong>内容，包含<a href='#'>链接</a>和<em>强调</em>"
//    }
// 3. 在组件中使用:
//    <LocalizedRichText translationKey="richText.example" />
//
// 还可以传递变量:
//    <LocalizedRichText 
//      translationKey="richText.welcome" 
//      variables={{ name: 'John', count: 5 }} 
//    />
//
// 对应的翻译内容: "欢迎 <strong>{{name}}</strong>，您有 {{count}} 条新消息" 