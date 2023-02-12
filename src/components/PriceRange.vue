<template>
  <div class="range-slider">
    <span class="rangeValues"></span>
    <input
      :value="value1"
      min="0"
      max="50"
      step="0.5"
      type="range"
      @change="loggg"
    />
    <input
      @change="loggg"
      :value="value2"
      min="1000"
      max="50000"
      step="500"
      type="range"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: 0,
      value2: 50000,
    };
  },

  methods: {
    loggg(e) {
      //console.log(e.target.value);
    },
  },
};
</script>

<style scoped>
/* .range-slider .rangeValues {
  display: block;
  box-shadow: 0 0 20px rgba(0, 139, 253, 0.25);
  padding: 20px;
  font-size: 22px;
  margin-bottom: 35px;
} */

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid white;
  width: 300px;
  position: absolute;
  left: 0;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 300px;
  height: 5px;
  background: #ddd;
  border: none;
  border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #21c1ff;
  margin-top: -6px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #ccc;
}

/*The following CSS code is not necessary for everyone*/

input[type="range"]::-moz-range-track {
  width: 300px;
  height: 5px;
  background: #ddd;
  border: none;
  border-radius: 3px;
}

input[type="range"]::-moz-range-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #21c1ff;
}

/*hide the outline behind the border*/
input[type="range"]:-moz-focusring {
  outline: 1px solid white;
  outline-offset: -1px;
}

input[type="range"]::-ms-track {
  width: 300px;
  height: 5px;
  /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
  background: transparent;
  /*leave room for the larger thumb to overflow with a transparent border */
  border-color: transparent;
  border-width: 6px 0;
  /*remove default tick marks*/
  color: transparent;
  z-index: -4;
}

input[type="range"]::-ms-fill-lower {
  background: #777;
  border-radius: 10px;
}

input[type="range"]::-ms-fill-upper {
  background: #ddd;
  border-radius: 10px;
}

input[type="range"]::-ms-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #21c1ff;
}

input[type="range"]:focus::-ms-fill-lower {
  background: #888;
}

input[type="range"]:focus::-ms-fill-upper {
  background: #ccc;
}
</style>
