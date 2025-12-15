// global variable
let countrySelect = null;
let reasearchSelect = null;
const wishListSet = new Set();



const countryList = () => {
  fetch("https://versity-search.onrender.com/versitylist/list/")
    .then((res) => res.json())
    .then((data) => {
      displayCountryData(data);
      displayReasearchArea(data);
    })
    .catch(err => console.log(err))
};

const displayCountryData = (data) => {
  // define set
  const uniqueCountry = new Set();

  // put all value into set from api
  data.forEach((element) => {
    if (element.Country) {
      uniqueCountry.add(element.Country);
    }
  });

  // add all unique country into dropdown
  const parent = document.getElementById("country_dropdown");
  uniqueCountry.forEach((country) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a class="dropdown-item" href="#" onclick="addClickOnCountry('${String(country).replace(/'/g, "\\'")}')">${country}</a>
      `;

    parent.appendChild(li);
  });
};


// click add on country 
const addClickOnCountry = (country) => {
  countrySelect = country

  if (reasearchSelect != null){
    fetch(`https://versity-search.onrender.com/versitylist/list/?country=${country}&reasearch=${reasearchSelect}`)
    .then(res => res.json())
    .then(data => countryDisplayOnTable(data))
    .catch(err => console.log(err))
  }
  else{
    fetch(`https://versity-search.onrender.com/versitylist/list/?country=${country}`)
    .then(res => res.json())
    .then(data => countryDisplayOnTable(data))
    .catch(err => console.log(err))
  }

}

const countryDisplayOnTable = (data) => {

  // parent table
  const parent = document.getElementById("table_body")
  parent.innerHTML = "";

  // print all value
  data.forEach(element => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${element.Country}</td>
      <td>${element.Institute}</td>
      <td>${element.Professors}</td>
      <td>${element.Research_Area}</td>
      <td>${element.URL} <button type="button" class="btn btn-primary" onclick="clickWish(${element.id})">add to wish</button> </td>
    `

    parent.appendChild(tr)
  })
}


const clickWish = (id) => {
  wishListSet.add(id);
}


const displayReasearchArea = (data) => {
  // create a set
  const uniqueReasearchArea = new Set();

  // put all data into set
  data.forEach(element => {
    uniqueReasearchArea.add(element.Research_Area)
  })

  // put all data into dropdown
  const parent = document.getElementById("reasearch_dropdown")
  uniqueReasearchArea.forEach(element => {
    const li = document.createElement("li");
    li.innerHTML = `
    <a class="dropdown-item" href="#" onclick="addClickReasearchArea('${String(element).replace(/'/g, "\\'")}')">${element}</a>
    `
    parent.appendChild(li)
  })
}

const addClickReasearchArea = (reasearch) => {
  reasearchSelect = reasearch

  if(countrySelect != null){
    fetch(`https://versity-search.onrender.com/versitylist/list/?country=${countrySelect}&reasearch=${reasearch}`)
    .then(res => res.json())
    .then(data => reasearchDisplayOnTable(data))
    .catch(err => console.log(err))
  }
  else{
    fetch(`https://versity-search.onrender.com/versitylist/list/?reasearch=${reasearch}`)
    .then(res => res.json())
    .then(data => reasearchDisplayOnTable(data))
    .catch(err => console.log(err))
  }
  
}

const reasearchDisplayOnTable = (data) => {
    // parent table
  const parent = document.getElementById("table_body")
  parent.innerHTML = "";

  // check country is true

  // print all value
  data.forEach(element => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <th>${element.Country}</th>
      <td>${element.Institute}</td>
      <td>${element.Professors}</td>
      <td>${element.Research_Area}</td>
      <td>${element.URL}</td>
    `

    parent.appendChild(tr)
  })
}

countryList();
