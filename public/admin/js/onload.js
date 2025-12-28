import scripts from "./scripts.js";

document.addEventListener("DOMContentLoaded", async () => {
  /*
  
  if (!(await scripts.routes.userAdmin())) {
    window.location.href = "../../index.html";
  }

  */

  scripts.navbar.fixNav();
});

export default {};
