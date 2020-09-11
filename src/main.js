import MenuView from "./view/menu.js";
import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";
import StatisticsView from "./view/statistics.js";

import {generateTask} from "./mock/task.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import {render, RenderPosition, remove} from "./utils/render.js";

const TASKS_NUM = 20;

const tasks = new Array(TASKS_NUM).fill().map(generateTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);
const filterModel = new FilterModel();

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);
const siteMenuComponent = new MenuView();

render(siteHeader, siteMenuComponent, RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMain, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMain, filterModel, tasksModel);

const handleTaskNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createTask(handleTaskNewFormClose);
      siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      break;
    case MenuItem.TASKS:
      boardPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(siteMain, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();
