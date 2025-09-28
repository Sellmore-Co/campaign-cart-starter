import * as cheerio from 'cheerio';
import beautify from 'js-beautify';
import fs from 'fs';
import path from 'path';

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
    if (this.config.processors.updateNextProcessScript?.enabled) {
      this.processors.push(this.updateNextProcessScript.bind(this));
    }
  }

  async process(html, filePath = null) {
    // Store the current file being processed
    this.currentFile = filePath;

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

    // Convert favicon and apple-touch-icon links
    $('link[rel="shortcut icon"], link[rel="icon"], link[rel="apple-touch-icon"]').each((i, elem) => {
      const $link = $(elem);
      const href = $link.attr('href');

      // Skip if already absolute or root-relative
      if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('/')) {
        return;
      }

      // Extract the filename from the path
      const filename = href.split('/').pop();

      // Convert to root-relative path
      $link.attr('href', `/images/${filename}`);
    });

    // Convert all image sources to use root-relative paths
    $('img').each((i, elem) => {
      const $img = $(elem);
      const src = $img.attr('src');
      const srcset = $img.attr('srcset');

      // Process src attribute
      if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('/') && !src.startsWith('data:')) {
        // Extract the filename from the path
        const filename = src.split('/').pop();
        // Convert to root-relative path
        $img.attr('src', `/images/${filename}`);
      }

      // Process srcset attribute if present
      if (srcset) {
        const updatedSrcset = srcset.split(',').map(srcItem => {
          const parts = srcItem.trim().split(/\s+/);
          const url = parts[0];

          // Skip if already absolute or root-relative
          if (url.startsWith('http') || url.startsWith('//') || url.startsWith('/') || url.startsWith('data:')) {
            return srcItem.trim();
          }

          // Extract filename and convert to root-relative
          const filename = url.split('/').pop();
          parts[0] = `/images/${filename}`;
          return parts.join(' ');
        }).join(', ');

        $img.attr('srcset', updatedSrcset);
      }
    });

    // Convert background images in inline styles
    $('[style*="background-image"]').each((i, elem) => {
      const $elem = $(elem);
      const style = $elem.attr('style');

      if (style) {
        // Replace relative URLs in background-image with absolute paths
        const updatedStyle = style.replace(/background-image:\s*url\(['"]?(?!http|\/\/|\/|data:)([^'")]+)['"]?\)/gi,
          (match, url) => {
            const filename = url.split('/').pop();
            return `background-image: url('/images/${filename}')`;
          });

        $elem.attr('style', updatedStyle);
      }
    });

    // Convert any other relative URLs in href attributes (like anchors with images)
    $('a[href*=".png"], a[href*=".jpg"], a[href*=".jpeg"], a[href*=".gif"], a[href*=".svg"], a[href*=".webp"]').each((i, elem) => {
      const $a = $(elem);
      const href = $a.attr('href');

      // Skip if already absolute or root-relative
      if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('/') || href.startsWith('#')) {
        return;
      }

      // Extract the filename from the path
      const filename = href.split('/').pop();

      // Convert to root-relative path
      $a.attr('href', `/images/${filename}`);
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

  updateNextProcessScript($) {
    if (!this.currentFile) return $;

    // Get the base filename without extension and path
    const basename = path.basename(this.currentFile, path.extname(this.currentFile));
    const relativePath = path.relative(this.config.inputDir, this.currentFile);
    const dirPath = path.dirname(relativePath);

    // Extract inline scripts and styles
    const inlineScripts = [];
    const inlineStyles = [];
    let nextProcessScript = null;

    // First, extract the next-process script if it exists
    const $nextProcess = $('#next-process');
    if ($nextProcess.length > 0) {
      const scriptContent = $nextProcess.html();
      if (scriptContent && scriptContent.trim()) {
        // Extract the URLs from the script to determine which file is being loaded
        const localMatch = scriptContent.match(/['"]([^'"]*localhost[^'"]*\.js)['"]/);
        const prodMatch = scriptContent.match(/['"]([^'"]*(?:workers\.dev|cdn)[^'"]*\.js)['"]/);

        let targetFile = null;

        // Try to get filename from local match first (more specific)
        if (localMatch) {
          const localUrl = localMatch[1];
          const parts = localUrl.split('/');
          targetFile = parts[parts.length - 1]; // e.g., 'olympus-mv-full.js'
        }
        // Fallback to production URL
        else if (prodMatch) {
          const prodUrl = prodMatch[1];
          const parts = prodUrl.split('/');
          targetFile = parts[parts.length - 1]; // e.g., 'olympus-mv-selection.js'
        }

        if (targetFile) {
          // Try to read the content from the static file
          const staticFilePath = path.join('src', 'static', targetFile);
          try {
            if (fs.existsSync(staticFilePath)) {
              const staticContent = fs.readFileSync(staticFilePath, 'utf8');
              nextProcessScript = {
                content: staticContent, // Use the actual file content
                targetFile: targetFile
              };
              console.log(`📖 Read static JS content from ${staticFilePath}`);
            } else {
              console.log(`⚠️ Static file not found: ${staticFilePath}`);
              nextProcessScript = {
                content: null,
                targetFile: targetFile
              };
            }
          } catch (error) {
            console.error(`❌ Error reading static file: ${error.message}`);
            nextProcessScript = {
              content: null,
              targetFile: targetFile
            };
          }
        }
      }
    }

    // Extract inline styles
    $('style').each((i, elem) => {
      const $style = $(elem);
      const styleContent = $style.html();

      if (styleContent && styleContent.trim()) {
        // Beautify the CSS content before adding
        const beautifiedCSS = beautify.css(styleContent.trim(), {
          indent_size: 2,
          indent_char: ' ',
          selector_separator_newline: true,
          newline_between_rules: true,
          space_around_combinator: true,
          preserve_newlines: false,
          max_preserve_newlines: 2
        });

        inlineStyles.push(`/* Inline style ${i + 1} from ${basename}.html */\n${beautifiedCSS}`);

        if (this.config.processors.updateNextProcessScript?.removeExtractedContent) {
          $style.remove();
        }
      }
    });

    // Extract inline scripts
    const excludeIds = ['next-process', 'next-config'];
    $('script').each((i, elem) => {
      const $script = $(elem);

      // Skip external scripts and excluded IDs
      if ($script.attr('src') || excludeIds.includes($script.attr('id'))) {
        return;
      }

      // Skip scripts that are part of templates or should stay inline
      if ($script.attr('type') === 'application/json' ||
          $script.attr('type') === 'text/template') {
        return;
      }

      const scriptContent = $script.html();
      if (scriptContent && scriptContent.trim()) {
        // Beautify the script content before adding
        const beautifiedScript = beautify.js(scriptContent.trim(), {
          indent_size: 2,
          indent_char: ' ',
          preserve_newlines: true,
          max_preserve_newlines: 2,
          keep_array_indentation: false,
          break_chained_methods: false,
          indent_scripts: 'normal',
          brace_style: 'collapse',
          space_before_conditional: true,
          unescape_strings: false,
          jslint_happy: false,
          wrap_line_length: 0
        });

        inlineScripts.push(`// Inline script ${i + 1} from ${basename}.html\n${beautifiedScript}`);

        if (this.config.processors.updateNextProcessScript?.removeExtractedContent) {
          $script.remove();
        }
      }
    });

    // Create file paths with folder structure in filename for uniqueness
    const filePrefix = dirPath !== '.' ? dirPath.replace(/[\\\/]/g, '-') + '-' : '';
    const jsFileName = `${filePrefix}${basename}.js`;
    const cssFileName = `${filePrefix}${basename}.css`;

    // Use flat structure - all JS in js/, all CSS in css/
    const outputJsPath = path.join(this.config.outputDir, 'js', jsFileName);
    const outputCssPath = path.join(this.config.outputDir, 'css', cssFileName);

    // Write JS file if we have scripts or next-process content
    if (inlineScripts.length > 0 || nextProcessScript) {
      try {
        // Ensure directory exists
        const jsDir = path.dirname(outputJsPath);
        if (!fs.existsSync(jsDir)) {
          fs.mkdirSync(jsDir, { recursive: true });
        }

        // Build the JS content with static file content at the top if it exists
        let jsContent = `// JavaScript extracted from ${relativePath}\n\n`;

        if (nextProcessScript && nextProcessScript.content) {
          jsContent += `// Content from static file: ${nextProcessScript.targetFile}\n${nextProcessScript.content}\n\n`;
        }

        if (inlineScripts.length > 0) {
          jsContent += inlineScripts.join('\n\n');
        }

        fs.writeFileSync(outputJsPath, jsContent, 'utf8');

        // Don't add script tag here - it will be added when replacing #next-process
        // or at the end if there's no #next-process element
        const jsPath = `/js/${jsFileName}`;
        console.log(`✅ Created ${jsPath}`);
      } catch (error) {
        console.error(`❌ Failed to create JS file: ${error.message}`);
      }
    }

    // Write CSS file if we have styles
    if (inlineStyles.length > 0) {
      try {
        // Ensure directory exists
        const cssDir = path.dirname(outputCssPath);
        if (!fs.existsSync(cssDir)) {
          fs.mkdirSync(cssDir, { recursive: true });
        }

        // Write the CSS file
        const cssContent = `/* CSS extracted from ${relativePath} */\n\n${inlineStyles.join('\n\n')}`;
        fs.writeFileSync(outputCssPath, cssContent, 'utf8');

        // Add link tag to HTML right after custom.css
        const cssPath = `/css/${cssFileName}`;
        const customCssLink = $('link[href="/css/custom.css"]');

        if (customCssLink.length > 0) {
          // Insert the template CSS right after custom.css
          customCssLink.after(`\n  <link href="${cssPath}" rel="stylesheet" type="text/css">`);
        } else {
          // Fallback: append to head if custom.css is not found
          $('head').append(`\n  <link href="${cssPath}" rel="stylesheet" type="text/css">`);
        }

        console.log(`✅ Created ${cssPath}`);
      } catch (error) {
        console.error(`❌ Failed to create CSS file: ${error.message}`);
      }
    }

    // Handle the next-process script replacement
    const $nextProcessElement = $('#next-process');
    if ($nextProcessElement.length > 0) {
      let scriptSrc;

      // If we created a combined JS file with both static and inline content, use that
      if ((inlineScripts.length > 0 || nextProcessScript) && fs.existsSync(outputJsPath)) {
        scriptSrc = `/js/${jsFileName}`;
        console.log(`✅ Using combined JS file: ${scriptSrc}`);
      }
      // Otherwise, if we have just a target file from the next-process script, use it
      else if (nextProcessScript && nextProcessScript.targetFile) {
        scriptSrc = `/js/${nextProcessScript.targetFile}`;
        console.log(`✅ Using static JS file from next-process: ${scriptSrc}`);
      }
      // Default fallback
      else {
        scriptSrc = '/js/olympus-mv-selection.js';
        console.log(`✅ Using default JS file: ${scriptSrc}`);
      }

      const newScript = `<script defer src="${scriptSrc}"></script>`;
      $nextProcessElement.replaceWith(newScript);
    } else if ((inlineScripts.length > 0 || nextProcessScript) && fs.existsSync(outputJsPath)) {
      // No #next-process element, but we created a JS file - add it to the end of body
      const jsPath = `/js/${jsFileName}`;
      $('body').append(`\n  <script defer src="${jsPath}"></script>`);
      console.log(`✅ Added generated JS file to body: ${jsPath}`);
    }

    return $;
  }

  addProcessor(name, processorFn) {
    this.processors.push(processorFn.bind(this));
  }
}

export default HtmlProcessor;