export default {
  name: 'selectores-group',
  enforce: 'pre',
  transform(code) {
    const str = code.toString().replace(
      /(&\[.+?[~^*$]?=)\((.+?)\)/gm,
      (from, pre, values, u) => values
        .split(/\s/g)
        .filter(Boolean)
        .map((v, i, a) => `${pre + v}${ i === a.length - 1 ? '' : ']' }`)
        .join(',')
    ).replace(
      /(data-\[.+?=)\((.+?)\)\]:(\(.+\))?|(\S+)/gm,
      (from, pre, values, u) => {
        console.log({ from, pre, values, u })
        return values
        .split(/\s/g)
        .filter(Boolean)
        .map(i => `${ pre }${i}]:${u}`)
        .join(' ')
      }
    )

    if (typeof code !== 'string' && code.length())
      code.overwrite(0, code.length(), str)
    return str
  },
}