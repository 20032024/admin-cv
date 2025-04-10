import { Component } from '@angular/core';
import { CertificatesService } from '../services/certificates-service/certificates.service';
import { Certificates } from '../models/certificates/certificates.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-certificates',
  templateUrl: './admin-certificates.component.html',
  styleUrls: ['./admin-certificates.component.css']
})
export class AdminCertificatesComponent {
  itemCount: number = 0;
  btnTxt: string = 'Agregar';
  certificates: Certificates[] = [];
  myCertificates: Certificates = new Certificates();
  selectedCertificateId: string | null = null;

  constructor(public certificatesService: CertificatesService) {
    console.log(this.certificatesService);
    this.certificatesService.getCertificates().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any[]) => {
      this.certificates = data;
      console.log(this.certificates);
    });
  }

  AgregarCertificates() {
    if (this.selectedCertificateId) {
      this.certificatesService.updateCertificates(this.selectedCertificateId, this.myCertificates).then(() => {
        this.resetForm();
        console.log('Updated certificate successfully!');
      });
    } else {
      this.certificatesService.createCertificates(this.myCertificates).then(() => {
        this.resetForm();
        console.log('Created new certificate successfully!');
      });
    }
  }

    deleteCertificates(id?: string) {
  // Verificar si el id está presente antes de continuar
  if (!id) {
    console.log('No ID provided for deletion');
    return;
  }

  // Mostrar la ventana de confirmación
  const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro?');

  // Si el usuario confirma la eliminación
  if (confirmacion) {
    this.certificatesService.deleteCertificates(id).then(() => {
      console.log('Deleted certificate successfully!');
      // Opcionalmente, puedes actualizar el estado o la vista después de eliminar
      // this.loadCertificates(); // o alguna otra acción para actualizar los datos mostrados
    }).catch((error) => {
      console.error('Error deleting certificate:', error);
      // Manejar cualquier error que ocurra durante la eliminación
    });
  } else {
    // Si el usuario no confirma, simplemente no hacer nada
    console.log('Deletion cancelled');
  }
}

  editCertificates(certificates: any) {
    this.myCertificates = {
      name: certificates.name,
      year: certificates.year,
    };
    this.selectedCertificateId = certificates.id;
    this.btnTxt = 'Update';
  }

  resetForm() {
    this.myCertificates = new Certificates();
    this.selectedCertificateId = null;
    this.btnTxt = 'Agregar';
  }
}
