// Import the provided library functions
import {
  openDatabase,
  withTransaction,
  read,
  write,
  io,
  update,
  deleteRecord,
  readonly,
  storeFile,
  getFile,
} from "./index.js";

const dbName = "CRUDAppDB";
const userStore = {
  storeName: "users",
  keyPath: "id",
  autoIncrement: false,
  indexes: [
    { name: "name", keyPath: "name", unique: false },
    { name: "email", keyPath: "email", unique: true }, // Add email index with unique constraint
    { name: "age", keyPath: "age", unique: false },
    { name: "file", keyPath: "file", unique: true },
  ],
};
const projectStore = {
  storeName: "projects",
  keyPath: "id",
  indexes: [{ name: "name", keyPath: "name", unique: false }],
};


const userSelect = document.getElementById("user-selector");
const userUl = document.getElementById("user-list");
const projectUl = document.getElementById("project-list");
const userNameInput = document.getElementById("user-name");
const userEmailInput = document.getElementById("user-email");
const userAgeInput = document.getElementById("user-age");
const projectNameInput = document.getElementById("project-name");
const addUserButton = document.getElementById("add-user");
const addProjectButton = document.getElementById("add-project");
const filterUserSelect = document.getElementById("filter-user");
const filterProjectsButton = document.getElementById("filter-projects");
const viewAllProjectsButton = document.getElementById("view-all-projects");
const viewAllUsersButton = document.getElementById("view-all-users");

(async () => {
  try {
    let db;
    db = await openDatabase({
      dbName: dbName,
      version: 1,
      storeConfigs: [userStore, projectStore],
    });

    // Populate user dropdown
    await withTransaction(
      db,
      userStore.storeName,
      readonly(async (store) => {
        const users = await read(store, "all");
        users.forEach((user) => {
          addUserToSelect(user);
        });
      })
    );

    // Populate users and projects
    await loadUsers();
    await loadProjects();

    function addUserToSelect(user) {
      const option = document.createElement("option");
      option.value = user.id;
      option.innerText = user.name;
      userSelect.appendChild(option);
      filterUserSelect.appendChild(option.cloneNode(true));
    }

    async function loadUsers() {
      userUl.innerHTML = "";
      await withTransaction(
        db,
        userStore.storeName,
        readonly(async (store) => {
          const users = await read(store, "all");
          users.forEach((user) => {
            const li = document.createElement("li");
            li.innerHTML = `${user.name} (Age: ${user.age}) <button class="delete-user" data-id="${user.id}">Delete</button>`;
            userUl.appendChild(li);
          });
        })
      );

      // Set up event listeners for user deletion
      userUl.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-user")) {
          const userId = (event.target.getAttribute("data-id"));
          await withTransaction(
            db,
            userStore.storeName,
            io(async (store) => {
              await deleteRecord(store, userId);
            })
          );
          await loadUsers();
          await loadProjects();
          userSelect.innerHTML = '<option value="">Select User</option>';
          filterUserSelect.innerHTML = '<option value="">Select User</option>';
          await withTransaction(
            db,
            userStore.storeName,
            readonly(async (store) => {
              const users = await store.getAll();
              users.readyState === "done" &&
                users.result.forEach((user) => {
                  addUserToSelect(user);
                });
            })
          );
        }
      });
    }
    
    function getUserbyId(id) {
      try {
        return new Promise(async (yes, no) => {
          if (Number.isNaN(id)) {
            id = 1
          }
          await withTransaction(
            db,
            userStore.storeName,
            readonly(async (store) => {
              const users = await store.getAll();
              users.onsuccess = (event) => {
                event.target.result.forEach(user => {
                  if (user.id == id) {
                    yes(user);
                  }
                })
              };
            })
          );
        });
      } catch (e) {
        console.error(e)
      }
    }

    async function loadProjects(filterUserId = null) {
      projectUl.innerHTML = "";
      await withTransaction(
        db,
        projectStore.storeName,
        readonly(async (store) => {
          const projects = await read(store, "all");
          projects.forEach(async (project) => {
            if (!filterUserId || project.userId === (filterUserId)) {
              let user = await getUserbyId((project.userId));
              const li = document.createElement("li");
              li.innerHTML = `${project.name} (User: ${user.name}) <button class="delete-project" data-id="${project.id}">Delete</button>`;
              projectUl.appendChild(li);
            }
          });
        })
      );

      // Set up event listeners for project deletion
      projectUl.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-project")) {
          const projectId = (event.target.getAttribute("data-id"));
          await withTransaction(
            db,
            projectStore.storeName,
            io(async (store) => {
              await deleteRecord(store, projectId);
            })
          );
          await loadProjects(filterUserId);
        }
      });
    }

    addUserButton.addEventListener("click", async () => {
      const userName = userNameInput.value;
      const userEmail = userEmailInput.value;
      const userAge = (userAgeInput.value);
      if (userName && userEmail && userAge) {
        const userId = crypto.randomUUID();
        const user = {
          id: userId,
          name: userName,
          email: userEmail,
          age: userAge,
        };
        await withTransaction(
          db,
          userStore.storeName,
          io(async (store) => {
            const res = await write(store, user, userStore.keyPath);

            console.log("addded user to db", user);
          })
        );
        userNameInput.value = "";
        userEmailInput.value = "";
        userAgeInput.value = "";
        addUserToSelect(user);
        await loadUsers();
        await loadProjects();
      }
    });

    addProjectButton.addEventListener("click", async () => {
      const projectName = projectNameInput.value;
      const selectedUserId = userSelect.value;
      if (projectName && selectedUserId) {
        const project = { name: projectName, userId: (selectedUserId) };
        await withTransaction(
          db,
          projectStore.storeName,
          io(async (store) => {
            const res = await write(store, project, projectStore.keyPath);

            console.log("addded user to db", res);
          })
        );
        await loadProjects();
        projectNameInput.value = "";
      }
    });

    filterProjectsButton.addEventListener("click", async () => {
      const selectedUserId = filterUserSelect.value;
      await loadProjects(selectedUserId);
    });

    viewAllProjectsButton.addEventListener("click", async () => {
      await loadProjects();
    });

    viewAllUsersButton.addEventListener("click", async () => {
      await loadUsers();
    });

    // Input field for profile picture
    const profilePictureInput = document.getElementById(
      "profile-picture-input"
    );
    const profilePictureDisplay = document.getElementById(
      "profile-picture-display"
    );

    // Function to update or add a user with a profile picture
    async function updateUserWithProfilePicture(
      userId,
      userName,
      userEmail,
      userAge,
      profilePicture
    ) {
      const user = {
        id: userId,
        name: userName,
        email: userEmail,
        age: userAge,
        file: profilePicture
      };
      console.log({ profilePicture })
      await withTransaction(
        db,
        userStore.storeName,
        io(async (store) => {
          await write(store, user, userStore.keyPath);
          //await storeFile(db, userStore.storeName, user);
        })
      );

      // Store the profile picture in IndexedDB
    }

    // Function to display a user's profile picture
    async function displayUserProfilePicture(userId) {
      try {
        const profilePicture = await getFile(
          db,
          userStore.storeName,
          userId
        );
        console.log("profilePictureDisplay", { profilePicture })
        profilePictureDisplay.src = URL.createObjectURL(profilePicture);
      } catch (error) {
        console.error("Error loading profile picture:", error);
        profilePictureDisplay.src = ""; // Clear the display if no profile picture is found
      }
    }

    // Event listener for the profile picture input field
    profilePictureInput.addEventListener("change", async (event) => {
      const selectedUserId = userSelect.value;
        console.log(event.target.files.length > 0)
      if (selectedUserId && event.target.files.length > 0) {
        const profilePicture = event.target.files[0];
        await updateUserWithProfilePicture(
          selectedUserId,
          userNameInput.value,
          userEmailInput.value,
          (userAgeInput.value),
          profilePicture
        );
        displayUserProfilePicture(selectedUserId);
      }
    });
  } catch (e) {
    console.error(e);
  }
})();
