export const config = {
  inputDir: 'import',
  outputDir: 'dist',
  processors: {
    removeWebflowAttributes: {
      enabled: true,
      attributes: ['data-wf-page', 'data-wf-site']
    },
    removeGoogleFontsAndWebflowJS: {
      enabled: true
    },
    removePageblockStyles: {
      enabled: true
    },
    removeFontSmoothingStyles: {
      enabled: true
    },
    convertToRootRelativePaths: {
      enabled: true
    },
    injectCustomCSS: {
      enabled: true
    },
    relocateCampaignScripts: {
      enabled: true,
      dnsPrefetch: [
        '//campaigns.apps.29next.com',
        '//cdn-countries.muddy-wind-c7ca.workers.dev',
        '//cdn.jsdelivr.net'
      ],
      scripts: [
        { src: 'config.js', external: false },
        { src: 'https://cdn.jsdelivr.net/gh/sellmore-co/campaign-cart@v0.2.11/dist/loader.js', external: true, type: 'module' }
      ]
    },
    relocateNextMetaTags: {
      enabled: true
    },
    consolidateInlineCSS: {
      enabled: true
    },
    removeWebflowComment: {
      enabled: true
    },
    removeTrackingScripts: {
      enabled: true
    },
    updateNextProcessScript: {
      enabled: true
    }
  },
  beautify: {
    enabled: true
  },
  filePatterns: {
    html: '**/*.html'
  },
  copyAssets: {
    enabled: true,
    folders: ['css', 'images'],
    customFiles: [
      { from: 'src/static/custom.css', to: 'css/custom.css' },
      { from: 'src/static/components.css', to: 'css/components.css' },
      { from: 'src/static/config.js', to: 'config.js' },
      // { from: 'src/static/loader.js', to: 'loader.js' }
    ]
  }
};

export default config;