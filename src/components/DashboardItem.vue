<template>
  <b-card no-body bg-variant="primary" v-if="category && chartData" class="mb-3 position-relative">
    <b-card-body class="">
      <b-card-title class="text-light text-center d-flex flex-column mb-0">
        <i :class="`mdi mdi-48px ${category.icon}`" />
        {{ category.name }}
      </b-card-title>
    </b-card-body>
    <div class="pt-3 px-3 chart-container position-absolute">
      <canvas ref="chartCanvas" height="100"/>
    </div>
  </b-card>
</template>

<script>
import Chart from 'chart.js'
const moment = require('moment')

export default {
  props: {
    category: {
      type: Object,
      default: null
    }
  },
  data: function () {
    const monthInts = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    return {
      stats: null,
      months: monthInts.map(i => {
        return moment().subtract(i, 'month').format('MMMM')
      }),
      chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      maxValue: 0
    }
  },
  watch: {
    category: {
      immediate: true,
      handler: function () {
        this.updateStats()
      }
    }
  },
  methods: {
    updateStats: function () {
      this.maxValue = 0
      this.apiGetCategoryStats(this.category.id, result => {
        if (result) {
          result.forEach(c => {
            const date = moment(c.month, 'YYYY-MM')
            const now = moment()
            const monthDiff = now.diff(date, 'months')
            this.chartData[11 - monthDiff] = c.count
            this.maxValue = Math.max(this.maxValue, c.max)
          })
        }

        this.updateChart()
      })
    },
    updateChart: function () {
      if (this.category && this.chartData) {
        new Chart(this.$refs.chartCanvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels: this.months,
            datasets: [{
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderColor: 'rgba(255,255,255,0.3)',
              hoverBackgroundColor: 'rgba(255,255,255,0.3)',
              hoverBorderColor: 'rgba(255,255,255,0.3)',
              data: this.chartData
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                display: false,
                ticks: {
                  suggestedMin: 0,
                  beginAtZero: true,
                  suggestedMax: this.maxValue
                }
              }],
              xAxes: [{
                display: false
              }]
            }
          }
        })
      }
    }
  }
}
</script>

<style>
.chart-container {
  /* position: relative; */
  bottom: 0;
  width: 100%;
  height: 100px;
}
</style>
