import { Component } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { TaskService } from './../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  type : string = "pending"

  constructor(public alertController : AlertController, 
              public taskService : TaskService,
              public toastController : ToastController,
              public popoverController : PopoverController) {}

  async presentAlertPromptAdd() {
    let now : any = new Date;
    let minDate : string = now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();
    let maxDate : string = (now.getFullYear() + 5)+"-"+now.getMonth()+"-"+now.getDate();

    const alert = await this.alertController.create({
      header: 'Adicionar Tarefa',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Tarefa'
        },
        {
          name: 'date',
          type: 'date',
          min: minDate,
          max: maxDate
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Salvar',
          handler: (alertData) => {
            if (alertData.task != "") {
              this.taskService.addTask(alertData.task, alertData.date);
            }
            else {
              this.presentToast();
              this.presentAlertPromptAdd();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  
  async presentAlertPromptDelete(index : number) {
    const alert = await this.alertController.create({
      header: 'Remover Tarefa',
      message: 'Deseja realmente remover a tarefa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Excluir',
          handler: () => this.taskService.delTask(index)
        }
      ]
    });

    await alert.present();
  }

  async presentAlertPromptUpdate(index : number, task : any) {
    let now : any = new Date;
    let minDate : string = now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();
    let maxDate : string = (now.getFullYear() + 5)+"-"+now.getMonth()+"-"+now.getDate();
    let formattedDate : string = task.date.toLocaleDateString().split("/").reverse().join("-");

    const alert = await this.alertController.create({
      header: 'Atualizar Tarefa',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Tarefa',
          value: task.value
        },
        {
          name: 'date',
          type: 'date',
          min: minDate,
          max: maxDate,
          value: formattedDate
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Salvar',
          handler: (alertData) => {
            if (alertData.task != "") {
              this.taskService.updateTask(index, alertData.task, alertData.date);
            }
            else {
              this.presentToast();
              this.presentAlertPromptUpdate(index, alertData);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Preencha a tarefa!",
      duration: 2500,
      cssClass: 'ion-text-center'
    });
    toast.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
