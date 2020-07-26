<template>
  <div v-if="categoryId" class="item-table">
    <b-table striped
             responsive
             hover
             dark
             show-empty
             table-variant="dark"
             sort-icon-left
             class="mb-0"
             @row-clicked="onRowClicked"
             :items="getData"
             :fields="fields"
             :tbody-tr-class="getRowClass"
             ref="table">
      <template v-slot:cell(selected)="data">
        <i :class="`mdi ${data.item.itemId === selectedItemId ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline'}`" />
      </template>
      <template v-slot:cell(typeName)="data">
        {{ data.item.typeName }} <i :class="`mdi ${data.item.typeIcon}`" v-if="data.item.typeIcon" />
      </template>
      <template v-slot:cell(manufacturerName)="data">
        <span v-if="data.item.manufacturerUrl"><a :href="data.item.manufacturerUrl">{{ data.item.manufacturerName }}</a> <i class="mdi mdi-open-in-new" /></span>
        <span v-else>{{ data.item.manufacturerName }}</span>
      </template>
      <template v-slot:cell(avgItemRating)="data">
        <b-form-rating v-model="data.item.avgItemRating" no-border inline stars="5" :show-value="data.item.avgItemRating !== undefined" precision="1" readonly />
      </template>
    </b-table>
    <b-button-group class="mb-3">
      <b-button @click="$refs.itemModal.show()"><i class="mdi mdi-plus" /></b-button>
    </b-button-group>
    <b-pagination v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total-rows="pagination.totalCount"
                  v-show="pagination.totalCount > pagination.perPage" />
    <ItemModal ref="itemModal" :categoryId="categoryId" v-on:item-added="onItemAdded" />
  </div>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import ItemModal from '@/components/modals/ItemModal'

export default {
  props: {
    categoryId: {
      type: Number,
      default: null
    },
    selected: {
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
        label: 'Manufacturer',
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
        totalCount: -1
      }
    }
  },
  watch: {
    'pagination.currentPage': function () {
      this.$refs.table.refresh()
    }
  },
  components: {
    ItemModal
  },
  methods: {
    onItemAdded: function () {
      this.pagination.totalCount = -1
      this.$refs.table.refresh()
      EventBus.$emit('item-added')
    },
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

      return new Promise((resolve) => {
        this.apiPostCategoryItems(this.categoryId, localCtx).then(result => {
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
  },
  mounted: function () {
    this.selectedItemId = this.selected
  }
}
</script>

<style>
.item-table table tr:hover {
  cursor: pointer;
}
.item-table table tr .b-rating:hover {
  cursor: default;
}
.item-table .btn-group .btn {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
