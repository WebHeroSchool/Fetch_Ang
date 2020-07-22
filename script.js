const GITHUB_URL_TEMPLATE = 'https://api.github.com/users/';
const QUERY_PARAM_NAME = 'username';
const preloader = document.getElementById('wrap__preloader');

let button = document.getElementById('block__button');
let enteredUrl = document.getElementById('block__url');
button.onclick = () => {
  const url = enteredUrl.value;
  let username = getQueryParamFromUrl(url, QUERY_PARAM_NAME);
  query(username);
};

function query(endOfTemplate) {
	if(!endOfTemplate) {
    handleError(endOfTemplate);
    return;
  }
  
  preloader.classList.remove('do-not-show');

  Promise.all([
    new Promise((resolve) => {
      setTimeout(() => {
        let date = new Date();
        resolve(date);
      }, 4000);
    }),
    fetch(GITHUB_URL_TEMPLATE + endOfTemplate)
    	.then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
    	.then(response => response.json())
      .then(json => parseJson(json))    
  ]).then(([date, user]) => {
    fillDate(date);
    createUserCard(user);
  }).then(() => preloader.classList.add('do-not-show'))
  .catch(response => handleError(response));
}

function fillDate(date){
  let dateInfo = document.getElementById('date');
  dateInfo.innerHTML = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}; ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}

function createUserCard(obj){
  if (obj.name) {
    let userName = document.getElementById('name');
    userName.innerHTML = obj.name;
    userName.setAttribute('href', obj.url)
    let photo = document.getElementById('photo');
    photo.setAttribute('src', obj.avatar);
    let description = document.getElementById('description');
    description.innerHTML = obj.bio;
  }
}

function parseJson(obj) {
  return {
	  avatar: obj.avatar_url,
    name: obj.name,
    bio: obj.bio,
    url: obj.html_url
  }
}

function handleError(result) {
  let description = document.getElementById('description');
  description.innerHTML = 'User not found';
}

function getQueryParamFromUrl (url, paramName) {
	let queryParams = url.substring(url.indexOf('?') + 1);
  let paramArr = queryParams.split('&');
  for(let parameter of paramArr){
		[key, value] = parameter.split('=');
		if(key === paramName)
      return value.trim();       
  }
  return null;
}