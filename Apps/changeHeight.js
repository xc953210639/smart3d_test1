
// 贴地调整
// 偏移矩阵modelMatrix可以由一个translation来确定，通过调整height来获得不同的modelMatrix，然后视角缩放到瓦片集的时候调用changeHeight函数。
function zoomToTileset() {
    changeHeight(0);
    // 直接调用就不能，很奇怪
}
function changeHeight(height) {
      height = Number(height);
      if (isNaN(height)) {
        return ;
      }
      var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
      var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
      var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
      var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      console.log(height);
    }

// 获取高度



function getPosition() {
        //得到当前三维场景
        var scene = viewer.scene;
        //得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var entity = viewer.entities.add({
            label : {
                show : false
            }
        });
        var longitudeString = null;
        var latitudeString = null;
        var height = null;
        var cartesian = null;
        // 定义当前场景的画布元素的事件处理
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化

        handler.setInputAction(function(movement) {
            //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian) {
                //将笛卡尔坐标转换为地理坐标
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                //将弧度转为度的十进制度表示
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                //获取相机高度
                height = Math.ceil(viewer.camera.positionCartographic.height);
                entity.position = cartesian;
                entity.label.show = true;
                entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')' ;
                console.log(entity.label.text);
            }else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
        handler.setInputAction(function(wheelment) {
            height = Math.ceil(viewer.camera.positionCartographic.height);
            entity.position = cartesian;
            entity.label.show = true;
            entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')' ;
            console.log(entity.label.text);
            // 这里显示的是点击的点距离镜头的高度

          }, Cesium.ScreenSpaceEventType.WHEEL);
      }

      

function getHeight(){
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(evt) {
        var ray=viewer.camera.getPickRay(evt.position);
        var cartesian=viewer.scene.globe.pick(ray,viewer.scene);
        var cartographic=Cesium.Cartographic.fromCartesian(cartesian);
        var lng=Cesium.Math.toDegrees(cartographic.longitude);//经度值
        var lat=Cesium.Math.toDegrees(cartographic.latitude);//纬度值
        //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。
        var height=viewer.scene.globe.getHeight(cartographic);
        var mapPosition={x:lng,y:lat,z:height.height};//height的值为地形高度。
        console.log(mapPosition,height);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
