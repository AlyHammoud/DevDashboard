<template>
  <md-card class="md-card-profile">
    <div class="md-card-avatar">
      <img class="img" v-if="user.image" :src="user.image" />
      <img class="img" v-else src="../../../../assets/images/d.jpg" />
    </div>
    

    <md-card-content>
      <h6 class="category text-gray">{{ user.role }}</h6>
      <h4 class="card-title">{{ user.name }}</h4>
      <!-- <p class="card-description">
        Don't be scared of the truth because we need to restart the human
        foundation in truth And I love you like Kanye loves Kanye I love Rick
        Owens’ bed design but the back is...
      </p>
      <md-button class="md-round" :class="getColorButton(buttonColor)">
        Follow
      </md-button> -->
    </md-card-content>
  </md-card>
</template>

<script>
export default {
  name: "user-profile-card",
  props: {
    cardUserImage: {
      type: String,
      default: process.env.VUE_APP_BASE_URL + "/img/faces/marc.jpg",
    },
    buttonColor: {
      type: String,
      default: "",
    },
    user: {
      type: Object,
    },
  },
  data() {
    return {
      userDefaultPicture: "../../../../assets/images/d.jpg",
    };
  },
  methods: {
    getColorButton: (buttonColor) => "md-" + buttonColor + "",
  },
};
</script>
