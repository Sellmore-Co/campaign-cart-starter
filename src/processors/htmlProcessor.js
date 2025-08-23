import * as cheerio from 'cheerio';
import beautify from 'js-beautify';

export class HtmlProcessor {
  constructor(config) {
    this.config = config;
    this.processors = [];
    this.initializeProcessors();
  }

  initializeProcessors() {
    if (this.config.processors.removeWebflowComment?.enabled) {
      this.processors.push(this.removeWebflowComment.bind(this));
    }
    if (this.config.processors.removeWebflowAttributes?.enabled) {
      this.processors.push(this.removeWebflowAttributes.bind(this));
    }
    if (this.config.processors.removeGoogleFontsAndWebflowJS?.enabled) {
      this.processors.push(this.removeGoogleFontsAndWebflowJS.bind(this));
    }
    if (this.config.processors.removePageblockStyles?.enabled) {
      this.processors.push(this.removePageblockStyles.bind(this));
    }
    if (this.config.processors.removeFontSmoothingStyles?.enabled) {
      this.processors.push(this.removeFontSmoothingStyles.bind(this));
    }
    if (this.config.processors.convertToRootRelativePaths?.enabled) {
      this.processors.push(this.convertToRootRelativePaths.bind(this));
    }
    if (this.config.processors.injectCustomCSS?.enabled) {
      this.processors.push(this.injectCustomCSS.bind(this));
    }
    if (this.config.processors.relocateCampaignScripts?.enabled) {
      this.processors.push(this.relocateCampaignScripts.bind(this));
    }
    if (this.config.processors.relocateNextMetaTags?.enabled) {
      this.processors.push(this.relocateNextMetaTags.bind(this));
    }
    if (this.config.processors.consolidateInlineCSS?.enabled) {
      this.processors.push(this.consolidateInlineCSS.bind(this));
    }
    if (this.config.processors.removeTrackingScripts?.enabled) {
      this.processors.push(this.removeTrackingScripts.bind(this));
    }
  }

  async process(html) {
    // Remove the Webflow comment before loading into cheerio
    if (this.config.processors.removeWebflowComment?.enabled) {
      html = html.replace(/<!--\s*Last Published:.*?-->\s*/i, '');
    }
    
    let $ = cheerio.load(html, {
      xmlMode: false,
      decodeEntities: false
    });

    for (const processor of this.processors) {
      $ = await processor($);
    }

    const processedHtml = $.html();
    
    // Beautify the HTML if enabled
    if (this.config.beautify?.enabled !== false) {
      return beautify.html(processedHtml, {
        indent_size: 2,
        indent_char: ' ',
        preserve_newlines: true,
        max_preserve_newlines: 2,
        wrap_line_length: 0,
        wrap_attributes: 'auto',
        wrap_attributes_indent_size: 2,
        end_with_newline: true,
        unformatted: ['script'],  // Remove 'style' from unformatted
        content_unformatted: [],
        extra_liners: [],
        indent_inner_html: true,
        indent_head_inner_html: true,
        indent_body_inner_html: true
      });
    }

    return processedHtml;
  }

  removeWebflowComment($) {
    // Comment removal is handled in the process method before cheerio loads
    return $;
  }

  removeWebflowAttributes($) {
    const attributes = this.config.processors.removeWebflowAttributes.attributes;
    
    attributes.forEach(attr => {
      $(`[${attr}]`).removeAttr(attr);
    });

    return $;
  }

  removeGoogleFontsAndWebflowJS($) {
    // Remove Google Fonts preconnect links
    $('link[href="https://fonts.googleapis.com"][rel="preconnect"]').remove();
    $('link[href="https://fonts.gstatic.com"][rel="preconnect"]').remove();
    
    // Remove WebFont loader script
    $('script[src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"]').remove();
    
    // Remove inline scripts containing WebFont.load
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html();
      if (scriptContent && scriptContent.includes('WebFont.load')) {
        $(elem).remove();
      }
    });
    
    // Remove Webflow w-mod script
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html();
      if (scriptContent && scriptContent.includes('w-mod-') && scriptContent.includes('ontouchstart')) {
        $(elem).remove();
      }
    });
    
    // Remove jQuery script from Cloudfront
    $('script[src*="d3e54v103j8qbb.cloudfront.net"][src*="jquery"]').remove();
    
    // Remove next-staging-core.js script (handles all path variations)
    $('script[src$="next-staging-core.js"]').remove();
    $('script[src*="/next-staging-core.js"]').remove();
    $('script[src="js/next-staging-core.js"]').remove();
    $('script[src="../js/next-staging-core.js"]').remove();
    $('script[src="../../js/next-staging-core.js"]').remove();

    return $;
  }

  removePageblockStyles($) {
    // Remove the pageblock-styles div that contains the campaign-cart.css link
    $('[data-remove-prod]').each((i, elem) => {
      const $elem = $(elem);
      // Check if this contains the campaign-cart.css link
      if ($elem.find('link[href*="campaign-cart.css"]').length > 0) {
        $elem.remove();
      }
    });

    return $;
  }

  removeFontSmoothingStyles($) {
    // Remove the specific style block containing font smoothing and selection styles
    $('style').each((i, elem) => {
      const $elem = $(elem);
      const styleContent = $elem.html();
      
      if (styleContent && 
          styleContent.includes('-webkit-font-smoothing') && 
          styleContent.includes('::selection') && 
          styleContent.includes('.test-mode-indicator')) {
        $elem.remove();
      }
    });

    return $;
  }

  convertToRootRelativePaths($) {
    // Convert all CSS links to use root-relative paths
    $('link[rel="stylesheet"]').each((i, elem) => {
      const $link = $(elem);
      const href = $link.attr('href');
      
      // Skip if already absolute or root-relative
      if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('/')) {
        return;
      }
      
      // Extract the filename from the path
      const filename = href.split('/').pop();
      
      // Convert to root-relative path
      if (filename.includes('.css')) {
        $link.attr('href', `/css/${filename}`);
      }
    });
    
    // Convert all image sources to use root-relative paths
    $('img').each((i, elem) => {
      const $img = $(elem);
      const src = $img.attr('src');
      
      // Skip if already absolute or root-relative
      if (!src || src.startsWith('http') || src.startsWith('//') || src.startsWith('/') || src.startsWith('data:')) {
        return;
      }
      
      // Extract the filename from the path
      const filename = src.split('/').pop();
      
      // Convert to root-relative path
      $img.attr('src', `/images/${filename}`);
    });
    
    return $;
  }

  injectCustomCSS($) {
    // Find the next-staging-core.css link (handles both relative and absolute paths)
    const nextStagingCoreLinks = $('link[href$="next-staging-core.css"]');
    
    nextStagingCoreLinks.each((i, elem) => {
      const $link = $(elem);
      
      // Create the custom.css link with root-relative path
      const customCSSLink = `<link href="/css/custom.css" rel="stylesheet" type="text/css">`;
      
      // Insert it after next-staging-core.css
      $link.after('\n  ' + customCSSLink);
    });

    return $;
  }

  relocateCampaignScripts($) {
    const config = this.config.processors.relocateCampaignScripts;
    
    // First, remove ALL existing campaign-related elements
    $('link[rel="dns-prefetch"][href*="campaigns.apps.29next.com"]').remove();
    $('link[rel="dns-prefetch"][href*="cdn-countries.muddy-wind-c7ca.workers.dev"]').remove();
    
    // Remove various forms of campaign scripts
    $('script[src*="campaign-cart"]').remove();
    $('script[src*="config.js"]').remove();
    $('script[src*="loader.js"]').remove();
    
    // Also remove the specific URLs from the original files
    $('script[src="https://campaign-cart-v2.pages.dev/config.js"]').remove();
    $('script[src="https://campaign-cart-v2.pages.dev/loader.js"]').remove();
    
    // Find the FIRST viewport meta tag only
    const viewportMeta = $('meta[name="viewport"]').first();
    
    if (viewportMeta.length > 0) {
      // Build the campaign scripts block
      let campaignBlock = '\n\n';
      
      // Add DNS prefetch links
      config.dnsPrefetch.forEach(href => {
        campaignBlock += `  <link rel="dns-prefetch" href="${href}">\n`;
      });
      
      // Add empty line before scripts
      campaignBlock += '\n';
      
      // Add script tags with comments
      config.scripts.forEach(script => {
        let scriptSrc = '';
        
        // Check if it's an external script (absolute URL) or local
        if (script.external) {
          scriptSrc = script.src;
        } else {
          // For local files, use root-relative path
          scriptSrc = `/${script.src}`;
        }
        
        // Add appropriate comment
        if (script.src.includes('loader.js')) {
          campaignBlock += `  <!-- Campaign Loader Script -->\n`;
        } else if (script.src.includes('config.js')) {
          campaignBlock += `  <!-- Campaign Configuration -->\n`;
        }
        
        // Build script tag with optional type attribute
        let scriptTag = `  <script src="${scriptSrc}"`;
        if (script.type) {
          scriptTag += ` type="${script.type}"`;
        }
        scriptTag += `></script>\n`;
        
        campaignBlock += scriptTag;
      });
      
      campaignBlock += '\n';
      
      // Insert after FIRST viewport meta only
      viewportMeta.after(campaignBlock);
    }

    return $;
  }

  relocateNextMetaTags($) {
    // Find all meta tags with names containing "next-"
    const nextMetaTags = $('meta[name*="next-"]');
    
    if (nextMetaTags.length > 0) {
      // Remove the meta tags from their current position
      const metaTagsHtml = [];
      nextMetaTags.each((i, elem) => {
        const $elem = $(elem);
        metaTagsHtml.push($elem.prop('outerHTML'));
        $elem.remove();
      });
      
      // Find the last campaign script (loader.js)
      const loaderScript = $('script[src*="loader.js"]').last();
      
      if (loaderScript.length > 0) {
        // Add empty line, comment, then meta tags (no empty line between comment and tags)
        let metaBlock = '\n\n';
        metaBlock += '  <!-- NEXT Metatags -->\n';
        metaTagsHtml.forEach(metaHtml => {
          metaBlock += `  ${metaHtml}\n`;
        });
        
        loaderScript.after(metaBlock);
      }
    }

    return $;
  }

  consolidateInlineCSS($) {
    // Find all custom-css w-embed divs
    const customCssDivs = $('.custom-css.w-embed');
    
    if (customCssDivs.length > 0) {
      const cssBlocks = new Map(); // Use Map to track unique CSS blocks
      
      // Collect all CSS content
      customCssDivs.each((i, elem) => {
        const $div = $(elem);
        const $style = $div.find('style');
        
        if ($style.length > 0) {
          const cssContent = $style.html().trim();
          if (cssContent) {
            // Use the CSS content as key to avoid duplicates
            cssBlocks.set(cssContent, cssContent);
          }
        }
        
        // Remove the original div
        $div.remove();
      });
      
      // If we have CSS to consolidate
      if (cssBlocks.size > 0) {
        // Create consolidated style tag
        let consolidatedCSS = '\n<!-- Consolidated Custom CSS -->\n';
        consolidatedCSS += '<style>\n';
        
        // Add all unique CSS blocks (js-beautify will handle the formatting)
        cssBlocks.forEach((css, index) => {
          consolidatedCSS += css;
          // Add newline between blocks
          if (index < cssBlocks.size - 1) {
            consolidatedCSS += '\n';
          }
        });
        
        consolidatedCSS += '\n</style>\n';
        
        // Insert before closing body tag
        $('body').append(consolidatedCSS);
      }
    }
    
    return $;
  }

  removeTrackingScripts($) {
    // Remove Facebook Pixel script
    $('script').each((i, elem) => {
      const $elem = $(elem);
      const scriptContent = $elem.html();
      
      // Check for Facebook Pixel code
      if (scriptContent && 
          (scriptContent.includes('connect.facebook.net/en_US/fbevents.js') ||
           scriptContent.includes('fbq(') ||
           scriptContent.includes('f.fbq'))) {
        $elem.remove();
      }
      
      // Check for Google Tag Manager code
      if (scriptContent && 
          (scriptContent.includes('googletagmanager.com/gtm.js') ||
           scriptContent.includes('GTM-') ||
           scriptContent.includes('dataLayer'))) {
        $elem.remove();
      }
    });
    
    // Remove Google Tag Manager noscript iframe
    $('noscript').each((i, elem) => {
      const $elem = $(elem);
      const content = $elem.html();
      
      if (content && content.includes('googletagmanager.com/ns.html')) {
        $elem.remove();
      }
    });
    
    return $;
  }

  addProcessor(name, processorFn) {
    this.processors.push(processorFn.bind(this));
  }
}

export default HtmlProcessor;