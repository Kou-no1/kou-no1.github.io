(() => {
  "use strict";
  const imageDialog = document.querySelector("#image-dialog");
  let opener = null;
  function openDialog(dialog, trigger) {
    opener = trigger;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  {
    const dialog = imageDialog;
    dialog.addEventListener("close", () => opener?.focus());
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    });
    for (const button of dialog.querySelectorAll("[data-close]"))
      button.addEventListener("click", () => dialog.close());
  }
  for (const trigger of document.querySelectorAll("[data-image]")) {
    trigger.addEventListener("click", () => {
      document.querySelector("#expanded-image").src = trigger.dataset.image;
      document.querySelector("#expanded-image").alt = trigger.dataset.alt;
      document.querySelector("#expanded-caption").textContent =
        trigger.dataset.alt;
      openDialog(imageDialog, trigger);
    });
  }
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !selected;
    }
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let target;
      if (event.key === "ArrowRight") target = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft")
        target = tabs[(index + tabs.length - 1) % tabs.length];
      if (event.key === "Home") target = tabs[0];
      if (event.key === "End") target = tabs.at(-1);
      if (target) {
        event.preventDefault();
        selectTab(target, true);
      }
    });
  });
})();
