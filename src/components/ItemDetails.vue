<template>
  <b-card v-if="item"
          bg-variant="dark"
          no-body
          :title="item.itemName"
          :sub-title="item.itemDescription">
    <template v-slot:header>
      <div class="d-flex flex-columns justify-content-between">
        <h3 class="text-primary mb-0">{{ item.itemName }}</h3>
        <b-button-group>
          <b-button size="sm" variant="outline-info" v-b-tooltip="'Edit item'" @click="$refs.itemModal.show()"><i class="mdi mdi-pencil"/></b-button>
          <b-button size="sm" variant="outline-danger" v-b-tooltip="'Delete item'" @click="deleteItem"><i class="mdi mdi-delete"/></b-button>
        </b-button-group>
      </div>
    </template>
    <b-card-body>
      <b-card-sub-title class="mb-3">{{ item.itemDescription }}</b-card-sub-title>
      <b-card-text v-if="item.typeName"><i class="mdi mdi-tooltip-text-outline" /> {{ item.typeName }}<span v-if="item.typeDescription" class="text-muted"> - {{ item.typeDescription }}</span></b-card-text>
      <b-card-text v-if="item.itemTags">
        <i class="mdi mdi-tag-multiple-outline" />
        <b-badge v-for="(tag, index) in item.itemTags" :key="`${item.itemId}-${index}`" class="mx-1">{{ tag }}</b-badge>
      </b-card-text>
      <b-card-text v-if="item.manufacturerName">
        <i class="mdi mdi-factory" />&nbsp;
        <template v-if="item.manufacturerUrl"><a :href="item.manufacturerUrl">{{ item.manufacturerName }}</a> <i class="mdi mdi-open-in-new" /></template>
        <span v-else>{{ item.manufacturerName }}</span>
        <span v-if="item.manufacturerDescription" class="text-muted"> - {{ item.manufacturerDescription }}</span>
      </b-card-text>
      <b-card-text v-if="item.sourceName">
        <i class="mdi mdi-store" />&nbsp;
        <template v-if="item.sourceUrl"><a :href="item.sourceUrl">{{ item.sourceName }}</a> <i class="mdi mdi-open-in-new" /></template>
        <span v-else>{{ item.sourceName }}</span>
        <span v-if="item.sourceDescription" class="text-muted"> - {{ item.sourceDescription }}</span>
      </b-card-text>
    </b-card-body>

    <RatingTable :item="item" v-on:rating-changed="$emit('rating-changed')" />

    <b-carousel
      v-if="images && images.length > 0"
      v-model="imagePage"
      controls
      :interval="0"
      img-width="1024"
      img-height="480"
      class="image-carousel"
      style="text-shadow: 1px 1px 2px #333;">

      <b-carousel-slide v-for="page in getImagePages()" :key="`image-page-${page}`">
        <template v-slot:img>
          <b-row class="image-carousel-row">
            <b-col :cols="12 / getImagesOnPage(page - 1).length" v-for="image in getImagesOnPage(page - 1)" :key="`image-${page}-${image.id}`" class="d-flex flex-column px-0 mx-0">
              <a :href="`${baseUrl}image/${image.id}/src?size=ORIGINAL`" class="baguettebox" @click.prevent>
                <img class="item-image d-block img-fluid w-100" :src="`${baseUrl}image/${image.id}/src?size=MEDIUM`">
              </a>
              <b-button variant="danger" @click="deleteImage(image.id)"><i class="mdi mdi-delete"/></b-button>
            </b-col>
          </b-row>
        </template>
      </b-carousel-slide>
    </b-carousel>

    <b-form @submit.prevent>
      <b-form-file
        class="mt-3"
        v-model="imageFile"
        :state="Boolean(imageFile)"
        accept=".jpg, .jpeg"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..." />
      <b-button type="submit" @click="uploadImage"><i class="mdi mdi-upload"/> Upload</b-button>
    </b-form>
    <ItemModal ref="itemModal" :categoryId="item.categoryId" :itemToEdit="item" v-on:item-added="onItemUpdate" />
  </b-card>
</template>

<script>
import RatingTable from '@/components/tables/RatingTable'
import ItemModal from '@/components/modals/ItemModal'
import baguetteBox from 'baguettebox.js'

import { EventBus } from '@/event-bus.js'

export default {
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  watch: {
    itemId: {
      immediate: true,
      handler: function (newValue) {
        this.updateItem(newValue)
      }
    },
    item: function () {
      this.updateImages()
    }
  },
  data: function () {
    return {
      item: null,
      images: null,
      imagePage: 0,
      imageFile: null,
      baguetteBox: null
    }
  },
  components: {
    ItemModal,
    RatingTable
  },
  methods: {
    onItemUpdate: function () {
      this.$emit('rating-changed')
      this.updateItem(this.item.itemId)
    },
    uploadImage: function () {
      if (this.imageFile) {
        EventBus.$emit('show-loading', true)
        const formData = new FormData()
        formData.append('imageFile', this.imageFile)

        this.apiPostItemImage(this.item.itemId, formData, result => {
          EventBus.$emit('show-loading', false)
          if (result) {
            this.updateImages()
            this.imageFile = null
          }
        })
      }
    },
    deleteItem: function () {
      this.$bvModal.msgBoxConfirm('Delete item?', {
        okTitle: 'Yes',
        cancelTitle: 'No'
      })
        .then(value => {
          if (value === true) {
            this.apiDeleteItem(this.item.itemId, (result) => {
              if (result) {
                this.$emit('item-deleted')
              }
            })
          }
        })
    },
    deleteImage: function (imageId) {
      this.apiDeleteImage(imageId, {
        id: imageId
      }, result => {
        if (result) {
          this.updateImages()
        }
      })
    },
    getImagePages: function () {
      const pageWidth = this.getPageWidth()
      let imgs

      if (pageWidth >= 992) {
        imgs = 3
      } else if (pageWidth >= 768) {
        imgs = 2
      } else {
        imgs = 1
      }

      return Math.ceil(this.images.length / imgs)
    },
    getImagesOnPage: function (page) {
      const pageWidth = this.getPageWidth()
      let imgs

      if (pageWidth >= 992) {
        imgs = 3
      } else if (pageWidth >= 768) {
        imgs = 2
      } else {
        imgs = 1
      }

      return this.images.slice(page * imgs, Math.min(this.images.length, (page + 1) * imgs))
    },
    updateItem: function (value) {
      const request = {
        page: 1,
        limit: 2147483647,
        prevCount: -1,
        filter: []
      }

      this.apiPostItemView(value, request, result => {
        if (result && result.data && result.data.length > 0) {
          this.item = result.data[0]
        } else {
          this.item = null
        }
      })
    },
    updateImages: function () {
      if (this.item) {
        this.apiGetItemImage(this.item.itemId, result => {
          if (this.baguetteBox) {
            baguetteBox.destroy()
          }

          this.images = result

          this.$nextTick(() => {
            this.baguetteBox = baguetteBox.run('.image-carousel-row', {
              captions: false,
              fullScreen: false,
              filter: /.*\/image.*/i
            })
          })
        })
      } else {
        this.images = null
      }
    }
  }
}
</script>

<style>
.image-carousel .row .btn {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.image-carousel .item-image {
  height: 400px;
  object-fit: cover;
}
</style>
