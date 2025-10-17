     window.nextConfig = {
        apiKey: "kLGpgEfCX3iUZG16hpI5zrCH9qxcOdahDY1im6ud",
        debug: false, // Always true since this file only loads in debug mode
        currencyBehavior: 'auto',
        // auto: Change currency when country changes (current)
        // manual: Never auto-change currency
        paymentConfig: {
          expressCheckout: {
            requireValidation: true,
            requiredFields: ['email', 'fname', 'lname'],
            methodOrder: ['paypal', 'apple_pay', 'google_pay']
          }
        },
        addressConfig: {
          defaultCountry: "US",
          showCountries: ["US", "CA", "GB", "BR", "AU", "DE", "FR", "IT", "ES", "NL"],
          dontShowStates: ["AS", "GU", "PR", "VI"]
        },
        discounts: {
          DEMO10: {
            code: "SAVE10",
            type: "percentage",
            value: 10,
            scope: "package",
            packageIds: [2, 3], // Only applies to these package IDs
            description: "10% off entire order",
            combinable: true
          }
        },
        googleMaps: {
          apiKey: "AIzaSyBmrv1QRE41P9FhFOTwUhRMGg6LcFH1ehs",
          region: "US",
          enableAutocomplete: true
        },
        tracking: "auto",
        analytics: {
          enabled: true,
          mode: 'auto', // auto | manual | disabled
          providers: {
            nextCampaign: {
              enabled: true
            },
            gtm: {
              enabled: true,
              settings: {
                containerId: "GTM-MCGB3JBM",
                dataLayerName: "dataLayer"
              }
            },
            facebook: {
              enabled: false,
              settings: {
                pixelId: "286865669194576"
              }
            },
            rudderstack: {
              enabled: false,
              settings: {
                // RudderStack configuration is handled by the RudderStack SDK itself
                // This just enables the adapter
              }
            },
            custom: {
              enabled: false,
              settings: {
                endpoint: "https://your-analytics.com/track",
                apiKey: "your-api-key"
              }
            }
          }
        },
        // Error monitoring removed - add externally via HTML/scripts if needed,
        utmTransfer: {
          enabled: true,
          applyToExternalLinks: false,
          debug: true,
          // excludedDomains: ['example.com', 'test.org'],
          // paramsToCopy: ['utm_source', 'utm_medium']
        }
      };