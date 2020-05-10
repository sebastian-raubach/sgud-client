<template>
  <div v-if="item" class="rating-table">
    <b-table striped
             responsive
             hover
             dark
             show-empty
             table-variant="dark"
             sort-icon-left
             class="mb-0"
             :items="getData"
             :fields="fields"
             ref="table">
      <template v-slot:cell(rating)="data">
        <b-form-rating v-model="data.item.rating" inline stars="5" precision="2" @change="evt => onChange(evt, data.item)" />
      </template>
      <template v-slot:cell(delete)="data">
        <b-button variant="danger" @click="deleteRating(data.item)"><i class="mdi mdi-delete" /></b-button>
      </template>
    </b-table>
    <b-button-group class="mb-3">
      <b-button @click="$refs.ratingModal.show()"><i class="mdi mdi-plus" /></b-button>
    </b-button-group>
    <b-pagination v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total-rows="pagination.totalCount"
                  v-show="pagination.totalCount > pagination.perPage" />
    <RatingModal ref="ratingModal" :categoryId="item.categoryId" v-on:rating-added="addRating" />
  </div>
</template>

<script>
import RatingModal from '@/components/modals/RatingModal'

export default {
  props: {
    item: {
      type: Object,
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
      }, {
        key: 'delete',
        label: '',
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
  components: {
    RatingModal
  },
  methods: {
    addRating: function (rating) {
      rating.itemId = this.item.itemId

      this.putItemRating(rating, result => {
        if (result) {
          this.$refs.table.refresh()
          this.$emit('rating-changed')
        }
      })
    },
    deleteRating: function (item) {
      this.deleteItemRating(item, result => {
        if (result) {
          this.$refs.table.refresh()
          this.$emit('rating-changed')
        }
      })
    },
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
        this.apiPostItemRatings(this.item.itemId, request).then(result => {
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
.rating-table .btn-group .btn {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
