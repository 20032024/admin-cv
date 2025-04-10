import { Component } from '@angular/core';
import { EducationService } from '../services/education-service/education.service';
import { Education } from '../models/education/education.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-education',
  templateUrl: './admin-education.component.html',
  styleUrls: ['./admin-education.component.css']
})
export class AdminEducationComponent {
  itemCount: number = 0;
  buttonText: string = 'Agregar';
  education: Education[] = [];
  myEducation: Education = new Education();
  selectedEducationId: string | null = null;

  constructor(public educationService: EducationService) {
    this.educationService.getEducation().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any[]) => {
      this.education = data;
    });
  }

  AgregarEducation() {
    if (this.selectedEducationId) {
      this.educationService.updateEducation(this.selectedEducationId, this.myEducation).then(() => {
        this.resetForm();
        console.log('Updated education successfully!');
      });
    } else {
      this.educationService.createEducation(this.myEducation).then(() => {
        this.resetForm();
        console.log('Created new education successfully!');
      });
    }
  }

deleteEducation(id?: string) {
  // Mostrar la ventana de confirmación antes de proceder con la eliminación
  const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro de educación?');

  // Si el usuario confirma la eliminación
  if (confirmacion && id) {
    this.educationService.deleteEducation(id).then(() => {
      console.log('Deleted education successfully!');
      // Opcionalmente, puedes actualizar el estado o la vista después de eliminar
      // this.loadEducation(); // o alguna otra acción para actualizar los datos mostrados
    }).catch((error) => {
      console.error('Error deleting education:', error);
      // Manejar cualquier error que ocurra durante la eliminación
    });
  } else {
    // Si el usuario no confirma, simplemente no hacer nada
    console.log('Deletion cancelled');
  }
}







  editEducation(educacion: any) {
    this.myEducation = { carrera: educacion.carrera, educationHome: educacion.educationHome, startDate: educacion.startDate, endDate: educacion.endDate };
    this.selectedEducationId = educacion.id;
    this.buttonText = 'Update';
  }

  resetForm() {
    this.myEducation = new Education();
    this.selectedEducationId = null;
    this.buttonText = 'Agregar';
  }
}

