import THREE from './lib/Three';
import img_map from './assets/images/map.png';
import img_universe from './assets/images/universe.jpg';
import img_radial_layers_medium from './assets/images/radial_layers_medium.jpg';
import img_map_inverted from './assets/images/map_inverted.png';
let EventObject = {};
EventObject.KeyboardState = function() {
  this.keyCodes = {};
  this.modifiers = {};
  this._onKeyDown = (event) => {
    this._onKeyChange(event, true);
  }
  this._onKeyUp = (event) => {
    this._onKeyChange(event, false);
  }
  document.addEventListener("keydown", this._onKeyDown, false);
  document.addEventListener("keyup", this._onKeyUp, false);
}
EventObject.KeyboardState.prototype.destroy = function() {
  document.removeEventListener("keydown", this._onKeyDown, false);
  document.removeEventListener("keyup", this._onKeyUp, false);
}
EventObject.KeyboardState.MODIFIERS = ['shift', 'ctrl', 'alt', 'meta'];
EventObject.KeyboardState.ALIAS = {
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'space': 32,
  'pageup': 33,
  'pagedown': 34,
  'tab': 9
};
EventObject.KeyboardState.prototype._onKeyChange = function(event, pressed) {
  let keyCode = event.keyCode;
  this.keyCodes[keyCode] = pressed;
  this.modifiers['shift'] = event.shiftKey;
  this.modifiers['ctrl'] = event.ctrlKey;
  this.modifiers['alt'] = event.altKey;
  this.modifiers['meta'] = event.metaKey;
}
EventObject.KeyboardState.prototype.pressed = function(keyDesc) {
  let keys = keyDesc.split("+");
  for(let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let pressed;
    if(EventObject.KeyboardState.MODIFIERS.indexOf(key) !== -1) {
      pressed = this.modifiers[key];
    } else if(Object.keys(EventObject.KeyboardState.ALIAS).indexOf(key) != -1) {
      pressed = this.keyCodes[EventObject.KeyboardState.ALIAS[key]];
    } else {
      pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)]
    }
    if(!pressed) {
      return false;
    }
  };
  return true;
}
EventObject.WindowResize = function(renderer, camera) {
  let callback  = function() {
    let w = renderer.domElement.parentNode.offsetWidth || window.innerWidth;
    let h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', callback, false);
  return {
    stop: function() {
      window.removeEventListener('resize', callback);
    }
  };
}
class Earth {
  constructor(opt) {
    this.bgColor = "0x00FFA7";
    this.sphereColor = "0x0B654B";
    this.ringColor = "0x00FFA7";
    this.earthColor = "0x0B553E";
    this.linghtColor = "0xffffff";
    this.spin = 0.1;
    this.hotspots = [];
    this.city = [];
    this.markers = [];
    this.currentCity = 0;
    this.isAnimate = false;
    this.HotspotColor = {
      "0": new THREE.Color(0x00FFA7),   
      "1": new THREE.Color(0xF16740),   
      "2": new THREE.Color(0xFEC97A),   
      "3": new THREE.Color(0xCEFA00),   
      "4": new THREE.Color(0xDEFA00),
      "5": new THREE.Color(0xB9FA00)
    };
    this.radius = 100;
    this.segments = 60;
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateVX = 0;
    this.rotateVY = 0;
    this.rotateXMax = 90 * Math.PI / 180;
    this.rotateTargetX = 0;
    this.rotateTargetY = 0;
    this.dragging = false;
    this.shader = {
      glow: {
        vertexShader: `
          uniform vec3 viewVector;
          uniform float c;
          uniform float p;
          varying float intensity;
          void main() {
            vec3 vNormal = -normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(c - dot(vNormal, vNormel), p);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, 0.6);
          }`
      },
      earth: {
        vertexShader: `
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 3.0;
            gl_Position = projectionMatrix * mvPosition;
          }`,
        fragmentShader: `
          uniform vec3 color;
          uniform vec3 glowColor;
          uniform sampler2D texture;
          void main() {
            gl_FragColor = vec4(color, 0.8);
          }`
      }
    };
    Object.assign(this, opt);
    this.init();
  }
  init() {
    this.wrap = this.el.get ? this.el.get(0) : (typeof this.el == "string" ? document.getElementById(this.el) : this.el);
    this.el = document.createElement("div");
    this.el.style = "user-select: none;";
    this.wrap.appendChild(this.el);
    this.containt = document.createElement("div");
    this.containt.style = "user-select: none;";
    this.wrap.appendChild(this.containt);
    if(!this._baseGeometry) {
      this._baseGeometry = new THREE.Geometry();
    }
    if(!this.point) {
      this.point = new THREE.Mesh(new THREE.CubeGeometry(0.5, 0.5, 2, 1, 1, 1));
    }
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true
    });
    let w = this.el.offsetWidth || window.innerWidth,
    h = this.el.offsetHeight || window.innerHeight;
    this.renderer.setSize(w, h);
    this.renderer.autoClear = false;
    this.renderer.sortObjects = false;    
    this.renderer.generateMipmaps = false;          
    this.el.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.matrixAutoUpdate = false;
    this.camera = new THREE.PerspectiveCamera(12, w / h, 1, 20000);
    this.camera.position.z = 2800;
    this.camera.position.y = 0;
    this.camera.position.x = 35;
    this.scene.add(this.camera);
    this.rotating = new THREE.Object3D();
    this.scene.add(this.rotating);
    this.visualizationMesh = new THREE.Object3D();
    this.rotating.add(this.visualizationMesh);
    this.scene.add(
      new THREE.Mesh(
        new THREE.CubeGeometry(580, 580, 1),
        new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture(img_radial_layers_medium),
          color: this.ringColor,
          opacity: 0.4,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending
        })
      )
    );
    this.addSkyBox();
    this.addGlow();
    this.addSphere();
    this.addMap();
    this.addLinght();
    EventObject.WindowResize(this.renderer, this.camera);
    this.initTrackballControls();
  }
  addSphere() {
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, this.segments, this.segments),
      new THREE.MeshLambertMaterial({
        map: new THREE.ImageUtils.loadTexture(img_map),
        color: this.sphereColor,
        transparent: true,
        opacity: 1.0,
        depthWrite: true,
        depthTest: true,
      })
    );
    this.rotating.add(this.sphere);
  }
  addSkyBox() {
    let cube = new THREE.Mesh(
      new THREE.CubeGeometry(1920, 974, 1),
      new THREE.MeshBasicMaterial({
        color: this.bgColor,
        map: THREE.ImageUtils.loadTexture(img_universe),
        side: THREE.BackSide,
        opacity: 1.0,
        transparent: true,
        blending: THREE.AdditiveBlending
      })
    )
    cube.position.z = -1800;
    this.scene.add(cube);
  }
  addGlow() {
    let moonGlow = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius + 20, this.segments, this.segments),
      new THREE.ShaderMaterial({
        uniforms: {
          'c': {
            type: 'f',
            value: 0.4
          },
          'p': {
            type: 'f',
            value: 9.0
          },
          glowColor: {
            type: 'c',
            value: new THREE.Color(this.ringColor)
          },
          viewVector: {
            type: 'v3',
            value: new THREE.Vector3(0, 0, 100)
          }
        },
        vertexShader: this.shader.glow.vertexShader,
        fragmentShader: this.shader.glow.fragmentShader,
        opacity: 1.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      })
    );
    moonGlow.position.z = -this.radius;
    moonGlow.scale.multiplyScalar(1.01);
    this.scene.add(moonGlow);
  }
  addMap() {
    let img0 = new Image();
    img0.src = img_map_inverted;
    img0.onload = () => {
      let uvtrans = (img) => {
        let globeCloudVerticesArray = [], globeCloud, offset = 20;
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let geo = new THREE.Geometry();
        for (let i = 0; i < imageData.data.length; i += offset) {
          let curX = i / 4 % canvas.width;
          let curY = (i / 4 - curX) / canvas.width;
          if (i / offset % 2 === 1 && curY % (offset / 5) === 1) {
            let color = imageData.data[i];
            if (color === 0) {
              let x = curX;
              let y = curY;
              let lat = (y / (canvas.height / 180) - 90) / -1;
              let lon = x / (canvas.width / 360) - 180;
              geo.vertices.push(this.getVector3(lat, lon, this.radius));
            }
          }
        }
        let uniforms = {
          color: {
            type: "c",
            value: new THREE.Color(this.earthColor)
          },
          glowColor: {
            type: "c",
            value: new THREE.Color(0xffffff)
          }
        };
        let mat = new THREE.ShaderMaterial({
          uniforms: uniforms,     
          vertexShader: this.shader.earth.vertexShader,
          fragmentShader: this.shader.earth.fragmentShader,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          transparent: true
        });
        globeCloud = new THREE.ParticleSystem(geo, mat);
        globeCloud.sortParticles = true;
        return globeCloud;
      }
      this.rotating.add(uvtrans(img0));
    }
  }
  addLinght() {
    let hemiLight = new THREE.PointLight(this.linghtColor, 2.2);
    hemiLight.position.x = -50; 
    hemiLight.position.y = 0;
    hemiLight.position.z = 350;
    this.scene.add(hemiLight);
    let hemiLight1 = new THREE.PointLight(this.linghtColor, 2.2);
    hemiLight1.position.x = 50; 
    hemiLight1.position.y = 0;
    hemiLight1.position.z = 350;
    this.scene.add(hemiLight1);
    let hemiLight2 = new THREE.PointLight(this.linghtColor, 2.5);
    hemiLight2.position.x = 0; 
    hemiLight2.position.y = 0;
    hemiLight2.position.z = 350;
    this.scene.add(hemiLight2);
  }
  wrapFn(value, min, rangeSize) {
    rangeSize -= min;
    while (value < min) {
      value += rangeSize;
    }
    return value % rangeSize;
  }
  screenXY(vec3) {
    if(!this.projector) {
      this.projector = new THREE.Projector();
    }
    let clo = vec3.clone();
    let vector = this.projector.projectVector(clo, this.camera);
    let windowWidth = window.innerWidth;
    let minWidth = 1280;
    if(windowWidth < minWidth) {
      windowWidth = minWidth;
    }
    clo = null;
    return {
      x: (Math.round(vector.x * (windowWidth / 2)) + windowWidth / 2) - 40,
      y: (Math.round((0 - vector.y) * (window.innerHeight / 2)) + window.innerHeight / 2) - 15
    };
  }
  addMarker(center) {
    let marker = document.createElement("div");
    marker.className ="earth-marker";
    marker.innerHTML = '<div class="earth-detailText"></div>';
    this.containt.appendChild(marker);
    marker.center = center;
    this._spin = this.spin;
    let self = this;
    marker.onmouseover = function() {
      self.spin = 0;
    }
    marker.onmouseout = function() {
      self.spin = self._spin;
    }
    marker.setPosition = function(x, y, z) {
      this.style.left = x + 'px';
      this.style.top = y + 'px';  
      this.style.zIndex = z;
    }
    marker.setVisible = function(vis) {
      if(!vis) {
        this.style.display = 'none';
      } else {
        this.style.display = 'inline';
      }
    }
    let detailLayer = marker.querySelector('.earth-detailText');
    detailLayer.innerHTML = center["name"];
    marker.detailLayer = detailLayer;
    marker.setSize = function(s) {
      let detailSize = Math.floor(2 + s * 0.5); 
      let totalHeight = detailSize * 2;
    }
    marker.update = function() {
      let matrix = self.rotating.matrixWorld;
      let clo = this.center.clone();
      let abspos = matrix.multiplyVector3(clo);
      let {x, y} = self.screenXY(abspos);
      let s = 0.3 + self.camera.scale.z * 1;
      let importanceScale = this.importance / 5000000;
      importanceScale = self.constrain(importanceScale, 0, 18);
      s += importanceScale;
      if(this.tiny) {
        s *= 0.75;
      }
      if(this.selected) {
        s = 30;
      }
      if(this.hover) {
        s = 15;
      }
      this.setSize(s); 
      this.setVisible(abspos.z > 0.60);
      let zIndex = Math.floor(1000 - abspos.z + s);
      if(this.selected || this.hover) {
        zIndex = 10000;
      }
      this.setPosition(x, y, zIndex);
      clo = null;
    }
    this.markers.push(marker);
  }
  rotateToLatLng(latLon, offsetY) {
    if(!latLon) {
      return;
    }
    this.rotateTargetX = latLon["lat"] * Math.PI / 180;
    let targetY0 = -(latLon["lon"] - 9 - 270) * Math.PI / 180, piCounter = 0;
    while(true) {
      let targetY0Neg = targetY0 - Math.PI * 2 * piCounter;
      let targetY0Pos = targetY0 + Math.PI * 2 * piCounter;
      if(Math.abs(targetY0Neg - this.rotating.rotation.y) < Math.PI) {
        this.rotateTargetY = targetY0Neg;
        break;
      } else if(Math.abs(targetY0Pos - this.rotating.rotation.y) < Math.PI) {
        this.rotateTargetY = targetY0Pos;
        break;
      }
      piCounter++;
      this.rotateTargetY = this.wrapFn(targetY0, -Math.PI, Math.PI);
    }
    this.rotateVX *= 0.6;
    this.rotateVY *= 0.6;
  }
  rotateCallback(currentCity, preCity) {}
  autoRotateToCities() {
    if(!this.isRotate) {
      if(this.city[0]) {
        this.ou = setTimeout(() => {
          this.rotateToLatLng(this.city[0]);
          this.rotateCallback(this.city[0]);
          clearTimeout(this.ou);
        }, 3500);
        this.isRotate = true;
      }
    } else {
      this.preCity = this.currentCity;
      if(this.currentCity >= this.city.length) {
        this.currentCity = 0;
      } else {
        this.currentCity += 0.003;
      }
      if(Math.floor(this.currentCity) != Math.floor(this.preCity)) {
        this.rotateToLatLng(this.city[Math.floor(this.currentCity)]);
        this.rotateCallback(this.city[Math.floor(this.currentCity)]);
      }
    }
  }
  interpolation(from, to, fraction) {
    return (to - from) * fraction + from;
  }
  render() {
    if(this.rotateTargetX !== undefined && this.rotateTargetY !== undefined) {
      this.rotateVX += (this.rotateTargetX - this.rotateX) * 0.012;
      this.rotateVY += (this.rotateTargetY - this.rotateY) * 0.012;
      if(Math.abs(this.rotateTargetX - this.rotateX) < 0.1 && Math.abs(this.rotateTargetY - this.rotateY) < 0.1) {
        this.rotateTargetX = undefined;
        this.rotateTargetY = undefined;
      }
    }
    this.rotateX += this.rotateVX;
    this.rotateY += this.rotateVY;
    this.rotateVX *= 0.98;
    this.rotateVY *= 0.98;
    if(this.dragging || this.rotateTargetX !== undefined) {
      this.rotateVX *= 0.6;
      this.rotateVY *= 0.6;
    }
    this.rotateY += this.spin * 0.01;
    if(this.rotateX < -this.rotateXMax){
      this.rotateX = -this.rotateXMax;
      this.rotateVX *= -0.95;
    }
    if(this.rotateX > this.rotateXMax){
      this.rotateX = this.rotateXMax;
      this.rotateVX *= -0.95;
    }
    this.rotating.rotation.x = this.rotateX;
    this.rotating.rotation.y = this.rotateY;
    this.renderer.clear();               
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
    this.camera.position.z = this.interpolation(this.camera.position.z, 1200, .05);
    this.autoRotateToCities();
    if(this.markers && this.markers.length) {
      for(let i in this.markers) {
        this.markers[i].update();
      }
    }
  }
  load(arr) {
    this.marker = [];
    for(let i = 0; i < arr.length; i++) {   
      let {x, y, z} = this.getXYZ(arr[i]["lat"], arr[i]["lon"], this.radius);
      this.point.position.x = x;
      this.point.position.y = y;
      this.point.position.z = z;
      this.point.lookAt(this.rotating.position);
      this.point.scale.z = -arr[i]["value"];
      this.point.updateMatrix();
      for (let i = 0; i < this.point.geometry.faces.length; i++) {
        this.point.geometry.faces[i].color = this.HotspotColor[arr[i]["type"]];
      }
      THREE.GeometryUtils.merge(this._baseGeometry, this.point);
      let vec = this.getVector3(arr[i]["lat"], arr[i]["lon"], this.radius);
      vec["name"] = arr[i]["name"];
      this.addMarker(vec);
    }
    this.rotating.add(new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: THREE.FaceColors,
      morphTargets: false
    })));
  }
  initTrackballControls() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.pmouseX = 0;
    this.pmouseY = 0;
    this.pressX = 0;
    this.pressY = 0;
    this.keyboard = new EventObject.KeyboardState();
    this.onDocumentResize = function(event) {}
    this.onDocumentMouseDown = function(event) {  
      this.dragging = true;        
      this.pressX = this.mouseX;
      this.pressY = this.mouseY;    
      this.rotateTargetX = undefined;
      this.rotateTargetX = undefined;
    }
    this.onDocumentMouseMove = function(event) {
      this.pmouseX = this.mouseX;
      this.pmouseY = this.mouseY;
      this.mouseX = event.clientX - window.innerWidth * 0.5;
      this.mouseY = event.clientY - window.innerHeight * 0.5;
      if(this.dragging) {
        if(this.keyboard.pressed("shift") == false) {
          this.rotateVY += (this.mouseX - this.pmouseX) / 2 * Math.PI / 180 * 0.3;
          this.rotateVX += (this.mouseY - this.pmouseY) / 2 * Math.PI / 180 * 0.3;  
        } else {
          this.camera.position.x -= (this.mouseX - this.pmouseX) * .5; 
          this.camera.position.y += (this.mouseY - this.pmouseY) * .5;
        }
      }
    }
    this.onDocumentMouseUp = function(event) {
      this.dragging = false;
    }
    this.onMouseWheel = function(event) {
      let delta = 0;
      if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
      } else if(event.detail) {
        delta = -event.detail / 3;
      }
      if (delta) {
        this.camera.scale.z += delta * 0.1;
        this.camera.scale.z = this.constrain(this.camera.scale.z, 0.7, 5.0);
      }
      event.returnValue = false;      
    }
    this.renderer.domElement.addEventListener('windowResize', (event) => {
      this.onDocumentResize(event);
    }, false);
    this.renderer.domElement.addEventListener('mousedown', (event) => {
      this.onDocumentMouseDown(event);
    }, true);
    this.renderer.domElement.addEventListener('mousemove', (event) => {
      this.onDocumentMouseMove(event);
    }, true);
    this.renderer.domElement.addEventListener('mouseup', (event) => {
      this.onDocumentMouseUp(event);
    }, false);
    this.renderer.domElement.addEventListener('mousewheel', (event) => {
      this.onMouseWheel(event);
    }, false);
    this.renderer.domElement.addEventListener('DOMMouseScroll', (event) => {
      this.onMouseWheel(window.event || event);
    }, false);
  }
  getXYZ(lat, lon, radius) {
    radius = radius || this.radius;
    let phi = (90 - lat) * Math.PI / 180;
    let theta = (lon - 180) * Math.PI / 180;
    return {
      x: -radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }
  getVector3(lat, lon, radius) {
    let {x, y, z} = this.getXYZ(lat, lon, radius);
    let center = new THREE.Vector3();
    center.x = x;
    center.y = y;
    center.z = z;
    return center;
  }
  constrain(v, min, max) {
    if(v < min) {
      v = min;
    } else if(v > max) {
      v = max;
    }
    return v;
  }
}
let earth = new Earth({
  el: "webgl-content",
  animate: () => {
    earth.render();
  }
});
if(!earth.isAnimate) {
  earth.animate();
  earth.isAnimate = true;
}
export default earth;