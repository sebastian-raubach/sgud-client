<template>
  <div>
    <b-modal ref="modal"
            modal-class="item-modal"
            :ok-title="itemToEdit ? 'Update' : 'Add'"
            cancel-title="Cancel"
            title="Add item"
            :size="ratingCategories && ratingCategories.length > 0 ? 'xl' : 'md'"
            @ok.prevent="onSubmit">
      <b-form @submit.prevent="onSubmit">
        <b-row>
          <b-col cols="12" :md="ratingCategories && ratingCategories.length > 0 ? '6' : '12'">
            <b-form-group label-for="name" label="Item name">
              <b-form-input v-model="name" id="name" />
            </b-form-group>
            <b-form-group label-for="description" label="Item description">
              <b-form-input v-model="description" id="description" />
            </b-form-group>
            <b-form-group label-for="itemTags" label="Item tags">
              <b-form-input v-model="itemTags" id="itemTags" />
            </b-form-group>
            <b-form-group label-for="type" label="Item type">
              <b-input-group>
                <template v-slot:append>
                  <b-button @click="$refs.itemTypeModal.show()" v-b-tooltip="'Add new item type.'"><i class="mdi mdi-plus" /></b-button>
                </template>
                <ModelSelect id="type" v-model="selectedType" :options="itemTypes" required />
              </b-input-group>
            </b-form-group>
            <b-form-group label-for="manufacturer" label="Item manufacturer">
              <b-input-group>
                <template v-slot:append>
                  <b-button @click="$refs.manufacturerModal.show()" v-b-tooltip="'Add new item manufacturer.'"><i class="mdi mdi-plus" /></b-button>
                </template>
                <ModelSelect id="manufacturer" v-model="selectedManufacturer" :options="itemManufacturers" required />
              </b-input-group>
            </b-form-group>
            <b-form-group label-for="source" label="Item source">
              <b-input-group>
                <template v-slot:append>
                  <b-button @click="$refs.sourceModal.show()" v-b-tooltip="'Add new item source.'"><i class="mdi mdi-plus" /></b-button>
                </template>
                <ModelSelect id="source" v-model="selectedSource" :options="itemSources" required />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6" v-if="ratingCategories && ratingCategories.length > 0">
            <b-form-group v-for="rating in ratingCategories" :key="`rating-category-${rating.id}`" :label-for="`rating-${rating.id}`" :label="rating.name">
              <b-form-rating v-model="selectedRatings[rating.id]" show-clear :id="`rating-${rating.id}`" />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
    <ItemTypeModal ref="itemTypeModal" :categoryId="categoryId" v-on:item-type-added="updateItemTypes" />
    <ManufacturerModal ref="manufacturerModal" v-on:manufacturer-added="updateManufacturers" />
    <SourceModal ref="sourceModal" v-on:source-added="updateSources" />
  </div>
</template>

<script>
import ItemTypeModal from '@/components/modals/ItemTypeModal'
import ManufacturerModal from '@/components/modals/ManufacturerModal'
import SourceModal from '@/components/modals/SourceModal'
import { ModelSelect } from 'vue-search-select'

export default {
  props: {
    categoryId: {
      type: Number,
      default: null
    },
    itemToEdit: {
      type: Object,
      default: null
    }
  },
  data: function () {
    return {
      name: null,
      description: null,
      itemTags: null,
      itemTypes: [],
      selectedType: null,
      itemManufacturers: [],
      selectedManufacturer: null,
      ratingCategories: [],
      selectedRatings: {},
      itemSources: [],
      selectedSource: null
    }
  },
  components: {
    ItemTypeModal,
    ModelSelect,
    ManufacturerModal,
    SourceModal
  },
  methods: {
    show: function () {
      this.selectedRatings = {}

      if (this.itemToEdit) {
        this.name = this.itemToEdit.itemName
        this.description = this.itemToEdit.itemDescription
        this.selectedType = this.itemToEdit.typeId
        this.selectedManufacturer = this.itemToEdit.manufacturerId
        this.selectedSource = this.itemToEdit.sourceId
        this.itemTags = this.itemToEdit.itemTags ? this.itemToEdit.itemTags.join(", ") : null
      } else {
        this.name = null
        this.description = null

        this.apiGetRatingCategories(this.categoryId, result => {
          this.ratingCategories = result
        })
      }

      this.updateItemTypes()
      this.updateManufacturers()
      this.updateSources()
      this.$refs.modal.show()
    },
    hide: function () {
      this.$refs.modal.hide()
    },
    onSubmit: function () {
      if (!this.selectedManufacturer || !this.selectedType || !this.name) {
        return
      }

      let tags = null
      if (this.itemTags) {
        tags = this.itemTags.split(",").map(t => t.trim()).filter(t => t.length > 0)
      }

      const item = {
        categoryId: this.categoryId,
        sourceId: this.selectedSource,
        typeId: this.selectedType,
        manufacturerId: this.selectedManufacturer,
        name: this.name,
        tags: tags,
        description: this.description
      }

      if (this.itemToEdit) {
        item.id = this.itemToEdit.itemId

        this.apiPatchItem(item, result => {
          if (result) {
            this.$emit('item-added')
            this.hide()
          }
        })
      } else {
        this.apiPostItem(item, result => {
          if (result) {
            const ratings = this.ratingCategories.map(c => {
              return {
                itemId: result,
                ratingCategoryId: c.id,
                rating: this.selectedRatings[c.id]
              }
            }).filter(r => r.rating !== null && r.rating !== undefined)

            this.putItemRatings(result, ratings, () => {
              this.$emit('item-added')
              this.hide()
            })
          }
        })
      }
    },
    updateManufacturers: function (idToSelect) {
      this.apiGetManufacturers(result => {
        if (result && result.length > 0) {
          this.itemManufacturers = result.map(m => {
            return {
              value: m.id,
              text: m.name
            }
          })

          if (idToSelect) {
            this.selectedManufacturer = idToSelect
          }
        }
      })
    },
    updateSources: function (idToSelect) {
      this.apiGetSources(result => {
        if (result && result.length > 0) {
          this.itemSources = result.map(s => {
            return {
              value: s.id,
              text: s.name
            }
          })

          if (idToSelect) {
            this.selectedSource = idToSelect
          }
        }
      })
    },
    updateItemTypes: function (idToSelect) {
      this.apiGetItemType(this.categoryId, result => {
        if (result && result.length > 0) {
          this.itemTypes = result.map(c => {
            return {
              value: c.id,
              text: c.name
            }
          })

          if (idToSelect) {
            this.selectedType = idToSelect
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
