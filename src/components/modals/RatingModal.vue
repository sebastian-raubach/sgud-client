<template>
  <div>
    <b-modal ref="modal"
             modal-class="rating-modal"
             ok-title="Add"
             cancel-title="Cancel"
             title="Add rating"
             @ok="onSubmit">
      <b-form @submit.prevent="onSubmit" autocomplete="off">
        <b-form-group label-for="category" label="Rating category">
          <b-input-group>
            <template v-slot:append>
              <b-button @click="$refs.categoryModal.show()" v-b-tooltip="'Add new rating category.'"><i class="mdi mdi-plus" /></b-button>
            </template>
            <ModelSelect id="category" v-model="selectedCategory" :options="ratingCategories" />
          </b-input-group>
          <b-form-rating v-model="rating" no-border />
        </b-form-group>
      </b-form>
    </b-modal>
    <RatingCategoryModal v-on:category-added="onCategoryCreated" ref="categoryModal" />
  </div>
</template>

<script>
import { ModelSelect } from 'vue-search-select'
import RatingCategoryModal from '@/components/modals/RatingCategoryModal'

export default {
  props: {
    categoryId: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      selectedCategory: null,
      ratingCategories: [],
      rating: null
    }
  },
  components: {
    ModelSelect,
    RatingCategoryModal
  },
  methods: {
    onCategoryCreated: function (category) {
      this.postRatingCategory(this.categoryId, {
        categoryId: this.categoryId,
        name: category.name,
        description: category.description
      }, result => {
        if (result) {
          this.updateCategories(result)
        }
      })
    },
    show: function () {
      this.rating = null
      this.selectedCategory = null
      this.ratingCategories = []
      this.updateCategories()
      this.$refs.modal.show()
    },
    onSubmit: function () {
      if (this.selectedCategory && this.rating) {
        this.$emit('rating-added', {
          ratingCategoryId: this.selectedCategory,
          rating: this.rating
        })
      }
      
      this.$refs.modal.hide()
    },
    updateCategories: function (idToSelect) {
      this.apiGetRatingCategories(this.categoryId, result => {
        if (result && result.length > 0) {
          this.ratingCategories = result.map(c => {
            return {
              value: c.id,
              text: c.name
            }
          })

          if (idToSelect) {
            this.selectedCategory = idToSelect
          }
        }
      })
    }
  }
}
</script>

<style>
.rating-modal form .ui.selection.dropdown,
.rating-modal form .btn {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.rating-modal form .b-rating {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
