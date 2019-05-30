<template>
  <div ref="table">
    <el-table v-bind="$attrs">
      <template v-for="(item, index) in columnConfig">
        <el-table-column
          v-if="item.component"
          :key="item.attributes.prop + '' +index"
          v-bind="item.attributes"
        >
          <template slot-scope="scope">
            <component
              :is="item.component"
              :row="scope.row"
              :index="scope.$index"
            ></component>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.slot"
          :key="item.attributes.prop +''+ index"
          v-bind="item.attributes"
        >
          <template slot-scope="scope">
            <slot
              :name="item.slot"
              :row="scope.row"
              :index="scope.$index"
            ></slot>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.attributes.prop +''+ index"
          v-bind="item.attributes"
        ></el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  name: "ex-table",
  props: {
    columnConfig: Array,
    sortable: Boolean
  },
  mounted() {
    // 如果支持拖拽排序
    if (this.sortable) {
      this.$nextTick(() => {
        const table = this.$refs.table.querySelector(
          ".el-table__body-wrapper tbody"
        );
        Sortable.create(table, {
          onEnd: e => {
            this.$emit("sortEnd", e);
          }
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>