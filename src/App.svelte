<script>
  import { validate } from "@voscausa/svelte-use-validate";

  export let packageJson = { name: "project name", version: "0.0.0" };
  console.log(packageJson);

  // field value defaults
  let defaults = { name: "", experience: "", html: false, css: false, js: false, jsSkills: "" };
  let { name, experience, html, css, js, jsSkills } = defaults;

  function reset() {
    ({ name, experience, html, css, js, jsSkills } = defaults);
  }

  const rulesConfig = {
    name: [
      "required",
      { len: { operator: ">=", len: 3, msg: "length must be at least 3 characters" } },
    ],
    experience: "required",
    html: "get", // if html we require css
    css: "get", // get bool
    js: "jsSkills", // if js we rquire jsSkills
    jsSkills: "required",
  };

  $: if (!html) css = false;
  $: if (!js) jsSkills = "";

  const notValidMarkers = {};
  // initialize the validation instance with node.name as the default id
  const { field, OK, addValidator, fieldValues, runRuleChain } = validate(
    { rulesConfig },
    (id, notValid, value) => {
      // callback to update bindings or signal notValid components
      if (id in notValidMarkers) notValidMarkers[id] = notValid;
    }
  );

  // alt rulechain selection to validate an optional jsSkills
  addValidator("jsSkills", function () {
    runRuleChain.jsSkills(
      // require skill for js
      this.value ? "required" : "get"
    );
    // this section validator is always OK, so return false
    return false;
  });

  function commitForm() {
    console.log("commit");
    if (OK()) {
      console.log("validation result", fieldValues);
    }
    return false;
  }
</script>

<form id="myform" action="get">
  <fieldset>
    <legend><h3>Use Validation Example</h3></legend>

    <div class="formgrid">
      <input id="name" name="name" type="text" use:field={name} bind:value={name} />
      <label for="name">name</label>

      <select id="experience" name="experience" use:field={experience} bind:value={experience}>
        <option value="">select experience option</option>
        <option value="1">1 year or less</option>
        <option value="2">2 years</option>
        <option value="3">3 - 4 years</option>
        <option value="5">5 years or more</option>
      </select>
      <label for="experience">experience</label>

      <input id="html" name="html" type="checkbox" use:field={html} bind:checked={html} />
      <label for="html">HTML</label>

      <input
        id="css"
        name="css"
        type="checkbox"
        class:hidden={html === false}
        use:field={css}
        bind:checked={css} />
      <label for="css">CSS</label>

      <input id="js" name="js" type="checkbox" use:field={js} bind:checked={js} />
      <label for="js">JavaScript</label>

      <select
        id="jsSkills"
        name="jsSkills"
        class:hidden={js === false}
        use:field={jsSkills}
        bind:value={jsSkills}>
        <option value="">select skill option</option>
        <option value="1">node server side</option>
        <option value="2">browser / V8 client side</option>
        <option value="3">Client + server side</option>
      </select>
      <label for="experience">JavaScript skills</label>

      <textarea id="other" name="other" rows="3" cols="20" />
      <label for="other">other skills</label>

      <div class="button-bar">
        <button type="submit" on:click|preventDefault={commitForm}>SUBMIT</button>
        <button type="reset" class="float-right" on:click|preventDefault={reset}>RESET</button>
      </div>
    </div>
  </fieldset>
</form>

<style>
  /* basic styles more: https://www.sitepoint.com/css-grid-web-form-layout/ */
  input,
  textarea,
  select,
  option,
  button,
  label {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
      "Droid Sans", "Helvetica Neue", sans-serif;
    font-size: 100%;
  }

  legend {
    margin: 1em auto;
    text-align: center;
  }

  fieldset {
    max-width: 40em;
    padding: 4px;
    margin: 2em auto;
    border: 0 none;
  }

  legend {
    font-size: 1.2em;
    width: 100%;
    border-bottom: 1px dotted #99c;
  }

  input,
  textarea,
  select,
  button {
    box-sizing: border-box;
    padding: 0.2em 0.4em;
    margin: 0.2em 0;
    outline: 0 none;
    border: 2px solid inherit;
    box-shadow: none;
  }

  button {
    max-width: 9em;
    padding: 0.2em 2em;
    background-color: #ddd;
    box-shadow: 0 2px 0 #bbb;
    cursor: pointer;
  }

  label {
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
  }

  input:focus + label,
  textarea:focus + label,
  select:focus + label {
    text-decoration: underline;
  }

  input:checked + label {
    font-weight: bold;
  }

  .float-right {
    float: right !important;
  }

  .hidden {
    visibility: hidden;
  }

  /* grid layout */
  .formgrid {
    display: grid;
    grid-template-columns: 1fr 1em 2fr;
    grid-gap: 1.5em 0.6em;
    grid-auto-flow: dense;
    align-items: center;
  }

  input,
  textarea,
  select,
  .button-bar {
    grid-column: 2 / 4;
    width: auto;
    margin: 0;
  }

  input[type="checkbox"],
  label,
  input[type="checkbox"] + label,
  textarea + label {
    align-self: start;
  }
</style>
