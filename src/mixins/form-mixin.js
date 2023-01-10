import { isEmpty, isEqual, omit, pick } from "lodash";

export default {
  data() {
    return {
      isLoading: false,
      apiValidationErrors: {},
    };
  },
  methods: {
    /* extract API server validation errors and assigns them to local mixin data */
    setApiValidation(serverErrors = [], refs = null) {
      this.apiValidationErrors = Object.entries(serverErrors).reduce(
        (accumulator, errorObject) => {
          const errorFieldName = errorObject[0];

          const errorDetail = (accumulator[errorFieldName] || []).concat(
            errorObject[1]
          );
          return {
            ...accumulator,
            [errorFieldName]: errorDetail,
          };
        },
        {}
      );
    },

    resetApiValidation() {
      this.apiValidationErrors = {};
    },
  },
};
