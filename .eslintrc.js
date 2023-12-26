module.exports = {
  extends: 'airbnb-base',
  rules: {
    quotes: [
      'error',
      'single',
    ],
    'no-underscore-dangle': [{'allow': ["_id"]}],
  },
};
