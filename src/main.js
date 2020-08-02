import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createTaskEditTemplate} from "./view/edit-task.js";
import {createTaskTemplate} from "./view/task.js";
import {createBoardTemplate} from "./view/board.js";
import {createLoadButton} from "./view/load-more.js";

const TASKS_NUM = 3;
const siteMain = document.querySelector(`.main`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = siteMain.querySelector(`.main__control`);

render(siteHeader, createMenuTemplate(), `beforeend`);
render(siteMain, createFilterTemplate(), `beforeend`);
render(siteMain, createBoardTemplate(), `beforeend`);

const siteBoard = siteMain.querySelector(`.board`);
const siteBoardList = siteMain.querySelector(`.board__tasks`);

render(siteBoardList, createTaskEditTemplate(), `beforeend`);
for (let i = 0; i < TASKS_NUM; i++) {
  render(siteBoardList, createTaskTemplate(), `beforeend`);
}

render(siteBoard, createLoadButton(), `beforeend`);
