import { describe, expect, it } from 'vitest'
import MagicStringStack from 'magic-string-stack'
import { main } from '../src'

const m = (s: string, utility = true) => new MagicStringStack(`<div class="p1 ${s}${utility ? ':flex' : ''} m1" />\n<p class="p2 ${s}${utility ? ':(border c-red)' : ''} m2" />\n`)

describe('group attribute values', () => {
  it('basic', () => {
    expect(
      main(m('[&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type=number],&[type=text]]:flex m1" />
      <p class="p2 [&[type=number],&[type=text]]:(border c-red) m2" />
      "
    `)
  })

  it('with operator', () => {
    expect(
      main(m('[&[type^=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type^=number],&[type^=text]]:flex m1" />
      <p class="p2 [&[type^=number],&[type^=text]]:(border c-red) m2" />
      "
    `)
  })

  it('with combinator', () => {
    expect(
      // Next-sibling combinator
      main(m('[.foo+&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo+&[type=number],.foo+&[type=text]]:flex m1" />
      <p class="p2 [.foo+&[type=number],.foo+&[type=text]]:(border c-red) m2" />
      "
    `)

    expect(
      // Child combinator
      main(m('[.foo>&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo>&[type=number],.foo>&[type=text]]:flex m1" />
      <p class="p2 [.foo>&[type=number],.foo>&[type=text]]:(border c-red) m2" />
      "
    `)

    expect(
      // Column combinator
      main(m('[.foo||&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo||&[type=number],.foo||&[type=text]]:flex m1" />
      <p class="p2 [.foo||&[type=number],.foo||&[type=text]]:(border c-red) m2" />
      "
    `)

    expect(
      // Subsequent sibling combinator
      main(m('[.foo~&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo~&[type=number],.foo~&[type=text]]:flex m1" />
      <p class="p2 [.foo~&[type=number],.foo~&[type=text]]:(border c-red) m2" />
      "
    `)

    expect(
      // Descendant combinator
      main(m('[.foo_&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo_&[type=number],.foo_&[type=text]]:flex m1" />
      <p class="p2 [.foo_&[type=number],.foo_&[type=text]]:(border c-red) m2" />
      "
    `)

    expect(
      // Namespace separator
      main(m('[.foo|&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo|&[type=number],.foo|&[type=text]]:flex m1" />
      <p class="p2 [.foo|&[type=number],.foo|&[type=text]]:(border c-red) m2" />
      "
    `)

    expect(
      // a sequence of combinator
      main(m('[.foo+&[type=(number text)]~.bar_.sim]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:flex m1" />
      <p class="p2 [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:(border c-red) m2" />
      "
    `)
  })

  it('multiple variant sorting', () => {
    expect(
      main(m('dark:hover:[&[type=(number text)]]')),
      // Note: UnoCSS can parse this result. but it doesn't seem good (The "number" has no `:hover`).
      // Just ignore it because it's too special.
      // /* layer: default */
      // .m1 {
      //   margin: 0.25rem;
      // }
      // .m2 {
      //   margin: 0.5rem;
      // }
      // .dark
      //   .dark\:hover\:\[\&\[type\=number\]\,\&\[type\=text\]\]\:flex[type='number'],
      // .dark\:hover\:\[\&\[type\=number\]\,\&\[type\=text\]\]\:flex[type='text']:hover {
      //   display: flex;
      // }
      // .p1 {
      //   padding: 0.25rem;
      // }
      // .p2 {
      //   padding: 0.5rem;
      // }
      // .dark
      //   .dark\:hover\:\[\&\[type\=number\]\,\&\[type\=text\]\]\:c-red[type='number'],
      // .dark\:hover\:\[\&\[type\=number\]\,\&\[type\=text\]\]\:c-red[type='text']:hover {
      //   --un-text-opacity: 1;
      //   color: rgb(248 113 113 / var(--un-text-opacity));
      // }
    ).toMatchInlineSnapshot(`
      "<div class="p1 dark:hover:[&[type=number],&[type=text]]:flex m1" />
      <p class="p2 dark:hover:[&[type=number],&[type=text]]:(border c-red) m2" />
      "
    `)
  })

  it('compound class selectors', () => {
    expect(
      main(m('[.foo&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo&[type=number],.foo&[type=text]]:flex m1" />
      <p class="p2 [.foo&[type=number],.foo&[type=text]]:(border c-red) m2" />
      "
    `)

    expect(
      main(m('[.foo&[type=(number text)].bar]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo&[type=number].bar,.foo&[type=text].bar]:flex m1" />
      <p class="p2 [.foo&[type=number].bar,.foo&[type=text].bar]:(border c-red) m2" />
      "
    `)
  })

  it('multiple', () => {
    expect(
      main(m('[&[type=(number text)]]:c-red [&[size=(large small middle)]]:(border flex)', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type=number],&[type=text]]:c-red [&[size=large],&[size=small],&[size=middle]]:(border flex) m1" />
      <p class="p2 [&[type=number],&[type=text]]:c-red [&[size=large],&[size=small],&[size=middle]]:(border flex) m2" />
      "
    `)
  })

  it('multiple in the same arbitrary-variants', () => {
    expect(
      main(m('[&[type=(number text)],&[name=(aa bb cc)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type=number],&[type=text],&[name=aa],&[name=bb],&[name=cc]]:flex m1" />
      <p class="p2 [&[type=number],&[type=text],&[name=aa],&[name=bb],&[name=cc]]:(border c-red) m2" />
      "
    `)
  })

  it('with newline', () => {
    expect(
      main(m('[&[type=(number\n  text)],&[aa=(aa  bb cc)]]:(\n  c-red \n     m-1\n     p-1\n  )', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type=number],&[type=text],&[aa=aa],&[aa=bb],&[aa=cc]]:(
        c-red 
           m-1
           p-1
        ) m1" />
      <p class="p2 [&[type=number],&[type=text],&[aa=aa],&[aa=bb],&[aa=cc]]:(
        c-red 
           m-1
           p-1
        ) m2" />
      "
    `)
  })

  it('empty group', () => {
    expect(
      main(m('[&[type=()]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type=()]]:flex m1" />
      <p class="p2 [&[type=()]]:(border c-red) m2" />
      "
    `)
  })
})

describe('group data-attribute values', () => {
  it('basic', () => {
    expect(
      // data-[xxx=foo]:aaa data-[xxx=bar]:(aaa bbb)
      main(m('data-[xxx=(foo bar)]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 data-[xxx=foo]:flex data-[xxx=bar]:flex m1" />
      <p class="p2 data-[xxx=foo]:(border c-red) data-[xxx=bar]:(border c-red) m2" />
      "
    `)
  })

  it('with operator', () => {
    expect(
      main(m('data-[xxx^=(foo bar)]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 data-[xxx^=foo]:flex data-[xxx^=bar]:flex m1" />
      <p class="p2 data-[xxx^=foo]:(border c-red) data-[xxx^=bar]:(border c-red) m2" />
      "
    `)
  })

  it('multiple', () => {
    expect(
      main(m('data-[xxx=(foo bar)]:p2 data-[yyy=(aaa bbb)]:(m3 m4)', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 data-[xxx=foo]:p2 data-[xxx=bar]:p2 data-[yyy=aaa]:(m3 m4) data-[yyy=bbb]:(m3 m4) m1" />
      <p class="p2 data-[xxx=foo]:p2 data-[xxx=bar]:p2 data-[yyy=aaa]:(m3 m4) data-[yyy=bbb]:(m3 m4) m2" />
      "
    `)
  })

  it('multiple variant sorting', () => {
    expect(
      main(m('dark:hover:data-[xxx=(foo bar)]:c-red', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 dark:hover:data-[xxx=foo]:c-red dark:hover:data-[xxx=bar]:c-red m1" />
      <p class="p2 dark:hover:data-[xxx=foo]:c-red dark:hover:data-[xxx=bar]:c-red m2" />
      "
    `)
    expect(
      main(m('dark:hover:data-[xxx=(foo bar)]:(c-red border)', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 dark:hover:data-[xxx=foo]:(c-red border) dark:hover:data-[xxx=bar]:(c-red border) m1" />
      <p class="p2 dark:hover:data-[xxx=foo]:(c-red border) dark:hover:data-[xxx=bar]:(c-red border) m2" />
      "
    `)
  })

  it('with newline', () => {
    expect(
      main(m('data-[xxx=(foo\n bar)]:(\n  c-red \n     m-1\n     p-1\n  )', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 data-[xxx=foo]:(
        c-red 
           m-1
           p-1
        ) data-[xxx=bar]:(
        c-red 
           m-1
           p-1
        ) m1" />
      <p class="p2 data-[xxx=foo]:(
        c-red 
           m-1
           p-1
        ) data-[xxx=bar]:(
        c-red 
           m-1
           p-1
        ) m2" />
      "
    `)
  })

  it('empty', () => {
    expect(
      main(m('data-[xxx=()]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 data-[xxx=()]:flex m1" />
      <p class="p2 data-[xxx=()]:(border c-red) m2" />
      "
    `)
  })
})

describe('random combination', () => {
  it('combination 1', () => expect(
    main(m('data-[xxx=(foo bar)]:(p-1 m-1) data-[yyy=(aa)]:p-1', false)),
  ).toMatchInlineSnapshot(`
    "<div class="p1 data-[xxx=foo]:(p-1 m-1) data-[xxx=bar]:(p-1 m-1) data-[yyy=aa]:p-1 m1" />
    <p class="p2 data-[xxx=foo]:(p-1 m-1) data-[xxx=bar]:(p-1 m-1) data-[yyy=aa]:p-1 m2" />
    "
  `))

  it('combination 2', () => {
    expect(main(m('[&[type=(number text)]]:c-red data-[xxx=(foo bar)]:p-1', false)))
      .toMatchInlineSnapshot(`
        "<div class="p1 [&[type=number],&[type=text]]:c-red data-[xxx=foo]:p-1 data-[xxx=bar]:p-1 m1" />
        <p class="p2 [&[type=number],&[type=text]]:c-red data-[xxx=foo]:p-1 data-[xxx=bar]:p-1 m2" />
        "
      `)

    expect(main(m('data-[xxx=(foo bar)]:(border flex) [&[type=(number text)]]:c-red', false)))
      .toMatchInlineSnapshot(`
        "<div class="p1 data-[xxx=foo]:(border flex) data-[xxx=bar]:(border flex) [&[type=number],&[type=text]]:c-red m1" />
        <p class="p2 data-[xxx=foo]:(border flex) data-[xxx=bar]:(border flex) [&[type=number],&[type=text]]:c-red m2" />
        "
      `)
  })

  it.only('with grouping selector and combinator', () => {
    expect(
      main(m('[.foo,&[type=(number text)]~.bar]:c-red', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo,&[type=number]~.bar,.foo,&[type=text]~.bar]:c-red m1" />
      <p class="p2 [.foo,&[type=number]~.bar,.foo,&[type=text]~.bar]:c-red m2" />
      "
    `)
  })
})
