import transformer from './index'
import { describe, it, expect } from 'vitest'

const main = transformer.transform

describe('group attribute values', () => {

  it('base', () => {
    const base = main('[&[type=(number text)]]:c-red')
    expect(base).toMatchInlineSnapshot('"[&[type=number],&[type=text]]:c-red"')
  })

  it('multi',() => {
    const multi = main('[&[type=(number text)]]:c-red [&[size=(large small middle)]]:p-1')
    expect(multi).toMatchInlineSnapshot('"[&[type=number],&[type=text]]:c-red [&[size=large],&[size=small],&[size=middle]]:p-1"')
  })

  it('multi attribute group', () => {
    const multi = main('[&[type=(number text)],&[aa=(bb cc)]]:c-red')
    expect(multi).toMatchInlineSnapshot('"[&[type=number],&[type=text],&[aa=bb],&[aa=cc]]:c-red"')
  })

  it('with variant group', () => {
    const multi = main('[&[type=(number text)],&[aa=(bb cc)]]:(c-red m-1)')
    expect(multi).toMatchInlineSnapshot('"[&[type=number],&[type=text],&[aa=bb],&[aa=cc]]:(c-red m-1)"')
  })

  it('empty group', () => {
    const empty = main('[&[type=()]]:p-1')
    expect(empty).toMatchInlineSnapshot('"[&[type=()]]:p-1"')
  })
})

describe('group data-attributes values', () => {
  it('base', () => {
    const base = main('data-[xxx=(foo bar)]:p-1')
    expect(base).toMatchInlineSnapshot('"data-[xxx=foo]:p-1 data-[xxx=bar]:p-1"')
  })

  it('multi', () => {
    const multi = main('data-[xxx=(foo bar)]:p-1 data-[yyy=(aaa bbb)]:m-1')
    expect(multi).toMatchInlineSnapshot('"data-[xxx=foo]:p-1 data-[xxx=bar]:p-1 data-[yyy=aaa]:m-1 data-[yyy=bbb]:m-1"')
  })

  it('with variant group', () => {
    const multi = main('data-[xxx=(foo bar)]:(p-1 m-1)')
    expect(multi).toMatchInlineSnapshot('"data-[xxx=foo]:(p-1 m-1) data-[xxx=bar]:(p-1 m-1)"')
  })

  it('empty', () => {
    const empty = main('data-[xxx=()]:p-1')
    expect(empty).toMatchInlineSnapshot('"data-[xxx=()]:p-1"')
  })

  it('more', () => {
    expect(main('data-[xxx=(foo bar)]:(p-1 m-1) data-[yyy=(aa)]:p-1'))
      .toMatchInlineSnapshot('"data-[xxx=foo]:(p-1 m-1) data-[xxx=bar]:(p-1 m-1) data-[yyy=aa]:p-1"')
  })
})

it('together', () => {
  expect(main('[&[type=(number text)]]:c-red data-[xxx=(foo bar)]:p-1'))
    .toMatchInlineSnapshot('"[&[type=number],&[type=text]]:c-red data-[xxx=foo]:p-1 data-[xxx=bar]:p-1"')

  expect(main('data-[xxx=(foo bar)]:p-1 [&[type=(number text)]]:c-red'))
    .toMatchInlineSnapshot('"data-[xxx=foo]:p-1 data-[xxx=bar]:p-1 [&[type=number],&[type=text]]:c-red"')
})