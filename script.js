const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const accessKey = config.ACCESS_KEY;

const initialCount = 5;
let photosArray = [];
let count = 0;
let isInitiallyLoaded = false;
let apiUrl = '';
let imagesLoaded = 0;
let totalImages = 0;
let ready = false;

const checkInitialLoad = () => {
    if (!isInitiallyLoaded) {
        count = initialCount;        
        isInitiallyLoaded = true;
    } else {
        count = 30;
    }
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${accessKey}&count=${count}`;
}

const imageLoaded = () => {
    imagesLoaded++;
    if(imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

const setAttributes = (element, attributes) => {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

const displayPhotos = () => {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach((photo) => {
        const item = document.createElement("a");
        setAttributes(item, {
            href: photo.links.html,
            target:'_blank'
        })
        const img = document.createElement("img");
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        })
        img.addEventListener("load", imageLoaded)
        item.appendChild(img);
        imageContainer.appendChild(item);
    }) 
}

const getPhotos = async () => {    
    try {
        checkInitialLoad();
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
    } catch(err) {
        console.log(err);
    }
}

window.addEventListener("scroll", () => {
    if(window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
})

getPhotos();