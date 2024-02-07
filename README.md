[![npm](https://img.shields.io/npm/v/unocss-transformer-attribute-values-group)](https://www.npmjs.com/package/unocss-transformer-attribute-values-group)

# Installation

```sh
pnpm add -D unocss-transformer-attribute-values-group
```

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import transformerAttrValuesGroup from 'unocss-transformer-attribute-values-group'

export default defineConfig({
  // ...
  transformers: [
    transformerAttrValuesGroup(),
  ],
})
```

# Usage:
```vue
<script setup lang="ts">
const type = ref<'number' | 'text'>()
const name = ref<'jack' | 'tom'>()

function changeTypeAndName() {
  // ......
}
</script>

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

[tests](https://github.com/lvjiaxuan/unocss-transformer-attribute-values-group/blob/main/tests/index.test.ts) for more details.
