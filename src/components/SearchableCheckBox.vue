<template>
  <div>
    <label>{{ name }}</label>
    <multi-select
      :options="selectOptions"
      :selected-options="items"
      :placeholder="placeholder"
      @select="onSelect"
      :isDisabled="!isEnabled"
    >
    </multi-select>
  </div>
</template>

<script>
import _ from "lodash";
import { MultiSelect } from "vue-search-select";
export default {
  name: "searchable-multi-select",
  components: {
    MultiSelect,
  },
  props: {
    name: {
      type: String,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    selectOptions: {
      type: Array,
    },
    resets: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "select item",
    },
  },
  data() {
    return {
      options: [],
      objectItem: {},
      searchText: "",
      lastSelectItem: {},
      items: [],
    };
  },

  async mounted() {},

  watch: {
    resets(newV) {
      // console.log(newV);
      this.reset();
    },
  },

  methods: {
    onSelect(items, lastSelectItem) {
      this.items = items;
      this.lastSelectItem = lastSelectItem;

      let valuesToEmit = [];

      for (let names of this.items.values()) {
        valuesToEmit.push(names.value);
      }
      this.$emit("filterItems", valuesToEmit);
    },
    // deselect option
    reset() {
      this.items = []; // reset
    },
    // select option from parent component
    selectFromParentComponent() {
      this.items = _.unionWith(this.items, [this.options[0]], _.isEqual);
    },
  },
};
</script>
<style>
.delete::after,
.delete::before {
  margin-left: 14px;
}
</style>
