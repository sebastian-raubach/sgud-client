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

    <RatingTable :itemId="item.itemId" v-on:rating-changed="$emit('rating-changed')" />

    <b-row>
      <b-col cols=12 md=6 v-for="image in images" :key="`image-${image.id}`">
        <b-img fluid-grow :src="`${baseUrl}image/${image.id}/src?src=MEDIUM`" />
      </b-col>
    </b-row>
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
      images: null
    }
  },
  components: {
    RatingTable
  },
  methods: {
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

</style>
