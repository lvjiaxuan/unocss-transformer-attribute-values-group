import {
  defineConfig,
  transformerVariantGroup,
} from 'unocss'
import transformerAttrValuesGroup from './src'

export default defineConfig({

  transformers: [
    transformerVariantGroup(),
    transformerAttrValuesGroup,
  ],
})
