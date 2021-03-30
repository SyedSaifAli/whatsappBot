module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
  "rules": {
    "no-prototype-builtins": "off",
    // "no-console": ["error", { allow: ["warn", "error"] }],
    "indent": [ "error", 2 ],
    "no-trailing-spaces": "error",
    "linebreak-style": [ "error", "unix" ],
    "arrow-spacing": 2, //enforce consistent spacing before and after the arrow in arrow functions
    "comma-spacing": ["error", { "before": false, "after": true }], // enforce 
    "keyword-spacing": ["error", { "before": true, "after": true }], // enforce 
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "always"],
    "space-before-blocks": ["error", { "functions": "always", "keywords": "always", "classes": "always" }],
    "quotes": [ "error", "double" ],
    "semi": [ "error", "always" ]
  }
};