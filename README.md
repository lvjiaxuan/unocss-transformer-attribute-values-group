# Usage

```vue
<scripts setup>
const type = ref<'number' | 'text'>()
const name = ref<'jack' | 'tom'>()

function changeTypeAndName() {
  // ......
}
</scripts>

<template>
  <input :type="type" class="[&[type=(number text)]]:c-red" />
  <div :data-name="name"  class="data-[name=(jack tom)]:c-red" />
</template>
```

transformed like:
```html
<input class="[&[type=number],&[type=text]]:c-red" />
<div class="data-[name=jack]:c-red data-[name=tom]:c-red" />
```

[tests](https://github.com/lvjiaxuan/transformer-attribute-values-group/blob/main/index.test.js) for More Details