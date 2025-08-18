
export interface MetadataItem {
  type: 'packages' | 'app',
  name: string
}

export const REPO_ADDRESS = 'https://github.com/vi-space/visual-platform'

export const Metadata: MetadataItem[] = [
  {
    type: "packages",
    name: "common-ui"
  },
  {
    type: "packages",
    name: 'utils'
  }
]