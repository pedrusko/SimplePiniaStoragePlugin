/**
 * Simple Pinia plugint to store values in localStorage.
 * Can be used to retrieve values across page reloadings.
 * @author Pedro R. Benito da Rocha <pedrusko@gmail.com>
 * @version 2022.11.11.00
 */
export function storePiniaPlugin(context) {

    const debug = false
    var objStore = {}

    /**
     * Setup function to restore state.
     */
    function setup() {

        var restoreState = true;

        if (debug) {

            console.log("Setup: restoring state for " + context.store.$id)
        }

        // Retrieve state saved in JSON format to an object.
        if (context.options.useSessionStorage) {

            objStore = JSON.parse(sessionStorage.getItem('Store_' + context.store.$id))
        } else {

            objStore = JSON.parse(localStorage.getItem('Store_' + context.store.$id))
        }

        // Restore state only if the retrieving was successfull.
        if (objStore !== null) {

            // If storage time has expired destroy the saved store.
            if (context.options.sessionExpiration) {

                var storAge = Date.now()

                if (context.options.useSessionStorage) {

                    storAge = sessionStorage.getItem('Store_' + context.store.$id + '-TS')
                } else {

                    storAge = localStorage.getItem('Store_' + context.store.$id + '-TS')
                }

                // If store age is too old destroy it.
                console.log(storAge + ' -> ' + (Date.now() - context.options.sessionExpiration))
                if (storAge < (Date.now() - context.options.sessionExpiration)) {

                    if (debug) {

                        console.log("Destroying stored state because is too old.")
                    }

                    restoreState = false;
                    if (context.options.useSessionStorage) {

                        sessionStorage.removeItem('Store_' + context.store.$id)
                        sessionStorage.removeItem('Store_' + context.store.$id + '-TS')
                    } else {

                        localStorage.removeItem('Store_' + context.store.$id)
                        localStorage.removeItem('Store_' + context.store.$id + '-TS')
                    }
                }
            }

            if (restoreState) {

                // Iterate thru the object to restore values.
                for (const [key, value] of Object.entries(objStore)) {

                    if (debug) {

                        console.log(`${key}: ${value}`)
                    }

                    context.store[key] = value
                }
            }
        }
    }

    /**
     * Save state on localStorage.
     * @param {*} estado 
     */
    function saveState(estado) {

        if (debug) {

            console.log("Saving state...")
        }

        // Store state in JSON format and time in ECMAScript epoch.
        if (context.options.useSessionStorage) {

            sessionStorage.setItem('Store_' + context.store.$id, JSON.stringify(estado))
            sessionStorage.setItem('Store_' + context.storeTime.$id + '-TS', Date.now)
        } else {

            localStorage.setItem('Store_' + context.store.$id, JSON.stringify(estado))
            localStorage.setItem('Store_' + context.store.$id + '-TS', Date.now())
        }
    }

    /**
     * Subscribe to store changes to save state.
     */
    context.store.$subscribe((mutation, state) => {

        saveState(state)
    })

    // Call setup to restore state.
    setup()
}