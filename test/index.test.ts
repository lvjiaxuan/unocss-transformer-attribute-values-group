import { describe, expect, it } from 'vitest'
import MagicStringStack from 'magic-string-stack'
import MagicString from 'magic-string'
import { main } from '../src'

const tags = ['h1', 'p']

const classAttr = ['class', 'className']

const prefix = 'p1'

const suffix = 'm1'

const singleUtilities = ['grid', 'w-1/2', 'grid-cols-[1fr,50%]', 'h-[calc(100%-4rem)]']

const groupUtilities = ['(flex c-red)', '(w-1/2 grid-cols-[1fr,50%] h-[calc(100%-4rem)])']

const cases = classAttr.reduce((acc, classA) => {
  ;[...singleUtilities, ...groupUtilities].forEach((utility) => {
    let one = ''
    tags.forEach((tag) => {
      one += `<${tag} ${classA}="${prefix} #variant#:${utility} ${suffix} " />\n`
    })
    acc.push(one)
  })

  return acc
}, [] as string[])

function genCases(opts: Partial<{
  multipleInClass: boolean
  newline: boolean
}>) {
  const { multipleInClass, newline } = opts

  const variant = (utility: string) => {
    const _utility = newline ? utility.split(' ').map(i => `${i}\n`).join('') : utility
    return multipleInClass ? `#variant1#:${_utility} #variant2#:${_utility}` : `#variant#:${_utility}`
  }

  return classAttr.reduce((acc, classA) => {
    ;[...singleUtilities, ...groupUtilities].forEach((utility) => {
      let one = ''
      tags.forEach(tag => one += `<${tag} ${classA}="${prefix} ${variant(utility)} ${suffix} " />\n`)
      acc.push(one)
    })

    return acc
  }, [] as string[])
}

function g(v: string | [string, string], genOpts?: Parameters<typeof genCases>[0]) {
  let _cases = cases
  if (genOpts) {
    _cases = genCases(genOpts)
  }

  if (Array.isArray(v)) {
    return _cases.map((i) => {
      const source = i.replace(/#variant1#/g, v[0]).replace(/#variant2#/g, v[1])
      const transformed = main(new MagicStringStack(source))
      return `<!--\n${source}-->\n${transformed}`
    }).join('\n\n')
  }
  else {
    return _cases.map((i) => {
      const source = i.replace(/#variant#/g, v)
      const transformed = main(new MagicStringStack(source))
      return `<!--\n${source}-->\n${transformed}`
    }).join('\n\n')
  }
}

describe('group attribute values', () => {
  it('basic', () => {
    expect(
      g('[&[type=(number text)]]'),
    ).toMatchFileSnapshot('./assets/output/attribute/basic.html')
  })

  it('with operator', () => {
    expect(
      g('[&[type^=(number text)]]'),
    ).toMatchFileSnapshot('./assets/output/attribute/operator.html')
  })

  it('variant sorting', () => {
    expect(
      g('dark:hover:[&[type=(number text)]]'),
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
    ).toMatchFileSnapshot('./assets/output/attribute/variant-sorting.html')
  })

  it('multiple in one class', () => {
    expect(
      g(['[&[type=(number text)]]', '[&[size=(large small middle)]]'], { multipleInClass: true }),
    ).toMatchFileSnapshot('./assets/output/attribute/in-one-class.html')
  })

  it('multiple in one arbitrary-variants', () => {
    expect(
      g('[&[type=(number text)],&[name=(aa bb cc)],&[age=(1 2)]]'),
    ).toMatchFileSnapshot('./assets/output/attribute/in-one-arbitrary-variants.html')
  })

  it('with newline', () => {
    // keep values newline
    expect(
      g('[&[type=(number\n  text)],&[aa=(aa  bb\n cc)]]'),
    ).toMatchFileSnapshot('./assets/output/attribute/newline.html')
  })

  it('empty group', () => {
    expect(
      g('[&[type=()]]'),
    ).toMatchFileSnapshot('./assets/output/attribute/empty-group.html')
  })

  it('with data-attr', () => {
    expect(
      g('[&[data-active=(true false)]]'),
    ).toMatchFileSnapshot('./assets/output/attribute/data-attr.html')
  })
})

describe('with pre/suf-fix combinator', () => {
  it('prefix', () => {
    expect(
      g('[.foo+&[type=(number text)]]'),
    ).toMatchFileSnapshot('./assets/output/attribute-combinator/prefix.html')
  })

  it('suffix', () => {
    expect(
      g('[&[type=(number text)]~.bar_.sim]'),
    ).toMatchFileSnapshot('./assets/output/attribute-combinator/suffix.html')
  })

  it('pre/suf-fix', () => {
    expect(
      g('[.foo+&[type=(number text)]~.bar_.sim]'),
    ).toMatchFileSnapshot('./assets/output/attribute-combinator/prefix-suffix.html')
  })

  it('multiple', () => {
    expect(
      g(['[.foo+&[type=(number text)]~.bar_.sim]', '[.foo+&[type=(number text)]~.bar_.sim]'], { multipleInClass: true }),
    ).toMatchFileSnapshot('./assets/output/attribute-combinator/multiple.html')
  })

  it('multiple in the one arbitrary-variants', () => {
    expect(
      g('[.foo+&[type=(number text)]~.bar_.sim,.fxx+&[type=(number text)]~.bxx_.sxx]'),
    ).toMatchFileSnapshot('./assets/output/attribute-combinator/in-one-arbitrary-variants.html')
  })
})

describe('group data-attribute values', () => {
  it('basic', () => {
    expect(
      g('data-[xxx=(foo bar)]'),
    ).toMatchFileSnapshot('./assets/output/data-attr/basic.html')
  })

  it('with operator', () => {
    expect(
      g('data-[xxx^=(foo bar)]'),
    ).toMatchFileSnapshot('./assets/output/data-attr/operator.html')
  })

  it('multiple in one class', () => {
    expect(
      g(['data-[xxx=(foo bar)]', 'data-[yyy=(aaa bbb)]'], { multipleInClass: true }),
    ).toMatchFileSnapshot('./assets/output/data-attr/in-one-class.html')
  })

  it('variant sorting', () => {
    expect(
      g('dark:hover:data-[xxx=(foo bar)]'),
    ).toMatchFileSnapshot('./assets/output/data-attr/variant-sorting.html')
  })

  it('with newline', () => {
    expect(
      g('data-[xxx=(foo\n bar)]', { newline: true }),
    ).toMatchFileSnapshot('./assets/output/data-attr/newline.html')
  })

  it('empty', () => {
    expect(
      g('data-[xxx=()]'),
    ).toMatchFileSnapshot('./assets/output/data-attr/empty.html')
  })
})

describe('any combinations', () => {
  it('any 1', () => expect(
    main(new MagicString('<i class="data-[xxx=(foo bar)]:(p-1 m-1) data-[yyy=(aa)]:p-1" />')),
  ).toMatchSnapshot())

  it('any 2', () => {
    expect(
      main(new MagicString('<i class="[&[type=(number text)]]:c-red data-[xxx=(foo bar)]:p-1" />')),
    ).toMatchSnapshot()

    expect(
      main(new MagicString('<i class="data-[xxx=(foo bar)]:(border flex) [&[type=(number text)]]:c-red" />')),
    ).toMatchSnapshot()
  })
})

describe('references some special cases from UnoCSS', () => {
  it('basic', async () => {
    const cases = [
      // 'a1 [&[type=(number text)]]:(b1 b2:(c1 c2-(d1 d2) c3) b3) a3',
      // 'bg-white font-light sm:hover:(bg-gray-100 font-medium)',
      // 'lt-sm:hover:(p-1 p-2)',
      '<sm:hover:[&[type=(number text)]]:(p-1 p-2)',
      '<sm:hover:data-[xxx=(foo bar)]:(p-1 p-2)',
      // 'sm:(p-1 p-2)',
      // 'dark:lg:(p-1 p-2)',
      // 'at-lg:(p-1 p-2)',
      '[&[type=(number text)]]:(w-40vw pr-4.5rem)',
      'data-[xxx=(foo bar)]:(w-40vw pr-4.5rem)',
      '[&[type=(number text)]]:(grid grid-cols-[1fr,50%])',
      'data-[xxx=(foo bar)]:(grid grid-cols-[1fr,50%])',
      // '<md:(grid grid-cols-[1fr,50%])',
      '![&[type=(number text)]]:(m-2 p-2)',
      '!data-[xxx=(foo bar)]:(m-2 p-2)',
      '[&[type=(number text)]]:(!m-2 p-2)',
      'data-[xxx=(foo bar)]:(!m-2 p-2)',
      '[&[type=(number text)]]:(w-1/2 h-[calc(100%-4rem)])',
      'data-[xxx=(foo bar)]:(w-1/2 h-[calc(100%-4rem)])',
      '[&[type=(number text)]]:(\n!m-2 \np-2\n)',
      'data-[xxx=(foo bar)]:(\n!m-2 \np-2\n)',
      // '[&]:(w-4 h-4) [&]:(w-4 h-4)',
    ]

    for (const c of cases) {
      const result = main(new MagicString(`<i class="${c}" />`))
      expect(result).toMatchSnapshot()
    }
  })
})
