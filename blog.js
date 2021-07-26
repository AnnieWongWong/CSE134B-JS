window.addEventListener('DOMContentLoaded', init);

let blogEntryList = [];
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
    readFromLocalStorage();
    detect_no_entries();
}

function readFromLocalStorage() {
    let savedList = JSON.parse(localStorage.getItem("blogEntries") || "[]");

    if (savedList) {
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

            document.getElementById('blogEntries').appendChild(blogItem);
        }
    }
}

function detect_no_entries() {
    let entryul = document.querySelector('#blogEntries');
    var hide = entryul.children.length == 0 ? 'block' : 'none';
    document.querySelector('#noEntries').style.display = hide;
}

function show_add_post() {
    let box = document.getElementById('post_pop');
    box.showModal();
}

function cancel_post() {
    let box = document.getElementById('post_pop');
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
        
        blogEntryCount += 1;
        blogEntryList.push({id: `entry${blogEntryCount}`, title: cleanTitle, date: cleanDate, summary:cleanSummary});
        
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
        
        localStorage.setItem('blogEntries', JSON.stringify(blogEntryList));
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
        let entryID = this.parentNode.id;
        let entryNode = this.parentNode;

        for (let i = 0; i < blogEntryList.length; i++) {
            if (blogEntryList[i].id == entryID) {
                blogEntryList.splice(i, 1);
            }
        }

        localStorage.setItem('blogEntries', JSON.stringify(blogEntryList));

        this.removeEventListener('click', editEntry);
        this.removeEventListener('click', delEntry);
        this.parentNode.parentNode.removeChild(entryNode);
        detect_no_entries();
    }
}

function editEntry() {
    let entryID = this.parentNode.id;
    index = parseInt(entryID.substr(5,1))-1;
    document.getElementById('edit_postTitle').value = blogEntryList[index].title;
    document.getElementById('edit_year').value = blogEntryList[index].date;
    document.getElementById('edit_summary').value = blogEntryList[index].summary;

    let box = document.getElementById('edit_post_pop');
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

function edit_cancel_post() {
    let box = document.getElementById('edit_post_pop');
    box.close();
}