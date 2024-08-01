import type MagicString from 'magic-string'
import MagicStringStack from 'magic-string-stack'
import type { SourceCodeTransformer } from 'unocss'

export function main(_code: MagicString) {
  const code = new MagicStringStack(_code.toString())

  // no combinator
  code.replaceAll(
    /([,[])(\S*?)&\[(\S*?)=\s*\(([^()]+)\)\s*\](\S*?)([,\]])/g,
    (_match, prefix = '', preCombinator = '', attr: string, values: string, sufCombinator = '', suffix = '') => `${prefix}${values
      .split(/\s+/)
      .filter(Boolean)
      .map((value, _idx, _arr) => `${preCombinator}&[${attr}=${value}]${sufCombinator}`)
      .join(',')}${suffix}`,
  )

  // with combinator
  // code.replace(
  //   // /(?<=class(?:name)?="[\s\S]*?)\[(\S+?)&\[([\s\S]+?)=\(([\s\S]+?)\)\](\S*?)\](?=[\s\S]*?")/gi,
  //   //g
  //   (_match, combinatorAhead: string, attr: string, values: string, combinatorBehind: string) => `${values
  //     .split(/\s+/)
  //     .filter(Boolean)
  //     .map((value, idx, arr) => {
  //       return `${idx === 0 ? '[' : ''}${combinatorAhead}&[${attr}=${value}${combinatorBehind ? `]${combinatorBehind}` : (arr.length - 1 === idx ? '' : ']')}`
  //     })
  //     .join(',')}]${combinatorBehind ? '' : ']'}`,
  // )

  // data-attribute
  // const matches = code.toString().matchAll(/(?<=class(?:name)?="[\s\S]*?)(\S+:)*?data-\[\S+=\((?<values>[^)]+)\)\]:([^(]\S+|\([^)]+\))(?=[\s\S]*?")/gi)
  // ;[...matches].forEach((match) => {
  //   const values = match?.groups?.values as unknown as string

  //   const joinIt = values
  //     ?.split(/\s/)
  //     .filter(Boolean)
  //     .reduce((acc, value, _idx) => {
  //       acc.push(match[0].replaceAll(`(${values})`, value))
  //       return acc
  //     }, [] as string[])

  //   code.replace(match[0], joinIt.join(' '))
  //   code.commit()
  // })

  return code.toString()
}

export default {
  name: 'unocss-transformer-attribute-values-group',
  enforce: 'pre',
  transform: (code) => {
    main(code)
  },
} satisfies SourceCodeTransformer
