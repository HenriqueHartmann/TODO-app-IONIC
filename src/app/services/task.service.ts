import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core'
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks : Task[] = []; // Or you could use Array<Task> = [];

  constructor() {}
    
  public getTasks() : Task[] {
    return this.tasks;
  }

  public addTask(value : string, date : string) {
    date = date.replace("-", "/");
    let task : Task = {value: value, date: new Date(date), done: false};
    this.tasks.push(task);
    this.setToStorage();
  }

  public delTask(index : number) {
    this.tasks.splice(index, 1);
    this.setToStorage();
  }

  public updateTask(index : number, value : string, date : string) {
    let task : Task = this.tasks[index];
    task.value = value;
    task.date = new Date(date.replace("-", "/"));
    this.tasks.splice(index, 1, task);
    this.setToStorage();
  }

  public switchDone(index : number) {
    let task : Task = this.tasks[index];
    if (task.done == false) {
      this.tasks[index].done = true
    }
    else {
      this.tasks[index].done = false
    }
    this.setToStorage();
  }

  public async setToStorage() {
    await Storage.set({
      key: 'tasks',
      value: JSON.stringify(this.tasks)
    });
  }

  public async getFromStorage() {
    const resp = await Storage.get({ key: 'tasks' });
    let tempTasks : Array<any> = JSON.parse(resp.value);
    console.log(tempTasks);
    if (tempTasks != null) {
      for (let t of tempTasks) {
        if (t.date != null) {
          t.date = t.date.substring(0, 10);
          t.date = t.date.replace(/-/g, "/");
          console.log(t);
        }
        else {
          t.date = "";
        }
        let task : Task = { value: t.value, date: new Date(t.date), done: t.done };
        this.tasks.push(task);
      }
    }
    return tempTasks;
  }
}

interface Task {
  value : String;
  date : Date;
  done ?: boolean; // '?' means that the value is optional
}
