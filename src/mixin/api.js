export default {
  methods: {
    apiGetCategories: function (onSuccess, onError) {
      return this.axios({ url: 'category', method: 'GET', success: onSuccess, error: onError })
    },
    apiGetCategory: function (categoryId, onSuccess, onError) {
      return this.axios({ url: `category/${categoryId}`, method: 'GET', success: onSuccess, error: onError })
    },
    apiPostCategory: function (category, onSuccess, onError) {
      return this.axios({ url: 'category', method: 'POST', data: category, success: onSuccess, error: onError })
    },
    apiPostItems: function (query, onSuccess, onError) {
      query.page--
      return this.axios({ url: 'item', method: 'POST', data: query, success: onSuccess, error: onError })
    },
    apiPostItem: function (itemId, query, onSuccess, onError) {
      query.page--
      return this.axios({ url: `item/${itemId}`, method: 'POST', data: query, success: onSuccess, error: onError })
    },
    apiPostCategoryItems: function (categoryId, query, onSuccess, onError) {
      query.page--
      return this.axios({ url: `category/${categoryId}/item`, method: 'POST', data: query, success: onSuccess, error: onError })
    },
    apiPostItemRatings: function (itemId, query, onSuccess, onError) {
      query.page--
      return this.axios({ url: `item/${itemId}/rating`, method: 'POST', data: query, success: onSuccess, error: onError })
    },
    apiPatchItemRating: function (itemId, categoryId, rating, onSuccess, onError) {
      return this.axios({ url: `item/${itemId}/rating/${categoryId}`, method: 'PATCH', data: rating, success: onSuccess, error: onError })
    },
    apiGetItemImage: function (itemId, onSuccess, onError) {
      return this.axios({ url: `item/${itemId}/image`, method: 'GET', success: onSuccess, error: onError })
    },
    apiGetRatingCategories: function (categoryId, onSuccess, onError) {
      return this.axios({ url: `category/${categoryId}/rating`, method: 'GET', success: onSuccess, error: onError })
    },
    putItemRating: function (rating, onSuccess, onError) {
      return this.axios({ url: `item/${rating.itemId}/rating/${rating.ratingCategoryId}`, method: 'PUT', data: rating, success: onSuccess, error: onError })
    },
    deleteItemRating: function (rating, onSuccess, onError) {
      return this.axios({ url: `item/${rating.itemId}/rating/${rating.ratingCategoryId}`, method: 'DELETE', data: rating, success: onSuccess, error: onError })
    },
    postRatingCategory: function (categoryId, ratingCategory, onSuccess, onError) {
      return this.axios({ url: `category/${categoryId}/rating`, method: 'POST', data: ratingCategory, success: onSuccess, error: onError })
    },
    apiDeleteImage: function (imageId, image, onSuccess, onError) {
      return this.axios({ url: `image/${imageId}`, method: 'DELETE', data: image, success: onSuccess, error: onError })
    },
    apiPostItemImage: function (itemId, formData, onSuccess, onError) {
      return this.axios({ url: `item/${itemId}/image`, method: 'POST', formData: formData, success: onSuccess, error: onError })
    }
  }
}