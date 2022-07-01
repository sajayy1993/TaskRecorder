//select elements in Dom

const form = document.querySelector("#itemform");
const inputItem = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item");
const alertdiv = document.querySelector("#message");

//create on empty items list

let todoitems = [];

const alertMessage = function (message, className) {

    alertdiv.innerHTML = message;
    alertdiv.classList.add(className, "show");
    alertdiv.classList.remove("hide");
    setTimeout(()=>{
        alertdiv.classList.add("hide");
    alertdiv.classList.remove("show");
    }, 3000);

    return;

};
//filter Items

const getItemsFilter = function (type) {
    let filteritem = [];
    switch (type) {
        case "todo":
            filteritem = todoitems.filter((item) => !item.isDone);
            break;
        case "done":
            filteritem = todoitems.filter((item) => item.isDone);
            break;
        default:
            filteritem = todoitems;
    }
    getList(filteritem);
}
//delete item

const removeItem = function (item) {
    const removeIndex = todoitems.indexOf(item);
    todoitems.splice(removeIndex, 1);
}

//update item

const updateItem = function (currentItemIndex, value) {
    const newItem = todoitems[currentItemIndex];
    newItem.name = value;
    todoitems.splice(currentItemIndex, 1, newItem);
    setLocalStorage(todoitems);
}

const handleItem = function (itemData) {
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        if (item.querySelector(".title").getAttribute("data-time") == itemData.addedAt) {
            // done

            item.querySelector("[data-done]").addEventListener("click", function (e) {
                e.preventDefault();
                const itemIndex = todoitems.indexOf(itemData);
                const currentItem = todoitems[itemIndex];
                const currentClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";


                currentItem.isDone = currentItem.isDone ? false : true;
                todoitems.splice(itemIndex, 1, currentItem);
                setLocalStorage(todoitems);
                const iconClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                this.firstElementChild.classList.replace(currentClass, iconClass);
                const filterValue = document.querySelector('#tabValue').value;
                getItemsFilter(filterValue);
            });
            //Edit
            item.querySelector("[data-edit]").addEventListener("click", function (e) {
                e.preventDefault();
                inputItem.value = itemData.name;
                document.querySelector('#objIndex').value = todoitems.indexOf(itemData);

            });

            //delete
            item.querySelector("[data-delete]").addEventListener("click", function (e) {
                e.preventDefault();
                if (confirm("Are you sure want to delete this item from the list ?")) {
                    itemList.removeChild(item);
                    removeItem(item)
                    setLocalStorage(todoitems);
                alertMessage("Task has been deleted.", "alert-success");

                    return todoitems.filter((item) => item != itemData);
                }
            });
        }
    });
};

const getList = function (todoItems) {
    itemList.innerHTML = "";
    if (todoItems.length > 0) {
        todoItems.forEach((item) => {
            const iconClass = item.isDone ? "bi-check-circle-fill" : "bi-check-circle";
            itemList.insertAdjacentHTML("beforeend", ` <li class="list-group-item d-flex justify-content-between align-item-center">
            <span class="title" data-time="${item.addedAt}">${item.name}</span>
            <span>
                <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
                <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
                <a href="#" data-delete><i class="bi bi-trash red"></i></a>
            </span>
        </li>`);
            handleItem(item);
        });
    } else {
        itemList.insertAdjacentHTML("beforeend", ` <li class="list-group-item d-flex justify-content-between align-item-center">
           <span> No Record Found </span>
        </li>`);
    }
}

// get LocalStorge from the page

const getLocalStorage = function () {
    const todoStorage = localStorage.getItem("todoItems");
    if (todoStorage === "undefined" || todoStorage === null) {
        todoitems = [];

    } else {
        todoitems = JSON.parse(todoStorage);

    }
    // console.log('items', todoitems);
    getList(todoitems);
};


//set in local Storage

const setLocalStorage = function (todoitems) {
    localStorage.setItem("todoItems", JSON.stringify(todoitems));
};

document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = inputItem.value.trim();
        if (itemName.length === 0) {
            alertMessage("Please enter the task first ", "alert-danger");
        } else {

            const currentItemIndex = document.querySelector("#objIndex").value;
            if (currentItemIndex) {
                //update
                updateItem(currentItemIndex, itemName);
                document.querySelector("#objIndex").value = "";
                alertMessage("Task has been updated.", "alert-success");



            } else {
                const itemObj = {
                    name: itemName,
                    isDone: false,
                    addedAt: new Date().getTime(),
                };



                todoitems.push(itemObj);
                setLocalStorage(todoitems);
                alertMessage("New task has been added.", "alert-success");
            }
            getList(todoitems);
        }
        inputItem.value = "";
    });

    //filter tabs

    filters.forEach((tab) => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const tabType = this.getAttribute("data-type");
            document.querySelectorAll('.nav-link').forEach((nav) => {
                nav.classList.remove("active");

            });
            this.firstElementChild.classList.add("active");
            getItemsFilter(tabType);
            document.querySelector('#tabValue').value = tabType;
        })
    })



    getLocalStorage();
});