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
      <td><a target="_blank" href="${element.URL}">${element.URL}</a> <button type="button" class="btn btn-primary" onclick="clickWish(${element.id})">add to wish</button> </td>
    `

    parent.appendChild(tr)
  })
}


const clickWish = (id) => {
  wishListSet.add(id);
  
  // put wishlistset into locatstorage
  const wishArray = Array.from(wishListSet);
  localStorage.setItem("wishList", JSON.stringify(wishArray));
  document.getElementById("count_wish_number").innerText = "";
  document.getElementById("count_wish_number").innerText = wishArray.length;
  // console.log("Saved to localStorage:", wishArray);
}

// get wishArray data from local storage
const getWishList = () => {
  const data = localStorage.getItem("wishList");

  if (!data) return [];

  return JSON.parse(data);
};

// show all the data into wish.html table
const displayWishTable = () => {
  const wishIds = getWishList();

  if (wishIds.length === 0) {
    console.log("Wishlist is empty");
    return;
  }

  // Fetch all data
  fetch("https://versity-search.onrender.com/versitylist/list/")
    .then(res => res.json())
    .then(data => {
      const wishedItems = data.filter(item =>
        wishIds.includes(item.id)
      );

      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";

      wishedItems.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.Country}</td>
          <td>${item.Institute}</td>
          <td>${item.Professors}</td>
          <td>${item.Research_Area}</td>
          <td>
          <a href="${item.URL}" target="_blank">${item.URL}</a>
          <button type="button" class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
};


// delete item
const deleteItem = (id) => {
  // console.log(id)
  const data = localStorage.getItem("wishList");
  if(!data)
    return;
  let wishList = JSON.parse(data);

  // delete specefic item
  wishList = wishList.filter(item => item != id);
  
  // set list into local store
  localStorage.setItem("wishList", JSON.stringify(wishList));
  displayWishTable();
  
};

// if wish.html open
if (window.location.pathname.includes("wish.html")) {
  displayWishTable();
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
