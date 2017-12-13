module.exports = {
    "env": {
        "jest": true,
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "airbnb",
    "rules": {
      "no-param-reassign": "off", /* sadly, we have to reassign params to deal with props */
      "import/prefer-default-export": "off", /* named exports allow for treeshaking */
      'no-restricted-syntax': [ /* we're omitting for of loops for this. they're pretty neat! */
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      "no-loop-func": "off", /* we create functions within a loop to close over our actions. this is intentional! */
      "linebreak-style": "off", /* we accept those of all line endings */
      "react/prop-types": "off", /* we dont deal with proptypes, sorry */
      "react/react-in-jsx-scope": "off", /* sadly we're not react */
      "react/no-unknown-property": "off", /* ^ */
      "jsx-a11y/heading-has-content": "off" /* these are just for testing */
    }
};
