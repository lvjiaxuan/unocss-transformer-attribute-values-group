import type MagicString from 'magic-string'
import type { SourceCodeTransformer } from 'unocss'
import { defaultSplitRE, splitWithVariantGroupRE } from 'unocss'

export function main(code: MagicString) {
  // no combinator
  code.replace(
    /(?<=class=".*?)&\[(.+?)=\(([\s\S]+?)\)(?=.*?")/g,
    (_match, variant: string, values: string) => values
      .split(/\s/g)
      .filter(Boolean)
      .map((value, idx, arr) => `&[${variant}=${value}${arr.length - 1 === idx ? '' : ']'}`)
      .join(','),
  )

  // with combinator
  code.replace(
    /(?<=class=".*?)\[(\S*?)&\[(.+?)=\(([\s\S]+?)\)\](\S*?)\](?=.*?")/g,
    (_match, combinatorAhead: string, variant: string, values: string, combinatorBehind: string) => `${values
      .split(/\s/g)
      .filter(Boolean)
      .map((value, idx, arr) => {
        return `${idx === 0 ? '[' : ''}${combinatorAhead}&[${variant}=${value}${combinatorBehind ? `]${combinatorBehind}` : (arr.length - 1 === idx ? '' : ']')}`
      })
      .join(',')}]${combinatorBehind ? '' : ']'}`,
  )

  // const matches = code.toString().matchAll(/data-\[.+?=\((?<values>[\s\S]+?)\)/g)

  // const clone = code.clone()
  // ;[...matches].forEach((match) => {
  //   code.replace(match.input, '')
  //   const values = match?.groups?.values as unknown as string
  //   values
  //     ?.split(/\s/g)
  //     .filter(Boolean)
  //     .forEach((value, idx) => {
  //       code.append(`${idx === 0 ? '' : ' '}${clone.toString().replace(`(${values})`, value)}`)
  //     })
  // })

  return code.toString()
}

export default {
  name: 'unocss-transformer-attribute-values-group',
  enforce: 'pre',
  transform: (code) => {
    main(code)
  },
} as SourceCodeTransformer
