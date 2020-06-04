<template>
  <div>
    <h1>Home</h1>
    <p>Welcome to SGUD. The place to rate absolutely everything under the sun.</p>
    <template v-if="categories && categories.length > 0">
      <p>Please select a category below or in the menu.</p>
      <b-row>
        <b-col cols=12 sm=6 lg=4 xl=3 v-for="category in categories" :key="`category-${category.id}`" class="dashboard-card">
          <router-link :to="{ name: 'category', params: { categoryId: category.id } }">
            <DashboardItem :category="category" />
          </router-link>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import DashboardItem from '@/components/DashboardItem'
export default {
  data: function () {
    return {
      categories: []
    }
  },
  components: {
    DashboardItem
  },
  methods: {
    updateCategories: function () {
      this.apiGetCategories(result => {
        this.categories = result
      })
    }
  },
  mounted: function () {
    this.updateCategories()
  }
}
</script>

<style>
.dashboard-card a:hover {
  text-decoration: none;
}
</style>
