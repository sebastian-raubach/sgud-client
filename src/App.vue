<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#" class="d-flex align-items-center">
        <img src="./assets/sgud.svg" height="40px" class="d-inline-block align-top" alt="SGUD">
        SGUD
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid class="mt-3">
      <b-row>
        <b-col cols="12" md="3">
          <b-list-group>
            <b-list-group-item variant="primary"
                               class="d-flex justify-content-between align-items-center"
                               v-for="category in categories"
                               :key="`category-${category.id}`"
                               :to="{ name: 'category', params: { categoryId: category.id } }">
              <span><i :class="`mdi ${category.icon}`" /> {{ category.name }}</span>
              <b-badge variant="secondary" pill v-if="!category.count || category.count === 0">0</b-badge>
              <b-badge variant="primary" pill v-else>{{ category.count }}</b-badge>
            </b-list-group-item>
            <b-list-group-item button variant="dark" @click.prevent v-b-modal.addCategory><i class="mdi mdi-plus"/> Add category</b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col cols="12" md="9">
          <router-view :key="$route.path" />
        </b-col>
      </b-row>
    </b-container>

    <b-modal id="addCategory" title="Add category" @ok="addCategory">
      <b-form @submit.prevent :validated="formValidated">
        <b-form-group label="Name" label-for="name">
          <b-form-input id="name" v-model="newCategory.name" required :state="formState.name" placeholder="Name (required)" />
        </b-form-group>
        <b-form-group label="Description" label-for="description">
          <b-form-input id="description" v-model="newCategory.description" :state="formState.description" placeholder="Description (optional)" />
        </b-form-group>
        <b-form-group label="Icon" label-for="icon">
          <b-form-input id="icon" v-model="newCategory.icon" required :state="formState.icon" placeholder="mdi-* (required)" />
          <template v-slot:description>
            Please use icons styles from <a href="https://materialdesignicons.com/">MaterialDesignIcons</a>.
          </template>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function () {
    return {
      categories: [],
      newCategory: {
        name: null,
        description: null,
        icon: null
      },
      formState: {
        name: null,
        description: null,
        icon: null
      },
      formValidated: false
    }
  },
  methods: {
    addCategory: function (bvModalEvt) {
      if (!this.newCategory.name || !this.newCategory.icon) {
        this.formValidated = true

        this.formState.name = this.newCategory.name !== null
        this.formState.icon = this.newCategory.icon !== null

        bvModalEvt.preventDefault()
        return
      }

      this.apiPostCategory(this.newCategory, () => {
        this.updateCategories()
      })

      this.formValidated = false
      this.formState = {
        name: null,
        description: null,
        icon: null
      }
      this.newCategory = {
        name: null,
        description: null,
        icon: null
      }
    },
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

<style lang="scss">
$primary: #aa0088;
$danger: #c0392b;
$info: #3498db;
$success: #2ecc71;
$warning: #f1c40f;

@import "~bootswatch/dist/solar/variables";
@import "~bootstrap/scss/bootstrap";
@import "~bootswatch/dist/solar/bootswatch";
</style>
