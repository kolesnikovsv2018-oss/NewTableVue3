import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import cell components with type checking
import * as CellComponents from './components/CellComponents'
import * as FilterComponents from './components/FilterComponents'

const app = createApp(App)

Object.entries(CellComponents).forEach(([key, component]) => {
  app.component(key, component);
});
Object.entries(FilterComponents).forEach(([key, component]) => {
  app.component(key, component);
});

// app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')