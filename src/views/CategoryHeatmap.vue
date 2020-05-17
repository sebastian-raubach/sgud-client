<template>
  <div v-if="category">
    <ItemHeatmapTable :categoryId="category.id" />
  </div>
</template>

<script>
import ItemHeatmapTable from '@/components/tables/ItemHeatmapTable'

export default {
  data: function () {
    return {
      category: null
    }
  },
  components: {
    ItemHeatmapTable
  },
  mounted: function () {
    var categoryId = this.$route.params.categoryId

    this.apiGetCategory(categoryId, result => {
      if (result && result.length > 0) {
        this.category = result[0]
      }
    })
  }
}
</script>

<style>

</style>
