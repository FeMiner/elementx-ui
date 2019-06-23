import { storiesOf } from '@storybook/vue'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import ExTable from '../../packages/ex-table'
import { normalColumnConfig, list } from './config'
import readme from './readme.md'

const stories = storiesOf('ExTable', module)
stories.addDecorator(withKnobs)

stories.add(
  'table',
  () => ({
    components: { ExTable },
    props: {
      sortable: {
        default: boolean('sortable', false)
      }
    },
    data() {
      return {
        normalColumnConfig,
        list,
        header: {
          export: {
            fetchData: this.fetchExportData
          }
        }
      }
    },
    methods: {
      fetchExportData() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(list)
          }, 2000)
        })
      }
    },
    template:
      '<ex-table :column-config="normalColumnConfig" :data="list" :header="header" border :sortable="sortable"></ex-table>'
  }),
  {
    notes: { markdown: readme }
  }
)
