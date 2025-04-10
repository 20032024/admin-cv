import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { Education } from '../../models/education/education.model';


@Injectable({
  providedIn: 'root'
})
export class EducationService {
  
  private dbPath = '/education-service';
  educationRef: AngularFirestoreCollection<Education>;

  constructor(private db: AngularFirestore) {
    this.educationRef = db.collection(this.dbPath);

 }
 
 getEducation(): AngularFirestoreCollection<Education> {
   return this.educationRef;
 }
 
 createEducation(myEducacion: Education): any {
   return this.educationRef.add({ ...myEducacion });
 }

 deleteEducation(id? : string): Promise<void> { 
   return this.educationRef.doc(id).delete();
 }
 updateEducation(id: string, educationData: Education): Promise<void> {
    return this.educationRef.doc(id).update({ ...educationData });
 }
}
