import { Config } from '@opennextjs/cloudflare'

const config: Config = {
  default: {
    override: {
      wrapper: 'cloudflare-node-compat',
      converter: 'cloudflare',
    },
  },
}

export default config
