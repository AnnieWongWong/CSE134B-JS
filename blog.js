window.addEventListener('DOMContentLoaded', init);

let blogEntryListTitle = [];
let blogEntryListDate = [];
let blogEntryListSummary = [];
let blogEntryCount = 0;
let index = 0;

function init() {
    document.getElementById('addpost').addEventListener('click', show_add_post);
    document.getElementById('post_cancel').addEventListener('click', cancel_post);
    document.getElementById('post_save').addEventListener('click', save_post);
    document.getElementById('edit_post_cancel').addEventListener('click', edit_cancel_post);
    document.getElementById('edit_post_save').addEventListener('click', edit_save_post);
}


function show_add_post() {
    let box;
    box = document.getElementById('post_pop');
    box.showModal();
}

function cancel_post() {
    let box;
    box = document.getElementById('post_pop');
    box.close();
}

function save_post() {
    let title = document.getElementById('postTitle').value;
    let date = document.getElementById('year').value;
    let summary = document.getElementById('summary').value;
    let box = document.getElementById('post_pop');

    if (!title || !date || !summary) {
        alert("Missing title, date, or summary fields");
    }
    else {
        setTimeout(function cb() {
                document.getElementById('postTitle').value = "";
                document.getElementById('year').value = "";
                document.getElementById('summary').value = "";
        }, 0);
        let cleanTitle = DOMPurify.sanitize( title , {USE_PROFILES: {html: true}} ); 
        let cleanDate = DOMPurify.sanitize( date , {USE_PROFILES: {html: true}} );
        let cleanSummary = DOMPurify.sanitize( summary , {USE_PROFILES: {html: true}} );
        
        blogEntryListTitle.push(cleanTitle);
        blogEntryListDate.push(cleanDate);
        blogEntryListSummary.push(cleanSummary);
        blogEntryCount += 1;

        let blogItem = document.createElement('li');
        blogItem.id = `entry${blogEntryCount}`;

        let titleText = document.createElement('h2');
        titleText.textContent = cleanTitle;
        titleText.id = `title${blogEntryCount}`;
        blogItem.appendChild(titleText);

        let dateText = document.createElement('h3');
        dateText.textContent = cleanDate;
        dateText.id = `date${blogEntryCount}`;
        blogItem.appendChild(dateText);

        let summaryText = document.createElement('p');
        summaryText.textContent = cleanTitle;
        summaryText.id = `summary${blogEntryCount}`;
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
        
        document.getElementById('blogEntries').appendChild(blogItem);

        box.close();
    
    }

}

function delEntry() {
    let entryID = this.parentNode;

    this.removeEventListener('click', editEntry);
    this.removeEventListener('click', delEntry);
    this.parentNode.parentNode.removeChild(entryID);
}

function editEntry() {
    let entryID = this.parentNode.id;
    index = parseInt(entryID.substr(5,1))-1;
    document.getElementById('edit_postTitle').value = blogEntryListTitle[index];
    document.getElementById('edit_year').value = blogEntryListDate[index];
    document.getElementById('edit_summary').value = blogEntryListSummary[index];

    let box;
    box = document.getElementById('edit_post_pop');
    box.showModal();
    
}

// fix later
function edit_save_post() {
    let title = document.getElementById('edit_postTitle').value;
    let date = document.getElementById('edit_year').value;
    let summary = document.getElementById('edit_summary').value;
    let box = document.getElementById('edit_post_pop');

    if (!title || !date || !summary) {
        alert("Missing title, date, or summary fields");
    }
    else {
        let cleanTitle = DOMPurify.sanitize( title , {USE_PROFILES: {html: true}} ); 
        let cleanDate = DOMPurify.sanitize( date , {USE_PROFILES: {html: true}} );
        let cleanSummary = DOMPurify.sanitize( summary , {USE_PROFILES: {html: true}} );
        
        blogEntryListTitle[index] = cleanTitle;
        blogEntryListDate[index] = cleanDate;
        blogEntryListSummary[index] = cleanSummary;

        document.querySelector(`#entry${index} > h2`).innerHTML = `Prompt result : User didn't enter anything`;
        document.querySelector(`#entry${index} > h3`).innerHTML = `Prompt result : User didn't enter anything`;
        document.querySelector(`#entry${index} > p`).innerHTML = `Prompt result : User didn't enter anything`;
        // document.getElementById("title " + index).innerHTML  = cleanTitle;
        // document.getElementById("date " + index).innerHTML  = cleanDate;
        // document.getElementById("summary " + index).innerHTML  = cleanSummary;
        box.close();
       
    }
}

function edit_cancel_post() {
    let box;
    box = document.getElementById('edit_post_pop');
    box.close();
}