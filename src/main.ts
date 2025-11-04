import { createApp } from 'vue'
import './styles/style.css'
import './components/NewTable/styles/variables.css'
import './styles/variables.css'
import App from './App.vue'
import { router } from './routes/routes'

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

app.use(router);

app.mount('#app')