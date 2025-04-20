export default {
  // NOTE: we follow the Conventional Commits specification
  // view full specification on https://www.conventionalcommits.org/en/v1.0.0
  extends: ['@commitlint/config-conventional'],
  rules: {
    // types declared in Conventional Commits specification & @commitlint/config-conventional
    // see: https://www.conventionalcommits.org/en/v1.0.0/#summary
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    'scope-enum': [
      1,
      'always',
      // scopes
      // see: https://www.conventionalcommits.org/en/v1.0.0/#specification
      [
        // only for 'build(deps)'
        'deps',
        // folder name in src/
        'core',
        'utils',
        // component names
        // add component name here when adding new component
        'button',
        'fab',
        'icon',
        'icon-button',
        'page',
        'ripple',
      ],
    ],
    'body-case': [0],
    'body-max-length': [0],
    'body-max-line-length': [0],
    'subject-case': [0],
  },
};
