import Vue from 'vue'
import { Tabbar, TabbarItem, IndexBar, IndexAnchor, List, Swipe, SwipeItem, PullRefresh, Cell, Lazyload, Tab, Tabs, Form, Field, Button, Notify, Toast, NoticeBar, Popup, Circle,Slider, DropdownMenu, DropdownItem, Empty } from 'vant';

Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(IndexBar);
Vue.use(IndexAnchor);
Vue.use(List);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(PullRefresh);
Vue.use(Cell);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(Notify);
Vue.use(Toast);
Vue.use(NoticeBar);
Vue.use(Popup);
Vue.use(Circle);
Vue.use(Slider);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Empty);

Vue.use(Lazyload);


Vue.prototype.$toast = Toast;


