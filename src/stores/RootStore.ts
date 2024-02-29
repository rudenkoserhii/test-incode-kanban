// stores/RootStore.ts
import ToDoIssuesStore from './ToDoIssuesStore';

class RootStore {
  toDoIssuesStore = new ToDoIssuesStore(this);

  constructor() {}
}

export default RootStore;
