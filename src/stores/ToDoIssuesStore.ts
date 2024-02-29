import { makeAutoObservable } from 'mobx';

class ToDoIssuesStore {
  value = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Add methods to modify state as needed
}

export default new ToDoIssuesStore();
