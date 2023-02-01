<template>
  <div class="md-layout md-alignment-center-space-around">
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="rose">
        <template slot="header">
          <div class="card-icon icon">
            <md-icon>equalizer</md-icon>
          </div>
          <p class="category uppercase">Website Visits</p>
          <h3 class="title">
            75.521
          </h3>
        </template>

        <template slot="footer">
          <div class="website_visits_color uppercase">
            Website Visits
          </div>
        </template>
      </stats-card>
    </div>

    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="green">
        <template slot="header">
          <div class="card-icon icon">
            <img
              src="../Dashboard/logos/dashboardLogos/costLogo.png"
              alt=""
              class="logo"
            />
          </div>
          <p class="category uppercase">Cost of Items</p>
          <h3 class="title">
            $ 34.245
          </h3>
        </template>

        <template slot="footer">
          <div class=" uppercase cost_of_items_color">
            cost of items
          </div>
        </template>
      </stats-card>
    </div>
    <div
      class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25 "
    >
      <stats-card header-color="blue">
        <template slot="header">
          <div class="card-icon icon">
            <img
              src="../Dashboard/logos/dashboardLogos/basketLogo.png"
              alt=""
              class="logo"
            />
          </div>
          <p class="category uppercase">Number of items</p>
          <h3 class="title">
            +245
          </h3>
        </template>

        <template slot="footer">
          <div class="uppercase nb_of_items_color">
            Number of items
          </div>
        </template>
      </stats-card>
    </div>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="warning">
        <template slot="header">
          <div class="card-icon icon">
            <img
              src="../Dashboard/logos/dashboardLogos/pLogo.png"
              alt=""
              class="logo"
            />
          </div>
          <p class="category uppercase ">Number of users</p>
          <h3 class="title">
            184
          </h3>
        </template>

        <template slot="footer">
          <div class="nb_of_users_color uppercase">
            number of users
          </div>
        </template>
      </stats-card>
    </div>

    <div
      class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
    >
      <chart-card
        :chart-data="emailsSubscriptionChart.data"
        :chart-options="emailsSubscriptionChart.options"
        :chart-responsive-options="emailsSubscriptionChart.responsiveOptions"
        chart-type="Bar"
        chart-inside-header
        background-color="rose"
      >
        <md-icon slot="fixed-button">build</md-icon>
        <md-button class="md-simple md-info md-just-icon" slot="first-button">
          <md-icon>refresh</md-icon>
          <md-tooltip md-direction="bottom">Refresh</md-tooltip>
        </md-button>
        <md-button class="md-simple md-just-icon" slot="second-button">
          <md-icon>edit</md-icon>
          <md-tooltip md-direction="bottom">Change Date</md-tooltip>
        </md-button>

        <template slot="content">
          <h4 class="title uppercase nb_v_p_m">Number of visits per month</h4>
          <!-- <p class="category">
              Last Campaign Performance
            </p> -->
        </template>

        <!-- <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>
              updated 10 days ago
            </div>
          </template> -->
      </chart-card>
    </div>
    <div
      class="md-layout-item md-medium-size-75 md-xsmall-size-100 md-size-33 "
    >
      <chart-card
        :chart-data="dailySalesChart.data"
        :chart-options="dailySalesChart.options"
        chart-type="Line"
        chart-inside-header
        background-color="green"
      >
        <md-button class="md-simple md-info md-just-icon" slot="first-button">
          <md-icon>refresh</md-icon>
          <md-tooltip md-direction="bottom">Refresh</md-tooltip>
        </md-button>
        <md-button class="md-simple md-just-icon" slot="second-button">
          <md-icon>edit</md-icon>
          <md-tooltip md-direction="bottom">Change Date</md-tooltip>
        </md-button>

        <template slot="content">
          <h4 class="title uppercase i_a_p_m">Items added per month</h4>
          <!-- <p class="category">
              <span class="text-success"
                ><i class="fas fa-long-arrow-alt-up"></i>
                55%
              </span>
              increase in today sales.
            </p> -->
        </template>

        <!-- <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>
              updated 4 minutes ago
            </div>
          </template> -->
      </chart-card>
    </div>

    <!-- <div class="md-layout-item md-size-100 text-center">
      <h1
        class="uppercase md-layout-item"
        style=" background-color: white; padding: 1rem 3rem; border-radius: 1rem; color: #808080;"
      >
        Most Viewed Items
      </h1>
    </div> -->

    <div class="md-layout-item md-size-100 text-center">
      <div class="md-layout md-alignment-center-space-around ">
        <div class="md-layout-item md-medium-size-85 md-large-size-66 ">
          <h1
            class="uppercase"
            style="background-color: white; padding: 1rem 3rem; border-radius: 1rem; color: #808080;   "
          >
            Most Viewed Items
          </h1>
        </div>
      </div>
    </div>

    <!-- <div
      class="md-layout  md-alignment-center-space-around md-size-100 "
      v-for="mvItem in mvItems"
      :key="mvItem.id"
    >
      <mv-items-card :item="mvItem" />
    </div> -->

    <div class="md-layout md-alignment-center-space-around ">
      <div
        class="md-layout-item md-large-size-30 md-medium-size-33 md-small-size-50 md-xsmall-size-85"
        v-for="mvItem in mvItems"
        :key="mvItem.id"
      >
        <mv-items-card :item="mvItem" />
      </div>
    </div>
  </div>
</template>

<script>
import { StatsCard, ChartCard, NavTabsCard, mvItemsCard } from "@/components";
export default {
  components: {
    StatsCard,
    ChartCard,
    mvItemsCard,
    // NavTabsCard,
  },

  data() {
    return {
      mvItems: [
        {
          id: 0,
          name: "pack 1",
          category: "BackPacks",
          price: 129,
          views: 100,
          purchases: 55,
        },
        {
          id: 1,
          name: "pack 2",
          category: "Front Packs",
          price: 12,
          views: 500,
          purchases: 505,
        },
        
      ],

      product1: process.env.VUE_APP_BASE_URL + "/img/card-2.jpg",
      product2: process.env.VUE_APP_BASE_URL + "/img/card-3.jpg",
      product3: process.env.VUE_APP_BASE_URL + "/img/card-1.jpg",
      seq2: 0,

      selected: [],
      firstTabs: [
        {
          tab: 'Sign contract for "What are conference organizers afraid of?"',
        },
        {
          tab: "Lines From Great Russian Literature? Or E-mails From My Boss?",
        },
        {
          tab:
            "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
        },
        { tab: "Create 4 Invisible User Experiences you Never Knew About" },
      ],
      secondTabs: [
        {
          tab:
            "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
        },
        {
          tab: 'Sign contract for "What are conference organizers afraid of?"',
        },
      ],
      thirdTabs: [
        {
          tab: "Lines From Great Russian Literature? Or E-mails From My Boss?",
        },
        {
          tab:
            "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
        },
        {
          tab: 'Sign contract for "What are conference organizers afraid of?"',
        },
      ],

      users: [
        {
          id: 1,
          name: "Noelia O'Kon",
          salary: "13098.00",
          country: "Niger",
        },
        {
          id: 2,
          name: "Mr. Enid Von PhD",
          salary: "35978.00",
          country: "Curaçao",
        },
        {
          id: 3,
          name: "Colton Koch",
          salary: "26278.00",
          country: "Netherlands",
        },
        {
          id: 4,
          name: "Gregory Vandervort",
          salary: "25537.00",
          country: "South Korea",
        },
      ],
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]],
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]],
        },

        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De",
          ],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
          ],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
    };
  },

  // async mounted() {
  //   await this.$store.dispatch("myUser");
  //   this.user = await this.$store.getters.myUser;
  // },

  methods: {
    onSelect: function(items) {
      this.selected = items;
    },
  },
};

// Vue.directive("uppercase",{
//   update: function (el) {
//     el.value = el.value.toUpperCase()
//   }
// })
</script>

<style>
@import "../Dashboard/css/logos.css";

.most_view_products {
  /* background-color: #8a9316; */
  padding: 1rem 3rem;
  border-radius: 1rem;
  color: #808080;
}

.card_bottom_radius {
  border: 5px solid;
  font-weight: bold;
  border-color: transparent #8a9316 #8a9316 #8a9316;
  border-radius: 6px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.card_content {
  border-color: transparent rgb(138, 147, 22) rgb(138, 147, 22);
  border-image: initial;
  border-radius: 0px 0px 30px 30px;
}
.hoverElevate:hover {
  box-shadow: 0px 10px 20px 5px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}
</style>
