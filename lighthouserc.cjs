module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 60_000,
      url: ['http://127.0.0.1:3000/'],
      numberOfRuns: 1,
      settings: {
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 1,
          disabled: false,
        },
        // Chrome's default temporary profile can remain locked on Windows
        // after Lighthouse finishes. Keep the disposable profile inside the
        // already-ignored reports directory so the runner can cleanly exit.
        chromeFlags: '--user-data-dir=.lighthouseci/chrome-profile',
        onlyCategories: ['performance', 'accessibility'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2_000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'interaction-to-next-paint': ['error', { maxNumericValue: 200 }],
        'total-byte-weight': ['error', { maxNumericValue: 1_400_000 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
