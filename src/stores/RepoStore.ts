import { makeAutoObservable } from 'mobx';

class RepoStore {
  value = '';

  constructor() {
    makeAutoObservable(this);
  }

  // Add methods to modify state as needed
}

export default new RepoStore();
