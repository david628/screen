let quality = {};
quality.count = document.getElementById("id-count");//优质项目
quality.couts = [
  document.getElementById("id-ljfs"),//垃圾焚烧
  document.getElementById("id-swfqw"),//生物废弃物
  document.getElementById("id-zszy")//再生资源
];
quality.load = function(count, couts) {
  this.count.innerHTML = count;
  for(let i = 0; i < couts.length; i++) {
    this.couts[i].innerHTML = parseInt((couts[i]['number'] || 0), 10).toLocaleString();
  }
}
export default quality;