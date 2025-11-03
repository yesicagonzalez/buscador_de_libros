const BOOK_URL = "https://openlibrary.org/search.json";
const COVER_BOOK_URL = "https://covers.openlibrary.org/b/id/";

const statusInput = document.getElementById("statusInput");
const result = document.getElementById("result");
const searchForm = document.getElementById("searchForm");

/**
 * Envío de formulario
 */
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (statusInput.value) {
    result.replaceChildren();

    books = await getBooks(statusInput.value);
    console.log(books);

    if (books.length > 0) {
      for (const book of books) {
        result.insertAdjacentHTML("beforeend", createBook(book));
      }
    } else{
      noResult();
    }
  } else {
    alert("¡Ingresa algo primero!");
  }
});

let createBook = (book) => {
  const title = book.title;
  const author = book.author_name;
  const coverSrc = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://cdnattic.atticbooks.co.ke/img/P901901.jpg";
  const editions =
    book.edition_count === 1
      ? `${book.edition_count} edición`
      : `${book.edition_count} ediciones`;
  const language = book.language ? book.language : "No hay datos";
  const firstPublishYear = book.first_publish_year;

  return `
        <div class="item-book">
            <div class="img-content">
                <img src="${coverSrc}" alt="${title}"">
            </div>
            <div class="contenido">
                <h3>${title}</h3>
                <p><strong>De:</strong> ${author}</p>
                <p><strong>Publicado por primera vez:</strong> ${firstPublishYear} - ${editions}</p>
                <p><strong>Disponible en los siguientes idiomas:</strong> ${language}</p>
            </div> 
        </div>
    `;
};

let getBooks = async (searchValue) => {
  const url = `${BOOK_URL}?title=${encodeURIComponent(searchValue)}`;
  const urlSelectedFields = `${url}&fields=key,title,author_name,cover_i,first_publish_year,language,edition_count`;

  const result = await getData(urlSelectedFields);
  if (result.status === "ok") {
    return result.data.docs;
  } else {
    console.error(result.data);
  }
};

let getData = async (url) => {
  let result = {};
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((response) => {
      result.status = "ok";
      result.data = response;
      return result;
    })
    .catch((response) => {
      result.status = "error";
      result.data = error;
      return result;
    });
};

function noResult() {
  const divAlert = document.createElement("div");
  divAlert.classList.add("alert");
  divAlert.innerHTML = "No hay resultados :(";
  divAlert.role = "alert";
  result.appendChild(divAlert);
}
