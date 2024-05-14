import { describe, expect, it } from 'vitest'
import MagicString from 'magic-string'
import { main } from '../src'

describe.skip('group attribute values', () => {
  it('basic', () => {
    expect(
      main(new MagicString('[&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"[&[type=number],&[type=text]]:c-red"`)
  })

  it('with operator', () => {
    expect(
      main(new MagicString('[&[type^=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"[&[type^=number],&[type^=text]]:c-red"`)
  })

  it('with combinator', () => {
    expect(
      main(new MagicString('[.foo,&[type=(number text)]~.bar]:c-red')),
    ).toMatchInlineSnapshot()

    expect(
      main(new MagicString('[.foo+&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot()
  })

  it('with operator', () => {
    expect(
      main(new MagicString('[&[type^=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"[&[type^=number],&[type^=text]]:c-red"`)
  })

  it('with combinator', () => {
    expect(
      main(new MagicString('[.foo,&[type=(number text)]~.bar]:c-red')),
    ).toMatchInlineSnapshot()

    expect(
      main(new MagicString('[.foo+&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot()
  })

  it('multiple variant sorting', () => {
    expect(
      main(new MagicString('dark:hover:[&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot()
  })

  it('with grouping selector', () => {
    expect(
      main(new MagicString('[.foo,&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot()
  })

  it('multiple', () => {
    expect(
      main(new MagicString('[&[type=(number text)]]:c-red [&[size=(large small middle)]]:p-1')),
    ).toMatchInlineSnapshot(`"[&[type=number],&[type=text]]:c-red [&[size=large],&[size=small],&[size=middle]]:p-1"`)
  })

  it('multiple in the same arbitrary-variants', () => {
    expect(
      main(new MagicString('[&[type=(number text)],&[aa=(bb cc)]]:c-red')),
    ).toMatchInlineSnapshot(`"[&[type=number],&[type=text],&[aa=bb],&[aa=cc]]:c-red"`)
  })

  it('with variant group', () => {
    expect(
      main(new MagicString('[&[type=(number text)]]:(c-red m-1)')),
    ).toMatchInlineSnapshot(`"[&[type=number],&[type=text]]:(c-red m-1)"`)

    expect(
      main(new MagicString('[&[type=(number text)],&[aa=(bb cc)]]:(c-red m-1)')),
    ).toMatchInlineSnapshot(`"[&[type=number],&[type=text],&[aa=bb],&[aa=cc]]:(c-red m-1)"`)
  })

  it('with newline', () => {
    expect(
      main(new MagicString('[&[type=(number\n text)],&[aa=(bb cc)]]:(\n  c-red \n     m-1\n     p-1\n  )')),
    ).toMatchInlineSnapshot(`
      "[&[type=number],&[type=text],&[aa=bb],&[aa=cc]]:(
        c-red 
           m-1
           p-1
        )"
    `)
  })

  it('empty group', () => {
    expect(
      main(new MagicString('[&[type=()]]:p-1')),
    ).toMatchInlineSnapshot('"[&[type=()]]:p-1"')
  })
})

describe.skip('group data-attribute values', () => {
  it('basic', () => {
    expect(
      main(new MagicString('data-[xxx=(foo bar)]:p-1')),
    ).toMatchInlineSnapshot(`"data-[xxx=foo]:p-1 data-[xxx=bar]:p-1"`)
  })

  it('with operator', () => {
    expect(
      main(new MagicString('data-[xxx^=(foo bar)]:p-1')),
    ).toMatchInlineSnapshot(`"data-[xxx^=foo]:p-1 data-[xxx^=bar]:p-1"`)
  })

  it('multiple', () => {
    expect(
      main(new MagicString('data-[xxx=(foo bar)]:p-1 data-[yyy=(aaa bbb)]:m-1')),
    ).toMatchInlineSnapshot(`"data-[xxx=foo]:p-1 data-[yyy=(aaa bbb)]:m-1 data-[xxx=bar]:p-1 data-[yyy=(aaa bbb)]:m-1data-[xxx=(foo bar)]:p-1 data-[yyy=aaa]:m-1 data-[xxx=(foo bar)]:p-1 data-[yyy=bbb]:m-1"`)
  })

  it('multiple variant sorting', () => {
    expect(
      main(new MagicString('dark:hover:data-[xxx=(foo bar)]:c-red')),
    ).toMatchInlineSnapshot()
  })

  it('with variant group', () => {
    expect(
      main(new MagicString('data-[xxx=(foo bar)]:(p-1 m-1)')),
    ).toMatchInlineSnapshot(`"data-[xxx=foo]:(p-1 m-1) data-[xxx=bar]:(p-1 m-1)"`)
  })

  it('with newline', () => {
    expect(
      main(new MagicString('data-[xxx=(foo\n bar)]:(\n  c-red \n     m-1\n     p-1\n  )')),
    ).toMatchInlineSnapshot(`
      "data-[xxx=foo]:(
        c-red 
           m-1
           p-1
        ) data-[xxx=bar]:(
        c-red 
           m-1
           p-1
        )"
    `)
  })

  it('empty', () => {
    expect(
      main(new MagicString('data-[xxx=()]:p-1')),
    ).toMatchInlineSnapshot('"data-[xxx=()]:p-1"')
  })
})

describe.skip('random combination', () => {
  it('combination 1', () => expect(
    main(new MagicString('data-[xxx=(foo bar)]:(p-1 m-1) data-[yyy=(aa)]:p-1')),
  ).toMatchInlineSnapshot(`"data-[xxx=foo]:(p-1 m-1) data-[yyy=(aa)]:p-1 data-[xxx=bar]:(p-1 m-1) data-[yyy=(aa)]:p-1data-[xxx=(foo bar)]:(p-1 m-1) data-[yyy=aa]:p-1"`))

  it('combination 2', () => {
    expect(main(new MagicString('[&[type=(number text)]]:c-red data-[xxx=(foo bar)]:p-1')))
      .toMatchInlineSnapshot(`"[&[type=number],&[type=text]]:c-red data-[xxx=(foo bar)]:p-1[&[type=number],&[type=text]]:c-red data-[xxx=foo]:p-1 [&[type=number],&[type=text]]:c-red data-[xxx=bar]:p-1"`)

    expect(main(new MagicString('data-[xxx=(foo bar)]:p-1 [&[type=(number text)]]:c-red')))
      .toMatchInlineSnapshot(`"data-[xxx=(foo bar)]:p-1 [&[type=number],&[type=text]]:c-reddata-[xxx=foo]:p-1 [&[type=number],&[type=text]]:c-red data-[xxx=bar]:p-1 [&[type=number],&[type=text]]:c-red"`)
  })
})
