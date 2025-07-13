import { defineConfig } from "bumpp"


export default defineConfig({
  recursive: true,
  commit: "chore(repo): replace",
  tag: 'v%s',
})
