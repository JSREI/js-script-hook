import i18next from 'i18next';

/**
 * 获取基于当前语言的链接
 * Get links based on current language
 */
export const getLocalizedLink = (key: string): string => {
  const language = i18next.language.split('-')[0];
  
  // 这里定义可能需要本地化的链接映射表
  const linkMap: Record<string, Record<string, string>> = {
    // GitHub 相关链接
    'github': {
      'zh': 'https://github.com/JSREI/js-script-hook',
      'en': 'https://github.com/JSREI/js-script-hook'
    },
    'issues': {
      'zh': 'https://github.com/JSREI/js-script-hook/issues',
      'en': 'https://github.com/JSREI/js-script-hook/issues'
    },
    'releases': {
      'zh': 'https://github.com/JSREI/js-script-hook/releases',
      'en': 'https://github.com/JSREI/js-script-hook/releases'
    },
    
    // 文档相关链接
    'docs': {
      'zh': 'https://github.com/JSREI/js-script-hook/blob/main/README.md',
      'en': 'https://github.com/JSREI/js-script-hook/blob/main/README.md'
    },
    
    // Greasy Fork 安装链接
    'greasyfork': {
      'zh': 'https://greasyfork.org/zh-CN/scripts/443008-js-script-hook',
      'en': 'https://greasyfork.org/en/scripts/443008-js-script-hook'
    },
    
    // 扩展商店链接
    'tampermonkey': {
      'zh': 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
      'en': 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo'
    },
    'violentmonkey': {
      'zh': 'https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag',
      'en': 'https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag'
    }
  };
  
  // 如果找不到对应语言的链接或者链接本身不存在，返回英文版或空字符串
  if (!linkMap[key]) {
    console.warn(`Link key "${key}" not found in localized links`);
    return '';
  }
  
  return linkMap[key][language] || linkMap[key]['en'] || '';
};

/**
 * 获取语言化的API路径
 * Get localized API paths
 */
export const getLocalizedApiPath = (key: string): string => {
  const language = i18next.language.split('-')[0];
  
  // 这里定义需要本地化的API路径
  const apiMap: Record<string, Record<string, string>> = {
    'contributors': {
      'zh': 'https://api.github.com/repos/JSREI/js-script-hook/contributors?per_page=10',
      'en': 'https://api.github.com/repos/JSREI/js-script-hook/contributors?per_page=10'
    },
    'starHistory': {
      'zh': 'https://api.star-history.com/svg?repos=JSREI/js-script-hook&type=Date',
      'en': 'https://api.star-history.com/svg?repos=JSREI/js-script-hook&type=Date'
    }
  };
  
  if (!apiMap[key]) {
    console.warn(`API key "${key}" not found in localized API paths`);
    return '';
  }
  
  return apiMap[key][language] || apiMap[key]['en'] || '';
}; 