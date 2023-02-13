<template>
  <div class="range-slider">
    <div style="width: auto; margin: auto; text-align: left; padding: 20px">
      <div
        style="display: flex; justify-content: space-between; text-align: center"
      >
        <!-- <span
          style="
          display: inline-block;
          padding: 10px;
          border: solid 1px;
          border-radius: 5px;
          width: 50px;
          margin: 3px;
        "
          >{{ oBarMinValue }}</span
        > -->
        <input type="number" :value="oBarMinValue" />
        <span style="margin-right: 40px;">Min</span>

        <span>Max</span>
        <input
          type="number"
          :value="oBarMaxValue"
          @input="(e) => $emit('price', e.target.vale)"
        />
      </div>

      <MultiRangeSlider
        baseClassName="multi-range-slider-bar-only"
        :minValue="oBarMinValue"
        :maxValue="oBarMaxValue"
        :max="1000"
        :min="0"
        :step="0.1"
        :rangeMargin="0"
        @input="update_oBarValues"
      />
    </div>
  </div>
</template>

<script>
import MultiRangeSlider from "multi-range-slider-vue";
import "../../node_modules/multi-range-slider-vue/MultiRangeSliderBlack.css";
import "../../node_modules/multi-range-slider-vue/MultiRangeSliderBarOnly.css";
export default {
  name: "App",
  components: { MultiRangeSlider },
  data() {
    return {
      oBarMinValue: 0,
      oBarMaxValue: 100,
    };
  },
  methods: {
    UpdateValues(e) {
      this.barMinValue = e.minValue;
      this.barMaxValue = e.maxValue;
    },

    update_oBarValues(e) {
      this.oBarMinValue = e.minValue;
      this.oBarMaxValue = e.maxValue;
      this.$emit("price", e.minValue, e.maxValue);
    },
  },
};
</script>

<style lang="scss">
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000305;
  margin-top: 60px;
} */

.multi-range-slider-bar-only .bar-inner {
  background-color: rgb(27, 238, 55) !important;
  border: none;
}

.multi-range-slider-bar-only .thumb .caption * {
  background-color: rgb(27, 238, 55) !important;
}
</style>
