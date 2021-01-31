<template>
  <b-modal ref="modal"
           title="Add manufacturer"
           ok-title="Add"
           cancel-title="Cancel"
           @ok="onSubmit">
    <b-form @submit.prevent="onSubmit" :validated="formValidated" autocomplete="off">
      <b-form-group label-for="name" label="Manufacturer name">
        <b-form-input v-model="name" id="name" :state="formState.name" placeholder="Manufacturer name (required)" required />
      </b-form-group>
      <b-form-group label-for="description" label="Manufacturer description">
        <b-form-input v-model="description" id="description" placeholder="Manufacturer description (optional)"/>
      </b-form-group>
      <b-form-group label-for="website" label="Manufacturer website">
        <b-form-input v-model="website" type="url" id="website" placeholder="Manufacturer website (optional)"/>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  data: function () {
    return {
      name: null,
      description: null,
      website: null,
      formValidated: false,
      formState: {
        name: null
      }
    }
  },
  methods: {
    show: function () {
      this.formValidated = false
      this.formState.name = null
      this.name = null
      this.description = null
      this.website = null
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
        url: this.website
      }

      this.apiPostManufacturer(query, result => {
        if (result) {
          this.$emit('manufacturer-added', result)
          this.$refs.modal.hide()
        }
      })
    }
  }
}
</script>

<style>

</style>
