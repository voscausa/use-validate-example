<script>
  import { validate } from "@voscausa/svelte-use-validate";

  export let packageJson = { name: "project name", version: "0.0.0" };
  console.log(packageJson);

  let submitOK = false;
  const year = new Date().getFullYear();

  // field value defaults
  let defaults = Object.freeze({
    day: "",
    month: "",
    name: "",
    experience: "",
    html: false,
    css: false,
    js: false,
    jsSkills: "",
    other: "",
  });

  let { day, month, name, experience, html, css, js, jsSkills, other } = defaults;

  function reset() {
    ({ day, month, name, experience, html, css, js, jsSkills, other } = defaults);
    submitOK = false;
  }

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
    other: "get", // get but not required
  };

  // reset optional fields
  $: if (!html) css = defaults.css;
  $: if (!js) jsSkills = defaults.jsSkills;

  const notValidMarkers = {}; // not used
  // initialize the validation instance with node.name as the default id
  const { field, OK, addValidator, fieldValues, runRuleChain } = validate(
    { rulesConfig },
    // callback not used
    (id, notValid, value) => {
      // callback to update bindings or signal notValid components
      if (id in notValidMarkers) notValidMarkers[id] = notValid;
    }
  );

  // alt rulechain selection to validate optional required jsSkills
  addValidator("jsSkills", function () {
    runRuleChain.jsSkills(
      // require skill for js
      this.value ? "required" : "get"
    );
    // this section validator is always OK, so return false
    return false;
  });

  function commitForm() {
    console.log("submit: check all rules using OK()");
    submitOK = OK();
    if (submitOK) {
      console.log("validation OK result", fieldValues);
    }
    return false;
  }
</script>

<form id="myform" action="get">
  <fieldset>
    <legend><h3>Svelte Use Validation Example</h3></legend>

    <div class="formgrid">
      <div class="bar-inputs">
        <input
          class="center"
          id="day"
          size="1"
          name="day"
          type="text"
          use:field={{ value: day, controls: [year, month] }}
          bind:value={day}
          placeholder="dd" />
        -
        <input
          class="center"
          id="month"
          size="1"
          name="month"
          type="text"
          use:field={month}
          bind:value={month}
          placeholder="mm" />
        - {year}
      </div>
      <div class="label">date</div>

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

      <textarea id="other" name="other" rows="3" cols="20" use:field={other} bind:value={other} />
      <label for="other">other skills</label>

      <div class="bar-inputs">
        <button type="submit" on:click|preventDefault={commitForm}>SUBMIT</button>
        <button type="reset" class="float-right" on:click|preventDefault={reset}>RESET</button>
      </div>
      <div class="label">form</div>
      <div class:submit-nok={!submitOK} class="bar-inputs center">
        <b>Submit OK: console logs validated fieldValues</b>
      </div>
    </div>
  </fieldset>
</form>

<style>
  /* adapted grid styles from: https://www.sitepoint.com/css-grid-web-form-layout/ */
  input,
  textarea,
  select,
  option,
  button,
  label,
  .label {
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

  label,
  .label {
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
  }

  .bar-inputs:focus-within + .label,
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

  .center {
    text-align: center;
  }

  .hidden {
    visibility: hidden;
  }

  .submit-nok {
    color: red;
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
  .bar-inputs {
    grid-column: 2 / 4;
    width: auto;
    margin: 0;
  }

  input[type="checkbox"],
  label,
  .label,
  input[type="checkbox"] + label,
  textarea + label {
    align-self: center;
  }
</style>
