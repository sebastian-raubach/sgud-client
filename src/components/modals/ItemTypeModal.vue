<template>
  <b-modal ref="modal"
           v-if="categoryId"
           title="Add item type"
           ok-title="Add"
           cancel-title="Cancel"
           @ok="onSubmit">
    <b-form @submit.prevent="onSubmit" :validated="formValidated" autocomplete="off">
      <b-form-group label-for="name" label="Item type name">
        <b-form-input v-model="name" id="name" :state="formState.name" placeholder="Item type name (required)" required />
      </b-form-group>
      <b-form-group label-for="description" label="Item type description">
        <b-form-input v-model="description" id="description" placeholder="Item type description (optional)"/>
      </b-form-group>
      <b-form-group label="Icon" label-for="icon">
        <b-input-group>
          <template v-slot:append>
             <b-input-group-text><i :class="`mdi ${icon ? icon : 'mdi-checkbox-blank-outline white'}`" /></b-input-group-text>
          </template>
          <b-form-input id="icon" v-model="icon" required placeholder="mdi-* (optional)" />
        </b-input-group>
        <template v-slot:description>
          <p>Please use icons styles from <a href="https://materialdesignicons.com/">MaterialDesignIcons</a>.<br />
          You can also use any of these colors to color the icon.<br/>
          <span class="navy">navy</span> <span class="blue">blue</span> <span class="aqua">aqua</span> <span class="teal">teal</span> <span class="olive">olive</span> <span class="green">green</span> <span class="lime">lime</span> <span class="yellow">yellow</span> <span class="orange">orange</span> <span class="red">red</span> <span class="fuchsia">fuchsia</span> <span class="purple">purple</span> <span class="maroon">maroon</span> <span class="white">white</span> <span class="silver">silver</span> <span class="gray">gray</span> <span class="black">black</span></p>
        </template>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  props: {
    categoryId: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      name: null,
      description: null,
      icon: null,
      formValidated: false,
      formState: {
        name: null
      }
    }
  },
  methods: {
    show: function () {
      this.name = null
      this.description = null
      this.formValidated = false
      this.formState.name = null
      this.$refs.modal.show()
    },
    onSubmit: function (evt) {
      if (!this.name) {
        this.formValidated = true
        this.formState.name = false
        evt.preventDefault()
        return
      }

      const query = {
        name: this.name,
        description: this.description,
        icon: this.icon,
        categoryId: this.categoryId
      }

      this.apiPostItemType(query, result => {
        if (result) {
          this.$emit('item-type-added', result)
          this.$refs.modal.hide()
        }
      })
    }
  }
}
</script>

<style>

</style>
