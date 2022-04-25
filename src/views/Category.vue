<template>
  <div v-if="category">
    <h1 class="text-primary">
      <i :class="`mdi mdi-32px ${category.icon}`" /> {{ category.name }}<template v-if="category.description"> - <small>{{ category.description }}</small></template>
    </h1>
    <hr/>
    <b-button :to="{ name: 'category-heatmap', params: { categoryId: category.id } }" class="mb-3">Show item heatmap</b-button>
    <ItemTable :categoryId="category.id" :selected="itemId" v-on:item-selected="(selectedId) => itemId = selectedId" ref="itemTable"/>
    <ItemDetails v-if="itemId" :itemId="itemId" v-on:rating-changed="$refs.itemTable.refresh()" v-on:item-deleted="onItemDeleted" />
  </div>
</template>

<script>
import ItemDetails from '@/components/ItemDetails'
import ItemTable from '@/components/tables/ItemTable'

export default {
  data: function () {
    return {
      category: null,
      itemId: null
    }
  },
  components: {
    ItemDetails,
    ItemTable
  },
  methods: {
    onItemDeleted: function () {
      this.itemId = null

      this.$refs.itemTable.refresh()
    }
  },
  mounted: function () {
    const categoryId = parseInt(this.$route.params.categoryId)
    this.itemId = parseInt(this.$route.params.itemId)

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
