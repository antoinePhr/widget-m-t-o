// target elements with the "draggable" class
interact('.widget')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: false,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,
    }
  })

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}
// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener




const geoSuccess = (position) =>{
  const lat = position.coords.latitude
  const long = position.coords.longitude
  console.log(lat, long)
  loadMeteoInfo(lat, long).then((response) =>{
    console.log(response)
    const tempTab =  getTemperature(response);
    const weatherID =  getWeatherID(response);
    const weatherName = getWeatherName(response)
    const city = getCity(response)

    buildMeteoWidget(weatherID, tempTab, city, weatherName)
  })
}

const geoError = (error) =>{
  alert('Vous, avez refusé la localisation du navigateur, le widget météo ne pourra donc pas fonctionner \n Si vous changer d\'avis vous pouvez la réactiver et rafraichir la page')
  
}

window.addEventListener('DOMContentLoaded', function(){
  var md = new MobileDetect(window.navigator.userAgent);
  if(md.mobile()){

  }
  else{      
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {enableHighAccuracy: false});
  }
})





async function loadMeteoInfo(lat, long){
  const api = "d4ed16593db710811ec5193f67857c36";
  const url = "https://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" +long + "&appid=" + api + "&mode=json&lang=fr&units=metric"
  console.log(url)
   const resp = await fetch(url)
   return resp.json()
}
function getWeatherID(info){
  return info["list"][0]["weather"][0]["id"]
}
function getWeatherName(info){
    return info["list"][0]["weather"][0]["description"]
}
function getTemperature(info){
  var tab = []
  tab.push(
    info["list"][0]['main']['temp'],
    info["list"][0]['main']['temp_max'], 
    info["list"][0]['main']['temp_min']
    )

 

  return tab

}
function getCity(info){
  return  info["list"][0]['name']
}
function buildMeteoWidget(weatherID, temp, city, weatherName){

  switch (true) {
    case (weatherID <= 232):
      var path = "./img/widget/orage.png"
      break;

    case (weatherID <= 531):
      const g = document.querySelector('.widget')
      g.classList.add('rain')
      if(weatherID == 500 || weatherID == 501)
        var path = "./img/widget/averse.png"
      else
        var path = "./img/widget/pluie.png"
      break;
    case (weatherID <= 622):
      if(weatherID == 600)
        var path = "./img/widget/neigeeparse.png"
      else
        var path = "./img/widget/neige.png"
      break;

    case (weatherID == 800):
      var path = "./img/widget/soleil.png"
      break;
    case (weatherID <= 802):
      var path = "./img/widget/s_n.png"
      break;
    case (weatherID <= 804):
      const cont = document.querySelector('.widget')
      cont.classList.add('rain')
      var path = "./img/widget/nuageux.png"
      break;

    default:
      console.log("erreur nouvel id non pris en charge")
      break;
  }

  console.log(path)

//COMPOSANT DEJA PRESENT 
var widgetTop = document.querySelector('.widgetTop')
var widgetBottom = document.querySelector('.widgetBottom')

//creation nom de la ville + logo localisaton
var containerTitle = document.querySelector('.city')
var cityH1 = document.createElement('h1')
cityH1.innerText = city
containerTitle.insertAdjacentElement('afterbegin', cityH1)

//creatoin temperatarue
var normalTemp = document.createElement('h1')
normalTemp.innerText = Math.round(temp[0])
widgetTop.insertAdjacentElement('beforeend', normalTemp)


//CREATION DE LA PARTIE BOTTOM : LOGO + NOM XEATHER + MAX MIN
var imgMeteo = document.createElement('img')
imgMeteo.setAttribute('src', path)
widgetBottom.insertAdjacentElement('beforeend', imgMeteo)

var meteoName = document.createElement('p')
meteoName.innerText = weatherName
widgetBottom.insertAdjacentElement('beforeend', meteoName)

var tempmMax = Math.round(temp[1])
var tempMin = Math.round(temp[2])

var tempLine = document.createElement('p')
var max = document.createElement('span')
var min = document.createElement('span')
max.innerText = "Max. " + tempmMax
min.innerText = "Min. " + tempMin
tempLine.insertAdjacentElement('beforeend', max)
tempLine.insertAdjacentElement('beforeend', min)
widgetBottom.insertAdjacentElement('beforeend', tempLine)


document.querySelector('.widget').classList.add('active')
document.querySelector('.widget').style.left="30px"
document.querySelector('.widget').style.top="125px"



}

