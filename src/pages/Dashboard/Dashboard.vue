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
            {{ siteData.allSiteVisists }}
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
          <p class="category uppercase">Cost of Products</p>
          <h3 class="title">
            {{ siteData.productPriceSum }}
          </h3>
        </template>

        <template slot="footer">
          <div class=" uppercase cost_of_items_color">
            cost of products
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
          <p class="category uppercase">Number of products</p>
          <h3 class="title">+{{ siteData.countOfProducts }}</h3>
        </template>

        <template slot="footer">
          <div class="uppercase nb_of_items_color">
            Number of products
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
            {{ siteData.countOfUsers }}
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
      class="md-layout-item md-medium-size-100 md-xsmall-size-100 chart-edit"
    >
      <chart-card
        v-if="showChartVists"
        :chart-data="siteVisits.data"
        :chart-options="siteVisits.options"
        :chart-responsive-options="siteVisits.responsiveOptions"
        chart-type="Bar"
        chart-inside-header
        background-color="rose"
        style="width: 100% !important; min-width: 100% !important"
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
          <!-- <div
            v-if="siteData.years_of_visits.length"
            style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;"
          >
            <p
              v-for="year in siteData.years_of_visits"
              :key="year"
              style="border-bottom: 1px solid crimson; cursor: pointer; color: crimson "
              @click="chartVisitsYear(year.year)"
            >
              {{ year.year }}
            </p>
          </div> -->
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
      style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;"
    >
      <p
        v-for="year in siteData.years_of_visits"
        :key="year.year"
        style="border-bottom: 1px solid crimson; cursor: pointer; color: crimson "
      >
        <span @click="chartVisitsYear(year.year)"> {{ year.year }}</span>
      </p>
    </div>
    <div class="md-layout-item md-medium-size-75 md-xsmall-size-100 chart-edit">
      <chart-card
        v-if="showChartVists"
        :chart-data="productsAddedPerMonth.data"
        :chart-options="productsAddedPerMonth.options"
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
      showChartVists: false,
      siteData: {},
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

      productsAddedPerMonth: {
        data: {
          labels: [],
          series: [],
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },

      siteVisits: {
        data: {
          labels: [],
          series: [],
        },
        options: {
          axisX: {
            showGrid: true,
          },
          low: 0,
          high: 500,
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

  async mounted() {
    await this.$store.dispatch("setSiteVisits");
    await this.$store.dispatch("getAllSiteData");
    this.siteData = await this.$store.getters.getAllsiteData;
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    this.siteVisits.data.series[0] = [];
    this.productsAddedPerMonth.data.series[0] = [];

    for (let x = 0; x < 12; x++) {
      this.siteVisits.data.labels[x] = labels[x];
      this.productsAddedPerMonth.data.labels[x] = labels[x];

      //site visits
      if (this.siteData.siteVisitsPerMonth[labels[x]] == undefined) {
        this.siteVisits.data.series[0][x] = 0;
      } else {
        this.siteVisits.data.series[0][x] = this.siteData.siteVisitsPerMonth[
          labels[x]
        ].length;
      }

      //products added per month
      if (this.siteData.products_add_per_month[labels[x]] == undefined) {
        this.productsAddedPerMonth.data.series[0][x] = 0;
      } else {
        this.productsAddedPerMonth.data.series[0][
          x
        ] = this.siteData.products_add_per_month[labels[x]].length;
      }
    }

    this.showChartVists = !this.showChartVists;
  },

  methods: {
    onSelect: function(items) {
      this.selected = items;
    },

    async chartVisitsYear(year) {
      this.showChartVists = false;
      await this.$store.dispatch("getAllSiteData", year);
      this.siteData = await this.$store.getters.getAllsiteData;
      const labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      this.siteVisits.data.series[0] = [];
      this.productsAddedPerMonth.data.series[0] = [];

      for (let x = 0; x < 12; x++) {
        this.siteVisits.data.labels[x] = labels[x];
        this.productsAddedPerMonth.data.labels[x] = labels[x];

        //site visits
        if (this.siteData.siteVisitsPerMonth[labels[x]] == undefined) {
          this.siteVisits.data.series[0][x] = 0;
        } else {
          this.siteVisits.data.series[0][x] = this.siteData.siteVisitsPerMonth[
            labels[x]
          ].length;
        }

        //products added per month
        if (this.siteData.products_add_per_month[labels[x]] == undefined) {
          this.productsAddedPerMonth.data.series[0][x] = 0;
        } else {
          this.productsAddedPerMonth.data.series[0][
            x
          ] = this.siteData.products_add_per_month[labels[x]].length;
        }
      }

      this.showChartVists = true;
    },
  },
};

// Vue.directive("uppercase",{
//   update: function (el) {
//     el.value = el.value.toUpperCase()
//   }
// })
</script>

<style lang="scss">
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

.md-layout-item.md-medium-size-100 {
  @media screen and (min-width: 1281px) {
    min-width: 90%;
    max-width: 90%;
    margin-left: 0 !important;
    flex: 1 1 100%;
  }
}

.chart-edit {
  max-width: 70% !important;
}
</style>
