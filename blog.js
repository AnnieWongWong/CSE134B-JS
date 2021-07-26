window.addEventListener('DOMContentLoaded', init);

let blogEntryListTitle = [];
let blogEntryListDate = [];
let blogEntryListSummary = [];
let blogEntryCount = 0;
let index = 0;
// let confirmm = false;

function init() {
    document.getElementById('addpost').addEventListener('click', show_add_post);
    document.getElementById('post_cancel').addEventListener('click', cancel_post);
    document.getElementById('post_save').addEventListener('click', save_post);
    document.getElementById('edit_post_cancel').addEventListener('click', edit_cancel_post);
    document.getElementById('edit_post_save').addEventListener('click', edit_save_post);
    // document.getElementById('confirm_cancel').addEventListener('click', cancel_confirm);
    // document.getElementById('confirm_ok').addEventListener('click', cancel_ok);
    detect_no_entries();
}

function detect_no_entries() {
    let entryul = document.querySelector('#blogEntries');
    var hide = entryul.children.length == 0 ? 'block' : 'none';
    document.querySelector('#noEntries').style.display = hide;
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
        detect_no_entries();
    }

}

// function cancel_confirm() {
//     let con = document.getElementById('confirm_del');
//     con.close();
//     confirmm = false;
// }

// function cancel_ok() {
//     confirmm = true;
// }

function delEntry() {
    // let con = document.getElementById('confirm_del');
    // con.showModal();
    
    let con = confirm('Confirm delete entry?');

    if (con) {
        let entryID = this.parentNode;

        this.removeEventListener('click', editEntry);
        this.removeEventListener('click', delEntry);
        this.parentNode.parentNode.removeChild(entryID);
        detect_no_entries();
    }
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

        document.querySelector(`#entry${index+1} > h2`).innerHTML = cleanTitle;
        document.querySelector(`#entry${index+1} > h3`).innerHTML = cleanDate;
        document.querySelector(`#entry${index+1} > p`).innerHTML = cleanSummary;

        box.close();
    }
}

function edit_cancel_post() {
    let box;
    box = document.getElementById('edit_post_pop');
    box.close();
}