import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "92ioxu",
  e2e: {
    baseUrl: "http://localhost:8080",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  defaultCommandTimeout: 40000
});
