const apiKey = "4bcd6da0";
const baseURL = "http://www.omdbapi.com/";
const searchInput = document.querySelector("#search-input");
const typeSelect = document.querySelector("#type");
const cardsDiv = document.querySelector(".cards");
async function getData() {
  try {
    const type = typeSelect.value;
    const searchValue = searchInput.value.trim();
    if (type === "" || searchValue === "") {
      alert("Cannot Leave Search Empty");
    } else {
      cardsDiv.classList.add("d-flex");
      cardsDiv.classList.remove("d-none");
      cardsDiv.innerHTML = "";
      const response = await fetch(
        `${baseURL}?apikey=${apiKey}&s=${searchValue}&type=${type}`
      );
      if (response.ok) {
        let cardsHTML = "";
        const dataList = await response.json();
        if (dataList.Response === "False") {
          cardsHTML = `<h1><i class="bi bi-emoji-frown me-1"></i>Result Not Found</h1>`;
        } else {
          dataList.Search.forEach((data) => {
            const { imdbID, Poster, Title, Year } = data;
            cardsHTML += `
        <div class="card shadow" style="width:250px" id="${imdbID}">
            <img src="${Poster}" onerror="this.onerror=null; this.src='no_poster.jpg';" class="card-img-top w-100" alt="${Title}">
            <div class="card-body">
                <h5 class="card-title">${Title} (${Year})</h5>
                <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#titleModal" onclick="getSingleData(this)">Read More</button>
            </div>
        </div>
        `;
          });
        }
        cardsDiv.innerHTML = cardsHTML;
      } else {
        console.log("Error 404");
      }
    }
  } catch (error) {
    console.log(error);
  }
  searchInput.value = "";
  typeSelect.value = "";
}

async function getSingleData(data) {
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = `<p><i class="bi bi-arrow-clockwise me-1"></i>Loading...</p>`;
  const imdbID = data.parentElement.parentElement.id;
  try {
    const response = await fetch(`${baseURL}?apikey=${apiKey}&i=${imdbID}`);
    if (response.ok) {
      const data = await response.json();
      const {
        Title,
        Poster,
        Year,
        Released,
        Runtime,
        Genre,
        Language,
        Rated,
        Plot,
        Director,
        Writer,
        Actors,
        Ratings,
        imdbVotes,
        BoxOffice,
        totalSeasons,
        Type,
      } = data;
      modalBody.innerHTML = `
      
              <img id="poster" src="${Poster}" alt="" class="img-fluid border shadow" />
              <div class="d-flex flex-column gap-2 pe-1">
                <h4 class="modal-title fw-bold" id="title">${
                  Title || "N/A"
                }</h4>
                <p class="m-0">
                  <span id="year">${
                    Year || "N/A"
                  }</span><i class="bi bi-dot"></i
                  ><span id="date">${
                    Released || "N/A"
                  }</span><i class="bi bi-dot"></i
                  ><span id="length">${
                    Runtime || "N/A"
                  }</span><i class="bi bi-dot"></i>
                  <span id="rated">${Rated || "N/A"}</span><span> Rated</span>
                </p>
                <p class="m-0">
                  <span class="fw-bold">Genre: </span><span id="genre">${
                    Genre || "N/A"
                  }</span>
                </p>
                <p class="m-0">
                  <span class="fw-bold">Language: </span
                  ><span id="language">${Language || "N/A"}</span>
                </p>
                <p class="m-0">
                  <span class="fw-bold">Plot: </span><span id="plot">${
                    Plot || "N/A"
                  }</span>
                </p>
                ${
                  Type === "series"
                    ? `<p class="m-0"><span class="fw-bold">Total Seasons: </span><span id="seasons">${
                        totalSeasons || "N/A"
                      }</span></p>`
                    : ""
                }
                <p class="m-0">
                  <span class="fw-bold">Director: </span
                  ><span id="director">${Director || "N/A"}</span>
                </p>
                <p class="m-0">
                  <span class="fw-bold">Writer: </span
                  ><span id="writer">${Writer || "N/A"}</span>
                </p>
                <p class="m-0">
                  <span class="fw-bold">Cast: </span><span id="cast">${
                    Actors || "N/A"
                  }</span>
                </p>
                <p class="m-0">
                  <span class="fw-bold">IMDb Rating: </span
                  ><span id="rating">${
                    Ratings[0]?.Value || "N/A"
                  }</span> (<span id="votes">${imdbVotes || "N/A"}</span>)
                </p>
                <p class="m-0">
                  <span class="fw-bold">Rotten Tomatoes: </span
                  ><span id="rottentomatoes">${
                    Ratings[1]?.Value || "N/A"
                  }</span>
                </p>
                <p class="m-0">
                  <span class="fw-bold">Metascore: </span
                  ><span id="metascore">${Ratings[2]?.Value || "N/A"}</span>
                </p>
                <p class="m-0">
                  <span class="fw-bold">Box Office Collection: </span
                  ><span id="boxoffice">${BoxOffice || "N/A"}</span>
                </p>
              </div>
            
      `;
    } else {
      console.error("404");
    }
  } catch (error) {
    console.log(error);
  }
}
