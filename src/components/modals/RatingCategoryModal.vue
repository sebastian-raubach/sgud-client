<template>
  <b-modal ref="modal"
           title="Add rating category"
           ok-title="Add"
           cancel-title="Cancel"
           @ok="onSubmit">
    <b-form @submit.prevent="onSubmit" autocomplete="off">
      <b-form-group label-for="name" label="Name">
        <b-input id="name" v-model="name" placeholder="Rating category name (required)" required />
      </b-form-group>
      <b-form-group label-for="description" label="Description">
        <b-input id="description" v-model="description" placeholder="Rating category description (optional)" />
      </b-form-group>
      <b-form-group label-for="counts" label="Counts towards rating average?">
        <b-form-checkbox switch v-model="counts" size="lg" placeholder="Rating category counts towards average (required)">{{ counts ? 'Yes' : 'No' }}</b-form-checkbox>
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
      counts: true
    }
  },
  methods: {
    show: function () {
      this.$refs.modal.show()
    },
    onSubmit: function () {
      if (this.name) {
        this.$emit('category-added', {
          name: this.name,
          description: this.description,
          includeInAverage: this.counts
        })
      }

      this.$refs.modal.hide()
    }
  }
}
</script>

<style>

</style>
