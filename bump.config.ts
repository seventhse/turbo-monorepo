import { defineConfig } from "bumpp";


export default defineConfig({
  push: false,
  printCommits: false,
  commit: "chore(repo): release %s",
  tag: "v%s",
  execute: "pnpm release:prepare",
  all: true
})