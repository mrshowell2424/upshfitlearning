export default {
  default: {
    override: {
      wrapper: 'cloudflare-node-compat',
      converter: 'cloudflare',
    },
  },
  // Disable self-reference service binding
  cloudflare: {
    serviceBinding: null,
  },
}
