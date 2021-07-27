window.addEventListener('DOMContentLoaded', init);

let blogEntryList = [];
let blogEntryCount = 0;
let index = 0;

function init() {
    document.getElementById('addpost').addEventListener('click', show_add_post);
    document.getElementById('post_cancel').addEventListener('click', cancel_post);
    document.getElementById('post_save').addEventListener('click', save_post);
    document.getElementById('edit_post_cancel').addEventListener('click', edit_cancel_post);
    document.getElementById('edit_post_save').addEventListener('click', edit_save_post);

    readFromLocalStorage();
    detect_no_entries();
}

//reads and loads in previously saved Blog entries from local storage
function readFromLocalStorage() {
    let savedList = JSON.parse(localStorage.getItem("blogEntries") || "[]");

    if (savedList) {
        // loops through each item and creates the corresponding blog entry
        for (let i = 0; i < savedList.length; i++) {
            blogEntryCount += 1;
            blogEntryList.push({id: `entry${blogEntryCount}`, title: savedList[i].title, date: savedList[i].date, summary:savedList[i].summary});
            
            let blogItem = document.createElement('li');
            blogItem.id = `entry${blogEntryCount}`;
    
            let titleText = document.createElement('h2');
            titleText.textContent = savedList[i].title;
            blogItem.appendChild(titleText);
    
            let dateText = document.createElement('h4');
            dateText.textContent = savedList[i].date;
            blogItem.appendChild(dateText);
    
            let summaryText = document.createElement('p');
            summaryText.textContent = savedList[i].summary;
            blogItem.appendChild(summaryText);
    
            let editBtn = document.createElement('button');
            editBtn.id = `entryBtn${blogEntryCount}`;
            editBtn.textContent = "Edit";
            editBtn.addEventListener('click', editEntry);
            blogItem.appendChild(editBtn);
    
            let delBtn = document.createElement('button');
            delBtn.id = `delBtn${blogEntryCount}`;
            delBtn.textContent = "Delete";
            delBtn.addEventListener('click', delEntry);
            blogItem.appendChild(delBtn);

            let line = document.createElement('hr');
            line.className = `smallerLine`;
            blogItem.appendChild(line);

            document.getElementById('blogEntries').appendChild(blogItem);
        }
    }
}

// If there are no entries in the blog display a message saying there are no entries
function detect_no_entries() {
    let entryul = document.querySelector('#blogEntries');
    var hide = entryul.children.length == 0 ? 'block' : 'none';
    document.querySelector('#noEntries').style.display = hide;
}

// show the modal that allows you to add posts 
function show_add_post() {
    let box = document.getElementById('post_pop');
    box.showModal();
}

// close the model to stop adding a post 
function cancel_post() {
    let box = document.getElementById('post_pop');
    box.close();
}

// adds a new post to the page and local storage
function save_post() {
    // Grab the post data frpm input fields
    let title = document.getElementById('postTitle').value;
    let date = document.getElementById('year').value;
    let summary = document.getElementById('summary').value;
    let box = document.getElementById('post_pop');

    // alert if an entry is missing
    if (!title || !date || !summary) {
        alert("Missing title, date, or summary fields");
    }
    else {
        // clear fields after post is done saving
        setTimeout(function cb() {
                document.getElementById('postTitle').value = "";
                document.getElementById('year').value = "";
                document.getElementById('summary').value = "";
        }, 0);

        //clean the post data
        let cleanTitle = DOMPurify.sanitize( title , {USE_PROFILES: {html: true}} ); 
        let cleanDate = DOMPurify.sanitize( date , {USE_PROFILES: {html: true}} );
        let cleanSummary = DOMPurify.sanitize( summary , {USE_PROFILES: {html: true}} );
        
        // set up the entry to be in the list and local storage
        blogEntryCount += 1;
        blogEntryList.push({id: `entry${blogEntryCount}`, title: cleanTitle, date: cleanDate, summary:cleanSummary});
        
        // Create elements for the entry and assemble them
        let blogItem = document.createElement('li');
        blogItem.id = `entry${blogEntryCount}`;

        let titleText = document.createElement('h2');
        titleText.textContent = cleanTitle;
        blogItem.appendChild(titleText);

        let dateText = document.createElement('h4');
        dateText.textContent = cleanDate;
        blogItem.appendChild(dateText);

        let summaryText = document.createElement('p');
        summaryText.textContent = cleanSummary;
        blogItem.appendChild(summaryText);

        let editBtn = document.createElement('button');
        editBtn.id = `entryBtn${blogEntryCount}`;
        editBtn.textContent = "Edit";
        editBtn.addEventListener('click', editEntry);
        blogItem.appendChild(editBtn);

        let delBtn = document.createElement('button');
        delBtn.id = `delBtn${blogEntryCount}`;
        delBtn.textContent = "Delete";
        delBtn.addEventListener('click', delEntry);
        blogItem.appendChild(delBtn);

        let line = document.createElement('hr');
        line.className = `smallerLine`;
        blogItem.appendChild(line);

        
        // Push entry to local storage and page
        localStorage.setItem('blogEntries', JSON.stringify(blogEntryList));
        document.getElementById('blogEntries').appendChild(blogItem);
        
        box.close();
        detect_no_entries();
    }

}

// deletes a post from the page and local storage
function delEntry() {

    let con = confirm('Confirm delete entry?');

    if (con) {
        let entryID = this.parentNode.id;
        let entryNode = this.parentNode;

        // find the entry in the list/local storage and removes it
        for (let i = 0; i < blogEntryList.length; i++) {
            if (blogEntryList[i].id == entryID) {
                blogEntryList.splice(i, 1);
            }
        }

        localStorage.setItem('blogEntries', JSON.stringify(blogEntryList));

        // remove entry from page
        this.removeEventListener('click', editEntry);
        this.removeEventListener('click', delEntry);
        this.parentNode.parentNode.removeChild(entryNode);
        detect_no_entries();
    }
}

// Opens a modal that allows you to edit a pre-existing post
function editEntry() {
    let entryID = this.parentNode.id;
    index = parseInt(entryID.substr(5,1))-1;

    // Fills the modal with the correct values for editing
    document.getElementById('edit_postTitle').value = blogEntryList[index].title;
    document.getElementById('edit_year').value = blogEntryList[index].date;
    document.getElementById('edit_summary').value = blogEntryList[index].summary;

    let box = document.getElementById('edit_post_pop');
    box.showModal();
}

// save edits of a post on the the page and local storage
function edit_save_post() {
    let title = document.getElementById('edit_postTitle').value;
    let date = document.getElementById('edit_year').value;
    let summary = document.getElementById('edit_summary').value;
    let box = document.getElementById('edit_post_pop');

    // alert if an entry is missing
    if (!title || !date || !summary) {
        alert("Missing title, date, or summary fields");
    }
    else {
        // sanitize the new input
        let cleanTitle = DOMPurify.sanitize( title , {USE_PROFILES: {html: true}} ); 
        let cleanDate = DOMPurify.sanitize( date , {USE_PROFILES: {html: true}} );
        let cleanSummary = DOMPurify.sanitize( summary , {USE_PROFILES: {html: true}} );
        
        // update local storage and page
        blogEntryList[index].title = cleanTitle;
        blogEntryList[index].date = cleanDate;
        blogEntryList[index].summary = cleanSummary;

        localStorage.setItem('blogEntries', JSON.stringify(blogEntryList));

        document.querySelector(`#entry${index+1} > h2`).innerHTML = cleanTitle;
        document.querySelector(`#entry${index+1} > h4`).innerHTML = cleanDate;
        document.querySelector(`#entry${index+1} > p`).innerHTML = cleanSummary;

        box.close();
    }
}

// Cancel editing a post and close the modal
function edit_cancel_post() {
    let box = document.getElementById('edit_post_pop');
    box.close();
}