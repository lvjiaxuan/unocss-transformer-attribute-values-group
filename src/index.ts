import type MagicString from 'magic-string'
import type { SourceCodeTransformer } from 'unocss'

export function main(code: MagicString) {
  // basic implementation
  code.replace(
    /&\[(.+?)=\(([\s\S]+?)\)/g,
    (_match, variant: string, values: string) => values
      .split(/\s/g)
      .filter(Boolean)
      .map((value, idx, arr) => `&[${variant}=${value}${arr.length - 1 === idx ? '' : ']'}`)
      .join(','),
  )

  const matches = code.toString().matchAll(/data-\[.+?=\((?<values>[\s\S]+?)\)/g)

  const clone = code.clone()
  ;[...matches].forEach((match) => {
    code.replace(match.input, '')
    const values = match?.groups?.values as unknown as string
    values
      ?.split(/\s/g)
      .filter(Boolean)
      .forEach((value, idx) => {
        code.append(`${idx === 0 ? '' : ' '}${clone.toString().replace(`(${values})`, value)}`)
      })
  })

  return code.toString()
}

export default {
  name: 'unocss-transformer-attribute-values-group',
  enforce: 'pre',
  transform: (code) => {
    main(code)
  },
} as SourceCodeTransformer
