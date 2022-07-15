const getElement = (element) => document.querySelector(element)
const getAllElements = (element) => document.querySelectorAll(element)

const prevBtn = getElement(".prev")
const nextBtn = getElement(".next")
const pageInfo = getElement(".pageInfo")
const postList = getElement(".post-list")
const searchInput = getElement(".search-input")

const sortSelect = getElement(".sort-posts")
const filterSelect = getElement(".filter-posts")

let posts = []
let usersId = []

// fetch posts
const getPosts = () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then((res) => res.json())
        .then((data) => {
            posts = data
            usersId = posts.map(el => el.userId)
            usersId = [...new Set(usersId)]
            usersId.forEach(item => {
                let option = `<option value="${item}">${item}</option>`
                filterSelect.innerHTML += option
            })
            createPostList(data)


        })
}

getPosts()
let itemNumber = 0;
let limit = 5;


// sort posts
function sortPosts(value, data) {

    let result = null
    switch (value) {
        case "a-z": {
            postList.innerHTML = ""
            result = data.sort((a, b) => a.title > b.title ? 1 : -1)
            createPostList(result)
        }
            break

        case "z-a": {

            postList.innerHTML = ""
            result = data.sort((a, b) => a.title > b.title ? -1 : 1)
            createPostList(result)
        }
            break

        case "asc": {
            postList.innerHTML = ""
            result = data.sort((a, b) => a.id - b.id)


            createPostList(result)
        }
            break

        case "desc": {
            postList.innerHTML = ""
            result = data.sort((a, b) => b.id - a.id)


            createPostList(result)
        }
            break


        default :
            return result
    }
}


// search posts
const showSearchResults = (value, data) => {

    value = value.toLowerCase().trim()
    postList.innerHTML = ""
    return data.filter(post => {
        return String(post.id).includes(value) || post.title.toLowerCase().includes(value) || post.body.toLowerCase().includes(value)
    })

}

sortSelect.addEventListener("change", (e) => {
    console.log(e.target.value)

    sortPosts(e.target.value, posts)
})

searchInput.addEventListener("input", (e) => {

    let result = showSearchResults(e.target.value, posts)
    if (result.length === 0) {
        postList.innerHTML = `<h1>No such result!</h1>`
    } else {
        createPostList(result)

    }

})


prevBtn.disabled = itemNumber <= 0;
nextBtn.disabled == itemNumber


// create posts

function createPostList(result) {

    let start = limit * itemNumber;
    let end = (itemNumber + 1) * limit;
    let partDisplayed = result.slice(start, end);
    if (end > result.length) {
        end = result.length;
    }


    if (itemNumber <= 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    const lastPage = result.length / limit;
    if (itemNumber + 1 >= lastPage) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }

    pageInfo.innerText = `${start + 1} - ${end} of ${result.length}`;

    partDisplayed.forEach((post) => {
        const onePost = `
      <li class="post-item" id="${post.id}">
      
       <p><strong>id:${post.id}</strong></p>
       <p><strong> userId:${post.userId}</strong></p>
       <h4> title: ${post.title}</h4>
       <p> body: ${post.body}</p>
      </li>
    `
        postList.innerHTML += onePost;
    });
    implementDetailPage()


}

filterSelect.addEventListener("change", (e) => {
    postList.innerHTML = ""
   let filteredData =   filterByUserId(e.target.value)
    console.log(filteredData)
    createPostList(filteredData)
})

prevBtn.addEventListener("click", function () {
    postList.innerHTML = "";
    itemNumber -= 1;
    createPostList(posts);

});

nextBtn.addEventListener("click", function () {
    postList.innerHTML = "";
    itemNumber += 1;
    createPostList(posts);

});

// filter posts by users

function filterByUserId(value){
    postList.innerHTML = ""
   return  posts.filter(post => {
         return post.userId === +value
    })


}


// creating details page

function implementDetailPage(){
    const postItems = getAllElements(".post-item")
    postItems.forEach(item => {
        item.addEventListener("click", () => {
            let result = ""
            const postId = item.getAttribute("id")
            console.log(postId)
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then((data) => data.json())
                .then((res) => {
                    result = `<h1>Detail page</h1>
<ul>
<li>${res.id}</li>
<li>${res.userId}</li>
<li>${res.title}</li>
<li>${res.body}</li>
</ul>
`

                    let openedPage = window.open("");
                    openedPage.document.write(`${result}`);
                })
        })
    })

}
