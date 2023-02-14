<template>
  <div class="range-slider" style="width: min(550px, 90%)">
    <div style=" margin: auto; text-align: left; padding: 20px">
      <div
        style="display: flex; justify-content: space-between; text-align: center"
      >
        <span style=" height: 30px; text-align: center;"
          >min: {{ oBarMinValue }}</span
        >
        <span>Price range</span>
        <span style=" height: 30px; text-align: center;"
          >max: {{ oBarMaxValue }}</span
        >
      </div>

      <MultiRangeSlider
        baseClassName="multi-range-slider-bar-only"
        :minValue="oBarMinValue"
        :maxValue="oBarMaxValue"
        :max="initialMaxPrice"
        :min="0"
        :step="0.1"
        :rangeMargin="1"
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
      oBarMaxValue: 1,
      componentInitialized: false,
    };
  },

  props: {
    initialMaxPrice: {
      type: Number,
      default: 1,
    },
    resetPriceRange: {
      type: Boolean,
    },
  },

  watch: {
    initialMaxPrice(newV) {
      this.oBarMaxValue = newV;
    },
    resetPriceRange(newV) {
      this.componentInitialized = false;
      this.oBarMinValue = 0;
      this.oBarMaxValue = this.initialMaxPrice;
    },
  },

  methods: {
    UpdateValues(e) {
      this.barMinValue = e.minValue;
      this.barMaxValue = e.maxValue;
    },

    update_oBarValues(e) {
      if (this.componentInitialized) {
        this.oBarMinValue = e.minValue;
        this.oBarMaxValue = e.maxValue;
        this.$emit("price", e.minValue, e.maxValue);
      }
      this.componentInitialized = true;
    },
  },
};
</script>

<style lang="scss">
.multi-range-slider-bar-only .bar-inner {
  background-color: rgb(114, 248, 132) !important;
  border: none;
}

.multi-range-slider-bar-only .thumb .caption * {
  background-color: rgb(114, 248, 132) !important;
}
.multi-range-slider-bar-only .thumb {
  border-radius: 0;
}
.multi-range-slider-bar-only .thumb-right::before {
  top: -10px;
  clip-path: polygon(
    35% 45%,
    15% 15%,
    15% 0%,
    85% 0%,
    85% 15%,
    66% 44%,
    67% 61%,
    85% 85%,
    85% 100%,
    15% 100%,
    15% 85%,
    34% 64%
  );
  background-color: rgb(114, 248, 132);
  border-radius: 0;
}

.multi-range-slider-bar-only .thumb-left::before {
  top: 16.5px;
  clip-path: polygon(
    35% 45%,
    15% 15%,
    15% 0%,
    85% 0%,
    85% 15%,
    66% 44%,
    67% 61%,
    85% 85%,
    85% 100%,
    15% 100%,
    15% 85%,
    34% 64%
  );
  border-radius: 0;
  background-color: rgb(114, 248, 132);
}
</style>
