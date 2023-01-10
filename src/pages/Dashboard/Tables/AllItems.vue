<template>
  <div style="display: flex; flex-direction: column;">
    <p>asdasdasd</p>
  </div>
</template>

<script>
// import ShowImages from "../ShowImages";
// import AddItem from "../ItemsManagement/AddItem";
// import EditItemDialoge from "../ItemsManagement/EditItemDialoge";
// import { Pagination } from "@/components";
// import { LoaderFull } from "@/components";

export default {
  name: "all-items",
  data() {
    return {
      items: [],
    };
  },

  async mounted() {
    await this.$store.dispatch("getAllItems", { page: 1, search: "" });
    this.items = await this.$store.getters.getAllItems;
    console.log(this.items);
  },
};
</script>

<style lang="scss" scoped></style>
