import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VAlert,
  VCard,
  VDialog,
  VDivider,
  VNavigationDrawer,
  VFooter,
  VForm,
  VList,
  VBtn,
  VIcon,
  VImg,
  VGrid,
  VProgressLinear,
  VSnackbar,
  VTabs,
  VTextField,
  VToolbar,
  transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VAlert,
    VCard,
    VDialog,
    VDivider,
    VNavigationDrawer,
    VFooter,
    VForm,
    VList,
    VBtn,
    VIcon,
    VImg,
    VGrid,
    VProgressLinear,
    VSnackbar,
    VTabs,
    VTextField,
    VToolbar,
    transitions
  },
  theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  iconfont: 'fa'
})
