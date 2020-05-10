<template>
  <b-card v-if="item"
          no-body
          :title="item.itemName"
          :sub-title="item.itemDescription">
    <b-card-body>
      <b-card-title class="text-primary">{{ item.itemName }}</b-card-title>
      <b-card-sub-title>{{ item.itemDescription }}</b-card-sub-title>
      <b-card-text><i class="mdi mdi-tag-text-outline" /> {{ item.typeName }}<span v-if="item.typeDescription" class="text-muted"> - {{ item.typeDescription }}</span></b-card-text>
      <b-card-text><i class="mdi mdi-factory" /> {{ item.manufacturerName }}<span v-if="item.manufacturerDescription" class="text-muted"> - {{ item.manufacturerDescription }}</span></b-card-text>
    </b-card-body>

    <RatingTable :item="item" v-on:rating-changed="$emit('rating-changed')" />

    <b-carousel
      v-if="images"
      v-model="imagePage"
      controls
      :interval="0"
      img-width="1024"
      img-height="480"
      class="image-carousel"
      style="text-shadow: 1px 1px 2px #333;">

      <b-carousel-slide v-for="page in getImagePages()" :key="`image-page-${page}`">
        <template v-slot:img>
          <b-row>
            <b-col cols=4 v-for="image in getImagesOnPage(page - 1)" :key="`image-${page}-${image.id}`" class="d-flex flex-column px-0 mx-0">
              <img class="item-image d-block img-fluid w-100" :src="`${baseUrl}image/${image.id}/src?size=MEDIUM`">
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
        accept=".jpg .jpeg"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..." />
      <b-button type="submit" @click="uploadImage"><i class="mdi mdi-upload"/> Upload</b-button>
    </b-form>
  </b-card>
</template>

<script>
import RatingTable from '@/components/tables/RatingTable'

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
      imageFile: null
    }
  },
  components: {
    RatingTable
  },
  methods: {
    uploadImage: function () {
      let formData = new FormData()
      formData.append('imageFile', this.imageFile)

      this.apiPostItemImage(this.item.itemId, formData, result => {
        if (result) {
          this.updateImages()
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
      return Math.ceil(this.images.length / 3)
    },
    getImagesOnPage: function (page) {
      return this.images.slice(page * 3, Math.min(this.images.length, (page + 1) * 3))
    },
    updateItem: function (value) {
      const request = {
        page: 1,
        limit: 2147483647,
        prevCount: -1,
        filter: []
      }

      this.apiPostItem(value, request, result => {
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
          this.images = result
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
