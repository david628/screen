import './assets/css/index.scss';
import quality from './quality';//优质项目
import cityCover from './cityCover';//城市覆盖
import dispose from './dispose';//处理规模
import kanban from './kanban';//环保各板块看板
import Earth from './earth';
import HOT_DATA from './data';
import { GET, POST, isOK } from './common';
function init() {
  //环境领域发展趋势
  GET('mizudacockpit/indusrty/getDevelopmentData', function(data) {
    if(isOK(data.rc)) {
      cityCover.load(data.ret && data.ret.cityList ? data.ret.cityList : [], data.ret && data.ret.cityOver ? data.ret.cityOver : []);
      quality.load(data.ret && data.ret.count ? data.ret.count : 0, data.ret && data.ret.typeList ? data.ret.typeList : []);
      dispose.load(data.ret && data.ret.scaleList ? data.ret.scaleList : []);
    } else {
      cityCover.load();
      quality.load();
      dispose.load();
    }
  });
  //环保各板块看板
  GET('mizudacockpit/indusrty/getKanBanData', function(data) {
    if(isOK(data.rc)) {
      kanban.load(data.ret && data.ret.list ? data.ret.list : []);
    } else {
      kanban.load();
    }
  });
  let earth = new Earth({
    el: "webgl-content"
  });
  earth.animate = () => {
    earth.render();
  }
  earth.rotateCallback = (city) => {

  }
  earth.load();
  earth.loadHotspot(HOT_DATA);
}
init();