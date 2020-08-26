import FilterView from "./view/filter.js";
import MenuView from "./view/menu.js";

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import BoardPresenter from "./presenter/board.js";
import {render, RenderPosition} from "./utils/render.js";

const TASKS_NUM = 20;

const tasks = new Array(TASKS_NUM).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMain);

render(siteHeader, new MenuView(), RenderPosition.BEFOREEND);
render(siteMain, new FilterView(filters), RenderPosition.BEFOREEND);
boardPresenter.init(tasks);
