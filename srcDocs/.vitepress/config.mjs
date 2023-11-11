import { defineConfig } from 'vitepress';

const base = process.env.CONTRAINER_ENV === 'PAGES' ? '/internet_bullshit_words' : '';

export default defineConfig({
  description: ' ',
  base,
  head: [],
  outDir: process.env.CONTRAINER_ENV === 'PAGES' ? '../docs' : './.vitepress/dist',
  appearance: 'force-dark',
  title: 'Bullshit Words - 互联网专业词汇',
  titleTemplate: false,
  themeConfig: {
    darkModeSwitchLabel: false,
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Powered by vitepress'
    },
    nav: false
  }
  
});
