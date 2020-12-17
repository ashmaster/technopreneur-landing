function openNav(name) {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("text").style.display = "none";
    document.getElementById("name").textContent = name;
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "20px";
    document.getElementById("text").style.display = "inline";
    document.getElementById("name").textContent = "";
  }