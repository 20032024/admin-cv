import { Component } from '@angular/core';
import { LanguagesService } from '../services/languages-service/languages.service';
import { Languages } from '../models/languages/languages.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-languages',
  templateUrl: './admin-languages.component.html',
  styleUrls: ['./admin-languages.component.css']
})
export class AdminLanguagesComponent {
  itemCount: number = 0;
  btnTxt: string = 'Agregar';
  languages: Languages[] = [];
  myLanguage: Languages = new Languages();
  selectedLanguageId: string | null = null;

  constructor(public languagesService: LanguagesService) {
    this.languagesService.getLanguages().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        }))
      )
    ).subscribe((data: any[]) => {
      this.languages = data;
    });
  }

  AgregarLanguages() {
    if (this.selectedLanguageId) {
      
      this.languagesService.updateLanguage(this.selectedLanguageId, this.myLanguage).then(() => {
        this.resetForm();
        console.log('Updated successfully!');
      });
    } else {

      this.languagesService.createLanguage(this.myLanguage).then(() => {
        this.resetForm();
        console.log('Created successfully!');
      });
    }
  }

deleteLanguages(id?: string) {
  const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este lenguaje?');
  if (confirmacion && id) {
    this.languagesService.deleteLanguage(id).then(() => {
      console.log('Deleted language successfully!');
    }).catch((error) => {
      console.error('Error deleting language:', error);
    });
  } else {
    console.log('Deletion cancelled');
  }
}

  editLanguage(language: any) {
    this.myLanguage = { name: language.name, level: language.level };
    this.selectedLanguageId = language.id;
    this.btnTxt = 'Actualizar';
  }

  resetForm() {
    this.myLanguage = new Languages();
    this.selectedLanguageId = null;
    this.btnTxt = 'Agregar';
  }
}
