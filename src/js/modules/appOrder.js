/**
 * Module to handle the positioning along z-axis.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

const storage = 'apporder-LNU-B3'

/**
 * Adds a new app to the apporder.
 *
 * @param {string} id - The id of the app to be added to the order.
 * @returns {number} The length of the app order list after the app has been added.
 */
export const addAppToAppOrder = (id) => {
  try {
    const appList = JSON.parse(sessionStorage.getItem(storage)) || []
    appList.push(id)
    sessionStorage.setItem(storage, JSON.stringify(appList))

    return appList.length
  } catch (err) {
    console.info('addAppToAppOrder encountered a problem.', err)
    return 0
  }
}

/**
 * Rearrange the app order when a new app has recieved focus.
 *
 * @param {string} id - The id of the app to be added to the order.
 */
export const newFocus = (id) => {
  try {
    const appList = JSON.parse(sessionStorage.getItem(storage))
    const remove = appList.indexOf(id)
    appList.splice(remove, 1)
    appList.push(id)

    sessionStorage.setItem(storage, JSON.stringify(appList))
  } catch (err) {
    console.error('newFocus encountered a problem.', err)
  }
}

/**
 * Returns the order of the app with the given id in the list stored in session storage.
 *
 * @param {string} id - The id of the app whose order is to be returned
 * @returns {number} - The order of the app in the list, or -1 if an error occurred
 */
export const getAppOrder = (id) => {
  try {
    const appList = JSON.parse(sessionStorage.getItem(storage))

    return appList.indexOf(id)
  } catch (err) {
    console.info('getAppOrder encountered a problem.', err)
    return -1
  }
}

/**
 * Removes an app from the app order in session storage.
 *
 * @param {string} id - The ID of the app to be removed.
 */
export const removeFromAppOrder = (id) => {
  try {
    const appList = JSON.parse(sessionStorage.getItem(storage))
    appList.splice(appList.indexOf(id), 1)

    sessionStorage.setItem(storage, JSON.stringify(appList))
  } catch (err) {
    console.error('removeFromAppOrder encountered a problem.', err)
  }
}

/**
 * Clears the stored app order from session storage.
 */
export const clearAppOrder = () => {
  try {
    sessionStorage.removeItem(storage)
  } catch (err) {
    console.error('clearApporder encountered a problem.', err)
  }
}
