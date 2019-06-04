import echarts from 'echarts';
import 'echarts-wordcloud';
//城市覆盖
let cityCover = {};
cityCover.cityOverNum = document.getElementById("id-cityOverNum");
cityCover.echart = echarts.init(document.getElementById("id-cityCover"));
cityCover.load = function(ds, cityOverNum) {
  let data = [];
  for(let i = 0; i < ds.length; i++) {
    data.push({
      name: ds[i]['cityName'],
      value: i
    });
  }
  this.echart.setOption({
    tooltip: {
      formatter: function(params, ticket, callback) {
        return params.data['name'] + ':' + params.data['value'];
      }
    },
    series: [{
      type: 'wordCloud',
      sizeRange: [12, 24],
      rotationRange: [0, 0],
      shape: 'square',
      textStyle: {
        normal: {
          color: function() {
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')';
          }
        }
      },
      /*type: 'wordCloud',
      //sizeRange: [10, 100],
      rotationRange: [-90, 90],
      rotationStep: 45,
      gridSize: 2,
      shape: 'pentagon',
      //maskImage: maskImage,
      textStyle: {
        normal: {
          color: function () {
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')';
          }
        }
      },*/
      data: data.sort(function (a, b) {
        return b.value  - a.value;
      })
    }]
  });
  cityCover.cityOverNum.innerHTML = cityOverNum || "";
}
export default cityCover;