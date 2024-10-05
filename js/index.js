function getTimeString(time) {
  const hour = parseInt(time / 3600);
  const minute = parseInt((time % 3600) / 60);
  const second = parseInt(time % 60);
  return `${hour} hour ${minute} minute ${second} second ago`;
}

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for (let btn of buttons) {
    btn.classList.remove("active");
  }
};

// console.log(getTimeString(3500));
// fetch, load and show categories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((err) => console.log(err));
};

// fetch and load videos
const loadVideos = (searchText = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((err) => console.log(err));
};

const loadVideoByCategory = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((err) => console.log(err));
};

const loadDetailsById = async (videoId) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(url);
  const data = await res.json();
  displayDetails(data.video);
};

const displayDetails = (video) => {
  const modalContainer = document.getElementById("modal-content");
  modalContainer.innerHTML = `<img src=${video.thumbnail} alt="" />
  <p class="py-3"> ${video.description} </p>
  `;
  document.getElementById("customModal").showModal();
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";

  if (videos.length === 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = ` 
    <div class="flex flex-col gap-5 min-h-[500px] mx-auto justify-center items-center">
    <img src="./assets/icon.png" alt="" />
    <h1 class="text-3xl font-bold text-gray-600">Oops!! Sorry, There is no video here.
    </div>
    `;
    return;
  } else {
    videoContainer.classList.add("grid");
  }

  videos.forEach((item) => {
    // console.log(item);
    const card = document.createElement("div");
    card.classList = "card card-compact  ";
    card.innerHTML = `
    <figure  class="h-[200px] relative">
    <img
    class="h-full w-full object-cover"
      src="${item.thumbnail}" />
      ${
        item.others.posted_date?.length === 0
          ? ""
          : `  <span class="absolute right-2 text-white bottom-2 bg-black text-xs rounded p-1" >${getTimeString(
              item.others.posted_date
            )} </span>`
      }
   
  </figure>
 <div class="px-0 py-2 flex gap-3">
  <div class=" ">
    <img
      class="h-10 w-10 rounded-full object-cover"
      src="${item.authors[0].profile_picture}"
      alt=""
    />
  </div>
  <div>
    <h2 class="font-bold">${item.title}</h2>
    <div class="flex gap-2 items-center">
      <p class="text-gray-400">${item.authors[0].profile_name}</p>
      ${
        item.authors[0].verified === true
          ? `<img
        class="w-5 h-5 object-cover"
        src="https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000"
        alt=""
      />`
          : ""
      }
    </div>
    <p><button onclick="loadDetailsById('${
      item.video_id
    }')" class="btn btn-sm mt-2">See More</button> </p>
  </div>
</div>
    `;
    videoContainer.appendChild(card);
  });
};

const displayCategories = (data) => {
  const categoryContainer = document.getElementById("categories");
  data.forEach((item) => {
    // console.log(item);

    const btnContainer = document.createElement("div");
    btnContainer.innerHTML = `
<button
  id="btn-${item.category_id}"
  onclick="loadVideoByCategory(${item.category_id})"
  class="btn category-btn"
>
  ${item.category}
</button>
   `;
    categoryContainer.append(btnContainer);
  });
};

document.getElementById("search").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});

loadCategories();
loadVideos();
