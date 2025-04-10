import { Component } from '@angular/core';
import { SkillsService } from '../services/skills-service/skills.service';
import { Skills } from '../models/skills/skills.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrls: ['./admin-skills.component.css']
})
export class AdminSkillsComponent {
  itemCount: number = 0;
  buttonText: string = 'Agregar';
  skills: Skills[] = [];
  mySkill: Skills = new Skills();
  selectedSkillId: string | null = null;

  constructor(public skillsService: SkillsService) {
    console.log(this.skillsService);
    this.skillsService.getSkills().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any[]) => {
      this.skills = data;
      console.log(this.skills);
    });
  }

  AgregarSkill() {
    if (this.selectedSkillId) {
      this.skillsService.updateSkill(this.selectedSkillId, this.mySkill).then(() => {
        this.resetForm();
        console.log('Updated skill successfully!');
      });
    } else {
      // Si estamos agregando una nueva habilidad
      this.skillsService.createSkill(this.mySkill).then(() => {
        this.resetForm();
        console.log('Created new skill successfully!');
      });
    }
  }

deleteSkill(id?: string) {
  const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta skill?');
  if (confirmacion && id) {
    this.skillsService.deleteSkill(id).then(() => {
      console.log('Deleted skill successfully!');
    }).catch((error) => {
      console.error('Error deleting skill:', error);
    });
  } else {
    console.log('Deletion cancelled');
  }
}

  editSkill(skill: any) {
    this.mySkill = { skills: skill.skills }; 
    this.selectedSkillId = skill.id;
    this.buttonText = 'Actualizar';
  }

  resetForm() {
    this.mySkill = new Skills();
    this.selectedSkillId = null;
    this.buttonText = 'Agregar';
  }
}
