// stores/ToDoIssuesStore.ts
import { makeAutoObservable } from 'mobx';

class ToDoIssuesStore {
  value = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setToDoIssues(value) {
    this.value = value;
  }
}

export default ToDoIssuesStore;
