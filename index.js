const got = require('got')
const xmlParser = require('xml-js')

/**
 * Supported formats: JSON, XML
 * @param {String} value string to be parsed
 */
const safeParse = value => {
  try {
    return JSON.parse(value)
  } catch (error) {
    try {
      return xmlParser.xml2js(value, { ignoreComment: true, alwaysChildren: true, compact: true })
    } catch (error) {
      return typeof value === 'string' ? { result: value } : 'NO CONTENT'
    }
  }
}

/**
 * Parse http error
 * @param {*} error any error
 */
const showError = error => {
  try {
    if (error.constructor === got.HTTPError) {
      const { body } = error.response
      console.log(`RESPONSE BODY: ${body}`)
      return safeParse(body)
    }
    else throw error
  } catch (error) {
    console.log(`ERROR: ${error.message}`)
    return { error: error.message }
  }
}

/**
 *
 * @param {Object.<string,*>} records Object of records to be logged
 */
const makeLog = (records) => {
  for (let key in records) {
    const value = typeof records[key] === 'object' ? JSON.stringify(records[key]) : records[key]
    console.log('-----------------------------')
    console.log(`${key}: ${records[key]}`)
    console.log('-----------------------------')
  }
}

module.exports = {
  safeParse, showError, makeLog
}