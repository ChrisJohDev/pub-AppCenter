/**
 * Module to handle positioning and movement of aaplications within the main application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

const storage = 'apporder-LNU-B3'

export const addAppToAppOrder = (id) => {
  console.log('addAppToAppOrder')
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

export const newFocus = (id) => {
  console.log('newFocus')
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

export const getAppOrder = (id) => {
  console.log('getAppOrder')
  try {
    const appList = JSON.parse(sessionStorage.getItem(storage))

    return appList.indexOf(id)
  } catch (err) {
    console.info('getAppOrder encountered a problem.', err)
    return -1
  }
}

export const removeFromAppOrder = (id) => {
  console.log('removeFromAppOrder')
  try {
    const appList = JSON.parse(sessionStorage.getItem(storage))
    appList.splice(appList.indexOf(id), 1)

    sessionStorage.setItem(storage, JSON.stringify(appList))
  } catch (err) {
    console.error('removeFromAppOrder encountered a problem.', err)
  }
}

export const clearAppOrder = () => {
  console.log('clearAppOrder')
  try {
    sessionStorage.removeItem(storage)
  } catch (err) {
    console.error('clearApporder encountered a problem.', err)
  }
}
