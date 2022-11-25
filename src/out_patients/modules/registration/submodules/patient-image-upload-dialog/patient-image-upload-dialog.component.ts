import { Component, Inject, Injectable, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject } from "rxjs";
import { HttpService } from "@shared/services/http.service";

@Injectable({
  providedIn: "root",
})

@Component({
  selector: 'out-patients-patient-image-upload-dialog',
  templateUrl: './patient-image-upload-dialog.component.html',
  styleUrls: ['./patient-image-upload-dialog.component.scss']
})

export class PatientImageUploadDialogComponent implements OnInit {
  
  public selecetdFile : any;
  public imagePreview: any;
  public submitClicked:boolean=true;
  public selectedFilename!:string;
  private readonly _destroying$ = new Subject<void>();
  saveApimessage!: string;
  base64textString:any = [];
  identityImage:any;

  constructor(public dialogRef: MatDialogRef<PatientImageUploadDialogComponent>,
    private http: HttpService,
    public messageDialogService: MessageDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  ngOnInit(): void {
   this.submitClicked=true;
   this.identityImage=this.data.imageData;
  }

   close() {
    this.identityImage = '';
    this.base64textString = undefined;
    this.identityImage.nativeElement.value = '';
    this.dialogRef.close();
  }

  submit(){
    this.dialogRef.close({ patientImage: this.identityImage });
  }

    public onIdentifyImgFileUpload(event:any) {
      let selectedFile = event.target.files[0];
      this.selectedFilename=event.target.files[0].name;
      const reader = new FileReader();
      reader.onload = () => {
        this.identityImage = reader.result;
      };
      reader.readAsDataURL(selectedFile);
      this.getBase64(selectedFile);
    }
  
    public getBase64(file:any) {
      if (file) {
        let reader = new FileReader();
        reader.onload = this.handleSignatureFile.bind(this);
        reader.readAsBinaryString(file);
      }
    }
  
    public handleSignatureFile(event:any) {
      let binaryString = event.target.result;
      this.base64textString = btoa(binaryString);
      this.submitClicked=false;
    }

}
