import MagicString from 'magic-string'
import type { SourceCodeTransformer } from '@unocss/core'

export function main(code: MagicString | string) {
  const nameRegexStr = '[\\w-_]+'
  const valueRegexStr = '[\\w-_\\s]+'

  const attributeValuesGroupRegex = new RegExp(`(&\\[${nameRegexStr}=)\\((${valueRegexStr})\\)`, 'gm')
  const dataAttributeValuesGroupRegex = new RegExp(`(data-\\[${nameRegexStr}=)\\((${valueRegexStr})\\)\\]:(${nameRegexStr}|\\(${valueRegexStr}\\))`, 'gm')
  // Remove the newline in parentheses
  const removeRegex = new RegExp(`\\]:\\((${valueRegexStr})\\)`, 'gm')

  const str = code.toString()
    .replace(
      removeRegex,
      (from, variant: string) => `]:(${variant.replace(/[\n\r]?/g, '').replace(/ {2,}/g, ' ')})`,
    ).replace(
      attributeValuesGroupRegex,
      (from, pre, values: string) => values
        .split(/\s/g)
        .filter(Boolean)
        .map((v, i, a) => `${pre + v}${i === a.length - 1 ? '' : ']'}`)
        .join(','),
    ).replace(
      dataAttributeValuesGroupRegex,
      (from, pre, values: string, variant: string) => values
        .split(/\s/g)
        .filter(Boolean)
        .map(i => `${pre}${i}]:${variant.replace(/[\n\r]?/g, '').replace(/ {2,}/g, ' ')}`)
        .join(' '),
    )

  if (typeof code !== 'string' && code.length()) {
    code = new MagicString(code.toString()) // hack? rewrite original magic string
    code.overwrite(0, code.length(), str)
  }

  return str
}

export default {
  name: 'unocss-transformer-attribute-values-group',
  enforce: 'pre',
  transform: main,
} as SourceCodeTransformer
