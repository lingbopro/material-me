export default {
  // NOTE: we follow the Conventional Commits specification
  // view full specification on https://www.conventionalcommits.org/en/v1.0.0
  extends: ['@commitlint/config-conventional'],
  rules: {
    // types declared in Conventional Commits specification & @commitlint/config-conventional
    // see: https://www.conventionalcommits.org/en/v1.0.0/#summary
    'type-enum': [2, 'always', ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']],
    'scope-enum': [
      2,
      'always',
      // scopes
      // see: https://www.conventionalcommits.org/en/v1.0.0/#specification
      [
        // folder name in src/
        'core',
        'utils',
        // component names
        // add component name here when adding new component
        'page',
        'ripple',
      ],
    ],
  },
};
