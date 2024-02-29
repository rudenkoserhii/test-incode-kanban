import { makeAutoObservable } from 'mobx';

class ChangesStore {
  value = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Add methods to modify state as needed
}

export default new ChangesStore();
