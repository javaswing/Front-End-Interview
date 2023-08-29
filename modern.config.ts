import { defineConfig, docTools } from '@modern-js/doc-tools';
import path from 'path';

const isProd = () => process.env.NODE_ENV === 'production';

function getI18nHelper(lang: 'zh' | 'en') {
  const cn = lang === 'zh';
  // 默认语言为中文，如果是英文，需要加上 /en 前缀
  // The default language is Chinese, if it is English, you need to add the /en prefix
  const prefix = cn ? '' : '/en';
  const getLink = (str: string) => `${prefix}${str}`;
  const getText = (cnText: string, enText: string) => (cn ? cnText : enText);
  return { getText, getLink };
}

function getNavConfig(lang: 'zh' | 'en') {
  const { getText, getLink } = getI18nHelper(lang);
  return [
    {
      text: getText('首页', 'Home'),
      link: getLink('/'),
    },
  ];
}

function getSidebarConfig(lang: 'zh' | 'en') {
  const { getText, getLink } = getI18nHelper(lang);
  // 注: 侧边栏配置可以嵌套，子菜单字段为 items
  // Note: The sidebar configuration can be nested, and the sub-menu field is items
  return {
    [getLink('/guide')]: [
      {
        collapsed: false,
        collapsible: false,
        text: getText('开始', 'Getting Started'),
        items: [getLink('/guide/introduction')],
      },
      {
        collapsed: false,
        collapsible: false,
        text: getText('网络协议', 'http'),
        items: [getLink('/guide/http/http')],
      },
      {
        text: getText('Javascript相关', 'javascript'),
        items: [getLink('/guide/javascript/javascript'), getLink('/guide/ES6/Decorator')],
      },
      {
        text: getText('手写代码', 'write-code'),
        link: getLink('/guide/write-code/write-code'),
      },
    ],
  };
}

export default defineConfig({
  doc: {
    // https://modernjs.dev/doc-tools/zh/api/config/config-basic.html
    base: isProd() ? '/Front-End-Interview/' : '/',
    root: path.join(__dirname, 'docs'),
    head: [
      `
    <script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?08dd1a00b1e317cd0a730370a212193a";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
    </script>
    `,
    ],
    // 默认语言
    // Default language
    lang: 'zh',
    themeConfig: {
      footer: {
        // 页脚的文案
        // Footer text
        message: '© 2023 JavaSwing  Reserved.',
      },
      // 不同语言的配置
      // Configuration for different languages
      locales: [
        {
          lang: 'zh',
          title: '前端面试手册',
          description: '前端面试手册',
          // nav: getNavConfig('zh'),
          sidebar: getSidebarConfig('zh'),
          // 语言切换按钮的文案
          // Language switch button text
          label: '简体中文',
        },
      ],
    },
  },
  plugins: [docTools()],
});
