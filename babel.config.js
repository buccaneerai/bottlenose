module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: 'Last 2 Chrome versions, Firefox ESR',
            node: '8.9',
          },
          modules: 'umd'
        },
      ],
      [
        '@babel/preset-react',
        {
          development: process.env.BABEL_ENV !== 'build',
        },
      ],
    ],
    env: {
      build: {
        ignore: [
          '**/*.test.js',
          '**/*.story.js',
          '__snapshots__',
          '__tests__',
          '__stories__',
        ],
      },
      script: {
        presets: [
          ['@babel/env', {modules: 'cjs'}],
        ],
        ignore: [
          '**/*.test.js',
          '**/*.story.js',
          '__snapshots__',
          '__tests__',
          '__stories__',
        ],
      },
      test: {
        ignore: [
          '**/*.story.js',
          '__snapshots__',
          '__tests__',
          '__stories__'
        ]
      }
    }
    // ignore: ['node_modules'],
  };
};
