# use-validate example

A Svelte-Vite SPA to validate an example form
Example use of: svelte-use-validate

### <b>Example config rules</b>

```js
const rulesConfig = {
  day: ["required", { range: { min: 1, max: 31 } }, "dayOk"],
  month: ["required", { range: { min: 1, max: 12 } }],
  name: [
    "required",
    { len: { operator: ">=", len: 3, msg: "length must be at least 3 characters" } },
  ],
  experience: "required",
  html: "get", // if html we require css
  css: "get", // get bool
  js: "jsSkills", // if js we rquire jsSkills
  jsSkills: "required",
  other: "get", // not required
};
```

### <b>jsSkills custom Validator</b>

Toggles between "required" and "get" rules controlled by "js" field value.

```js
// alt rulechain selection to validate an optional jsSkills
addValidator("jsSkills", function () {
  runRuleChain.jsSkills(
    // require skill for js
    this.value ? "required" : "get"
  );
  // this section validator is always OK, so return false
  return false;
});
```