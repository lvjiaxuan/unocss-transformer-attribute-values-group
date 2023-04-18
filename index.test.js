import transformer from './index'
import { describe, it, expect } from 'vitest'

const main = transformer.transform

it('group attribute values', () => {
  const base = main('[&[type=(number text)]]:c-red')
  expect(base).toMatchInlineSnapshot('"[&[type=number],&[type=text]]:c-red"')

  const multi = main('[&[type=(number text)],&[aa=(bb cc)]]:c-red')
  expect(multi).toMatchInlineSnapshot('"[&[type=number],&[type=text],&[aa=bb],&[aa=cc]]:c-red"')

  const multi2 = main('[&[type=(number text)],&[aa=(bb cc)]]:(c-red m-1)')
  expect(multi2).toMatchInlineSnapshot('"[&[type=number],&[type=text],&[aa=bb],&[aa=cc]]:(c-red m-1)"')

  const multi3 = main('[&[type=(number text)]]:c-red [&[size=(large small middle)]]:p-1')
  expect(multi3).toMatchInlineSnapshot('"[&[type=number],&[type=text]]:c-red [&[size=large],&[size=small],&[size=middle]]:p-1"')

  const empty = main('[&[type=()]]:p-1')
  expect(empty).toMatchInlineSnapshot('"[&[type=()]]:p-1"')
})

it('group data attributes values', () => {
  const base = main('data-[xxx=(foo bar)]:p-1')
  expect(base).toMatchInlineSnapshot('"data-[xxx=foo]:p-1 data-[xxx=bar]:p-1"')

  const multi = main('data-[xxx=(foo bar)]:p-1 data-[yyy=(aaa bbb)]:m-1')
  expect(multi).toMatchInlineSnapshot('"data-[xxx=foo]:p-1 data-[yyy=(aaa bbb)]:m-1 data-[xxx=bar]:p-1 data-[yyy=(aaa bbb)]:m-1"')

  const multi2 = main('data-[xxx=(foo bar)]:(p-1 m-1)')
  expect(multi2).toMatchInlineSnapshot('"data-[xxx=foo]:(p-1 m-1) data-[xxx=bar]:(p-1 m-1)"')

  const empty = main('data-[xxx=()]:p-1')
  expect(empty).toMatchInlineSnapshot('"data-[xxx=()]:p-1"')
})