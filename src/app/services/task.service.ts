import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks : Task[] = []; // Or you could use Array<Task> = [];

  constructor() { }
    
  public getTasks() : Task[] {
    return this.tasks;
  }

  public addTask(value : string, date : string) {
    date = date.replace("-", "/");
    let task : Task = {value: value, date: new Date(date), done: false};
    this.tasks.push(task);
    console.log(this.tasks);
  }

  public delTask(index : number) {
    this.tasks.splice(index, 1);
  }

  public updateTask(index : number, value : string, date : string) {
    let task : Task = this.tasks[index];
    task.value = value;
    task.date = new Date(date.replace("-", "/"));
    this.tasks.splice(index, 1, task);
  }
}

interface Task {
  value : String;
  date : Date;
  done ?: boolean; // '?' means that the value is optional
}
