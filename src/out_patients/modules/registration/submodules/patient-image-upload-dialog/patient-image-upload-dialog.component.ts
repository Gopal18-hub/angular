import { Component, Inject, Injectable, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject, takeUntil } from "rxjs";
import { HttpService } from "@shared/services/http.service";
import { DomSanitizer } from '@angular/platform-browser';

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
  public selectedFileType!:string;
  private readonly _destroying$ = new Subject<void>();
  saveApimessage!: string;
  base64textString:any = [];
  identityImage:any;
  patientImage:any;

  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;

  @ViewChild('photo') photo: any;

  constructor(public dialogRef: MatDialogRef<PatientImageUploadDialogComponent>,
    private http: HttpService,
    public messageDialogService: MessageDialogService,
    private domSanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  ngOnInit(): void {
   this.submitClicked=true;
   this.patientImage=this.data.imageData;
   this.identityImage=this.data.imageData;
  }

  public ngAfterViewInit() {
    let self = this;
    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   console.log('Initializing');
    //   navigator.mediaDevices.getUserMedia({
    //     video: { width: 300, height: 250 },
    //     audio: false
    //   }).then(MediaStream => {
    //     self.video.nativeElement.srcObject = MediaStream;
    //     // this.video.nativeElement.play();
    //   })
    // }

    var enumeratorPromise = navigator.mediaDevices.enumerateDevices().then(function(devices) {
      var cam = devices.find(function(device) {
        return device.kind === "videoinput";
      });
        var mic = devices.find(function(device) {
          return device.kind === "audioinput";
        });
        
        if (cam ){
          navigator.mediaDevices.getUserMedia({
            video: { width: 300, height: 250 },
            audio: false
          }).then(MediaStream => {
            self.video.nativeElement.srcObject = MediaStream;
            // this.video.nativeElement.play();
          })
        }
      });
  }

   close() {
    this.identityImage = '';
    this.patientImage='';
    this.base64textString = undefined;
    if(this.identityImage)
      this.identityImage.nativeElement.value = '';
    if(this.patientImage)
      this.patientImage.nativeElement.value='';
    this.webCameraOff();
    this.dialogRef.close();
  }

  submit(){
    this.webCameraOff();
    this.dialogRef.close({ patientImage: this.patientImage, fileType:this.selectedFileType });
  }

    public onIdentifyImgFileUpload(event:any) {
      let selectedFile = event.target.files[0];
      this.selectedFilename=event.target.files[0].name;
      this.selectedFileType=event.target.files[0].type;
      const reader = new FileReader();
      let fileSize= Number(((event.target.files[0].size/1024)/1024).toFixed(0)); // MB
      if (fileSize <= 1)
      {
        reader.onload = () => {
          this.identityImage = reader.result;
          this.patientImage = reader.result;
          this.identityImage = this.domSanitizer.bypassSecurityTrustUrl(this.identityImage);
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
      let self = this;
      let enumeratorPromise = navigator.mediaDevices.enumerateDevices().then(function (devices) {
        let cam = devices.find(function (device) {
          return device.kind === "videoinput";
        });
        if (cam) {
          const context = self.canvas.nativeElement.getContext("2d").drawImage(self.video.nativeElement, 0, 0, 640, 480);
          let data = self.canvas.nativeElement.toDataURL("image/png");
          self.identityImage = data;
          self.submitClicked = false;
        }
      });
    }

    public webCameraOff(){
      var stream = this.video.nativeElement.srcObject;
      if (stream && stream.getTracks()) {
      const tracks = stream.getTracks();
  
      tracks.forEach((track: any) => {
        track.stop();
      });
  
      this.video.nativeElement.srcObject = null;
    }
    }
}
