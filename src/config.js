export const config = {
  // Source mode: 'local' for import folder, 'sitemap' for live Webflow site
  sourceMode: 'local', // 'local' or 'sitemap'

  // Configuration for sitemap mode
  sitemap: {
    url: 'https://next-staging-core.webflow.io/sitemap',
    baseUrl: 'https://next-staging-core.webflow.io',
    // Optional: Add authentication headers if needed
    headers: {},
    // Optional: Delay between requests (in ms) to avoid rate limiting
    requestDelay: 100
  },

  // Configuration for local mode
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
        { src: 'https://cdn.jsdelivr.net/gh/sellmore-co/campaign-cart@v0.2.28/dist/loader.js', external: true, type: 'module' }
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
      enabled: true,
      extractInlineContent: true,  // Enable inline script and style extraction
      removeExtractedContent: true // Remove scripts/styles from HTML after extraction
    }
  },
  beautify: {
    enabled: true
  },
  filePatterns: {
    html: '**/*.html'
  },
  excludePatterns: {
    folders: ['style-guide', 'demo'], // Folders to exclude
    files: ['playground.html', 'index.html', 'detail_category.html', 'detail_template.html', 'gallery.html', 'page-template.html', 'sale-banners.html', '401.html', '404.html'] // Specific files to exclude
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