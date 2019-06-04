import echarts from 'echarts';
const kanban = {
  echarts: {},
  showChart(type, title, legend_data, data) {
    let opt;
    if(type == 1 || type == 4 || type == 6) {
      opt = {
        title: {
          subtext: title,
          x: 'center',
          y: '80%'
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '3%',
          bottom: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          orient: 'horizontal',
          //top: '80%',
          itemWidth: 10,
          itemHeight: 10,
          x: 'center',
          y: 'top',
          textStyle: {
            //fontSize: 12,
            color: '#e4e5e5'
          },
          pageIconColor: '#e4e5e5',
          pageIconInactiveColor: '#2f4554',
          pageIconSize: 10,
          pageTextStyle: {
            color: '#e4e5e5'
          },
          data: legend_data || []
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#444853'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#aaa'
            }
          },
          data: legend_data || []
        },
        yAxis: {
          name: type == 1 ? "kW-h" : "t",
          nameTextStyle: {
            color: '#D6E0E2'
          },
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ['#1d212a']
            }
          },
          axisLabel: {
            textStyle: {
              color: '#aaa'
            }
          }
        },
        series: [{
          data: data,
          type: 'line',
          symbol: 'circle'/*,
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#ea950040'
                  }, {
                    offset: 0,
                    color: '#ea9500'
                  }
                ],
                globalCoord: false
              }
            }
          }*/
        }]
      }
    } else if(type == 2 || type == 3) {
      console.log(data);
      opt = {
        title: {
          subtext: title,
          x: 'center',
          y: '80%'
        },
        legend: {
          orient: 'horizontal',
          //top: '80%',
          itemWidth: 10,
          itemHeight: 10,
          x: 'center',
          y: 'top',
          textStyle: {
            //fontSize: 14,
            color: '#aaa'
          },
          //pageIconColor: '#e4e5e5',
          //pageIconInactiveColor: '#2f4554',
          //pageIconSize: 10,
          //pageTextStyle: {
            //color: '#e4e5e5'
          //},
          data: legend_data || []
        },
        color: ['#49d5d4','#4ab7f1','#3d97cc','#3076a4','#23557d','#b2565c','#3f79c8','#30a7e0','#bfae6a','#b9d6df'],
        series: {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['60%', '80%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false, 
              textStyle: {
                //fontSize: 14,
                color: '#e4e5e5'
              },    
              position: 'center',
              formatter: function(param) {
                if(param.name != "") {
                  return param.percent + "%" + "\n\n" + param.name;
                }
                return "";
              }
            },
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
            }
          },
          data: data || []
        }
      };
    } else if(type == 5) {
      opt = {
        title: {
          subtext: title,
          x: 'center',
          y: '80%'
        },
        grid: {
          top: '22%',
          left: '3%',
          right: '3%',
          bottom: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: "right",
          textStyle: {
            color: '#aaa'
          },
          data: ["发电量", "发热量"]
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#444853'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#aaa'
            }
          },
          data: legend_data || []
        },
        yAxis: {
          name: 'kw-h/GJ',
          nameTextStyle: {
            color: '#D6E0E2'
          },
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ['#1d212a']
            }
          },
          axisLabel: {
            textStyle: {
              color: '#aaa'
            }
          }
        },
        series: [{
          name: "发电量",
          data: data[0],
          type: 'line',
          symbol: 'circle'/*,
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#ea950040'
                  }, {
                    offset: 0,
                    color: '#ea9500'
                  }
                ],
                globalCoord: false
              }
            }
          }*/
        }, {
          name: "发热量",
          data: data[1],
          type: 'line',
          symbol: 'circle'/*,
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#ea950040'
                  }, {
                    offset: 0,
                    color: '#ea9500'
                  }
                ],
                globalCoord: false
              }
            }
          }*/
        }]
      }
    }
    if(!this.echarts[type]) {
      this.echarts[type] = echarts.init(document.getElementById("id-kb-chart" + type));
    }
    this.echarts[type].setOption(opt);
  }
  /*scale: {
    1: "scale",//总处理规模
    2: "scale",//总处理规模
    3: "scale",//总处理规模
    4: "scale",//总处理规模
    5: "powerNumber",//发热量heatNumber
    6: "scale"//总处理规模
  },
  powerNumber: {
    1: "powerNumber",//发电量
    2: "carNumber",//车辆数
    3: "oilNumber",//产油量
    4: "",//减量化
    5: "heatNumber",//发热量heatNumber
    6: "oilNumber"//产油量
  }*/
};
kanban.load = function(ds) {
  if(ds) {
    for(let i = 0; i < ds.length; i++) {
      document.getElementById("id-kb-typeName" + ds[i]["type"]).innerHTML = (ds[i]["typeName"] || 0).toLocaleString();
      document.getElementById("id-kb-count" + ds[i]["type"]).innerHTML = (ds[i]["count"] || 0).toLocaleString() + " 个";
      document.getElementById("id-kb-amount" + ds[i]["type"]).innerHTML = (ds[i]["amount"] || 0).toLocaleString() + " 元";
      let _d = [], time, legend_data = [], data = [];
      if(ds[i]["type"] == 1) {
        document.getElementById("id-kb-scale" + ds[i]["type"]).innerHTML = (ds[i]["scale"] || 0).toLocaleString() + " 吨";//总处理规模
        document.getElementById("id-kb-powerNumber" + ds[i]["type"]).innerHTML = (ds[i]["total"] || 0).toLocaleString() + " kw-h";//发电量
        _d = ds[i]["monthList"] || [];
        for(let i = 0; i < _d.length; i++) {
          time = _d[i]["dataTime"].split("-");
          legend_data.push(parseInt(time[1], 10) + "月");
          data.push(_d[i]["powerNumber"]);
          time = time[0]
        }
        this.showChart(ds[i]["type"], time + "累计发电量趋势图", legend_data, data);
      } else if(ds[i]["type"] == 2) {
        document.getElementById("id-kb-scale" + ds[i]["type"]).innerHTML = (ds[i]["scale"] || 0).toLocaleString() + " 吨";//总处理规模
        document.getElementById("id-kb-powerNumber" + ds[i]["type"]).innerHTML = (ds[i]["total"] || 0).toLocaleString() + " 辆";//车辆数
        _d = ds[i]["areaList"] || [];
        for(let i = 0; i < _d.length; i++) {
          legend_data.push(_d[i]["provinceName"]);
          data.push({
            name: _d[i]["provinceName"],
            value: _d[i]["carNumber"]
          });
        }
        this.showChart(ds[i]["type"], "全国收运车辆占比", legend_data, data);
      } else if(ds[i]["type"] == 3) {
        document.getElementById("id-kb-scale" + ds[i]["type"]).innerHTML = (ds[i]["scale"] || 0).toLocaleString() + " 吨";//总处理规模
        document.getElementById("id-kb-powerNumber" + ds[i]["type"]).innerHTML = (ds[i]["total"] || 0).toLocaleString() + " 吨";//产油量
        _d = ds[i]["areaList"] || [];
        for(let i = 0; i < _d.length; i++) {
          legend_data.push(_d[i]["provinceName"]);
          data.push({
            name: _d[i]["provinceName"],
            value: _d[i]["handleNumber"]
          });
        }
        this.showChart(ds[i]["type"], "全国生物废弃物处理量占比", legend_data, data);
      } else if(ds[i]["type"] == 4) {
        document.getElementById("id-kb-scale" + ds[i]["type"]).innerHTML = (ds[i]["scale"] || 0).toLocaleString() + " 吨";//总处理规模
        document.getElementById("id-kb-powerNumber" + ds[i]["type"]).innerHTML = (ds[i]["total"] || 0).toLocaleString() + " 吨";//减量化
        _d = ds[i]["monthList"] || [];
        for(let i = 0; i < _d.length; i++) {
          time = _d[i]["dataTime"].split("-");
          legend_data.push(parseInt(time[1], 10) + "月");
          data.push(_d[i]["handleNumber"]);
          time = time[0]
        }
        this.showChart(ds[i]["type"], time + "累计处置量趋势图", legend_data, data);
      } else if(ds[i]["type"] == 5) {
        document.getElementById("id-kb-scale" + ds[i]["type"]).innerHTML = (ds[i]["powerNumber"] || 0).toLocaleString() + " kw-h";//发电量
        document.getElementById("id-kb-powerNumber" + ds[i]["type"]).innerHTML = (ds[i]["total"] || 0).toLocaleString() + " GJ";//发热量
        _d = ds[i]["monthList"] || [];
        let data1 = [];
        for(let i = 0; i < _d.length; i++) {
          time = _d[i]["dataTime"].split("-");
          legend_data.push(parseInt(time[1], 10) + "月");
          data.push(_d[i]["powerNumber"]);
          data1.push(_d[i]["heatNumber"]);
          time = time[0]
        }
        this.showChart(ds[i]["type"], time + "累计发/供热量趋势图", legend_data, [data, data1]);
      } else if(ds[i]["type"] == 6) {
        document.getElementById("id-kb-scale" + ds[i]["type"]).innerHTML = (ds[i]["scale"] || 0).toLocaleString() + " 吨";//总处理规模
        document.getElementById("id-kb-powerNumber" + ds[i]["type"]).innerHTML = (ds[i]["total"] || 0).toLocaleString() + " 吨";//产油量
        _d = ds[i]["monthList"] || [];
        for(let i = 0; i < _d.length; i++) {
          time = _d[i]["dataTime"].split("-");
          legend_data.push(parseInt(time[1], 10) + "月");
          data.push(_d[i]["oilNumber"]);
          time = time[0]
        }
        this.showChart(ds[i]["type"], time + "累计产油量趋势图", legend_data, data);
      }
    }
  } else {
    for(let i = 1; i <= 6; i++) {
      document.getElementById("id-kb-typeName" + i).innerHTML = "";
      document.getElementById("id-kb-count" + i).innerHTML = "";
      document.getElementById("id-kb-amount" + i).innerHTML = "";
      document.getElementById("id-kb-scale" + i).innerHTML = "";
      document.getElementById("id-kb-powerNumber" + i).innerHTML = "";
      this.showChart(i, "");
    }
  }
}
export default kanban;