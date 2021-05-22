import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core'
import { AngularFirestore } from '@angular/fire/firestore';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks : Task[] = []; // Or you could use Array<Task> = [];
  private collectionName : string = 'Task';

  constructor(
    private firestore : AngularFirestore,
  ) {}
    
  public getTasks() : Task[] {
    return this.tasks;
  }

  public addTask(value : string, date : string) {
    let task : Task;
    
    if (date != '') {
      date = date.replace(/-/g, "/");
      task = {value: value, date: new Date(date), done: false};
    } else {
      task = {value: value, done: false};
    }

    this.tasks.push(task);
    this.addToFirestore(task);
    this.setToStorage();
  }

  public updateTask(id, value : string, date : string, done : boolean) {
    let task : Task;

    if (date != '') {
      date = date.replace(/-/g, "/");
      task = {value: value, date: new Date(date), done: done};
    } else {
      task = {value: value, done: done};
    }

    this.updateOnFirestore(id, task);
  }

  public switchDone(id, task) {
    task.done = !task.done;
    this.updateOnFirestore(id, task);
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

  public addToFirestore(record : Task) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  public getFromFirestore() {
    return this.firestore.collection(this.collectionName).valueChanges({idField: 'id'});
  }

  public updateOnFirestore(recordId, record : Task) {
    this.firestore.doc(this.collectionName + '/' + recordId).update(record);
  }

  public deleteOnFirestore(recordId) {
    this.firestore.doc(this.collectionName + '/' + recordId).delete();
  }
}

interface Task { // '?' means that the value is optional
  value : String;
  date ?: Date;
  done : boolean;
}
