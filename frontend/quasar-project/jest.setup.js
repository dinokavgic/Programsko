import * as Vue from 'vue'
globalThis.Vue = Vue
const fetch = require('node-fetch')
global.fetch = fetch
global.Request = fetch.Request
global.Response = fetch.Response
global.Headers = fetch.Headers
