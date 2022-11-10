/**
 * Simple Pinia plugint to store values in localStorage.
 * Can be used to retrieve values across page reloadings.
 * @author Pedro R. Benito da Rocha <pedrusko@gmail.com>
 * @version 2022.11.10.00
 */
export function simplePiniaStorePlugin(context) {

    const debug = true
    var objStore = {}

    /**
     * Setup function to restore state.
     */
    function setup() {

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

            // Iterate thru the object to restore values.
            for (const [key, value] of Object.entries(objStore)) {

                if (debug) {

                    console.log(`${key}: ${value}`)
                }

                context.store[key] = value
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

        // Store state in JSON format.
        if (context.options.useSessionStorage) {

            sessionStorage.setItem('Store_' + context.store.$id, JSON.stringify(estado))
        } else {

            localStorage.setItem('Store_' + context.store.$id, JSON.stringify(estado))
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