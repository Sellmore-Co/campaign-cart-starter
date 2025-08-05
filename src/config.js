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
    injectCustomCSS: {
      enabled: true
    },
    relocateCampaignScripts: {
      enabled: true,
      dnsPrefetch: [
        '//campaigns.apps.29next.com',
        '//cdn-countries.muddy-wind-c7ca.workers.dev'
      ],
      scripts: [
        { src: 'config.js', external: false },
        { src: 'loader.js', external: false }
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
      { from: 'src/static/loader.js', to: 'loader.js' }
    ]
  }
};

export default config;