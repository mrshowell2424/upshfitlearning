export default {
  default: {
    override: {
      wrapper: 'cloudflare-node-compat',
      converter: 'cloudflare',
      incrementalCache: 'cloudflare-kv',
    },
  },
  middleware: {
    external: [],
  },
}
