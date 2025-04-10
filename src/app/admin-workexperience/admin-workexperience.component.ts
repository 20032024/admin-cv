import { Component } from '@angular/core';
import { WorkExperienceService } from '../services/work-experience-service/work-experience.service';
import { WorkExperience } from '../models/work-experience/work-experience.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-workexperience',
  templateUrl: './admin-workexperience.component.html',
  styleUrls: ['./admin-workexperience.component.css']
})
export class AdminWorkexperienceComponent {
  itemCount: number = 0;
  buttonText: string = 'Agregar';
  goalText: string = '';
  workExperience: WorkExperience[] = [];
  myWorkExperience: WorkExperience = new WorkExperience();
  selectedWorkExperienceId: string | null = null;

  constructor(public workExperienceService: WorkExperienceService) {
    console.log(this.workExperienceService);
    this.workExperienceService.getWorkExperience().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any[]) => {
      this.workExperience = data;
      console.log(this.workExperience);
    });
  }

  AgregarJob() {
    if (this.selectedWorkExperienceId) {
    
      this.workExperienceService.updateWorkExperience(this.selectedWorkExperienceId, this.myWorkExperience).then(() => {
        this.resetForm();
        console.log('Updated successfully!');
      });
    } else {
   
      this.workExperienceService.createWorkExperience(this.myWorkExperience).then(() => {
        this.resetForm();
        console.log('Created new work experience successfully!');
      });
    }
  }

deleteJob(id?: string) {
  const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta Work Experience?');
  if (confirmacion && id) {
    this.workExperienceService.deleteWorkExperience(id).then(() => {
      console.log('Deleted successfully!');
    }).catch((error) => {
      console.error('Error deleting job:', error);
    });
  } else {
    console.log('Deletion cancelled');
  }
}

  editJob(job: any) {
    this.myWorkExperience = { accomplishment: job.accomplishment, company: job.company,
                              endDate: job.endDate, location: job.location, position: job.position, startDate: job.startDate };
    this.selectedWorkExperienceId = job.id;
    this.buttonText = 'Actualizar';
  }

  resetForm() {
    this.myWorkExperience = new WorkExperience();
    this.selectedWorkExperienceId = null;
    this.buttonText = 'Agregar';
  }
}
