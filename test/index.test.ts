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

  it('multiple', () => {
    expect(
      main(m('[&[type=(number text)]]:c-red [&[size=(large small middle)]]:(border flex)', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type=number],&[type=text]]:c-red [&[size=large],&[size=small],&[size=middle]]:(border flex) m1" />
      <p class="p2 [&[type=number],&[type=text]]:c-red [&[size=large],&[size=small],&[size=middle]]:(border flex) m2" />
      "
    `)
  })

  it('multiple in the one arbitrary-variants', () => {
    expect(
      main(m('[&[type=(number text)],&[name=(aa bb cc)],&[age=(1 2)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type=number],&[type=text],&[name=aa],&[name=bb],&[name=cc],&[age=1],&[age=2]]:flex m1" />
      <p class="p2 [&[type=number],&[type=text],&[name=aa],&[name=bb],&[name=cc],&[age=1],&[age=2]]:(border c-red) m2" />
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

  it('with data-attr', () => {
    expect(
      main(m('[&[data-active=(true false)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[data-active=true],&[data-active=false]]:flex m1" />
      <p class="p2 [&[data-active=true],&[data-active=false]]:(border c-red) m2" />
      "
    `)
  })
})

describe('with pre/suf-fix combinator', () => {
  it('prefix', () => {
    expect(
      main(m('[.foo+&[type=(number text)]]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo+&[type=number],.foo+&[type=text]]:flex m1" />
      <p class="p2 [.foo+&[type=number],.foo+&[type=text]]:(border c-red) m2" />
      "
    `)
  })

  it('suffix', () => {
    expect(
      main(m('[&[type=(number text)]~.bar_.sim]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [&[type=number]~.bar_.sim,&[type=text]~.bar_.sim]:flex m1" />
      <p class="p2 [&[type=number]~.bar_.sim,&[type=text]~.bar_.sim]:(border c-red) m2" />
      "
    `)
  })

  it('pre/suf-fix', () => {
    expect(
      main(m('[.foo+&[type=(number text)]~.bar_.sim]')),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:flex m1" />
      <p class="p2 [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:(border c-red) m2" />
      "
    `)
  })

  it('multiple', () => {
    expect(
      main(m('[.foo+&[type=(number text)]~.bar_.sim]:c-red [.foo+&[type=(number text)]~.bar_.sim]:(border flex)', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:c-red [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:(border flex) m1" />
      <p class="p2 [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:c-red [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim]:(border flex) m2" />
      "
    `)
  })

  it('multiple in the one arbitrary-variants', () => {
    expect(
      main(m('[.foo+&[type=(number text)]~.bar_.sim,.fxx+&[type=(number text)]~.bxx_.sxx]:(border flex)', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim,.fxx+&[type=number]~.bxx_.sxx,.fxx+&[type=text]~.bxx_.sxx]:(border flex) m1" />
      <p class="p2 [.foo+&[type=number]~.bar_.sim,.foo+&[type=text]~.bar_.sim,.fxx+&[type=number]~.bxx_.sxx,.fxx+&[type=text]~.bxx_.sxx]:(border flex) m2" />
      "
    `)
  })
})

describe.skip('group data-attribute values', () => {
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

describe.skip('random combination', () => {
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

  it('with grouping selector and combinator', () => {
    expect(
      main(m('[.foo,&[type=(number text)]~.bar]:c-red', false)),
    ).toMatchInlineSnapshot(`
      "<div class="p1 [.foo,&[type=number]~.bar,.foo,&[type=text]~.bar]:c-red m1" />
      <p class="p2 [.foo,&[type=number]~.bar,.foo,&[type=text]~.bar]:c-red m2" />
      "
    `)
  })
})

// describe('references some special cases from UnoCSS', () => {
//   it('basic', async () => {
//     const cases = [
//       // 'a1 [&[type=(number text)]]:(b1 b2:(c1 c2-(d1 d2) c3) b3) a3',
//       // 'bg-white font-light sm:hover:(bg-gray-100 font-medium)',
//       // 'lt-sm:hover:(p-1 p-2)',
//       '<sm:hover:[&[type=(number text)]]:(p-1 p-2)',
//       '<sm:hover:data-[xxx=(foo bar)]:(p-1 p-2)',
//       // 'sm:(p-1 p-2)',
//       // 'dark:lg:(p-1 p-2)',
//       // 'at-lg:(p-1 p-2)',
//       '[&[type=(number text)]]:(w-40vw pr-4.5rem)',
//       'data-[xxx=(foo bar)]:(w-40vw pr-4.5rem)',
//       '[&[type=(number text)]]:(grid grid-cols-[1fr,50%])',
//       'data-[xxx=(foo bar)]:(grid grid-cols-[1fr,50%])',
//       // '<md:(grid grid-cols-[1fr,50%])',
//       '![&[type=(number text)]]:(m-2 p-2)',
//       '!data-[xxx=(foo bar)]:(m-2 p-2)',
//       '[&[type=(number text)]]:(!m-2 p-2)',
//       'data-[xxx=(foo bar)]:(!m-2 p-2)',
//       '[&[type=(number text)]]:(w-1/2 h-[calc(100%-4rem)])',
//       'data-[xxx=(foo bar)]:(w-1/2 h-[calc(100%-4rem)])', // TODO fail
//       '[&[type=(number text)]]:(\n!m-2 \np-2\n)',
//       'data-[xxx=(foo bar)]:(\n!m-2 \np-2\n)',
//       // '[&]:(w-4 h-4) [&]:(w-4 h-4)',
//     ]

//     for (const c of cases) {
//       const result = main(m(c, false))
//       expect(result).toMatchSnapshot(`"${c}"`)
//     }
//   })
// })
