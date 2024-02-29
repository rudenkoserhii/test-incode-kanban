import { makeAutoObservable } from 'mobx';
import RootStore from './RootStore';

class BoardsStore {
  pageToDo = 1;
  pageInProgress = 1;
  pageDone = 1;
  removeButtonToDo = false;
  removeButtonInProgress = false;
  removeButtonDone = false;
  isLoadingToDo = false;
  isLoadingInProgress = false;
  isLoadingDone = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPage(title: string) {
    if (title === 'ToDo') {
      this.pageToDo += 1;
    } else if (title === 'In Progress') {
      this.pageInProgress += 1;
    } else if (title === 'Done') {
      this.pageDone += 1;
    }
  }

  setRemoveButton(title: string, value: boolean) {
    if (title === 'ToDo') {
      this.removeButtonToDo = value;
    } else if (title === 'In Progress') {
      this.removeButtonInProgress = value;
    } else if (title === 'Done') {
      this.removeButtonDone = value;
    }
  }

  setIsLoading(title: string, value: boolean) {
    if (title === 'ToDo') {
      this.isLoadingToDo = value;
    } else if (title === 'In Progress') {
      this.isLoadingInProgress = value;
    } else if (title === 'Done') {
      this.isLoadingDone = value;
    }
  }
}

export default new BoardsStore();
