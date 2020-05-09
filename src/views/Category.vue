<template>
  <div v-if="category">
    <h1 class="text-primary"><i :class="`mdi mdi-32px ${category.icon}`" /> {{ category.name }}<template v-if="category.description"> - <small>{{ category.description }}</small></template></h1>
    <hr/>
    <ItemTable :categoryId="category.id" v-on:item-selected="(selectedId) => itemId = selectedId" ref="itemTable"/>
    <ItemDetails v-if="itemId" :itemId="itemId" v-on:rating-changed="$refs.itemTable.refresh()" />
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
