import { storiesOf } from '@storybook/vue'
import ExTable from '../components/ExTable'

const columnConfig = [
  {
    attributes: {
      label: '姓名',
      prop: 'name'
    }
  },
  {
    attributes: {
      label: '年龄',
      prop: 'age'
    }
  },
  {
    attributes: {
      label: '身高',
      prop: 'height'
    }
  },
  {
    attributes: {
      label: '体重',
      prop: 'weight'
    }
  }
]

const list = [
  {
    name: 'aaa',
    age: '23',
    height: '167',
    weight: 70
  },
  {
    name: 'aaa',
    age: '24',
    height: '167',
    weight: 70
  },
  {
    name: 'aaa',
    age: '25',
    height: '167',
    weight: 70
  },
  {
    name: 'aaa',
    age: '26',
    height: '167',
    weight: 70
  },
  {
    name: 'aaa',
    age: '27',
    height: '167',
    weight: 70
  }
]

storiesOf('ExTable', module).add('normal table', () => ({
  components: { ExTable },
  data() {
    return {
      columnConfig,
      list
    }
  },
  template:
    '<ex-table :column-config="columnConfig" :data="list" border></ex-table>'
}))

storiesOf('ExTable', module).add('sortable table', () => ({
  components: { ExTable },
  data() {
    return {
      columnConfig,
      list
    }
  },
  template:
    '<ex-table :column-config="columnConfig" :data="list" border sortable></ex-table>'
}))
