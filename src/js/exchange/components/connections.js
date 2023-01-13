/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

const baseUrl = 'https://cscloud7-176.lnu.se/exchange/api'

/**
 * Gets all available currency codes.
 *
 * @returns {Array} - An array of arrays containing currency codes and names.
 */
// [
//   [
//     "AED",
//     "UAE Dirham"
//   ],
//   ...
// ]
export const getCurrencyCodes = async () => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const data = await fetch(baseUrl + '/codes')
        const json = await data.json()

        resolve(json.codes)
      } catch (err) {
        console.error('getCurrencyCodes encountered an error', err)
        reject(err)
      }
    })()
  })
}

/**
 * Gets the rate between the base and quote currencies.
 *
 * @param {string} base - the base curency.
 * @param {string} quote - the quote currency.
 * @returns {object} - returns an object with the rate and both currency codes.
 */
// {
//   "rate": 0.9243,
//   "base": "USD",
//   "quote": "EUR"
// }
export const getPair = async (base, quote) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const data = await fetch(baseUrl + `/pair/${base}/${quote}`)
        const json = await data.json()

        resolve(json)
      } catch (err) {
        console.error('getPair encountered an error.', err)
        reject(err)
      }
    })()
  })
}

/**
 * Collects all available reates agains the currency provided.
 *
 * @param {string} currency - the currency code to get all latest reates against.
 * @returns {object} - latest rates for all available currencies.
 */
// {
//   "base": "USD",
//   "rates": {
//     "USD": 1,
//     "AED": 3.6725,
//     ...
//   }
// }
export const latestRates = async (currency) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const data = await fetch(baseUrl + `/latest/${currency}`)
        const json = await data.json()

        resolve(json)
      } catch (err) {
        console.error('latestRates encountered an error.', err)
        reject(err)
      }
    })()
  })
}
