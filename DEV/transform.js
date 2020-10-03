function interpolate(resolution, [key, value]) {
  return resolution.replace(new RegExp(`{${key}}`, 'g'), value)
}

export default function transform({ template, modifiers }) {
  return Object
  .entries(modifiers || {})
  .reduce(interpolate, template)
}
