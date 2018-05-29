import Vuex from 'vuex'




const createStore = () => {
    return new Vuex.Store({
        state: {
            counter: 0,
            loaded:false,
            homeSlidePos:0
        },
        mutations: {
            increment(state) {
                state.counter=2
            },
            loadedAll(loaded) {
                loaded=true
            },
            homeSlider(position) {
               // homeSlidePos = true
            }
        }
    })
}

export default createStore