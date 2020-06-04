<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="{ name: 'home' }" class="d-flex align-items-center">
        <img src="./assets/sgud.svg" height="40px" class="d-inline-block align-top" alt="SGUD">
        SGUD - 's gud?
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{ name: 'about' }">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid class="mt-3">
      <b-row>
        <b-col cols="12" md="3" class="mb-3">
          <b-list-group>
            <b-list-group-item :variant="`${category.id === $route.params.categoryId ? 'primary' : 'default'}`"
                               :class="`d-flex justify-content-between align-items-center ${category.id === $route.params.categoryId ? 'active' : ''}`"
                               v-for="category in categories"
                               :key="`category-${category.id}`"
                               :to="{ name: 'category', params: { categoryId: category.id } }">
              <span><i :class="`mdi ${category.icon}`" /> {{ category.name }}</span>
              <b-badge variant="secondary" pill v-if="!category.count || category.count === 0">0</b-badge>
              <b-badge variant="primary" pill v-else>{{ category.count }}</b-badge>
            </b-list-group-item>
            <b-list-group-item button @click.prevent v-b-modal.addCategory><i class="mdi mdi-plus"/> Add category</b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col cols="12" md="9" class="mb-3">
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
          <b-input-group>
          <template v-slot:append>
            <b-input-group-text><i :class="`mdi ${newCategory.icon ? newCategory.icon : 'mdi-checkbox-blank-outline white'}`" /></b-input-group-text>
          </template>
          <b-form-input id="icon" v-model="newCategory.icon" required :state="formState.icon" placeholder="mdi-* (required)" />
          </b-input-group>
          <template v-slot:description>
            <p>Please use icons styles from <a href="https://materialdesignicons.com/">MaterialDesignIcons</a>.<br />
            You can also use any of these colors to color the icon.<br/>
            <span class="navy">navy</span> <span class="blue">blue</span> <span class="aqua">aqua</span> <span class="teal">teal</span> <span class="olive">olive</span> <span class="green">green</span> <span class="lime">lime</span> <span class="yellow">yellow</span> <span class="orange">orange</span> <span class="red">red</span> <span class="fuchsia">fuchsia</span> <span class="purple">purple</span> <span class="maroon">maroon</span> <span class="white">white</span> <span class="silver">silver</span> <span class="gray">gray</span> <span class="black">black</span></p>
          </template>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { EventBus } from '@/event-bus.js'

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
  destroyed: function () {
    EventBus.$off('item-added', this.updateCategories)
  },
  mounted: function () {
    this.updateCategories()

    EventBus.$on('item-added', this.updateCategories)
  }
}
</script>

<style lang="scss">
$primary: #aa0088;
$danger: #ED4C67;
$info: #12CBC4;
$success: #A3CB38;
$warning: #FFC312;
$gray-200: #330029;
$table-dark-hover-color: #ecf0f1;
$link-color: #bdc3c7;

@import '~bootswatch/dist/solar/variables';
@import '~bootstrap/scss/bootstrap';
@import '~bootswatch/dist/solar/bootswatch';
@import '~baguettebox.js/dist/baguetteBox.min.css';

body > div {
  overflow-x: hidden;
}

.input-group .ui.selection.dropdown {
  position: relative;
  flex: 1 1 0%;
  min-width: 0;
  margin-bottom: 0;
  background: #A9BDBD;
}
.input-group .ui.selection.dropdown .menu {
  background: #A9BDBD;
}
.input-group .ui.selection.dropdown:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.input-group .ui.selection.dropdown:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.modal.fade .modal-dialog {
  transition: transform 0.3s ease-out, max-width 0.3s ease-out;
}

.navy { color: #001F3F; }
.blue { color: #0074D9; }
.aqua { color: #7FDBFF; }
.teal { color: #39CCCC; }
.olive { color: #3D9970; }
.green { color: #2ECC40; }
.lime { color: #01FF70; }
.yellow { color: #FFDC00; }
.orange { color: #FF851B; }
.red { color: #FF4136; }
.fuchsia { color: #F012BE; }
.purple { color: #B10DC9; }
.maroon { color: #85144B; }
.white { color: #FFFFFF; }
.silver { color: #DDDDDD; }
.gray { color: #AAAAAA; }
.black { color: #111111; }
</style>
