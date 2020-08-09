import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createTaskEditTemplate} from "./view/edit-task.js";
import {createTaskTemplate} from "./view/task.js";
import {createBoardTemplate} from "./view/board.js";
import {createLoadButton} from "./view/load-more.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

const TASKS_NUM = 20;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASKS_NUM).fill().map(generateTask);
const filters = generateFilter(tasks);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

render(siteHeader, createMenuTemplate(), `beforeend`);
render(siteMain, createFilterTemplate(filters), `beforeend`);
render(siteMain, createBoardTemplate(), `beforeend`);

const siteBoard = siteMain.querySelector(`.board`);
const siteBoardList = siteMain.querySelector(`.board__tasks`);

render(siteBoardList, createTaskEditTemplate(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(siteBoardList, createTaskTemplate(tasks[i]), `beforeend`);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  render(siteBoard, createLoadButton(), `beforeend`);

  const loadMoreButton = siteBoard.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(siteBoardList, createTaskTemplate(task), `beforeend`));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
