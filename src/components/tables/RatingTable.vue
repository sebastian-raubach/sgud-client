<template>
  <div v-if="itemId">
    <b-table striped
             responsive
             hover
             dark
             show-empty
             table-variant="dark"
             sort-icon-left
             :items="getData"
             :fields="fields"
             ref="table">
      <template v-slot:cell(rating)="data">
        <b-form-rating v-model="data.item.rating" inline stars="5" precision="2" @change="evt => onChange(evt, data.item)" />
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
    itemId: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      fields: [{
        key: 'ratingCategoryName',
        label: 'Rating category name'
      }, {
        key: 'ratingCategoryDescription',
        label: 'Rating category description'
      }, {
        key: 'rating',
        label: 'Rating',
        class: 'text-right'
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
    refresh: function () {
      this.$refs.table.refresh()
    },
    onChange: function (evt, item) {
      this.apiPatchItemRating(item.itemId, item.ratingCategoryId, item, result => {
        if (result) {
          this.$refs.table.refresh()
          this.$emit('rating-changed')
        }
      })
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
        this.apiPostItemRatings(this.itemId, request).then(result => {
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

</style>
