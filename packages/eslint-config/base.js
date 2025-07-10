import antfu from "@antfu/eslint-config";


export default (configs, ...args) => {
  return antfu({
    vue: false,
    stylistic: {
      indent: 2,
      quotes: "single"
    },
    ...configs
  }, ...args)
}
