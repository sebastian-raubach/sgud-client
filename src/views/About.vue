<template>
  <div>
    <div class="text-center">
      <img src="@/assets/sgud.svg" fluid  class="about-header-logo" alt="SGUD">
      <h1>SGUD - 's gud?</h1>
    </div>
    <p>SGUD is a tool to rate pretty much everything you can think of. Beer, coffee, wine, ice cream, your favourite underwear, you name it...</p>
    <p>Create new item categories, define rating criteria and start rating things.</p>
    <p>SGUD has been developed by <a href="http://www.raubach.co.uk">Sebastian Raubach</a>. If you would like to thank him, you can <a href="https://github.com/sponsors/sebastian-raubach">buy him a coffee ☕</a>. He'll be sure to rate the coffee properly.</p>

    <b-row class="about-links">
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body bg-variant="dark">
          <div class="card-img text-center">
            <img src="@/assets/github.svg" class="img-fluid p-5" alt="Github" />
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sebastian-raubach/sgud-client">SGUD on Github</a>
          </b-card-footer>
        </b-card>
      </b-col>
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body bg-variant="dark">
          <div class="card-img text-center">
            <img src="@/assets/docker.svg" class="img-fluid p-5" alt="Docker" />
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sebastian-raubach/sgud-client/tree/master/docker">SGUD Docker Container</a>
          </b-card-footer>
        </b-card>
      </b-col>
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body bg-variant="dark">
          <div class="card-img text-center">
            <img src="@/assets/coffee.svg" class="img-fluid p-5" alt="Coffee" />
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sponsors/sebastian-raubach">Buy Sebastian a coffee!</a>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.about-header-logo {
  max-height: 200px;
}
.about-links img {
  height: 15em;
  max-width: 100%;
}
</style>
