import type MagicString from 'magic-string'
import MagicStringStack from 'magic-string-stack'
import type { SourceCodeTransformer } from 'unocss'

export function main(_code: MagicString) {
  const code = new MagicStringStack(_code.toString())

  // no combinator
  code.replace(
    /(?<=class="[\s\S]*?)&\[([\s\S]+?)=\(([^)(]+?)\)(?=[\s\S]*?")/g,
    (_match, variant: string, values: string) => values
      .split(/\s+/g)
      .filter(Boolean)
      .map((value, idx, arr) => `&[${variant}=${value}${arr.length - 1 === idx ? '' : ']'}`)
      .join(','),
  )

  // with combinator
  code.replace(
    /(?<=class="[\s\S]*?)\[(\S+?)&\[([\s\S]+?)=\(([\s\S]+?)\)\](\S*?)\](?=[\s\S]*?")/g,
    (_match, combinatorAhead: string, variant: string, values: string, combinatorBehind: string) => `${values
      .split(/\s+/g)
      .filter(Boolean)
      .map((value, idx, arr) => {
        return `${idx === 0 ? '[' : ''}${combinatorAhead}&[${variant}=${value}${combinatorBehind ? `]${combinatorBehind}` : (arr.length - 1 === idx ? '' : ']')}`
      })
      .join(',')}]${combinatorBehind ? '' : ']'}`,
  )

  // data-attribute
  const matches = code.toString().matchAll(/(?<=class="[\s\S]*?)(\S+:)*?data-\[\S+=\((?<values>[^\)]+)\)\]:([^(]\S+|\([^\)]+\))(?=[\s\S]*?")/g)
  ;[...matches].forEach((match) => {
    const values = match?.groups?.values as unknown as string

    const joinIt = values
      ?.split(/\s/g)
      .filter(Boolean)
      .reduce((acc, value, _idx) => {
        acc.push(match[0].replaceAll(`(${values})`, value))
        return acc
      }, [] as string[])

    code.replace(match[0], joinIt.join(' '))
    code.commit()
  })

  return code.toString()
}

export default {
  name: 'unocss-transformer-attribute-values-group',
  enforce: 'pre',
  transform: (code) => {
    main(code)
  },
} satisfies SourceCodeTransformer
