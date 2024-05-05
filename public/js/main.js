// set up some const to set up DOM elements
const deleteBtn = document.querySelectorAll(".fa-trash");
const item = document.querySelectorAll(".item span");
const itemCompleted = document.querySelectorAll(".item span.completed");
// add event listener to evry delete buton
Array.from(deleteBtn).forEach(element => {
  element.addEventListener("click", deleteItem);
});
// add event listener to evry todo-item
Array.from(item).forEach(element => {
  element.addEventListener("click", markComplete);
});
// add event listener to evry completed item
Array.from(itemCompleted).forEach(element => {
  element.addEventListener("click", markUnComplete);
});
// delets 1 item clicked on from database.
async function deleteItem() {
  // grabbing the todo item
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deleteItem", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
