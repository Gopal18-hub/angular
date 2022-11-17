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
  template: `<div class="mat-maxhealth-snackbar-content">
      <!-- Info -->
      <div *ngIf="data.type == 'info'" class="notification">
        <div class="icon">
          <mat-icon class="material-icons-round">info</mat-icon>
        </div>
        <div class="content">
          <div class="message">{{ data.message }}</div>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="data.type == 'error'" class="notification">
        <div class="icon">
          <mat-icon class="material-icons-round">warning</mat-icon>
        </div>
        <div class="content">
          <div class="message">{{ data.message }}</div>
        </div>
      </div>

      <!-- Success -->
      <div *ngIf="data.type == 'success'" class="notification">
        <div class="icon">
          <mat-icon class="material-icons-round">check_circle</mat-icon>
        </div>
        <div class="content">
          <div class="message">{{ data.message }}</div>
        </div>
      </div>
    </div>

    <div class="mat-maxhealth-snackbar-action" *ngIf="hasAction">
      <button mat-button (click)="action()">{{ data.action }}</button>
    </div>`,
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
        (<any>element.parentElement).classList.add("mat-snack-bar-error");
        break;
      case "success":
        (<any>element.parentElement).classList.add("mat-snack-bar-success");
        break;
      default:
        (<any>element.parentElement).classList.add("mat-snack-bar-info");
        break;
    }
  }
}

@Injectable()
export class MaxHealthSnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  open(message: string, type: string = "info", duration?: number) {
    this.snackBar.openFromComponent(MaxHealthSnackBar, {
      duration: duration || 40000000000000,
      data: {
        message: message,
        type: type,
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
