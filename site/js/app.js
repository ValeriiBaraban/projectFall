if (window.__TEST__) {
} else {
  document.addEventListener("DOMContentLoaded", async () => {
    // turn off browser validation
    const form = document.querySelector("#search-form");
    if (form) {
      form.setAttribute("novalidate", "");
    }

    //add animation to Wheater
    const animationForWheater = document.querySelector("h1");
    if (animationForWheater) {
      animationForWheater.classList.add("loading-text");
    }

    // Elements for city error message and city input field

    const cityError = document.querySelector("#city-error");
    const cityField = document.querySelector("#cities");

    // checking City field
    const checkingFieldName = () => {
        if(cityField.value.length === 0) {
            cityError.textContent = "field requared";
            return false;
        } else if(cityField.value.length < 3) {
            cityError.textContent = "min 3 symbols";
            return false;
        } else {
            cityError.textContent = "";
            return true;
        };
    };

    // -------- Fetch and prepare city list --------

    // Load JSON with zip codes and cities and save it to sessionStorage
    const getZipCity = async () => {
      const res = await fetch("/site/delivery_zipcode_physical_city.json");

      const file = await res.json();
      sessionStorage.setItem("zipCity", JSON.stringify(file));
      return file;
    };

    // Build a unique list of city names from the loaded data

    const getCityList = async () => {
      await getZipCity();
      const data = await JSON.parse(sessionStorage.getItem("zipCity"));
      return [...new Set(data.map((item) => item.physical_city))];
    };

    // Get the list of cities (array of strings)

    const listOfCities = await getCityList();

    //inputSearch
    // Create search helper for the list of cities

    const finder = () => {
      const search = inputSearch(listOfCities);
      // Listen to input in the city field

      cityField.addEventListener("input", (e) => {
        const filteredValue = e.target.value.replace(/[^\p{L}\s-]/gu, "");
        const inputField = filteredValue;
        sessionStorage.setItem("input", inputField);
        const datalist = document.querySelector("#cities-list");
        // Get matching cities

        const result = search.find(inputField);

        //Prevent datalist glitch when user selects an option
        if (result.includes(inputField)) {
          datalist.innerHTML = ""; //del old results
          return result;
        }

        // Clear previous suggestions

        datalist.innerHTML = ""; //del old results

        // Add  cities to the inline list and slice to 7
        result.slice(0, 7).forEach((city) => {
          const option = document.createElement("option");
          option.value = city;
          datalist.appendChild(option);
        });

        console.log("result", result.slice(0, 7));
        return result;
      });
    };
    finder();

    // Validation runs when the button is clicked
    const submit = document.querySelector(".btn-primary");
    submit.addEventListener("click", function (e) {
      e.preventDefault();
      // Run all validation functions/ consts received true or false
      const checkingFieldNameBoolean = checkingFieldName();

      if (checkingFieldNameBoolean) {
        sessionStorage.setItem("selectedCity", cityField.value);
        //sessionStorage.setItem('selectedCountry', country);
        // sessionStorage.setItem('zip', zip);
        window.location.href = "/site/page-main.html";
      }
    });
  });
}
// -------- City search function --------

const inputSearch = (listOfCities) => {
  const find = (query) => {
    // Normalize query: trim spaces and convert to lowercase

    const q = (query || "").trim().toLowerCase();
    if (!q) {
      return [];
    }
    return listOfCities.filter((listOfCities) =>
      listOfCities.toLowerCase().startsWith(q)
    );
  };
  return { find };
};
window.inputSearch = inputSearch;
