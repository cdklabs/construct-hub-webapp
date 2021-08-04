const defaultSrc = "default-src 'none';";
const imgSrc = "img-src 'self' https://* http://*;";

let scriptSrc = "script-src 'self' https://*.awsstatic.com;";

if (process.env.NODE_ENV === "development") {
  scriptSrc = scriptSrc.replace(";", " 'unsafe-eval' 'unsafe-inline';"); // HMR
}

const styleSrc = "style-src 'unsafe-inline' 'self';";
const objectSrc = "object-src 'none';";
const connectSrc = "connect-src 'self' https://*.shortbread.aws.dev;";
const manifestSrc = "manifest-src 'self';";
const fontSrc = "font-src 'self';";
const frameSrc = "frame-src 'none';";

const contentSecurityPolicy = {
  key: "Content-Security-Policy",
  value: [
    defaultSrc,
    imgSrc,
    scriptSrc,
    styleSrc,
    objectSrc,
    connectSrc,
    manifestSrc,
    fontSrc,
    frameSrc,
  ].join(" "),
};

const xFrameOptions = {
  key: "X-Frame-Options",
  value: "deny",
};

const xXSSProtection = {
  key: "X-XSS-Protection",
  value: "1; mode=block",
};

const xContentTypeOptions = {
  key: "X-Content-Type-Options",
  value: "nosniff",
};

const strictTransportSecurity = {
  key: "Strict-Transport-Security",
  value: "max-age=47304000; includeSubDomains; preload",
};

const securityHeaders = [
  contentSecurityPolicy,
  xFrameOptions,
  xXSSProtection,
  xContentTypeOptions,
  strictTransportSecurity,
];

module.exports = {
  serverRuntimeConfig: {
    apiUrl: "https://construct-hub-testing.dev-tools.aws.dev",
  },
  eslint: {
    // We already run eslint during our build with projen, running again with next is redundant
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // Apply to all routes in application
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
