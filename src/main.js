import App from "@/App.svelte";
import { name, version } from "../package.json";
import "/assets/css/global.css";

const app = new App({
  target: document.getElementById("app"),
  props: {
    packageJson: { name, version },
  },
});

export default app;
