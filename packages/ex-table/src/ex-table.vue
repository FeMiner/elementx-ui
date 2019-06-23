<template>
  <div
    ref="table"
    class="ex-table"
  >
    <slot name="header"></slot>
    <div
      class="table-header"
      v-if="header"
    >
      <el-button
        v-if="header.export"
        type="primary"
        size="mini"
        :loading="exporting"
        icon="el-icon-download"
        @click="handleExportData"
      >{{header.export.text || '导出'}}</el-button>
    </div>
    <el-table
      v-bind="$attrs"
      v-on="$listeners"
      :data="list"
    >
      <template v-for="item in columnConfig">
        <el-table-column
          v-if="item.component"
          :key="item.attrs.prop"
          v-bind="item.attrs"
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
          :key="item.attrs.prop"
          v-bind="item.attrs"
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
          :key="item.attrs.prop"
          v-bind="item.attrs"
        ></el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="_pagination"
      style="padding: 15px 0"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      v-bind="_pagination"
    >
    </el-pagination>
  </div>
</template>
<script>
import _debounce from "lodash.debounce";
const defaultPagination = {
  currentPage: 1,
  pageSizes: [10, 20, 50, 100],
  pageSize: 20,
  total: 0,
  layout: "total, sizes, prev, pager, next, jumper"
};
export default {
  name: "ex-table",
  inheritAttrs: false,
  props: {
    columnConfig: Array,
    header: Object,
    pagination: {
      type: [Object, Boolean],
      default: function() {
        return defaultPagination;
      }
    },
    sortable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      innerPaging: false,
      exporting: false,
      currentPage: 1,
      pageSize: 20
    };
  },
  computed: {
    _pagination() {
      // 如果外部显式传入false,则不展示分页器
      if (this.pagination === false) {
        return false;
      }
      // 如果外部没有传入pagination属性，直接取的default
      if (this.pagination === defaultPagination) {
        // 内部对传入的数据分页
        this.innerPaging = true;
        return {
          ...defaultPagination,
          total: (this.$attrs.data && this.$attrs.data.length) || 0
        };
      }
      return {
        ...defaultPagination,
        ...this.pagination
      };
    },
    list() {
      const data = [...(this.$attrs.data || [])];
      if (this.innerPaging) {
        const pageSize = this.pageSize;
        const currentPage = this.currentPage;
        return data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      }
      return data;
    }
  },
  watch: {
    _pagination: {
      handler(newVal, oldVal) {
        if (newVal && typeof newVal === "object") {
          this.currentPage = newVal.currentPage;
          this.pageSize = newVal.pageSize;
          this.total = newVal.total;
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.pagination) {
      this.handlePageSizeChange = this.handlePaginationChange.bind(
        this,
        "pageSize"
      );
      this.handleCurrentPageChange = this.handlePaginationChange.bind(
        this,
        "currentPage"
      );
      this.emitPaginationChange = _debounce(this.emitPaginationChange, 0);
    }
  },
  methods: {
    handlePaginationChange(type, value) {
      this[type] = value;
      this.$emit(type.toLowerCase() + "-change", value);
      this.emitPaginationChange();
    },
    emitPaginationChange() {
      this.$emit("pagination-change", {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        total: this.total
      });
    },
    async handleExportData() {
      const XLSX = this._XLSX || require("xlsx");
      this.exporting = true;
      const { data, type, fetchData, columnTitle } = this.header.export;
      let output = [];
      if (typeof fetchData === "function") {
        output = await fetchData();
      } else {
        output = data || this.$attrs.data;
      }
      if (Array.isArray(output) && !output.length) {
        this.$message.warning("暂无数据导出");
        return;
      }
      if (type === "aoa_to_sheet" && Array.isArray(columnTitle)) {
        output.unshift(columnTitle);
      }
      if (
        columnTitle &&
        !Array.isArray(columnTitle) &&
        typeof columnTitle === "object"
      ) {
        output = output.map(item =>
          Object.keys(item).reduce((acc, key) => {
            if (columnTitle[key]) {
              acc[columnTitle[key]] = item[key];
            } else {
              acc[key] = item[key];
            }
            return acc;
          }, {})
        );
      }
      const ws = XLSX.utils[type || "json_to_sheet"](output);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
      XLSX.writeFile(wb, "sheetjs.xlsx");
      this.exporting = false;
    }
  },
  updated() {
    //如果支持拖拽排序
    if (this.sortable) {
      const Sortablejs = require("sortablejs");
      const Sortable = Sortablejs.default || Sortablejs;
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
    if (this.header && this.header.export) {
      this._XLSX = require("xlsx");
    }
  }
};
</script>

<style scoped>
.ex-table .table-header {
  background: #f5f7fa;
  padding: 0 15px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>