import { Component, Inject, Injectable, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject, takeUntil } from "rxjs";
import { HttpService } from "@shared/services/http.service";

@Injectable({
  providedIn: "root",
})

@Component({
  selector: 'out-patients-patient-image-upload-dialog',
  templateUrl: './patient-image-upload-dialog.component.html',
  styleUrls: ['./patient-image-upload-dialog.component.scss']
})

export class PatientImageUploadDialogComponent implements OnInit, AfterViewInit {
  
  public selecetdFile : any;
  public imagePreview: any;
  public submitClicked:boolean=true;
  public selectedFilename!:string;
  private readonly _destroying$ = new Subject<void>();
  saveApimessage!: string;
  base64textString:any = [];
  identityImage:any;

  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;

  @ViewChild('photo') photo: any;

  constructor(public dialogRef: MatDialogRef<PatientImageUploadDialogComponent>,
    private http: HttpService,
    public messageDialogService: MessageDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  ngOnInit(): void {
   this.submitClicked=true;
   this.identityImage=this.data.imageData;
  }

  public ngAfterViewInit() {
    navigator.mediaDevices.getUserMedia({
      video: { width: 300, height: 250 },
      audio: false
    }).then(MediaStream => {
      this.video.nativeElement.srcObject = MediaStream;
      // this.video.nativeElement.play();
    })
  }

   close() {
    this.identityImage = '';
    this.base64textString = undefined;
    this.identityImage.nativeElement.value = '';
    this.webCameraOff();
    this.dialogRef.close();
  }

  submit(){
    this.webCameraOff();
    this.dialogRef.close({ patientImage: this.identityImage });
  }

    public onIdentifyImgFileUpload(event:any) {
      let selectedFile = event.target.files[0];
      this.selectedFilename=event.target.files[0].name;
      const reader = new FileReader();
      let fileSize= Number(((event.target.files[0].size/1024)/1024).toFixed(0)); // MB
      if (fileSize <= 1)
      {
        reader.onload = () => {
          this.identityImage = reader.result;
        };
        reader.readAsDataURL(selectedFile);
        this.getBase64(selectedFile);
      }
      else{
        // alert('File size exceeds 1 MB');
        const dialogRef = this.messageDialogService.warning(
          "File size exceeds 1 MB"
        );
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this._destroying$))
          .toPromise();
      }
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

    public capture() {
      const context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
      let data = this.canvas.nativeElement.toDataURL("image/png");
      this.identityImage = data;
    }

    public webCameraOff(){
      const stream = this.video.nativeElement.srcObject;
      const tracks = stream.getTracks();
  
      tracks.forEach((track: any) => {
        track.stop();
      });
  
      this.video.nativeElement.srcObject = null;
    }
}
