// Day 5 solutions -- component thinking.

function greetingHtml(name) {
    return `<h1>Hello, ${name}!</h1>`;
}

function todoItemHtml(todo) {
    return todo.done ? `<li class="done">${todo.text}</li>` : `<li>${todo.text}</li>`;
}

function todoListHtml(todos) {
    return `<ul>${todos.map(todoItemHtml).join("")}</ul>`;
}

function counterHtml(count) {
    return `<p>Count: ${count}</p><button>+1</button>`;
}

module.exports = { greetingHtml, todoItemHtml, todoListHtml, counterHtml };
