import type MagicString from 'magic-string'
import MagicStringStack from 'magic-string-stack'
import type { SourceCodeTransformer } from 'unocss'

export function main(_code: MagicString) {
  const code = new MagicStringStack(_code.toString())

  // group attribute values
  code.replaceAll(
    /([^,[]*?&\[\S+?=)\(([^)]+)\)(\][^,\]]*)/g,
    (_match, pre: string, values: string, suf: string) => {
      const preComma = _match.startsWith(',') ? ',' : ''

      return `${preComma}${values
        .split(/\s+/)
        .filter(Boolean)
        .map((value, _idx, _arr) => `${pre}${value}${suf}`)
        .join(',')}`
    },
  )

  // group data-attribute values
  const matches = code.toString().matchAll(/[^="\s]*data-\[\S+=\((?<values>[^)]+)\)\]:(?:[^(]\S+|\([^<>=]+\))/gi)
  ;[...matches].forEach((match) => {
    const values = match?.groups?.values as string

    const joinIt = values
      ?.split(/\s/)
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
