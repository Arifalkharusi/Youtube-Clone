// DOM selectors
const searchInput = document.querySelector(".search-bar");
const main = document.querySelector(".vid-grid");
const searchBtn = document.querySelector(".sch-bt");
const ytBtn = document.querySelector(".logo");
const homeBtn = document.querySelector(".home");
const mainWatch = document.querySelector(".main-watch");
const watch = document.querySelector(".watch");
const recom = document.querySelector(".recom");
const mainMain = document.querySelector(".main");

// date published
const datePublished = function (date) {
  // date vid uploaded
  const dateUploaded = new Date(date);
  // current time
  const now = new Date();
  // gets time passed in minutes
  let timePassed = (now.getTime() - dateUploaded.getTime()) / 1000 / 60;
  // minutes
  if (timePassed < 60) return `${Math.floor(timePassed)} minutes ago`;
  timePassed = timePassed / 60;
  // hours
  if (timePassed < 24) return `${Math.floor(timePassed)} hours ago`;
  timePassed = timePassed / 24;
  // days
  if (timePassed < 7) return `${Math.floor(timePassed)} days ago`;
  timePassed = timePassed / 7;
  // weeks
  if (timePassed < 4) return `${Math.floor(timePassed)} weeks ago`;
  timePassed = timePassed / 4;
  // months
  if (timePassed < 12) return `${Math.floor(timePassed)} months ago`;
  timePassed = timePassed / 12;
  // years
  return `${Math.floor(timePassed)} years ago`;
};
// views
const viewCount = function (views) {
  // number of views
  let numViews = Number(views);
  // hundreds
  if (numViews < 1000) return `${views}`;
  // thousands
  if (numViews >= 1000 && numViews < 1000000)
    return `${Math.floor(numViews / 1000)}K`;
  // millions
  if (numViews >= 1000000 && numViews < 1000000000)
    return `${(numViews / 1000000).toFixed(2)}M`;
  // billions
  if (numViews >= 1000000000) return `${(numViews / 1000000000).toFixed(2)}B`;
};
// Youtube API call function
const mainFunc = async function (search, div) {
  // stores data recieved
  const linkArray = [];
  const titleArray = [];
  const views = [];
  const days = [];
  const dp = [];
  const auth = [];
  // fetch vidios
  const res = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${search}&key=AIzaSyDRMwlchZ2LklZcVLlckdrXJrykZmy1l5c`
  );
  const data = await res.json();
  // stores videos only
  data.items.forEach((x) => {
    // check item recieved is video
    if (x.id.kind === "youtube#video") {
      linkArray.push(x.id.videoId);
      titleArray.push(x.snippet.title);
    }
  });
  // itterates throught the recieved videos
  for (let i = 0; i < 25; i++) {
    if (data.items[i].id.kind === "youtube#video") {
      // fetches channel info
      const resChan = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${data.items[i].snippet.channelId}&key=AIzaSyDRMwlchZ2LklZcVLlckdrXJrykZmy1l5c`
      );
      const dataChan = await resChan.json();
      // fetch views info
      const resView = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${data.items[i].id.videoId}&key=AIzaSyDRMwlchZ2LklZcVLlckdrXJrykZmy1l5c`
      );
      const dataView = await resView.json();
      // stores the data recieved
      views.push(dataView.items[0].statistics.viewCount);
      days.push(data.items[i].snippet.publishTime);
      dp.push(dataChan.items[0].snippet.thumbnails.high.url);
      auth.push(dataChan.items[0].snippet.title);
      // html snipets
      const html = `
      <div class="vid-prev">
        <div class="thum-row">
          <img
                class="thumbnail"
                src="${data.items[i].snippet.thumbnails.high.url}"
                alt=""
            />
        </div>
        <div class="vid-info-grid">
          <div class="channel-pic">
          <img
                class="profile-pic"
                src="${dataChan.items[0].snippet.thumbnails.high.url}"
                alt=""
            />
          </div>
          <div class="vid-info">
          <p class="vid-title">${data.items[i].snippet.title}</p>
              <p class="vid-auth">${dataChan.items[0].snippet.title}</p>
            <p class="vid-stat">${viewCount(
              dataView.items[0].statistics.viewCount
            )} views &#183; ${datePublished(
        data.items[i].snippet.publishTime
      )}</p>
          </div>
        </div>
      </div>`;
      // pushes to the DOM
      div.insertAdjacentHTML("beforeend", html);
    }
  }
  // selects all the rendered videos
  const vidDisplay = document.querySelectorAll(".vid-prev");
  recom.innerHTML = "";
  // itterates through the videos
  vidDisplay.forEach((x, i) => {
    // click event
    x.addEventListener("click", function () {
      // removes/ desplays
      watch.classList.remove("hidden");
      mainMain.classList.add("hidden");
      mainWatch.innerHTML = "";
      const html2 = ` <iframe
        allow='autoplay'
        src="https://www.youtube.com/embed/${linkArray[i]}?autoplay=1"
      >
      </iframe>
      <h1>${titleArray[i]}</h1>
      <div class="watch-info-grid">
      <div class="watch-info-left">
      <img
            class="profile-pic"
            src="${dp[i]}"
            alt=""
        />
        <h2>${auth[i]}</h2>
        <button class="chan-name">Subscribe</button>
        </div>
        <div class="watch-info-right">
          <div>
          <i class="fa-regular fa-thumbs-up"></i>
          <i class="fa-regular fa-thumbs-down"></i>
          </div>
          <p><i class="fa-solid fa-share"></i> Share</p>
          <p><i class="fa-solid fa-arrow-down"></i> Download</p>
          <p><i class="fa-regular fa-heart"></i> Thanks</p>
          <p><i class="fa-solid fa-scissors"></i> Clip</p>
          <i class="fa-solid fa-ellipsis"></i>

        </div>
        </div>
    `;
      // pushes to the DOM
      mainWatch.insertAdjacentHTML("afterbegin", html2);
    });
    // gets channel info for the video selected
    const thumb = x.querySelector(".thum-row");
    const info = x.querySelector(".vid-info");
    const html3 = `<div class='recon-vid'>
                        <div class='recon-thum'>${thumb.innerHTML}</div>
                        <div class='recon-info'>${info.innerHTML}</div>
                      </div>`;
    // pushes to the DOM
    recom.insertAdjacentHTML("beforeend", html3);
  });
};
// search functions
const searchFunc = function (value, div) {
  main.innerHTML = "";
  watch.classList.add("hidden");
  mainMain.classList.remove("hidden");
  // puts whats being searched
  mainFunc(value, div);
};
// click event function
const clickEvent = function (search) {
  searchFunc(search, main);
  window.scroll({ top: 0 });
  mainWatch.innerHTML = "";
};
// on load
window.addEventListener("load", () => {
  searchFunc("", main);
});
// logo click event
ytBtn.addEventListener("click", function () {
  clickEvent("");
});
// home button click event
homeBtn.addEventListener("click", function () {
  clickEvent("");
});
// searched event
searchBtn.addEventListener("click", function () {
  const searchFor = searchInput.value;
  clickEvent(searchFor);
});
// keyboard event on search
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const searchFor = searchInput.value;
    clickEvent(searchFor);
  }
});
