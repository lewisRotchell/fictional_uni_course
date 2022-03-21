import debounce from "../helpers/debounce";

class Search {
  // Constructor code is called as soon as new class instance is initialised
  // 1. describe and create/initiate object
  constructor() {
    this.addSearchHTML();
    this.openButton = document.querySelectorAll(".js-search-trigger");
    this.closeButton = document.querySelector(".search-overlay__close");
    this.searchOverlay = document.querySelector(".search-overlay");
    this.searchField = document.querySelector("#search-term");
    this.searchResults = document.querySelector("#search-overlay__results");
    //Call the events method so the browser listens for them as soon as the page is loaded
    this.events();
    this.isOverlayOpen = false;
    this.typingTimer;
    this.isSpinnerVisible = false;
    this.previousValue;
    this.inputs = document.querySelectorAll("input, textarea");
  }
  //2 events
  //dispatchers
  events = () => {
    this.openButton.forEach((btn) => {
      btn.addEventListener("click", this.openOverlay);
    });

    this.closeButton.addEventListener("click", this.closeOverlay);

    document.addEventListener("keydown", this.keyPressDispatcher);

    this.searchField.addEventListener("keyup", this.submitForm);

    //Keyboard shortcuts
  };

  //3 methods
  //Remember to se arrow functions to avoid having to bind "this"
  openOverlay = (e) => {
    this.searchOverlay.classList.add("search-overlay--active");
    //adds overflow: hidden to body
    document.querySelector("body").classList.add("body-no-scroll");
    this.searchField.value = "";
    //Got to wait until the searchfield is visible- explains the setTimeout
    setTimeout(() => this.searchField.focus(), 301);
    this.isOverlayOpen = true;
    //This prevents the default behaviour of link elements
    e.preventDefault();
  };

  closeOverlay = () => {
    this.searchOverlay.classList.remove("search-overlay--active");
    document.querySelector("body").classList.remove("body-no-scroll");
    this.isOverlayOpen = false;
  };

  //keyboard shortcuts
  keyPressDispatcher = (e) => {
    if (
      e.keyCode === 83 &&
      !this.isOverlayOpen &&
      //Only if an input or text area is not focussed
      this.checkFocus(this.inputs)
    ) {
      this.openOverlay();
    }
    if (e.keyCode === 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
  };

  checkFocus = (inputs) => {
    for (const el of inputs) {
      //If element is focussed
      if (document.activeElement === el) {
        return false;
      } else {
        return true;
      }
    }
  };

  submitForm = (e) => {
    if (this.searchField.value !== this.previousValue) {
      clearTimeout(this.typingTimer);

      if (this.searchField.value) {
        if (!this.isSpinnerVisible) {
          this.searchResults.innerHTML = '<div class="spinner-loader"></div>';
          this.isSpinnerVisible = true;
        }

        this.typingTimer = setTimeout(() => {
          this.getResults(e);
        }, 750);
      } else {
        this.searchResults.innerHTML = "";
        this.isSpinnerVisible = false;
      }
    }
    this.previousValue = this.searchField.value;
  };

  getResults = async () => {
    const url = `${universityData.root_url}/wp-json/university/v1/search?term=${this.searchField.value}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      this.searchResults.innerHTML = `
      <div class="row">
        <div class="one-third">
          <h2 class="search-overlay__section-title">General Information</h2>
          ${
            data.generalInfo.length
              ? `<ul class="link-list min-list">
             ${data.generalInfo
               .map((e) => {
                 return `<li> <a href="${e.permalink}">${e.title}</a> ${
                   e.postType == "post" ? `by ${e.authorName}` : ""
                 }
                 </li>`;
               })
               .join("")}
             </ul>
               `
              : `<p>No results match your query</p>`
          }
        </div>
        <div class="one-third">
          <h2 class="search-overlay__section-title">Programs</h2>
          ${
            data.programs.length
              ? `<ul class="link-list min-list">
             ${data.programs
               .map((e) => {
                 return `<li> <a href="${e.permalink}">${e.title}</a> 
                 </li>`;
               })
               .join("")}
             </ul>
               `
              : `<p>No programs match your query. <a href="${universityData.root_url}/programs">View all programs</a></p>`
          }

          <h2 class="search-overlay__section-title">Professors</h2>

          ${
            data.professors.length
              ? `<ul class="professor-cards">
             ${data.professors
               .map((e) => {
                 return `
                 <li class="professor-card__list-item">
                    <a class="professor-card" href="${e.permalink}">
                        <img class="professor-card__image" src="${e.image}">
                        <span class="professor-card__name">${e.title}</span>
                    </a>
                </li>
                 `;
               })
               .join("")}
             </ul>
               `
              : `<p>No professors match your query.</p>`
          }

        </div>
        <div class="one-third">
          <h2 class="search-overlay__section-title">Events</h2>
          ${
            data.events.length
              ? data.events.map((event) => {
                  return `
                  <div class="event-summary">
    <a class="event-summary__date t-center" href="${event.permalink}">
        <span class="event-summary__month">${event.month}</span>
        <span class="event-summary__day">${event.day}</span>
    </a>
    <div class="event-summary__content">
        <h5 class="event-summary__title headline headline--tiny"><a href="${event.permalink}">${event.title}</a></h5>
        <p>${event.description}<a href="${event.permalink}" class="nu gray">Learn more</a></p>
    </div>
</div>
                  `;
                })
              : `<p>No events match your query</p> <a href="${universityData.root_url}/events">View all events</a></p>`
          }
        </div>
      </div>
      `;

      this.isSpinnerVisible = false;
    } catch (err) {
      console.log(err);
    }
  };

  addSearchHTML() {
    let search = document.createElement("div");
    search.setAttribute("class", "search-overlay");
    search.innerHTML = `
    <div class="search-overlay__top">
      <div class="container">
        <!-- aria-hidden true = hides element from screen reader  -->
        <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
        <input autocomplete="off" type="text" class="search-term" placeholder="What are you looking for?" id='search-term'>
        <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
      </div>
    </div>
    <div class="container">
      <div id="search-overlay__results">
  
      </div>
    </div>
    `;
    document.body.append(search);
  }
}

export default Search;
