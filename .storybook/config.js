import { configure } from '@storybook/vue'
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
Vue.use(Element, { locale })
// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
