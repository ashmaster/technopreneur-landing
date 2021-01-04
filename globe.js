(function() {
    const container = document.getElementById("globe");
    const canvas = container.getElementsByTagName("canvas")[0];
    
    const globeRadius = 60;
    const globeWidth = 4098 / 2;
    const globeHeight = 1968 / 2;
  
    function convertFlatCoordsToSphereCoords(x, y) {
      let latitude = ((x - globeWidth) / globeWidth) * -180;
      let longitude = ((y - globeHeight) / globeHeight) * -90;
      latitude = (latitude * Math.PI) / 180;
      longitude = (longitude * Math.PI) / 180;
      const radius = Math.cos(longitude) * globeRadius;
  
      return {
        x: Math.cos(latitude) * radius,
        y: Math.sin(longitude) * globeRadius,
        z: Math.sin(latitude) * radius
      };
    }
  
    function makeMagic(points) {
      const { width, height } = container.getBoundingClientRect();
  
      // 1. Setup scene
      const scene = new THREE.Scene();
      // 2. Setup camera
      const camera = new THREE.PerspectiveCamera(45, width / height);
      // 3. Setup renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
      });
      renderer.setSize(width, height);
      // 4. Add points to canvas
      // - Single geometry to contain all points.
      const mergedGeometry = new THREE.Geometry();
      // - Material that the dots will be made of.
      const pointGeometry = new THREE.SphereGeometry(0.5, 1, 1);
      const pointMaterial = new THREE.MeshBasicMaterial({
        color: "#fff"
      });
  
      for (let point of points) {
        const { x, y, z } = convertFlatCoordsToSphereCoords(
          point.x,
          point.y,
          width,
          height
        );
  
        if (x && y && z) {
          pointGeometry.translate(x, y, z);
          mergedGeometry.merge(pointGeometry);
          pointGeometry.translate(-x, -y, -z);
        }
      }
  
      const globeShape = new THREE.Mesh(mergedGeometry, pointMaterial);
      scene.add(globeShape);
  
      container.classList.add("peekaboo");
  
      // Setup orbital controls
      camera.orbitControls = new THREE.OrbitControls(camera, canvas);
      camera.orbitControls.enableKeys = false;
      camera.orbitControls.enablePan = false;
      camera.orbitControls.enableZoom = false;
      camera.orbitControls.enableDamping = false;
      camera.orbitControls.enableRotate = true;
      camera.orbitControls.autoRotate = true;
      camera.position.z = -265;
  
      function animate() {
        // orbitControls.autoRotate is enabled so orbitControls.update
        // must be called inside animation loop.
        camera.orbitControls.update();
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
    }
  
    function hasWebGL() {
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl && gl instanceof WebGLRenderingContext) {
        return true;
      } else {
        return false;
      }
    }
  
    function init() {
      if (hasWebGL()) {
        window
          .fetch("https://gist.githubusercontent.com/ashmaster/a8b73d626d6953f951c06cdc10f5ea05/raw/a525eca7f7d911a774abb4b58a2fc4057eb850c5/points.json")
          .then(response => response.json())
          .then(data => {
            makeMagic(data.points);
          });
      }
    }
    init();
  })();