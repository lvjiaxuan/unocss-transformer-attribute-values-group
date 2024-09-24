[![npm](https://img.shields.io/npm/v/unocss-transformer-attribute-values-group)](https://www.npmjs.com/package/unocss-transformer-attribute-values-group)

# Installation

```sh
pnpm add -D unocss-transformer-attribute-values-group
```

# Usage

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import transformerAttrValuesGroup from 'unocss-transformer-attribute-values-group'

export default defineConfig({
  transformers: [
    transformerAttrValuesGroup,
  ],
})
```

```vue
<template>
  <input
    :type="type"
    class="[&[type=(number text)]]:c-red"
  >
  <div
    :data-name="name"
    class="data-[name=(jack tom)]:c-red"
  />
</template>
```

transformed like:
```html
<input class="[&[type=number],&[type=text]]:c-red" />
<div class="data-[name=jack]:c-red data-[name=tom]:c-red" />
```

[tests](https://github.com/lvjiaxuan/unocss-transformer-attribute-values-group/blob/main/test/index.test.ts) for more usages.

# References

- [using-arbitrary-variants](https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants)
- [the better arbitrary-variants of unocss](https://github.com/unocss/unocss/blob/main/packages/preset-mini/src/_variants/misc.ts#L75)
