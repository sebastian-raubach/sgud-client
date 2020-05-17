<template>
  <div>
    <h1>Item heatmap</h1>
    <b-table striped
             responsive
             hover
             dark
             show-empty
             table-variant="dark"
             sort-icon-left
             class="mb-0"
             :items="items"
             :fields="fields"
             ref="table">
      <template v-slot:cell(item.name)="data">
        {{ data.value }}
      </template>
      <template v-slot:cell()="data">
        <template v-if="data.value">
          <i :class="`mdi mdi-circle ${sizes[Math.floor(data.value) - 1]}`" :style="{ color: '#' + colors[Math.floor(data.value)] }" v-b-tooltip :title="data.value"/>
        </template>
      </template>
    </b-table>
    <b-pagination v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total-rows="pagination.totalCount"
                  v-show="pagination.totalCount > pagination.perPage" />
  </div>
</template>

<script>
const Rainbow = require('rainbowvis.js')
const rainbow = new Rainbow()
rainbow.setNumberRange(0, 5)
rainbow.setSpectrum('#073642', '#aa0088')

export default {
  props: {
    categoryId: {
      type: Number,
      default: null
    }
  },
  watch: {
    categoryId: {
      immediate: true,
      handler: function () { this.updateTable() }
    }
  },
  data: function () {
    return {
      fields: [],
      filter: [],
      items: [],
      colors: [0, 1, 2, 3, 4, 5].map(i => rainbow.colorAt(i)),
      sizes: ['', 'mdi-18px', 'mdi-24px', 'mdi-36px', 'mdi-48px'],
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalCount: -1
      }
    }
  },
  methods: {
    updateTable: function () {
      this.apiGetRatingCategories(this.categoryId, result => {
        if (result) {
          this.fields = result.map(r => {
            return {
              key: 'ratings.' + r.id.toString(),
              label: r.name,
              sortable: true,
              tdClass: 'my-0 py-0 align-middle'
            }
          })
          this.fields.unshift({
            key: 'item.name',
            label: 'Item',
            tdClass: 'align-middle',
            sortable: true
          })
        } else {
          this.fields = []
        }
      })

      this.apiGetRatingHeatmap(this.categoryId, result => {
        if (result) {
          this.items = result
        } else {
          this.items = []
        }
      })
    }
  }
}
</script>

<style>

</style>
