import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'baseUrl'
    ])
  },
  methods: {
    getPageWidth: function () {
      return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      )
    },
    axios ({ url = null, method = 'GET', data = null, formData = null, dataType = 'json', contentType = 'application/json; charset=utf-8', success = null, error = null }) {
      let requestData = null
      let requestParams = null

      // Stringify the data object for non-GET requests
      if (data !== null || data !== undefined) {
        if (method === 'GET') {
          requestParams = data
        } else {
          requestData = data
        }
      }

      let promise

      if (formData) {
        promise = axios.post(url, formData, {
          crossDomain: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        promise = axios({
          url: url,
          method: method,
          data: requestData,
          formData: formData,
          params: requestParams,
          crossDomain: true,
          responseType: dataType,
          headers: {
            'Content-Type': contentType
          }
        })
      }

      promise.then(result => {
        if (success) {
          if (dataType === 'blob' && result.headers && result.headers['content-disposition']) {
            const filename = result.headers['content-disposition']
              .split(';')
              .map(p => p.trim())
              .filter(p => p.indexOf('filename') === 0)
              .map(p => p.replace('filename=', ''))

            if (filename && filename.length > 0) {
              result.data.filename = filename[0]
            }
          }

          success(result.data)
        }
      })

      promise.catch(err => {
        if (err.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          // Log the user out if the result is forbidden and no error method has been provided
          // Otherwise, we assume that the calling method takes care of the error
          if (!error) {
            if (process.env.NODE_ENV === 'development') {
              console.error(err)
            }
          } else if (error) {
            return error(err.response)
          } else if (process.env.NODE_ENV === 'development') {
            console.error(err)
          }
        } else if (err.request) {
          // The request was made but no response was received `err.request` is an instance of XMLHttpRequest in the browser
          if (err.request.textStatus === 'timeout') {
            // TODO: notification
          }
        } else {
          // Something happened in setting up the request that triggered an Error
          if (process.env.NODE_ENV === 'development') {
            console.error(err)
          }
        }

        throw err
      })

      return promise
    }
  }
}
