import echarts from 'echarts';

let dispose = {};
let scaleList0 = {};
scaleList0.echart = echarts.init(document.getElementById("id-scaleList0"));
scaleList0.load = function(ds) {
  this.echart.setOption({
    /*legend: {
      orient: 'horizontal',
      top: '80%',
      itemWidth: 10,
      itemHeight: 10,
      x: 'center',
      y: 'top',
      textStyle: {
        fontSize: 14,
        color: '#e4e5e5'
      },
      pageIconColor: '#e4e5e5',
      pageIconInactiveColor: '#2f4554',
      pageIconSize: 10,
      pageTextStyle: {
        color: '#e4e5e5'
      }
    },*/
    color: ['#49d5d4','#4ab7f1','#3d97cc','#3076a4','#23557d','#b2565c','#3f79c8','#30a7e0','#bfae6a','#b9d6df'],
    series: {
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['60%', '80%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: true, 
          textStyle: {
            fontSize: 14
          },    
          position: 'center',
          formatter: function(param) {
            if(param.name != "") {
              return param.percent + "%" + "\n\n" + param.name;
            }
            return "";
          }
        }/*,
        emphasis: {
          show: true,
          rich: {
            labelValue: {
              lineHeight: '30',
              fontSize: '18',
              fontWeight: 'bold'
            },
            labelName: {
              fontSize: '14',
              color: '#e4e5e5'
            }
          },
          formatter: function(param){
            return '{labelValue|' + param.value + '}' + '\n' + '{labelName|' + param.name + '}';
          }
        }*/
      },
      data: ds || []
    }
  });
}

let scaleList1 = {};
scaleList1.echart = echarts.init(document.getElementById("id-scaleList1"));
scaleList1.load = function(ds) {
  this.echart.setOption({
    /*legend: {
      orient: 'horizontal',
      top: '80%',
      itemWidth: 10,
      itemHeight: 10,
      x: 'center',
      y: 'top',
      textStyle: {
        fontSize: 14,
        color: '#e4e5e5'
      },
      pageIconColor: '#e4e5e5',
      pageIconInactiveColor: '#2f4554',
      pageIconSize: 10,
      pageTextStyle: {
        color: '#e4e5e5'
      }
    },*/
    color: ['#49d5d4','#4ab7f1','#3d97cc','#3076a4','#23557d','#b2565c','#3f79c8','#30a7e0','#bfae6a','#b9d6df'],
    series: {
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['60%', '80%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: true, 
          textStyle: {
            fontSize: 14
          },    
          position: 'center',
          formatter: function(param) {
            if(param.name != "") {
              return param.percent + "%" + "\n\n" + param.name;
            }
            return "";
          }
        }/*,
        emphasis: {
          show: true,
          rich: {
            labelValue: {
              lineHeight: '30',
              fontSize: '18',
              fontWeight: 'bold'
            },
            labelName: {
              fontSize: '14',
              color: '#e4e5e5'
            }
          },
          formatter: function(param){
            return '{labelValue|' + param.value + '}' + '\n' + '{labelName|' + param.name + '}';
          }
        }*/
      },
      data: ds || []
    }
  });
}
dispose.pies = [
  scaleList0,
  scaleList1
];
dispose.load = function(data) {
  let scaleList = data || [];
  for(let i = 0; i < scaleList.length; i++) {
    let num = parseFloat(scaleList[i]['precent'].replace(/%/g, ''), 10);
    this.pies[i].load([{
      name: scaleList[i]['typeName'],
      value: num * 100
    }, {
      name: '',
      value: (100 - num) * 100
    }]);
  }
}
export default dispose;