var page = {
  init: function() {
  	if(!this.earth) {
  		this.earth = new Earth({
  	    el: "webgl-content"
  	  });
  		this.earth.animate = () => {
  			this.earth.render();
  	  }
  		this.earth.rotateCallback = (city) => {
  			/*if(!this.titleDom) {
  				this.titleDom = $("#id-title");
  			}
  			if(audio) {
  				audio.playFromTo("open", 0, 1);
  				this.titleDom.text(city.name);
  				this.refres(JSON[city.name]["attackType"], JSON[city.name]["sourceIp"]);
  			}*/
  		}
console.log(LINE_DATA);
  		this.earth.load();
  		this.earth.loadFlightLine(LINE_DATA);
console.log(HOT_DATA);  		
  		this.earth.loadHotspot(HOT_DATA);
  		/*this.earth.loadFlightLine([{
				start: {
					lat: 30.28,
					lon: 120.15,
		      name: "杭州",
		      value: 0,
		      type: 0
				},
				end: {
		      lat: 59.453751,
		      lon: 108.830719,
		      name: "俄罗斯",
		      value: 0,
		      type: 0
				},
				type: 3,
				lineType: 0
			}, {
				start: {
					lat: 30.28,
					lon: 120.15,
		      name: "杭州",
		      value: 0,
		      type: 0
				},
				end: {
		      lat: 46.710670,
		      lon: 1.718190,
		      name: "法国",
		      value: 0,
		      type: 0
				},
				type: 3,
				lineType: 0
			}], 2);*/
  		
  	}
  }		
}
page.init();