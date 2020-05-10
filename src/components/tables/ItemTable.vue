<template>
  <div v-if="categoryId">
    <b-table striped
             responsive
             hover
             dark
             show-empty
             table-variant="dark"
             sort-icon-left
             class="item-table"
             @row-clicked="onRowClicked"
             :items="getData"
             :fields="fields"
             :tbody-tr-class="getRowClass"
             ref="table">
      <template v-slot:cell(selected)="data">
        <i :class="`mdi ${data.item.itemId === selectedItemId ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline'}`" />
      </template>
      <template v-slot:cell(avgItemRating)="data">
        <b-form-rating v-model="data.item.avgItemRating" no-border inline stars="5" precision="2" readonly />
      </template>
    </b-table>
    <b-pagination v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total-rows="pagination.totalCount"
                  v-show="pagination.totalCount > pagination.perPage" />
  </div>
</template>

<script>
export default {
  props: {
    categoryId: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      selectedItemId: null,
      fields: [{
        key: 'selected',
        label: ''
      }, {
        key: 'itemName',
        label: 'Name',
        sortable: true
      }, {
        key: 'typeName',
        label: 'Type',
        sortable: true
      }, {
        key: 'manufacturerName',
        label: 'Producer',
        sortable: true
      }, {
        key: 'avgItemRating',
        label: 'Avg. rating',
        class: 'text-right',
        sortable: true
      }],
      filter: [],
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalCount: 0
      }
    }
  },
  methods: {
    getRowClass: function (item) {
      if (item) {
        return this.selectedItemId === item.itemId ? 'table-primary' : null
      } else {
        return null
      }
    },
    onRowClicked: function (item) {
      this.selectedItemId = item.itemId
      this.$emit('item-selected', item.itemId)
    },
    refresh: function () {
      this.$refs.table.refresh()
    },
    getData: function (ctx) {
      // Set the API pagination information fields
      var localCtx = JSON.parse(JSON.stringify(ctx))
      localCtx.page = this.pagination.currentPage
      localCtx.limit = this.pagination.perPage
      localCtx.prevCount = this.pagination.totalCount
      localCtx.orderBy = localCtx.sortBy.length > 0 ? localCtx.sortBy : null
      localCtx.ascending = localCtx.sortBy.length > 0 ? (localCtx.sortDesc ? 0 : 1) : null
      localCtx.filter = this.filter
      // Delete fields that the bootstrap-vue table sets itself
      delete localCtx.sortBy
      delete localCtx.sortDesc
      delete localCtx.apiUrl
      delete localCtx.currentPage
      delete localCtx.perPage

      const request = {
        page: this.pagination.currentPage,
        limit: this.pagination.perPage,
        prevCount: -1,
        filter: this.filter
      }

      return new Promise((resolve) => {
        this.apiPostCategoryItems(this.categoryId, request).then(result => {
          var localResult = null
          if (result && result.data && result.data.data) {
            this.pagination.totalCount = result.data.count
            localResult = result.data.data
          } else {
            this.pagination.totalCount = 0
          }
          resolve(localResult)
        })
      })
    }
  }
}
</script>

<style>
.item-table tr:hover {
  cursor: pointer;
}
.item-table tr .b-rating:hover {
  cursor: default;
}
</style>
