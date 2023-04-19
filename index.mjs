export default {
  name: 'unocss-transformer-attribute-values-group',
  enforce: 'pre',
  transform(code) {
    const nameRegexStr = '[\\w-_]+'
    const valueRegexStr = '[\\w-_\\s]+'

    const attributeValuesGroupRegex = new RegExp(`(&\\[${ nameRegexStr }=)\\((${ valueRegexStr })\\)`, 'gm')
    const dataAttributeValuesGroupRegex = new RegExp(`(data-\\[${ nameRegexStr }=)\\((${ valueRegexStr })\\)\\]:(${ nameRegexStr }|\\(${ valueRegexStr }\\))`, 'gm')

    const str = code.toString().replace(
      attributeValuesGroupRegex,
      (from, pre, values) => values
        .split(/\s/g)
        .filter(Boolean)
        .map((v, i, a) => `${pre + v}${ i === a.length - 1 ? '' : ']' }`)
        .join(',')
    ).replace(
      dataAttributeValuesGroupRegex,
      (from, pre, values, variant) => values
        .split(/\s/g)
        .filter(Boolean)
        .map(i => `${ pre }${i}]:${variant}`)
        .join(' ')
    )

    if (typeof code !== 'string' && code.length())
      code.overwrite(0, code.length(), str)

    return str
  },
}