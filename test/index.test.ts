import { describe, expect, it } from 'vitest'
import MagicString from 'magic-string'
import { main } from '../src'

const m = (s: string) => new MagicString(`<div class="${s}" />`)

describe('group attribute values', () => {
  it('basic', () => {
    expect(
      main(m('[&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[&[type=number],&[type=text]]:c-red" />"`)
  })

  it('with operator', () => {
    expect(
      main(m('[&[type^=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[&[type^=number],&[type^=text]]:c-red" />"`)
  })

  it('with combinator', () => {
    expect(
      // Next-sibling combinator
      main(m('[.foo+&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo+&[type=number],.foo+&[type=text]]:c-red" />"`)

    expect(
      // Child combinator
      main(m('[.foo>&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo>&[type=number],.foo>&[type=text]]:c-red" />"`)

    expect(
      // Column combinator
      main(m('[.foo||&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo||&[type=number],.foo||&[type=text]]:c-red" />"`)

    expect(
      // Subsequent sibling combinator
      main(m('[.foo~&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo~&[type=number],.foo~&[type=text]]:c-red" />"`)

    expect(
      // Descendant combinator
      main(m('[.foo_&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo_&[type=number],.foo_&[type=text]]:c-red" />"`)

    expect(
      // Namespace separator
      main(m('[.foo|&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo|&[type=number],.foo|&[type=text]]:c-red" />"`)

    expect(
      // a sequence of combinator
      main(m('[.foo+&[type=(number text)]~.bar_.sim]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:c-red" />"`)
  })

  it('multiple variant sorting', () => {
    expect(
      main(m('dark:hover:[&[type=(number text)]]:c-red')),
      // Note: unocss can parse this result. but it doesn't seem good.
      // Just ignore it because it's too special.
      // .dark
      //   .dark\:hover\:\[\&\[type\=number\]\,\&\[type\=text\]\]\:c-red[type='number'],
      // .dark\:hover\:\[\&\[type\=number\]\,\&\[type\=text\]\]\:c-red[type='text']:hover {
      //   --un-text-opacity: 1;
      //   color: rgb(248 113 113 / var(--un-text-opacity));
      // }
    ).toMatchInlineSnapshot(`"<div class="dark:hover:[&[type=number],&[type=text]]:c-red" />"`)
  })

  it('compound class selectors', () => {
    expect(
      main(m('[.foo&[type=(number text)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo&[type=number],.foo&[type=text]]:c-red" />"`)

    expect(
      main(m('[.foo&[type=(number text)].bar]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo&[type=number].bar,.foo&[type=text].bar]:c-red" />"`)
  })

  it('multiple', () => {
    expect(
      main(m('[&[type=(number text)]]:c-red [&[size=(large small middle)]]:p-1')),
    ).toMatchInlineSnapshot(`"<div class="[&[type=number],&[type=text]]:c-red [&[size=large],&[size=small],&[size=middle]]:p-1" />"`)
  })

  it('multiple in the same arbitrary-variants', () => {
    expect(
      main(m('[&[type=(number text)],&[aa=(bb cc)]]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[&[type=number],&[type=text)],&[aa=(bb],&[type=cc]]:c-red" />"`)
  })

  it('with variant group', () => {
    expect(
      main(m('[&[type=(number text)]]:(c-red m-1)')),
    ).toMatchInlineSnapshot(`"<div class="[&[type=number],&[type=text]]:(c-red m-1)" />"`)

    expect(
      main(m('[&[type=(number text)],&[aa=(bb cc)]]:(c-red m-1)')),
    ).toMatchInlineSnapshot(`"<div class="[&[type=number],&[type=text)],&[aa=(bb],&[type=cc]]:(c-red m-1)" />"`)
  })

  it('with newline', () => {
    expect(
      main(m('[&[type=(number\n text)],&[aa=(bb cc)]]:(\n  c-red \n     m-1\n     p-1\n  )')),
    ).toMatchInlineSnapshot(`"<div class="[&[type=number],&[type=text)],&[aa=(bb],&[type=cc)]]:(],&[type=c-red],&[type=m-1],&[type=p-1" />"`)
  })

  it('empty group', () => {
    expect(
      main(m('[&[type=()]]:p-1')),
    ).toMatchInlineSnapshot(`"<div class="[&[type=()]]:p-1" />"`)
  })
})

describe.skip('group data-attribute values', () => {
  it('basic', () => {
    expect(
      main(m('data-[xxx=(foo bar)]:p-1')),
    ).toMatchInlineSnapshot(`"<div class="data-[xxx=foo]:p-1" /> <div class="data-[xxx=bar]:p-1" />"`)
  })

  it('with operator', () => {
    expect(
      main(m('data-[xxx^=(foo bar)]:p-1')),
    ).toMatchInlineSnapshot(`"<div class="data-[xxx^=foo]:p-1" /> <div class="data-[xxx^=bar]:p-1" />"`)
  })

  it.todo('multiple', () => {
    expect(
      main(m('data-[xxx=(foo bar)]:p-1 data-[yyy=(aaa bbb)]:m-1')),
    ).toMatchInlineSnapshot()
  })

  it('multiple variant sorting', () => {
    expect(
      main(m('dark:hover:data-[xxx=(foo bar)]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="dark:hover:data-[xxx=foo]:c-red" /> <div class="dark:hover:data-[xxx=bar]:c-red" />"`)
  })

  it('with variant group', () => {
    expect(
      main(m('data-[xxx=(foo bar)]:(p-1 m-1)')),
    ).toMatchInlineSnapshot(`"<div class="data-[xxx=foo]:(p-1 m-1)" /> <div class="data-[xxx=bar]:(p-1 m-1)" />"`)
  })

  it('with newline', () => {
    expect(
      main(m('data-[xxx=(foo\n bar)]:(\n  c-red \n     m-1\n     p-1\n  )')),
    ).toMatchInlineSnapshot(`
      "<div class="data-[xxx=foo]:(
        c-red 
           m-1
           p-1
        )" /> <div class="data-[xxx=bar]:(
        c-red 
           m-1
           p-1
        )" />"
    `)
  })

  it('empty', () => {
    expect(
      main(m('data-[xxx=()]:p-1')),
    ).toMatchInlineSnapshot(`"<div class="data-[xxx=()]:p-1" />"`)
  })
})

describe.skip('random combination', () => {
  it.todo('combination 1', () => expect(
    main(m('data-[xxx=(foo bar)]:(p-1 m-1) data-[yyy=(aa)]:p-1')),
  ).toMatchInlineSnapshot())

  it.todo('combination 2', () => {
    expect(main(m('[&[type=(number text)]]:c-red data-[xxx=(foo bar)]:p-1')))
      .toMatchInlineSnapshot()

    expect(main(m('data-[xxx=(foo bar)]:p-1 [&[type=(number text)]]:c-red')))
      .toMatchInlineSnapshot()
  })

  it('with grouping selector and combinator', () => {
    expect(
      main(m('[.foo,&[type=(number text)]~.bar]:c-red')),
    ).toMatchInlineSnapshot(`"<div class="[.foo,&[type=number],&[type=text]~.bar]:c-red" />"`)
  })
})
