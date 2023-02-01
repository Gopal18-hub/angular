import {
  Injectable,
  Component,
  Inject,
  NgModule,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
} from "@angular/core";
import {
  MatSnackBar,
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef,
} from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
  selector: "maxhealth-snack-bar",
  template: `<div class="snack_container">
  <div class="mat-maxhealth-snackbar-content">
       
      <!-- Info -->
      <div *ngIf="data.type == 'info'" class="notification notification-info">
      <!--  <div class="icon">
          <mat-icon class="material-icons-round">info</mat-icon>
        </div> -->
        <div class="content">
          <div class="message">{{ data.message }}</div>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="data.type == 'error'" class="notification norification-error">
      <!--    <div class="icon">
          <mat-icon class="material-icons-round">warning</mat-icon>
        </div> -->
        <div class="content">
          <div class="message">{{ data.message }}</div>
        </div>
      </div>

      <!-- Success -->
      <div *ngIf="data.type == 'success'" class="notification notification-success">
      <!--  <div class="icon">
          <mat-icon class="material-icons-round">check_circle</mat-icon>
        </div> -->
        <div class="content">
          <div class="message">{{ data.message }}</div>
        </div>
      </div>
      <!-- defalut -->
      <div class="notification">
    
        <div class="content">
          <div class="message">{{ data.message }}</div>
        </div>
      </div>
    </div>

    <div class="mat-maxhealth-snackbar-action" *ngIf="!data.otheraction">
      <button (click)="action()" class="snack_button">{{data.action}}</button>
      
        <mat-icon (click)="action()" class="snack_exit">{{data.exit}}</mat-icon>
      
    </div>
    <div class="long_action" *ngIf="data.otheraction">
      <div class="mat-maxhealth-snackbar-action " >
        <button (click)="action()" class="snack_button">{{data.action}}</button>
        <button (click)="action()" class="snack_button">{{data.otheraction}}</button>
          <mat-icon (click)="action()" class="snack_exit">{{data.exit}}</mat-icon>
        
      </div>
    </div>
  </div>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "mat-maxhealth-snackbar",
  },
})
export class MaxHealthSnackBar {
  constructor(
    public snackBarRef: MatSnackBarRef<MaxHealthSnackBar>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _elementRef: ElementRef<HTMLElement>
  ) {}
  /** Performs the action on the snack bar. */
  action(): void {
    this.snackBarRef.dismissWithAction();
  }

  /** If the action button should be shown. */
  get hasAction(): boolean {
    return !!this.data.action;
  }
  ngAfterViewInit() {
    const element: HTMLElement = this._elementRef.nativeElement;
    switch (this.data.type) {
      case "error":
        (<any>element).classList.add("mat-snack-bar-error");
        break;
      case "success":
       
        (<any>element).classList.add("mat-snack-bar-success");
        break;
        case "info":
          (<any>element).classList.add("mat-snack-bar-info");
          break;
      default:
        (<any>element).classList.add("mat-snack-bar-defalut");
        break;
    }
  }
}

@Injectable()
export class MaxHealthSnackBarService {
  constructor(private snackBar: MatSnackBar) {}
    open(message: string,type: string="defalut",exit?:string,action?:string,otheraction?:string) {
    this.snackBar.openFromComponent(MaxHealthSnackBar, {
     // duration: duration || 4000,
      data: {
        message: message,
        type:type,
        action:action,
        otheraction:otheraction,
        exit:exit
      },
    });
  }
}

@NgModule({
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  declarations: [MaxHealthSnackBar],
  entryComponents: [MaxHealthSnackBar],
  providers: [MaxHealthSnackBarService],
})
export class MaxHealthSnackBarModule {}
