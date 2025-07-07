  window.dataLayer = window.dataLayer || [];
  window.nextReady = window.nextReady || [];

  window.nextConfig = {
    apiKey: "kLGpgEfCX3iUZG16hpI5zrCH9qxcOdahDY1im6ud",
    debug: true,
    paymentConfig: {
      expressCheckout: {
        enabled: true,
        methods: {
          paypal: true,
          applePay: true,
          googlePay: false
        }
      }
    },
    addressConfig: {
      defaultCountry: "US",
      showCountries: ["US", "CA", "GB"],
      dontShowStates: ["AS", "GU", "PR", "VI"]
    },
    discounts: {
      SAVE10: {
        code: "SAVE10",
        type: "percentage",
        value: 10,
        scope: "order",
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
          enabled: true,
          settings: {
            pixelId: "286865669194576"
          }
        },
        // custom: {
        //   enabled: false,
        //   settings: {
        //     endpoint: "https://your-analytics.com/track",
        //     apiKey: "your-api-key"
        //   }
        // }
      }
    },
  utmTransfer: {
    enabled: true,                    // Enable/disable feature
    applyToExternalLinks: false,      // Apply to external domains
    excludedDomains: ['example.com'], // Domains to exclude
    paramsToCopy: []                  // Specific params (empty = all)
  }

  };