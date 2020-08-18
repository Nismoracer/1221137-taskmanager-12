import BoardView from "./view/board.js";
import LoadMoreButtonView from "./view/load-more.js";
import TaskListView from "./view/task-list.js";
import SortView from "./view/sort.js";
import FilterView from "./view/filter.js";
import MenuView from "./view/menu.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/edit-task.js";
import NoTaskView from "./view/no-task.js";

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition} from "./util.js";

const TASKS_NUM = 20;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASKS_NUM).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const tasksList = new TaskListView();
  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), tasksList.getElement(), RenderPosition.BEFOREEND);
  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTaskView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent.getElement(), new SortView().getElement(), RenderPosition.AFTERBEGIN);

  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(tasksList.getElement(), boardTask));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMore = new LoadMoreButtonView();
    render(boardComponent.getElement(), loadMore.getElement(), RenderPosition.BEFOREEND);

    loadMore.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(tasksList.getElement(), boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMore.getElement().remove();
        loadMore.removeElement();
      }
    });
  }
};

render(siteHeader, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(siteMain, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
renderBoard(siteMain, tasks);
