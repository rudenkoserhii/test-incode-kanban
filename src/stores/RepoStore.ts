// stores/repoStore.ts
import { makeAutoObservable } from 'mobx';

class RepoStore {
  repoUrl = '';

  constructor() {
    makeAutoObservable(this);
  }

  setRepoUrl(url: string) {
    this.repoUrl = url;
  }

  getRepoUrl() {
    return this.repoUrl;
  }
}

const repoStore = new RepoStore();

export default repoStore;
