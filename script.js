
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]"); 
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
  alert("You are now Registered");
}

function getPosts() {
  return JSON.parse(localStorage.getItem("posts") || "[]");
}
function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
  alert("Post Published");
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}
function setCurrentUser(user) {
  if (user) localStorage.setItem("currentUser", JSON.stringify(user));
  else localStorage.removeItem("currentUser");
  alert("You are Logged in!!");
}

function updateNav() {
  const nav = document.getElementById("navLinks");
  if (!nav) return;
  const user = getCurrentUser();
  if (user) {
    nav.innerHTML = `
      <span>Hello, ${user.username}</span>
      <a href="index.html">Home</a>
      <a href="create.html">New Post</a>
      <a href="#" onclick="logout()">Logout</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;

  }
}
function logout() {
  setCurrentUser(null);
  window.location.href = "index.html";
  alert("You are logged out");
}

function renderPosts() {
  const postsDiv = document.getElementById("posts");
  if (!postsDiv) return;
  const posts = getPosts().reverse();
  postsDiv.innerHTML = posts.length
    ? posts.map(p => `
        <div class="post">
          <h3>${p.title}</h3>
          <p class="meta">by ${p.author} on ${p.date}</p>
          <p>${p.body}</p>
        </div>
      `).join("")
    : "<p>No posts yet.</p>";
}

const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value;
    let users = getUsers();
    if (users.find(u => u.username === username)) {
      document.getElementById("regMsg").textContent = "Username already taken.";
      return;
    }
    users.push({ username, password });
    saveUsers(users);
    document.getElementById("regMsg").textContent = "Registered! You can now login.";
    regForm.reset();
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;
    const user = getUsers().find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      window.location.href = "index.html";
    } else {
      document.getElementById("loginMsg").textContent = "Invalid username or password.";
    }
  });
}

const postForm = document.getElementById("postForm");
if (postForm) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  postForm.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("postTitle").value.trim();
    const body = document.getElementById("postBody").value.trim();
    let posts = getPosts();
    posts.push({
      title,
      body,
      author: user.username,
      date: new Date().toLocaleString()
    });
    savePosts(posts);
    document.getElementById("postMsg").textContent = "Post published!";
    postForm.reset();
  });
}

updateNav();
renderPosts();
